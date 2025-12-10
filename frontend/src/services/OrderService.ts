import { api } from "./api";
import type { Order, OrderSummary } from "../types";

interface CreateOrderData {
    shippingAddress?: string;
    shippingCity?: string;
    shippingState?: string;
    shippingZipCode?: string;
    notes?: string;
}

export const OrderService = {
    createOrder: async (data?: CreateOrderData): Promise<Order> => {
        return api.post("/orders", data || {});
    },

    getUserOrders: async (): Promise<OrderSummary[]> => {
        return api.get<OrderSummary[]>("/orders");
    },

    getOrderById: async (id: number): Promise<Order> => {
        return api.get<Order>(`/orders/${id}`);
    },

    getOrderByUuid: async (uuid: string): Promise<Order> => {
        return api.get<Order>(`/orders/uuid/${uuid}`);
    },

    cancelOrder: async (id: number): Promise<void> => {
        return api.post(`/orders/${id}/cancel`);
    },
};
