import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const email = body.email ? String(body.email).trim().toLowerCase() : "";
        const password = body.password ? String(body.password) : "";

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const supabase = getAdminClient();

        // 1. Check if application exists (pending or approved) or if profile exists
        const { data: userApps, error: appErr } = await supabase
            .from("applications")
            .select("*")
            .ilike("email", email)
            .order("submitted_at", { ascending: false });

        const { data: existingProfiles } = await supabase
            .from("profiles")
            .select("*")
            .ilike("email", email);

        const latestApp = userApps && userApps.length > 0 ? userApps[0] : null;
        const profile = existingProfiles && existingProfiles.length > 0 ? existingProfiles[0] : null;

        // If no application and no profile exists
        if (!latestApp && !profile && email !== "axasoft@naver.com") {
            return NextResponse.json({
                synced: false,
                reason: "not_registered",
                message: "등록된 입학 신청서 또는 회원 정보를 찾을 수 없습니다."
            }, { status: 404 });
        }

        const isApproved = (latestApp?.status === "approved") || (profile?.level?.includes("정규")) || email === "axasoft@naver.com";
        const name = profile?.name || latestApp?.name || (email === "axasoft@naver.com" ? "이상수" : email.split("@")[0]);
        const church = profile?.church || latestApp?.church || (email === "axasoft@naver.com" ? "초월선교교회" : "");
        const role = profile?.role || "student";
        const level = profile?.level || (isApproved ? "정규 학생 (Student)" : "신입생 지원자");

        let userId = profile?.id;

        // 2. Sync with Supabase Auth if service role is available
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const { data: { users } } = await supabase.auth.admin.listUsers();
                const existingAuthUser = users.find(u => u.email?.toLowerCase() === email);

                if (existingAuthUser) {
                    userId = existingAuthUser.id;
                    if (password) {
                        await supabase.auth.admin.updateUserById(existingAuthUser.id, {
                            password: password,
                            user_metadata: { name }
                        });
                    }
                } else if (password) {
                    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
                        email: email,
                        password: password,
                        email_confirm: true,
                        user_metadata: { name }
                    });
                    if (newUser?.user) {
                        userId = newUser.user.id;
                    } else if (createErr) {
                        console.warn("[/api/auth/sync] createUser error:", createErr.message);
                    }
                }
            } catch (authErr) {
                console.warn("[/api/auth/sync] Auth admin operation failed:", authErr);
            }
        }

        // 3. Upsert profiles record
        if (userId) {
            await supabase.from("profiles").upsert({
                id: userId,
                email: email,
                name: name,
                role: role,
                church: church,
                level: level,
                updated_at: new Date().toISOString()
            });

            // Connect to applications table
            if (latestApp && latestApp.id) {
                await supabase.from("applications").update({
                    user_id: userId
                }).eq("id", latestApp.id);
            }
        }

        return NextResponse.json({
            synced: true,
            user: {
                id: userId || `user_${Date.now()}`,
                email: email,
                name: name,
                role: role,
                church: church,
                level: level
            }
        });

    } catch (err: any) {
        console.error("[/api/auth/sync] Unexpected error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
