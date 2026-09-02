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
        try {
            const supabase = createClient();
            // Try Supabase Auth first
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
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
                    email: data.user.email || email,
                    name: profile?.name || data.user.user_metadata?.name || email.split("@")[0],
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

            // Fallback to local mock login
            const loggedInUser = db.auth.login(email, pass);
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
