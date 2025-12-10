import { api } from "./api";
import type { Product, PaginatedResponse, ProductFilter } from "../types";

export const ProductService = {
    list: async (
        filter?: ProductFilter
    ): Promise<PaginatedResponse<Product>> => {
        const params = new URLSearchParams();
        if (filter) {
            if (filter.search) params.append("search", filter.search);
            if (filter.categoryId)
                params.append("categoryId", filter.categoryId.toString());
            if (filter.brandId)
                params.append("brandId", filter.brandId.toString());
            if (filter.minPrice)
                params.append("minPrice", filter.minPrice.toString());
            if (filter.maxPrice)
                params.append("maxPrice", filter.maxPrice.toString());
            if (filter.inStock !== undefined)
                params.append("inStock", filter.inStock.toString());
            if (filter.page) params.append("page", filter.page.toString());
            if (filter.pageSize)
                params.append("pageSize", filter.pageSize.toString());
            if (filter.sortBy) params.append("sortBy", filter.sortBy);
            if (filter.sortDescending)
                params.append(
                    "sortDescending",
                    filter.sortDescending.toString()
                );
        }
        const queryString = params.toString();
        return api.get<PaginatedResponse<Product>>(
            `/products${queryString ? `?${queryString}` : ""}`
        );
    },

    getById: async (id: number): Promise<Product> => {
        return api.get<Product>(`/products/${id}`);
    },

    search: async (query: string): Promise<Product[]> => {
        return api.get<Product[]>(
            `/products/search?q=${encodeURIComponent(query)}`
        );
    },

    getByCategory: async (categoryId: number): Promise<Product[]> => {
        return api.get<Product[]>(`/products/category/${categoryId}`);
    },

    getByBrand: async (brandId: number): Promise<Product[]> => {
        return api.get<Product[]>(`/products/brand/${brandId}`);
    },
};
