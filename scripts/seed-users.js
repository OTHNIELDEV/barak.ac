const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thqirninurslaguwmuyd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocWlybmludXJzbGFndXdtdXlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAxOTI5NiwiZXhwIjoyMDg4NTk1Mjk2fQ.6i--k6ZHSWHAk8-JjuszCMR9H6d9q-TeDINN_hdSS4w';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function seedUsers() {
    console.log("Seeding Supabase Auth Users...");
    
    // 1. Admin user
    const { data: adminUser, error: adminErr } = await supabase.auth.admin.createUser({
        email: 'a@a.com',
        password: 'password1111', // Supabase min password is 6 chars
        email_confirm: true,
        user_metadata: {
            name: 'Director',
            role: 'admin',
            church: 'Barak HQ',
            level: 'Administrator'
        }
    });
    console.log("Admin user create result:", { user: adminUser?.user?.id, error: adminErr?.message });

    // 2. Demo Pastor user
    const { data: pastorUser, error: pastorErr } = await supabase.auth.admin.createUser({
        email: 'axasoft@naver.com',
        password: 'password1111',
        email_confirm: true,
        user_metadata: {
            name: '김바라크',
            role: 'pastor',
            church: '서울은혜교회',
            level: '부목사'
        }
    });
    console.log("Pastor user create result:", { user: pastorUser?.user?.id, error: pastorErr?.message });
}

seedUsers();
