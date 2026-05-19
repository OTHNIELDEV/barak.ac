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
                title: "Lesson 1: 디지털 시대의 성경해석학",
                duration: "15:00",
                videoUrl: "",
                description: "AI의 환각(Hallucination)과 거짓 정보 속에서 변하지 않는 진리(Canon)를 수호하고 해석하는 디지털 텍스트 비평 및 설교학."
            },
            {
                id: "d-2",
                title: "Lesson 2: 잇사갈의 영성과 데이터",
                duration: "15:00",
                videoUrl: "",
                description: "빅데이터를 통해 이 시대의 영적 흐름과 아픔을 읽어내고, 이를 중보기도와 목회적 돌봄으로 연결하는 통찰 훈련."
            },
            {
                id: "d-3",
                title: "Lesson 3: 어미의 마음: 목양 리더십",
                duration: "15:00",
                videoUrl: "",
                description: "기술 만능주의 시대에 AI가 대체할 수 없는 '인격적 돌봄'과 '영적 모성'을 회복하는 하이터치(High-Touch) 목회학."
            },
            {
                id: "d-4",
                title: "Lesson 4: 깨어남의 신학 (Awakening)",
                duration: "15:00",
                videoUrl: "",
                description: "잠든 한국 교회를 깨우기 위한 메시지를 구성하고, AI 도구를 활용해 이 메시지를 가장 효과적으로 전파하는 설교 전달(Delivery) 전략."
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
                title: "Lesson 1: 영적 전쟁과 디지털 선교",
                duration: "15:00",
                videoUrl: "",
                description: "온라인 공간(유튜브, 메타버스)을 단순한 홍보처가 아닌 '영적 전쟁터'로 인식하고, 복음으로 문화를 점령하는 디지털 선교 전략."
            },
            {
                id: "b-2",
                title: "Lesson 2: 동역의 신학: 사람과 AI",
                duration: "15:00",
                videoUrl: "",
                description: "인간의 연약함을 돕는 도구로서의 AI를 신학적으로 정립하고, 목회자와 평신도, 기성세대와 다음세대의 연합 원리 교육."
            },
            {
                id: "b-3",
                title: "Lesson 3: 킹덤 빌더의 경영학",
                duration: "15:00",
                videoUrl: "",
                description: "교회와 선교 단체 운영에 필요한 재정, 행정, 인사를 투명하고 지혜롭게 관리하는 청지기적 경영론 (AI 행정 자동화 적용)."
            },
            {
                id: "b-4",
                title: "Lesson 4: 순종의 실행력 (Action)",
                duration: "15:00",
                videoUrl: "",
                description: "기도와 계획에 머물지 않고, AI 기술을 활용해 즉각적으로 전도지(콘텐츠)를 만들고, 소그룹을 조직하여 실행에 옮기는 실천 신학."
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
                title: "Lesson 1: 장막의 신학: 일터 사역",
                duration: "15:00",
                videoUrl: "",
                description: "목회자가 아닌 평신도가 자신의 일터(장막)에서 AI 기술을 통해 어떻게 하나님의 영광을 드러내고 선교적 삶을 살 것인가? (BaM)"
            },
            {
                id: "j-2",
                title: "Lesson 2: 거룩한 말뚝: 도구론",
                duration: "15:00",
                videoUrl: "",
                description: "세상이 만든 AI(말뚝)를 하나님 나라를 위해 사용하는 방법. 세속적 기술을 거룩한 목적(설교 영상, 전도 앱)으로 전용하는 기술 훈련."
            },
            {
                id: "j-3",
                title: "Lesson 3: 카이로스의 포착",
                duration: "15:00",
                videoUrl: "",
                description: "결정적인 순간(Kairos)을 놓치지 않는 기민함. 급변하는 기술 트렌드 속에서 복음 전파의 골든타임을 포착하고 대응하는 위기 관리."
            },
            {
                id: "j-4",
                title: "Lesson 4: 창조적 지혜 (Creativity)",
                duration: "15:00",
                videoUrl: "",
                description: "가진 재료를 활용해 최선의 결과를 내는 야엘의 지혜처럼, 생성형 AI(이미지, 음악, 영상)를 활용해 창조적 영감을 표현하는 문화 사역."
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
