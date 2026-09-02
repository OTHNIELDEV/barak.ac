import { useEffect, useState, useRef } from "react";
import { Loader2, AlertTriangle, CheckCircle2, Play, Sparkles, FastForward } from "lucide-react";

interface VideoPlayerProps {
    videoUrl: string;
    onComplete: () => void;
    title?: string;
}

export function VideoPlayer({ videoUrl, onComplete, title }: VideoPlayerProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleEnded = () => {
        setIsCompleted(true);
        onComplete();
    };

    const handleFastComplete = () => {
        setIsCompleted(true);
        onComplete();
    };

    // Helper to extract ID
    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (!hasMounted) {
        return (
            <div className="w-full aspect-video bg-black flex items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
        );
    }

    const youtubeId = getYouTubeId(videoUrl);

    return (
        <div className="relative group bg-black rounded-xl overflow-hidden shadow-2xl aspect-video">
            {/* Completion Overlay */}
            {isCompleted && (
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-blue-950/90 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                    <CheckCircle2 className="w-16 h-16 text-amber-400 mb-3 animate-bounce" />
                    <h3 className="text-2xl font-bold text-white mb-1">강의 시청 완료!</h3>
                    <p className="text-amber-200 text-sm">하단의 [아멘] 버튼을 눌러 수강 진도를 저장해 주세요.</p>
                </div>
            )}

            {youtubeId ? (
                <div className="w-full h-full relative">
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
                        title={title || "YouTube video player"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                    />
                </div>
            ) : videoUrl ? (
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    controls
                    controlsList="nodownload"
                    onEnded={handleEnded}
                >
                    Your browser does not support the video tag.
                </video>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
                    <AlertTriangle className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium">등록된 영상이 없습니다.</p>
                </div>
            )}

            {/* Title Overlay */}
            {title && (
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-30 pointer-events-none">
                    <h3 className="text-white font-bold drop-shadow-md text-base sm:text-lg">{title}</h3>
                </div>
            )}

            {/* Quick Fast-Complete Test Helper Pill */}
            {!isCompleted && (
                <button
                    onClick={handleFastComplete}
                    className="absolute bottom-3 right-3 z-30 px-3 py-1.5 bg-black/75 hover:bg-amber-500 hover:text-black text-amber-300 text-xs font-semibold rounded-lg border border-amber-400/40 backdrop-blur-md transition-all shadow-lg flex items-center gap-1.5 opacity-80 hover:opacity-100"
                    title="테스트 목적으로 강의를 즉시 시청 완료 처리합니다."
                >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>[테스트] 시청 완료 처리</span>
                </button>
            )}
        </div>
    );
}

