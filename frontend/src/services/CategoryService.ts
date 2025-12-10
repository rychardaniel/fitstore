import { api } from "./api";
import type { Category } from "../types";

export const CategoryService = {
    list: async (): Promise<Category[]> => {
        return api.get<Category[]>("/categories");
    },

    getById: async (id: number): Promise<Category> => {
        return api.get<Category>(`/categories/${id}`);
    },
};
