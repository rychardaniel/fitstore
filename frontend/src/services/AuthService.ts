import { api } from "./api";
import type { User, LoginCredentials, RegisterData } from "../types";

export const AuthService = {
    login: async (
        credentials: LoginCredentials
    ): Promise<{ token: string; message: string }> => {
        return api.post("/users/authenticate", credentials);
    },

    register: async (data: RegisterData): Promise<User> => {
        return api.post("/users", {
            fullName: data.fullName,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            email: data.email,
            password: data.password,
            phone: data.phone,
        });
    },

    getCurrentUser: async (userId: number): Promise<User> => {
        return api.get<User>(`/users/${userId}`);
    },

    updateUser: async (user: Partial<User>): Promise<User> => {
        return api.put("/users", user);
    },

    logout: async (): Promise<void> => {
        // Clear cookie on server side if implemented, otherwise just clear local state
        document.cookie =
            "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    },
};
