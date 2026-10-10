const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://thqirninurslaguwmuyd.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRocWlybmludXJzbGFndXdtdXlkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzAxOTI5NiwiZXhwIjoyMDg4NTk1Mjk2fQ.6i--k6ZHSWHAk8-JjuszCMR9H6d9q-TeDINN_hdSS4w';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function seedAll() {
    console.log("=== Migrating Mock Data to Supabase ===");

    // 1. Check existing Auth Users to populate profiles
    const { data: { users } } = await supabase.auth.admin.listUsers();
    console.log(`Found ${users.length} auth users.`);

    for (const u of users) {
        const { error } = await supabase.from('profiles').upsert({
            id: u.id,
            email: u.email,
            name: u.user_metadata?.name || u.email.split('@')[0],
            role: u.user_metadata?.role || (u.email === 'a@a.com' ? 'admin' : 'pastor'),
            church: u.user_metadata?.church || '서울은혜교회',
            level: u.user_metadata?.level || '부목사',
            profile_image: u.user_metadata?.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Barak'
        });
        if (error) console.log("Profile upsert error:", error.message);
        else console.log(`✅ Synced profile for ${u.email}`);
    }

    const pastorUser = users.find(u => u.email === 'axasoft@naver.com') || users[0];
    const adminUser = users.find(u => u.email === 'a@a.com') || users[0];

    // 2. Posts
    const { data: existingPosts } = await supabase.from('posts').select('id');
    if (!existingPosts || existingPosts.length === 0) {
        const { error } = await supabase.from('posts').insert([
            {
                title: "바라크 아카데미에 오신 것을 환영합니다!",
                content: "서로 격려하며 함께 성장하는 공간이 되길 바랍니다. 말씀과 사역의 현장에서 하나님의 지혜를 나누어요.",
                author_id: adminUser?.id,
                author_name: "관리자",
                category: "free",
                views: 120
            },
            {
                title: "디지털 사역과 영적 전쟁에 대한 기도 나눔",
                content: "각자의 교회와 사역 현장에서 AI와 미디어를 거룩하게 사용할 수 있도록 함께 중보합니다.",
                author_id: pastorUser?.id,
                author_name: "김바라크",
                category: "prayer",
                views: 45
            }
        ]);
        if (error) console.log("Posts seed error:", error.message);
        else console.log("✅ Seeded Posts");
    }

    // 3. Banners
    const { data: existingBanners } = await supabase.from('banners').select('id');
    if (!existingBanners || existingBanners.length === 0) {
        const { error } = await supabase.from('banners').insert([
            { title: "2026 Spring Enrollment", image_url: "/images/hero-architecture.png", link: "/curriculum", is_active: true },
            { title: "New Caleb AI Features", image_url: "/images/caleb-real-v2.png", link: "/ai-system", is_active: false }
        ]);
        if (error) console.log("Banners seed error:", error.message);
        else console.log("✅ Seeded Banners");
    }

    // 4. Faculty
    const { data: existingFaculty } = await supabase.from('faculty').select('id');
    if (!existingFaculty || existingFaculty.length === 0) {
        const { error } = await supabase.from('faculty').insert([
            { name: "Pastor Lee Caleb", title: "President & Founder", bio: "Founder of Barak Academy, Leading Next-Gen Ministry & Digital Theology.", photo_url: "/images/caleb-real-v2.png" }
        ]);
        if (error) console.log("Faculty seed error:", error.message);
        else console.log("✅ Seeded Faculty");
    }

    // 5. Applications
    const { data: existingApps } = await supabase.from('applications').select('id');
    if (!existingApps || existingApps.length === 0) {
        const { error } = await supabase.from('applications').insert([
            {
                user_id: pastorUser?.id,
                name: "이믿음",
                email: "faith@example.com",
                phone: "010-1234-5678",
                church: "강남비전교회",
                position: "theology_student",
                department: "청년부",
                track: "barak",
                motivation: "다음 세대를 위한 실제적인 전략을 배우고 싶습니다.",
                status: "pending"
            },
            {
                name: "박소망",
                email: "hope@example.com",
                phone: "010-9876-5432",
                church: "분당우리교회",
                position: "lay_leader",
                department: "새가족팀",
                track: "deborah",
                motivation: "영적 분별력을 기르고 싶어 지원합니다.",
                status: "approved"
            }
        ]);
        if (error) console.log("Applications seed error:", error.message);
        else console.log("✅ Seeded Applications");
    }

    // 6. AI Logs
    const { data: existingLogs } = await supabase.from('ai_logs').select('id');
    if (!existingLogs || existingLogs.length === 0) {
        const { error } = await supabase.from('ai_logs').insert([
            {
                student_id: pastorUser?.id,
                student_name: "김바라크",
                query: "설교 준비할 때 본문 분석을 어떻게 하나요?",
                response_summary: "본문 분석의 3단계 방법론 제시 및 예시 제공",
                category: "Ministry"
            },
            {
                student_id: pastorUser?.id,
                student_name: "김바라크",
                query: "재정 위기 상황에서의 목회적 조언",
                response_summary: "재정 투명성 확보 및 성도들과의 소통 중요성 강조",
                category: "Counseling"
            }
        ]);
        if (error) console.log("AI Logs seed error:", error.message);
        else console.log("✅ Seeded AI Logs");
    }

    console.log("=== All Data Seeded Successfully! ===");
}

seedAll();
