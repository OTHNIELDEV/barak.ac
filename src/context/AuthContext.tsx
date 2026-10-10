"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, db } from "@/lib/storage";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    signup?: (data: Omit<User, "id">) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // 1. Initialize local DB fallback
        db.init();

        const supabase = createClient();

        // 2. Fetch Supabase Session or fallback to local session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // Try fetch profile from Supabase
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("*")
                        .eq("id", session.user.id)
                        .single();

                    if (profile) {
                        setUser({
                            id: profile.id,
                            email: profile.email,
                            name: profile.name,
                            role: profile.role || "student",
                            church: profile.church,
                            profileImage: profile.profile_image,
                            level: profile.level,
                        });
                        setIsLoading(false);
                        return;
                    }
                }
            } catch (e) {
                console.warn("[Auth] Supabase auth check fallback:", e);
            }

            // Fallback to local session
            const currentUser = db.auth.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
            setIsLoading(false);
        };

        initAuth();

        // 3. Listen to Supabase Auth State Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" && session?.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", session.user.id)
                    .single();

                if (profile) {
                    setUser({
                        id: profile.id,
                        email: profile.email,
                        name: profile.name,
                        role: profile.role || "student",
                        church: profile.church,
                        profileImage: profile.profile_image,
                        level: profile.level,
                    });
                }
            } else if (event === "SIGNED_OUT") {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, pass: string) => {
        const cleanEmail = email.trim();
        try {
            const supabase = createClient();
            
            // 1. Try direct Supabase Auth signIn
            const { data, error } = await supabase.auth.signInWithPassword({
                email: cleanEmail,
                password: pass,
            });

            if (!error && data.user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", data.user.id)
                    .single();

                const loggedUser: User = {
                    id: data.user.id,
                    email: data.user.email || cleanEmail,
                    name: profile?.name || data.user.user_metadata?.name || cleanEmail.split("@")[0],
                    role: profile?.role || "student",
                    church: profile?.church,
                    level: profile?.level,
                };
                setUser(loggedUser);

                if (loggedUser.role === "admin") {
                    router.push("/dashboard/admin");
                } else {
                    router.push("/dashboard");
                }
                return;
            }

            // 2. If direct signIn failed, try syncing account via /api/auth/sync (for approved admissions)
            try {
                const syncRes = await fetch("/api/auth/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: cleanEmail, password: pass })
                });

                if (syncRes.ok) {
                    const syncData = await syncRes.json();
                    if (syncData.synced && syncData.user) {
                        // Retry Supabase Auth signIn now that password is synchronized
                        const { data: retryData, error: retryErr } = await supabase.auth.signInWithPassword({
                            email: cleanEmail,
                            password: pass,
                        });

                        const finalUser: User = {
                            id: retryData?.user?.id || syncData.user.id,
                            email: cleanEmail,
                            name: syncData.user.name,
                            role: syncData.user.role || "student",
                            church: syncData.user.church,
                            level: syncData.user.level,
                        };

                        setUser(finalUser);
                        // Also sync to local storage session
                        db.auth.login(cleanEmail, pass);

                        if (finalUser.role === "admin") {
                            router.push("/dashboard/admin");
                        } else {
                            router.push("/dashboard");
                        }
                        return;
                    }
                }
            } catch (syncErr) {
                console.warn("[Auth] /api/auth/sync attempt failed, falling back to local storage:", syncErr);
            }

            // 3. Fallback to local storage login & auto-heal
            const loggedInUser = db.auth.login(cleanEmail, pass);
            setUser(loggedInUser);
            if (loggedInUser.role === "admin") {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
        } catch (e) {
            console.warn("[Auth] Supabase signOut error:", e);
        }
        db.auth.logout();
        setUser(null);
        router.push("/login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
