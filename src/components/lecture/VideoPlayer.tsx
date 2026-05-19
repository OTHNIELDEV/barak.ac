"use client";

import { useRef, useState, useEffect } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface VideoPlayerProps {
    src: string;
    poster?: string;
    onEnded?: () => void;
}

export function VideoPlayer({ src, poster, onEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [maxWatchedTime, setMaxWatchedTime] = useState(0);
    const [showWarning, setShowWarning] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const currentTime = videoRef.current.currentTime;

        // Prevent scrubbing ahead
        if (currentTime > maxWatchedTime + 1 && !isCompleted) { // +1 tolerance
            videoRef.current.currentTime = maxWatchedTime;
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
        } else {
            // Update max watched time normally
            if (currentTime > maxWatchedTime) {
                setMaxWatchedTime(currentTime);
            }
        }
    };

    const handleEnded = () => {
        setIsCompleted(true);
        if (onEnded) onEnded();
    };

    const handleSeeked = () => {
        if (!videoRef.current) return;
        if (videoRef.current.currentTime > maxWatchedTime && !isCompleted) {
            videoRef.current.currentTime = maxWatchedTime;
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
        }
    };

    // Helper to extract ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYouTubeId(src);

    if (youtubeId) {
        return (
            <div className="relative group rounded-xl overflow-hidden shadow-lg bg-black aspect-video">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
                {/* Note: Scrubbing protection for YouTube iframe requires YouTube Player API, omitted for simplicity to fix playback first */}
            </div>
        );
    }

    return (
        <div className="relative group rounded-xl overflow-hidden shadow-lg bg-black aspect-video">
            <video
                ref={videoRef}
                src={src}
                poster={poster}
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload"
                onTimeUpdate={handleTimeUpdate}
                onSeeked={handleSeeked}
                onEnded={handleEnded}
            >
                Your browser does not support the video tag.
            </video>

            {/* Scrubbing Warning Overlay */}
            {showWarning && (
                <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none bg-black/50 animate-in fade-in zoom-in">
                    <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl backdrop-blur-sm">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-semibold text-sm">건너뛰기는 허용되지 않습니다. 순서대로 시청해주세요.</span>
                    </div>
                </div>
            )}

            {/* Completed Overlay (Optional visual cue) */}
            {isCompleted && (
                <div className="absolute top-4 right-4 z-40 animate-in fade-in slide-in-from-top-2">
                    <div className="bg-green-500/90 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-sm text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>시청 완료</span>
                    </div>
                </div>
            )}
        </div>
    );
}
