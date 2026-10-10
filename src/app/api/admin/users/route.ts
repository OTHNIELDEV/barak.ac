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

const isValidUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET: All Users from Profiles
export async function GET() {
    try {
        const supabase = getAdminClient();

        // 1. Fetch profiles
        const { data: profiles, error: profileErr } = await supabase
            .from("profiles")
            .select("*")
            .order("created_at", { ascending: false });

        if (profileErr) {
            console.warn("[/api/admin/users] Profiles fetch error:", profileErr.message);
        }

        const formatted = (profiles || []).map(p => ({
            id: p.id,
            email: p.email,
            name: p.name || p.email?.split("@")[0] || "회원",
            role: p.role || "student",
            church: p.church || "",
            profileImage: p.profile_image || "",
            level: p.level || "",
            createdAt: p.created_at
        }));

        return NextResponse.json({ users: formatted }, {
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                "Pragma": "no-cache",
                "Expires": "0"
            }
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE: Delete user permanently from profiles & auth
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        let id = searchParams.get("id");
        let email = searchParams.get("email");

        if (!id && !email) {
            const body = await request.json().catch(() => ({}));
            id = body.id;
            email = body.email;
        }

        if (!id && !email) {
            return NextResponse.json({ error: "Missing user id or email" }, { status: 400 });
        }

        const supabase = getAdminClient();

        // 1. Delete from profiles table
        if (id && isValidUUID(id)) {
            await supabase.from("profiles").delete().eq("id", id);
        } else if (email) {
            await supabase.from("profiles").delete().eq("email", email);
        }

        // 2. Disconnect from applications table (nullify user_id to prevent foreign key errors)
        if (id && isValidUUID(id)) {
            await supabase.from("applications").update({ user_id: null }).eq("user_id", id);
        }

        // 3. Delete from Supabase Auth if service role is enabled
        if (process.env.SUPABASE_SERVICE_ROLE_KEY && id && isValidUUID(id)) {
            try {
                await supabase.auth.admin.deleteUser(id);
            } catch (authDelErr) {
                console.warn("[/api/admin/users] auth.admin.deleteUser warning:", authDelErr);
            }
        }

        return NextResponse.json({ success: true, deletedId: id, deletedEmail: email });
    } catch (err: any) {
        console.error("[/api/admin/users] DELETE error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH: Update user role / level / church / name
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, role, level, church, name, email } = body;

        if (!id && !email) {
            return NextResponse.json({ error: "Missing user id or email" }, { status: 400 });
        }

        const supabase = getAdminClient();
        const updateData: any = {};
        if (role) updateData.role = role;
        if (level !== undefined) updateData.level = level;
        if (church !== undefined) updateData.church = church;
        if (name !== undefined) updateData.name = name;
        updateData.updated_at = new Date().toISOString();

        // 1. Update profiles table
        let profileQuery = supabase.from("profiles").update(updateData);
        if (id && isValidUUID(id)) {
            profileQuery = profileQuery.eq("id", id);
        } else if (email || id) {
            profileQuery = profileQuery.ilike("email", (email || id).toLowerCase().trim());
        }

        const { data: updatedProfile, error: profileErr } = await profileQuery.select().maybeSingle();

        if (profileErr) {
            console.error("[/api/admin/users PATCH] Profile error:", profileErr);
            return NextResponse.json({ error: profileErr.message }, { status: 500 });
        }

        // 2. Synchronize with applications table (Two-Way Sync)
        const targetEmail = updatedProfile?.email || email || (id && id.includes("@") ? id : null);
        const targetUserId = updatedProfile?.id || (id && isValidUUID(id) ? id : null);

        if (targetEmail || targetUserId) {
            try {
                const appUpdate: any = {};
                if (church !== undefined) appUpdate.church = church;
                if (name !== undefined) appUpdate.name = name;
                if (level !== undefined) {
                    appUpdate.position = level;
                } else if (role === "pastor" && (!updatedProfile?.level || updatedProfile.level.includes("학생"))) {
                    appUpdate.position = "목회자 (pastor)";
                }

                if (Object.keys(appUpdate).length > 0) {
                    let appQuery = supabase.from("applications").update(appUpdate);
                    if (targetUserId && isValidUUID(targetUserId)) {
                        await appQuery.eq("user_id", targetUserId);
                    } else if (targetEmail) {
                        await appQuery.ilike("email", targetEmail.toLowerCase().trim());
                    }
                }
            } catch (appSyncErr) {
                console.warn("[/api/admin/users PATCH] Application sync warning:", appSyncErr);
            }
        }

        return NextResponse.json({ user: updatedProfile || { id, ...updateData } });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
