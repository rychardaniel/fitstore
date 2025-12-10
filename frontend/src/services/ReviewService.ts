import { api } from "./api";
import type { ProductReviews, Review, CreateReview } from "../types";

export const ReviewService = {
    getProductReviews: (productId: number) =>
        api.get<ProductReviews>(`/products/${productId}/reviews`),

    createReview: (productId: number, data: CreateReview) =>
        api.post<Review>(`/products/${productId}/reviews`, data),

    updateReview: (reviewId: number, data: CreateReview) =>
        api.put<Review>(`/reviews/${reviewId}`, data),

    deleteReview: (reviewId: number) =>
        api.delete<void>(`/reviews/${reviewId}`),
};
