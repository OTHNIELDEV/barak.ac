import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(supabaseUrl, serviceRoleKey);
}

const isValidUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

// GET: All applications
export async function GET() {
    try {
        const supabase = getAdminClient();
        const { data, error } = await supabase
            .from("applications")
            .select("*")
            .order("submitted_at", { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const formatted = (data || []).map(a => ({
            id: a.id,
            userId: a.user_id,
            name: a.name,
            email: a.email,
            phone: a.phone,
            church: a.church,
            position: a.position,
            department: a.department,
            track: a.track,
            motivation: a.motivation,
            status: a.status,
            submittedAt: a.submitted_at,
        }));

        return NextResponse.json({ applications: formatted });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST: Create application
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = getAdminClient();

        const validUserId = typeof body.userId === "string" && isValidUUID(body.userId) ? body.userId : null;

        const { data, error } = await supabase
            .from("applications")
            .insert({
                user_id: validUserId,
                name: body.name,
                email: body.email,
                phone: body.phone,
                church: body.church,
                position: body.position,
                department: body.department,
                track: body.track,
                motivation: body.motivation,
                status: body.status || "pending",
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ application: data }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH: Update application fields (status, name, phone, track, motivation, etc.)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) {
            return NextResponse.json({ error: "Missing application id" }, { status: 400 });
        }

        const supabase = getAdminClient();

        // Build database update payload with column mapping
        const dbPayload: any = {};
        if (updates.status !== undefined) dbPayload.status = updates.status;
        if (updates.name !== undefined) dbPayload.name = updates.name;
        if (updates.email !== undefined) dbPayload.email = updates.email;
        if (updates.phone !== undefined) dbPayload.phone = updates.phone;
        if (updates.church !== undefined) dbPayload.church = updates.church;
        if (updates.position !== undefined) dbPayload.position = updates.position;
        if (updates.department !== undefined) dbPayload.department = updates.department;
        if (updates.track !== undefined) dbPayload.track = updates.track;
        if (updates.motivation !== undefined) dbPayload.motivation = updates.motivation;

        let query = supabase.from("applications").update(dbPayload);
        if (isValidUUID(id)) {
            query = query.eq("id", id);
        } else if (updates.email) {
            query = query.eq("email", updates.email);
        } else {
            query = query.eq("id", id);
        }

        const { data, error } = await query.select().single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ application: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE: Delete application permanently
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
            return NextResponse.json({ error: "Missing application id or email" }, { status: 400 });
        }

        const supabase = getAdminClient();
        let query = supabase.from("applications").delete();

        if (id && isValidUUID(id)) {
            query = query.eq("id", id);
        } else if (email) {
            query = query.eq("email", email);
        } else if (id) {
            query = query.eq("id", id);
        }

        const { error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, deletedId: id, deletedEmail: email });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
