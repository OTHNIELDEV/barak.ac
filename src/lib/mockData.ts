export const mockUser = {
    name: "Kim Barak",
    role: "Assistant Pastor",
    email: "barak.kim@example.com",
    profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Barak",
    currentTrack: "Deborah Track",
    level: "Associate Leader",
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
        title: "드보라 트랙 (The Deborah Track)",
        subTitle: "종려나무 아래의 지혜: 시대를 분별하는 예언자적 영성",
        description: "말씀(Logos)과 분별(Discernment)에 집중하며, AI를 혼탁한 세상에서 진리를 드러내는 도구로 재해석합니다.",
        progress: 0,
        totalModules: 4,
        completedModules: 0,
        lastAccessed: null,
        status: "Not Started",
        thumbnail: "/images/track-deborah-biblical.png",
        modules: [
            {
                id: "d-1",
                title: "Lesson 1: 신학입문 - 신학이란 어떤 학문인가?",
                duration: "25:00",
                videoUrl: "https://www.youtube.com/watch?v=paVjQbkMg8I",
                description: "신학의 정의와 본질, 신앙과 학문의 관계를 탐구하며 성경적 진리를 현대의 삶 속에서 바르게 이해하고 해석하는 신학의 기초를 정립합니다."
            },
            {
                id: "d-2",
                title: "Lesson 2: 구약학의 5가지 핵심 연구분야",
                duration: "18:00",
                videoUrl: "https://www.youtube.com/watch?v=JAUyMe63r28",
                description: "오경, 역사서, 시가서, 예언서에 이르는 구약 성경의 광대한 흐름과 히브리어 '바라크(축복)'의 구속사적 언약 신학을 배웁니다."
            },
            {
                id: "d-3",
                title: "Lesson 3: 신약성서학이란 무엇인가?",
                duration: "20:00",
                videoUrl: "https://www.youtube.com/watch?v=GfXyT_L3m8Q",
                description: "복음서와 바울서신의 신약 텍스트 비평, 구속사적 성경 해석의 원리 및 초기 기독교 공동체의 복음 선포를 심층 강해합니다."
            },
            {
                id: "d-4",
                title: "Lesson 4: 슬기로운 교회사와 역사신학",
                duration: "16:00",
                videoUrl: "https://www.youtube.com/watch?v=twaX7pEQSCs",
                description: "초대교회부터 종교개혁, 한국 교회사에 이르기까지 교회의 거룩한 전통과 신앙의 선진들이 남긴 사역적 영적 유산을 조명합니다."
            }
        ]
    },
    {
        id: 2,
        title: "바라크 트랙 (The Barak Track)",
        subTitle: "다볼 산의 소집: 거룩한 순종과 연합의 영성",
        description: "순종(Obedience)과 동역(Partnership), 그리고 영적 전쟁(Spiritual Warfare)을 다루며, 비전을 현실로 만드는 전략적 실행을 배웁니다.",
        progress: 0,
        totalModules: 4,
        completedModules: 0,
        lastAccessed: null,
        status: "Not Started",
        thumbnail: "/images/track-barak-biblical.png",
        modules: [
            {
                id: "b-1",
                title: "Lesson 1: 실천신학과 기독교 영성신학",
                duration: "22:00",
                videoUrl: "https://www.youtube.com/watch?v=743UBBa6q0c",
                description: "신학적 지식을 넘어 성령의 기름부으심, 기도의 영성, 목회 현장과 사역에서의 실천적 권능을 회복하는 영성 형성을 다룹니다."
            },
            {
                id: "b-2",
                title: "Lesson 2: 신학입문 - 신학과 신앙의 조화",
                duration: "25:00",
                videoUrl: "https://www.youtube.com/watch?v=paVjQbkMg8I",
                description: "인간의 연약함을 돕는 성령의 사역과 성경적 진리를 신학적으로 정립하고, 목회자와 평신도의 연합 원리를 배웁니다."
            },
            {
                id: "b-3",
                title: "Lesson 3: 구약 성경과 하나님의 나라",
                duration: "18:00",
                videoUrl: "https://www.youtube.com/watch?v=JAUyMe63r28",
                description: "교회와 선교 단체 사역에 필요한 구약적 신앙과 청지기적 리더십을 학습합니다."
            },
            {
                id: "b-4",
                title: "Lesson 4: 초대교회 영성과 현대 사역",
                duration: "16:00",
                videoUrl: "https://www.youtube.com/watch?v=twaX7pEQSCs",
                description: "초대교회의 부흥과 순종의 실행력을 현대 사역 현장에 적용하는 실천 신학."
            }
        ]
    },
    {
        id: 3,
        title: "야엘 트랙 (The Jael Track)",
        subTitle: "장막 안의 승부수: 일상의 성화와 도구의 거룩함",
        description: "일상의 영성(Daily Spirituality)과 도구의 성화(Sanctification of Tools)를 통해, 삶의 현장에서 결정적 승리를 거두는 평신도 전문인을 양성합니다.",
        progress: 0,
        totalModules: 4,
        completedModules: 0,
        lastAccessed: null,
        status: "Not Started",
        thumbnail: "/images/track-jael-biblical.png",
        modules: [
            {
                id: "j-1",
                title: "Lesson 1: 기독교 사회윤리와 일터 사역",
                duration: "20:00",
                videoUrl: "https://www.youtube.com/watch?v=0X2bbQYimPs",
                description: "평신도가 자신의 일터와 세상 속에서 하나님의 공의와 사랑을 실천하며 선교적 삶을 사는 기독교 윤리를 배웁니다."
            },
            {
                id: "j-2",
                title: "Lesson 2: 신약 복음서와 일상의 제자도",
                duration: "20:00",
                videoUrl: "https://www.youtube.com/watch?v=GfXyT_L3m8Q",
                description: "예수 그리스도의 제자로서 일상의 영역에서 승리하는 성경적 원리를 습득합니다."
            },
            {
                id: "j-3",
                title: "Lesson 3: 기도의 영성과 실천 사역",
                duration: "22:00",
                videoUrl: "https://www.youtube.com/watch?v=743UBBa6q0c",
                description: "일상의 고난을 이기는 영적 분별력과 성령 안에서의 깊은 기도 생활을 실천합니다."
            },
            {
                id: "j-4",
                title: "Lesson 4: 포스트모던 시대의 신학적 통찰",
                duration: "25:00",
                videoUrl: "https://www.youtube.com/watch?v=paVjQbkMg8I",
                description: "포스트모던 시대 속에서 참된 복음의 가치를 지키고 세상을 변화시키는 평신도 리더십."
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
