export const mockUser = {
    name: "수강생",
    role: "수강생",
    email: "student@barak.ac",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=student",
    currentTrack: "Barak Track",
    level: "수강생",
};

export interface Module {
    id: string; // e.g. "m1-1"
    title: string;
    duration: string; // e.g. "15:00"
    videoUrl: string; // YouTube ID or URL
    description: string;
}

export interface Course {
    id: number;
    title: string;
    subTitle?: string;
    description: string;
    progress: number;
    totalModules: number;
    completedModules: number;
    lastAccessed: string | null;
    status: "Not Started" | "In Progress" | "Completed";
    thumbnail: string;
    modules: Module[];
}

export const mockCourses: Course[] = [
    {
        id: 1,
        title: "드보라 담임목회 과정 (The Deborah Course)",
        subTitle: "종려나무 아래의 지혜: 시대를 분별하는 예언자적 영성",
        description: "말씀(Logos)과 분별(Discernment)에 집중하며, 교회와 사역 현장에서 진리를 드러내는 목회 리더십을 훈련합니다.",
        progress: 0,
        totalModules: 4,
        completedModules: 0,
        lastAccessed: null,
        status: "Not Started",
        thumbnail: "/images/track-deborah-biblical.png",
        modules: [
            {
                id: "d-1",
                title: "제1강: 이갈렙 목사의 성경해석학 — 성경은 어떻게 읽어야 하는가",
                duration: "25:00",
                videoUrl: "https://www.youtube.com/watch?v=T-kY9XBB8io",
                description: "성경 본문을 구속사적 관점과 성령의 조명 안에서 바르게 해석하고 설교와 사역 현장에 적용하는 원리를 배웁니다."
            },
            {
                id: "d-2",
                title: "제2강: 구약과 '바라크(ברך)'의 언약적 영성",
                duration: "22:00",
                videoUrl: "https://www.youtube.com/watch?v=bftZuUKSfM8",
                description: "히브리어 '바라크(무릎 꿇다·복을 빌다)'의 성경적 원형과 사사기 4~5장에 나타난 하나님의 구원 역사를 탐구합니다."
            },
            {
                id: "d-3",
                title: "제3강: 복음서와 성령 사역의 성경적 기초",
                duration: "24:00",
                videoUrl: "https://www.youtube.com/watch?v=OP79-8l715c",
                description: "예수 그리스도의 복음 사역과 성령의 역사하심을 성경 본문 중심으로 강해합니다."
            },
            {
                id: "d-4",
                title: "제4강: 교회 공동체 회복과 실천 목회",
                duration: "20:00",
                videoUrl: "https://www.youtube.com/watch?v=ZbAzIGAuywg",
                description: "예배와 말씀, 기도를 통해 지역 교회와 성도의 삶을 세우는 실천 목회 원리를 다룹니다."
            }
        ]
    },
    {
        id: 2,
        title: "바락 부목사 과정 (The Barak Course)",
        subTitle: "다볼 산의 소집: 거룩한 순종과 연합의 영성",
        description: "순종(Obedience)과 동역(Partnership)을 다루며, 담임목회를 보좌하고 교회를 세우는 부교역자 사역 실제를 배웁니다.",
        progress: 0,
        totalModules: 4,
        completedModules: 0,
        lastAccessed: null,
        status: "Not Started",
        thumbnail: "/images/track-barak-biblical.png",
        modules: [
            {
                id: "b-1",
                title: "제1강: 사사기 바락의 순종과 동역 리더십",
                duration: "25:00",
                videoUrl: "https://www.youtube.com/watch?v=T-kY9XBB8io",
                description: "자신의 영광보다 하나님의 함께하심을 구했던 바락의 겸손과 동역의 영성을 배웁니다."
            },
            {
                id: "b-2",
                title: "제2강: 말씀 묵상과 강단 사역 보좌",
                duration: "22:00",
                videoUrl: "https://www.youtube.com/watch?v=bftZuUKSfM8",
                description: "목회 현장에서 말씀을 깊이 연구하고 성도들을 양육하는 부교역자의 핵심 사역을 다룹니다."
            },
            {
                id: "b-3",
                title: "제3강: 성령의 인도와 기도 사역의 실제",
                duration: "24:00",
                videoUrl: "https://www.youtube.com/watch?v=tvWiKoF_MI8",
                description: "기도와 말씀 안에서 성령의 인도를 분별하며 교회 공동체를 섬기는 실천적 원리를 학습합니다."
            },
            {
                id: "b-4",
                title: "제4강: 다음 세대 교육과 디지털 목회 활용",
                duration: "20:00",
                videoUrl: "https://www.youtube.com/watch?v=0erRTAn0HJQ",
                description: "기독교 교육과 현대 디지털 도구를 활용해 교회 사역을 효과적으로 지원하는 방법을 익힙니다."
            }
        ]
    },
    {
        id: 3,
        title: "야엘 은사사역 과정 (The Jael Course)",
        subTitle: "장막 안의 헌신: 일상의 성화와 은사 사역",
        description: "일상의 영성과 성경적 은사 활용을 통해 교회와 삶의 현장에서 헌신하는 평신도·은사 사역자를 양성합니다.",
        progress: 0,
        totalModules: 4,
        completedModules: 0,
        lastAccessed: null,
        status: "Not Started",
        thumbnail: "/images/track-jael-biblical.png",
        modules: [
            {
                id: "j-1",
                title: "제1강: 야엘의 헌신과 일상의 영적 승리",
                duration: "25:00",
                videoUrl: "https://www.youtube.com/watch?v=T-kY9XBB8io",
                description: "자신의 장막과 일상의 자리에서 하나님의 구원 역사에 쓰임받는 헌신의 원리를 배웁니다."
            },
            {
                id: "j-2",
                title: "제2강: 성경적 상담과 영혼 돌봄의 기초",
                duration: "22:00",
                videoUrl: "https://www.youtube.com/watch?v=OP79-8l715c",
                description: "상처 입은 이웃과 성도를 말씀과 사랑으로 위로하고 세우는 돌봄 사역을 학습합니다."
            },
            {
                id: "j-3",
                title: "제3강: 기도의 영성과 중보 사역",
                duration: "24:00",
                videoUrl: "https://www.youtube.com/watch?v=ZbAzIGAuywg",
                description: "교회와 가정을 살리는 성경적 중보기도와 영적 분별의 삶을 실천합니다."
            },
            {
                id: "j-4",
                title: "제4강: 삶의 현장에서 실천하는 복음 전도",
                duration: "20:00",
                videoUrl: "https://www.youtube.com/watch?v=tvWiKoF_MI8",
                description: "일터와 가정에서 그리스도의 향기를 드러내며 복음을 전하는 실천적 사역자를 세웁니다."
            }
        ]
    },
];

export const mockStats = {
    weeklyHours: [
        { day: "Mon", hours: 2 },
        { day: "Tue", hours: 1.5 },
        { day: "Wed", hours: 3 },
        { day: "Thu", hours: 1 },
        { day: "Fri", hours: 4 },
        { day: "Sat", hours: 5 },
        { day: "Sun", hours: 2 },
    ],
    aiInteractionCount: 45,
    spiritualGrowthScore: 850,
    certificatesEarned: 1,
};

export const mockActionItems = [
    {
        id: 1,
        task: "사사기 4장 묵상 후 적용점 기록하기",
        dueDate: "2024-03-15",
        completed: false,
        priority: "High",
    },
    {
        id: 2,
        task: "이번 주 설교에 '기름부으심' 예화 적용하기",
        dueDate: "2024-03-17",
        completed: false,
        priority: "Medium",
    },
    {
        id: 3,
        task: "갈렙 AI에게 '리더십의 위임'에 대해 질문하기",
        dueDate: "2024-03-14",
        completed: true,
        priority: "Low",
    },
];
