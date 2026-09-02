-- ==============================================================================
-- Barak Academy (barak.ac) Supabase Database Schema & Initial Setup
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/thqirninurslaguwmuyd/sql)
-- ==============================================================================

-- 1. Profiles Table (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'pastor', 'admin')),
    church TEXT,
    profile_image TEXT,
    level TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger: Automatically create profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name, role, church, level)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'role', 'student'),
        new.raw_user_meta_data->>'church',
        new.raw_user_meta_data->>'level'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    sub_title TEXT,
    description TEXT,
    total_modules INT DEFAULT 0,
    thumbnail TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 3. Modules Table
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration TEXT,
    video_url TEXT,
    description TEXT,
    sort_order INT DEFAULT 0
);

ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules are viewable by authenticated users" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Admins can manage modules" ON public.modules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 4. User Progress Table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE,
    completed_lessons TEXT[] DEFAULT '{}',
    last_access TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, course_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert/update own progress" ON public.user_progress FOR ALL USING (auth.uid() = user_id);


-- 5. Access Logs Table (Daily Activity)
CREATE TABLE IF NOT EXISTS public.access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    count INT DEFAULT 1,
    UNIQUE(user_id, log_date)
);

ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own access logs" ON public.access_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own access logs" ON public.access_logs FOR ALL USING (auth.uid() = user_id);


-- 6. Posts Table (Community)
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'free' CHECK (category IN ('free', 'prayer', 'qna')),
    views INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update/delete own posts" ON public.posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = author_id);


-- 7. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    church TEXT NOT NULL,
    position TEXT NOT NULL,
    department TEXT,
    track TEXT NOT NULL CHECK (track IN ('deborah', 'barak', 'jael')),
    motivation TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an application" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own application" ON public.applications FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins can view and manage all applications" ON public.applications FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);


-- 8. Admin Tables: Banners, Faculty, Certificates, AI Logs
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    link TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Banners viewable by everyone" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admins manage banners" ON public.banners FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE IF NOT EXISTS public.faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    bio TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Faculty viewable by everyone" ON public.faculty FOR SELECT USING (true);
CREATE POLICY "Admins manage faculty" ON public.faculty FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    track_id BIGINT REFERENCES public.courses(id),
    track_title TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    license_key UUID DEFAULT gen_random_uuid(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own certificates" ON public.certificates FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Admins manage certificates" ON public.certificates FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TABLE IF NOT EXISTS public.ai_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_name TEXT,
    query TEXT NOT NULL,
    response_summary TEXT,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view all ai logs" ON public.ai_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Users can insert own ai logs" ON public.ai_logs FOR INSERT WITH CHECK (true);


-- ==============================================================================
-- Initial Seed Data
-- ==============================================================================
INSERT INTO public.courses (id, title, sub_title, description, total_modules, thumbnail)
VALUES 
(1, '드보라 트랙 (The Deborah Track)', '종려나무 아래의 지혜: 시대를 분별하는 예언자적 영성', '말씀(Logos)과 분별(Discernment)에 집중하며, AI를 혼탁한 세상에서 진리를 드러내는 도구로 재해석합니다.', 4, '/images/track-deborah-biblical.png'),
(2, '바라크 트랙 (The Barak Track)', '다볼 산의 소집: 거룩한 순종과 연합의 영성', '순종(Obedience)과 동역(Partnership), 그리고 영적 전쟁(Spiritual Warfare)을 다루며, 비전을 현실로 만드는 전략적 실행을 배웁니다.', 4, '/images/track-barak-biblical.png'),
(3, '야엘 트랙 (The Jael Track)', '장막 안의 승부수: 일상의 성화와 도구의 거룩함', '일상의 영성(Daily Spirituality)과 도구의 성화(Sanctification of Tools)를 통해, 삶의 현장에서 결정적 승리를 거두는 평신도 전문인을 양성합니다.', 4, '/images/track-jael-biblical.png')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.modules (id, course_id, title, duration, video_url, description, sort_order)
VALUES
('d-1', 1, 'Lesson 1: 디지털 시대의 성경해석학', '15:00', '', 'AI의 환각과 거짓 정보 속에서 변하지 않는 진리를 수호하고 해석하는 디지털 텍스트 비평 및 설교학.', 1),
('d-2', 1, 'Lesson 2: 잇사갈의 영성과 데이터', '15:00', '', '빅데이터를 통해 이 시대의 영적 흐름과 아픔을 읽어내고, 이를 중보기도와 목회적 돌봄으로 연결하는 통찰 훈련.', 2),
('d-3', 1, 'Lesson 3: 어미의 마음: 목양 리더십', '15:00', '', '기술 만능주의 시대에 AI가 대체할 수 없는 인격적 돌봄과 영적 모성을 회복하는 하이터치 목회학.', 3),
('d-4', 1, 'Lesson 4: 깨어남의 신학 (Awakening)', '15:00', '', '잠든 한국 교회를 깨우기 위한 메시지를 구성하고, AI 도구를 활용해 이 메시지를 가장 효과적으로 전파하는 설교 전달 전략.', 4),
('b-1', 2, 'Lesson 1: 영적 전쟁과 디지털 선교', '15:00', '', '온라인 공간을 단순한 홍보처가 아닌 영적 전쟁터로 인식하고, 복음으로 문화를 점령하는 디지털 선교 전략.', 1),
('b-2', 2, 'Lesson 2: 동역의 신학: 사람과 AI', '15:00', '', '인간의 연약함을 돕는 도구로서의 AI를 신학적으로 정립하고, 목회자와 평신도의 연합 원리 교육.', 2),
('b-3', 2, 'Lesson 3: 킹덤 빌더의 경영학', '15:00', '', '교회와 선교 단체 운영에 필요한 재정, 행정, 인사를 투명하고 지혜롭게 관리하는 청지기적 경영론.', 3),
('b-4', 2, 'Lesson 4: 순종의 실행력 (Action)', '15:00', '', '기도와 계획에 머물지 않고, AI 기술을 활용해 즉각적으로 전도지와 소그룹을 조직하여 실행에 옮기는 실천 신학.', 4),
('j-1', 3, 'Lesson 1: 장막의 신학: 일터 사역', '15:00', '', '평신도가 자신의 일터(장막)에서 AI 기술을 통해 어떻게 하나님의 영광을 드러내고 선교적 삶을 살 것인가? (BaM)', 1),
('j-2', 3, 'Lesson 2: 거룩한 말뚝: 도구론', '15:00', '', '세상이 만든 AI를 하나님 나라를 위해 사용하는 방법. 세속적 기술을 거룩한 목적으로 전용하는 기술 훈련.', 2),
('j-3', 3, 'Lesson 3: 카이로스의 포착', '15:00', '', '급변하는 기술 트렌드 속에서 복음 전파의 골든타임을 포착하고 대응하는 위기 관리.', 3),
('j-4', 3, 'Lesson 4: 창조적 지혜 (Creativity)', '15:00', '', '생성형 AI(이미지, 음악, 영상)를 활용해 창조적 영감을 표현하는 문화 사역.', 4)
ON CONFLICT (id) DO NOTHING;
