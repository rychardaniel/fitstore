// Product types
export interface Product {
    id: number;
    name: string;
    description?: string;
    categoryId?: number;
    categoryName?: string;
    brandId?: number;
    brandName?: string;
    active: boolean;
    image?: string;
    price: number;
    originalPrice?: number;
    stockQuantity: number;
    sku?: string;
}

export interface ProductFilter {
    search?: string;
    categoryId?: number;
    brandId?: number;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortDescending?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

// Category & Brand types
export interface Category {
    id: number;
    name: string;
    productCount?: number;
}

export interface Brand {
    id: number;
    name: string;
    productCount?: number;
}

// Cart types
export interface CartItem {
    id: number;
    productId: number;
    productName?: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
    total: number;
    stockAvailable: number;
}

export interface Cart {
    id: number;
    items: CartItem[];
    subtotal: number;
    totalItems: number;
}

// Order types
export interface OrderItem {
    id: number;
    productId: number;
    productName?: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
    total: number;
}

export interface ShippingAddress {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface Order {
    id: number;
    uuid: string;
    createdAt: string;
    orderDate: string;
    deliveryDate?: string;
    totalAmount: number;
    status: string;
    items: OrderItem[];
    shippingAddress?: ShippingAddress;
}

export interface OrderSummary {
    id: number;
    uuid: string;
    orderDate: string;
    totalAmount: number;
    status: string;
    itemCount: number;
}

// User types
export interface User {
    id: number;
    fullName?: string;
    email?: string;
    active: boolean;
    createdAt?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phone?: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    fullName: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    email: string;
    password: string;
    phone?: string;
}

// Review types
export interface Review {
    id: number;
    productId: number;
    userId: number;
    userName?: string;
    rating: number;
    title?: string;
    comment?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductReviews {
    productId: number;
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
    reviews: Review[];
}

export interface CreateReview {
    rating: number;
    title?: string;
    comment?: string;
}

// Wishlist types
export interface WishlistItem {
    id: number;
    productId: number;
    productName?: string;
    productImage?: string;
    price: number;
    originalPrice?: number;
    inStock: boolean;
    addedAt: string;
}

export interface Wishlist {
    id: number;
    totalItems: number;
    items: WishlistItem[];
}

// Profile types
export interface UserProfile {
    id: number;
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    createdAt?: string;
}

export interface UpdateProfile {
    fullName?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}

export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
}
