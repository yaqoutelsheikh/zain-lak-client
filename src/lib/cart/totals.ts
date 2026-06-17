import type { CartItem } from "@/stores/cart";

export type CartTotals = {
    subtotal: number;
    estimatedFees: number;
    total: number;
    count: number;
};

export function lineTotal(item: Pick<CartItem, "priceValue" | "quantity">) {
    return item.priceValue * item.quantity;
}

export function cartTotals(items: CartItem[]): CartTotals {
    const subtotal = items.reduce((sum, item) => sum + lineTotal(item), 0);
    const estimatedFees = items.length ? Math.round(subtotal * 0.03) : 0;
    const count = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
        subtotal,
        estimatedFees,
        total: subtotal + estimatedFees,
        count,
    };
}
