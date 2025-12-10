import { api } from "./api";
import type { PaginatedResponse } from "../types";

export interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    pendingOrders: number;
    lowStockProducts: number;
    recentOrders: RecentOrder[];
    topProducts: TopProduct[];
}

export interface RecentOrder {
    id: number;
    customerName?: string;
    customerEmail?: string;
    total: number;
    status: string;
    createdAt: string;
}

export interface TopProduct {
    id: number;
    name: string;
    image?: string;
    totalSold: number;
    revenue: number;
}

export interface AdminUser {
    id: number;
    fullName?: string;
    email?: string;
    phone?: string;
    role: string;
    active: boolean;
    createdAt: string;
    orderCount: number;
    totalSpent: number;
}

export interface OrderFilter {
    status?: string;
    search?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}

export const AdminService = {
    getStats: () => api.get<AdminStats>("/admin/stats"),

    getOrders: (filter: OrderFilter = {}) => {
        const params = new URLSearchParams();
        if (filter.status) params.append("status", filter.status);
        if (filter.search) params.append("search", filter.search);
        if (filter.startDate) params.append("startDate", filter.startDate);
        if (filter.endDate) params.append("endDate", filter.endDate);
        if (filter.page) params.append("page", filter.page.toString());
        if (filter.pageSize)
            params.append("pageSize", filter.pageSize.toString());
        const query = params.toString();
        return api.get<PaginatedResponse<RecentOrder>>(
            `/admin/orders${query ? `?${query}` : ""}`
        );
    },

    updateOrderStatus: (orderId: number, status: string) =>
        api.patch<void>(`/admin/orders/${orderId}/status`, { status }),

    getUsers: (page = 1, pageSize = 20, search?: string) => {
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("pageSize", pageSize.toString());
        if (search) params.append("search", search);
        return api.get<PaginatedResponse<AdminUser>>(
            `/admin/users?${params.toString()}`
        );
    },

    updateUserRole: (userId: number, role: string) =>
        api.patch<void>(`/admin/users/${userId}/role`, { role }),

    toggleUserActive: (userId: number) =>
        api.patch<void>(`/admin/users/${userId}/toggle-active`),

    // Product management (uses existing endpoints)
    createProduct: (data: CreateProductData) => api.post("/products", data),
    updateProduct: (id: number, data: UpdateProductData) =>
        api.put(`/products/${id}`, data),
    deleteProduct: (id: number) => api.delete(`/products/${id}`),
    updateStock: (id: number, quantity: number) =>
        api.patch(`/products/${id}/stock`, quantity),

    // Category management
    createCategory: (data: { name: string }) => api.post("/categories", data),
    updateCategory: (id: number, data: { name?: string }) =>
        api.put(`/categories/${id}`, data),
    deleteCategory: (id: number) => api.delete(`/categories/${id}`),

    // Brand management
    createBrand: (data: { name: string }) => api.post("/brands", data),
    updateBrand: (id: number, data: { name?: string }) =>
        api.put(`/brands/${id}`, data),
    deleteBrand: (id: number) => api.delete(`/brands/${id}`),
};

interface CreateProductData {
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    stockQuantity: number;
    categoryId?: number;
    brandId?: number;
    sku?: string;
    image?: string;
}

interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    stockQuantity?: number;
    categoryId?: number;
    brandId?: number;
    sku?: string;
    image?: string;
}
