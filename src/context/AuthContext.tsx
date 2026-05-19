"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, db } from "@/lib/storage";
import { useRouter } from "next/navigation";

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Initialize DB and Check Session
        db.init();
        const currentUser = db.auth.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, pass: string) => {
        try {
            const loggedInUser = db.auth.login(email, pass);
            setUser(loggedInUser);
            if (loggedInUser.role === 'admin') {
                router.push("/dashboard/admin");
            } else {
                router.push("/dashboard");
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
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
