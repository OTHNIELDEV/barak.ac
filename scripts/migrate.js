const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thqirninurslaguwmuyd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocWlybmludXJzbGFndXdtdXlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAxOTI5NiwiZXhwIjoyMDg4NTk1Mjk2fQ.6i--k6ZHSWHAk8-JjuszCMR9H6d9q-TeDINN_hdSS4w';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function run() {
    console.log("Checking Supabase connection...");
    
    // Read schema.sql
    const sqlPath = path.join(__dirname, '../supabase/schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Try executing SQL via Supabase pg endpoint or rest
    try {
        console.log("Executing schema SQL via Supabase REST/pg API...");
        const response = await fetch(`${supabaseUrl}/pg/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': serviceRoleKey,
                'Authorization': `Bearer ${serviceRoleKey}`
            },
            body: JSON.stringify({ query: sqlContent })
        });

        if (response.ok) {
            console.log("Schema SQL executed successfully via /pg/query!");
        } else {
            const errText = await response.text();
            console.log(`pg/query status: ${response.status}, text: ${errText}`);
            
            // Try fallback endpoint /v1/query or other
            const v1Response = await fetch(`${supabaseUrl}/rest/v1/`, {
                headers: {
                    'apikey': serviceRoleKey,
                    'Authorization': `Bearer ${serviceRoleKey}`
                }
            });
            console.log("REST status:", v1Response.status);
        }
    } catch (e) {
        console.error("Direct fetch error:", e);
    }
}

run();
