import { api } from "./api";
import type { Brand } from "../types";

export const BrandService = {
    list: async (): Promise<Brand[]> => {
        return api.get<Brand[]>("/brands");
    },

    getById: async (id: number): Promise<Brand> => {
        return api.get<Brand>(`/brands/${id}`);
    },
};
