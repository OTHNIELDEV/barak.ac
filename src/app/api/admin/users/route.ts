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

// GET: All Users from Profiles (+ Auth Users)
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

        // 2. Try fetching auth users with service role (if available)
        let authUsersMap: Record<string, any> = {};
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            try {
                const { data: authData } = await supabase.auth.admin.listUsers();
                if (authData?.users) {
                    authData.users.forEach(u => {
                        authUsersMap[u.id] = u;
                        if (u.email) authUsersMap[u.email.toLowerCase()] = u;
                    });
                }
            } catch (authErr) {
                console.warn("[/api/admin/users] Auth admin listUsers fallback:", authErr);
            }
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

        return NextResponse.json({ users: formatted });
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

// PATCH: Update user role / level
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, role, level, church } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing user id" }, { status: 400 });
        }

        const supabase = getAdminClient();
        const updateData: any = {};
        if (role) updateData.role = role;
        if (level !== undefined) updateData.level = level;
        if (church !== undefined) updateData.church = church;

        const { data, error } = await supabase
            .from("profiles")
            .update(updateData)
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ user: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
