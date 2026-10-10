import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(supabaseUrl, serviceRoleKey);
}

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

        const isValidUUID = typeof body.userId === "string" &&
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.userId);

        const { data, error } = await supabase
            .from("applications")
            .insert({
                user_id: isValidUUID ? body.userId : null,
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

// PATCH: Update status
export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();
        if (!id || !status) {
            return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
        }

        const supabase = getAdminClient();
        const { data, error } = await supabase
            .from("applications")
            .update({ status })
            .eq("id", id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ application: data });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
