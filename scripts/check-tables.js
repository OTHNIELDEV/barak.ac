const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thqirninurslaguwmuyd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocWlybmludXJzbGFndXdtdXlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAxOTI5NiwiZXhwIjoyMDg4NTk1Mjk2fQ.6i--k6ZHSWHAk8-JjuszCMR9H6d9q-TeDINN_hdSS4w';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkTables() {
    console.log("Checking existing tables...");
    const { data: courses, error: cErr } = await supabase.from('courses').select('*').limit(1);
    console.log("courses table check:", { exists: !cErr, error: cErr?.message, data: courses });

    const { data: profiles, error: pErr } = await supabase.from('profiles').select('*').limit(1);
    console.log("profiles table check:", { exists: !pErr, error: pErr?.message, data: profiles });
}

checkTables();
