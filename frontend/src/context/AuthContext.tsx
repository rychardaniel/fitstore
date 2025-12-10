import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { AuthService } from "../services/AuthService";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: {
        fullName: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        email: string;
        password: string;
        phone?: string;
    }) => Promise<void>;
    logout: () => void;
    updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in (from localStorage)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem("user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await AuthService.login({ email, password });
        if (response.token) {
            // Decode token to get user info (basic decode, not verification)
            const tokenPayload = JSON.parse(atob(response.token.split(".")[1]));

            // Try different claim formats
            const userIdClaim =
                tokenPayload[
                    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
                ] ||
                tokenPayload["nameid"] ||
                tokenPayload["sub"] ||
                tokenPayload["userId"];

            const userId = parseInt(userIdClaim);

            if (isNaN(userId)) {
                console.error(
                    "Could not parse user ID from token. Token payload:",
                    tokenPayload
                );
                throw new Error("Failed to parse user information from token");
            }

            // Token is stored in HttpOnly cookie by the backend
            // Just fetch user data and store in localStorage for UI purposes
            const userData = await AuthService.getCurrentUser(userId);
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        }
    };

    const register = async (data: {
        fullName: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
        email: string;
        password: string;
        phone?: string;
    }) => {
        await AuthService.register(data);
        // Auto-login after registration
        await login(data.email, data.password);
    };

    const logout = () => {
        AuthService.logout();
        // Cookie is cleared by the backend
        setUser(null);
        localStorage.removeItem("user");
    };

    const updateUser = async (userData: Partial<User>) => {
        if (!user) return;
        const updatedUser = await AuthService.updateUser({
            ...user,
            ...userData,
        });
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
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
