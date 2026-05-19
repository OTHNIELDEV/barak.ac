import { useEffect, useState, useRef } from "react";
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface VideoPlayerProps {
    videoUrl: string;
    onComplete: () => void;
    title?: string;
}

export function VideoPlayer({ videoUrl, onComplete, title }: VideoPlayerProps) {
    const [hasMounted, setHasMounted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Mount check
    useEffect(() => {
        setHasMounted(true);
    }, []);

    const handleEnded = () => {
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
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-blue-900/90 backdrop-blur-sm animate-in fade-in duration-500 pointer-events-none">
                    <CheckCircle2 className="w-20 h-20 text-yellow-500 mb-4 animate-bounce" />
                    <h3 className="text-3xl font-bold text-white mb-2">강의 완료!</h3>
                    <p className="text-blue-200">수고하셨습니다.</p>
                </div>
            )}

            {/* Title Overlay */}


            {youtubeId ? (
                <YouTubeEmbed
                    videoId={youtubeId}
                    onEnded={handleEnded}
                    title={title}
                />
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
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-50 pointer-events-none">
                    <h3 className="text-white font-bold drop-shadow-md text-lg">{title}</h3>
                </div>
            )}
        </div>
    );
}

// Sub-component for YouTube to handle API logic cleanly
function YouTubeEmbed({ videoId, onEnded, title }: { videoId: string, onEnded: () => void, title?: string }) {
    const playerRef = useRef<any>(null);
    const [maxPlayed, setMaxPlayed] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Load API
        if (!(window as any).YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }

        const initPlayer = () => {
            playerRef.current = new (window as any).YT.Player(`youtube-player-${videoId}`, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    playsinline: 1,
                    rel: 0,
                    modestbranding: 1,
                },
                events: {
                    'onStateChange': (event: any) => {
                        if (event.data === 0) { // YT.PlayerState.ENDED
                            onEnded();
                        }
                    },
                    'onReady': () => {
                        // Start monitoring progress
                        intervalRef.current = setInterval(checkProgress, 1000);
                    }
                }
            });
        };

        if ((window as any).YT && (window as any).YT.Player) {
            initPlayer();
        } else {
            (window as any).onYouTubeIframeAPIReady = initPlayer;
        }

        return () => {
            if (playerRef.current) playerRef.current.destroy();
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [videoId, onEnded]);

    const checkProgress = () => {
        if (!playerRef.current || !playerRef.current.getCurrentTime) return;

        const currentTime = playerRef.current.getCurrentTime();

        // 1. Update max played (allow 2 seconds buffer)
        if (currentTime > maxPlayed) {
            // Logic: If user jumps AHEAD more than 2 seconds beyond maxPlayed, it's a seek
            // If they are just watching normally, currentTime will be close to maxPlayed
            if (currentTime > maxPlayed + 2) {
                // ILLEGAL SEEK DETECTED
                playerRef.current.seekTo(maxPlayed, true);
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
            } else {
                // NORMAL PLAYBACK
                setMaxPlayed(currentTime);
            }
        }
    };

    return (
        <div className="w-full h-full relative">
            <div id={`youtube-player-${videoId}`} className="w-full h-full" />

            {/* Warning Toast */}
            {showWarning && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-in fade-in zoom-in duration-200 z-50 pointer-events-none">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-sm">아직 시청하지 않은 구간으로 건너뛸 수 없습니다.</span>
                </div>
            )}
        </div>
    );
}

