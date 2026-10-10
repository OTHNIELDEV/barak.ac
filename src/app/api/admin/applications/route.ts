import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createClient(supabaseUrl, serviceRoleKey);
}

const isValidUUID = (str: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

        return NextResponse.json({ applications: formatted }, {
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

// PATCH: Update application fields (or upsert if record does not exist in DB yet)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id && !updates.email) {
            return NextResponse.json({ error: "Missing application id or email" }, { status: 400 });
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

        // 1. Check if record exists by UUID or by email
        let existingRecord: any = null;
        if (id && isValidUUID(id)) {
            const { data } = await supabase.from("applications").select("*").eq("id", id).maybeSingle();
            existingRecord = data;
        }

        if (!existingRecord && (updates.email || (typeof id === "string" && id.includes("@")))) {
            const targetEmail = updates.email || id;
            const { data } = await supabase.from("applications").select("*").eq("email", targetEmail).maybeSingle();
            existingRecord = data;
        }

        let resultData: any = null;

        if (existingRecord) {
            // Update existing
            const { data, error } = await supabase
                .from("applications")
                .update(dbPayload)
                .eq("id", existingRecord.id)
                .select()
                .maybeSingle();

            if (error) {
                console.error("[API PATCH Applications] Update error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            resultData = data;
        } else {
            // Record doesn't exist in Supabase yet (was local-only), so insert it!
            const newPayload = {
                name: updates.name || "신청자",
                email: updates.email || id,
                phone: updates.phone || "",
                church: updates.church || "",
                position: updates.position || "pastor",
                department: updates.department || "",
                track: updates.track || "deborah",
                motivation: updates.motivation || "",
                status: updates.status || "pending",
                ...dbPayload
            };
            const { data, error } = await supabase
                .from("applications")
                .insert(newPayload)
                .select()
                .maybeSingle();

            if (error) {
                console.error("[API PATCH Applications] Insert fallback error:", error);
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            resultData = data;
        }

        return NextResponse.json({ application: resultData });
    } catch (err: any) {
        console.error("[API PATCH Applications] Exception:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// DELETE: Delete application permanently from DB
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

        // 1. Delete by UUID if valid
        if (id && isValidUUID(id)) {
            const { error } = await supabase.from("applications").delete().eq("id", id);
            if (error) console.warn("[API DELETE Applications] UUID delete warning:", error);
        }

        // 2. Delete by email if provided
        if (email) {
            const { error } = await supabase.from("applications").delete().eq("email", email);
            if (error) console.warn("[API DELETE Applications] Email delete warning:", error);
        }

        // 3. Fallback: if id happens to be an email string
        if (id && typeof id === "string" && id.includes("@")) {
            await supabase.from("applications").delete().eq("email", id);
        }

        return NextResponse.json({ success: true, deletedId: id, deletedEmail: email });
    } catch (err: any) {
        console.error("[API DELETE Applications] Exception:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
