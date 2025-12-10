import { api } from "./api";
import type { UserProfile, UpdateProfile, ChangePassword } from "../types";

export const ProfileService = {
    getProfile: () => api.get<UserProfile>("/profile"),

    updateProfile: (data: UpdateProfile) =>
        api.put<UserProfile>("/profile", data),

    changePassword: (data: ChangePassword) =>
        api.put<void>("/profile/password", data),
};
