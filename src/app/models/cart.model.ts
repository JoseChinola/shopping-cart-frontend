export interface CartItem {
    userId?: number;
    productId?: number;
    quantity?: number;
}

export interface Cart {
    items: CartItem[];
    totalItems: number;
    totalPrice: number;
}