const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thqirninurslaguwmuyd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocWlybmludXJzbGFndXdtdXlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAxOTI5NiwiZXhwIjoyMDg4NTk1Mjk2fQ.6i--k6ZHSWHAk8-JjuszCMR9H6d9q-TeDINN_hdSS4w';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function checkAllTables() {
    console.log("=== Checking Supabase Tables & Data ===");
    
    const tables = [
        'profiles',
        'courses',
        'modules',
        'user_progress',
        'access_logs',
        'posts',
        'applications',
        'banners',
        'faculty',
        'certificates',
        'ai_logs'
    ];

    for (const table of tables) {
        const { data, count, error } = await supabase
            .from(table)
            .select('*', { count: 'exact' });

        if (error) {
            console.log(`❌ Table [${table}]: ERROR -> ${error.message}`);
        } else {
            console.log(`✅ Table [${table}]: SUCCESS (Rows: ${data.length})`);
            if (data.length > 0) {
                console.log(`   Sample:`, JSON.stringify(data[0]).substring(0, 100) + '...');
            }
        }
    }
}

checkAllTables();
