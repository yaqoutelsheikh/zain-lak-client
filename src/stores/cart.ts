import { createStore } from "./create-store";

export type CartProductType =
    | "physical"
    | "digital"
    | "service"
    | "tour"
    | "hotel"
    | "realEstate";

export type CartTone = "primary" | "sky" | "violet" | "emerald" | "amber" | "rose";

export type CartItem = {
    id: string;
    slug: string;
    type: CartProductType;
    name: `product.${string}`;
    price: `product.${string}`;
    priceValue: number;
    quantity: number;
    option: `product.${string}`;
    selectedDate: string;
    tone: CartTone;
    meta: `product.${string}`;
};

export const useCart = createStore("cart", {
    items: [] as CartItem[],
});

export function addCartItem(item: CartItem) {
    const items = useCart.get("items");
    const existing = items.find((entry) => entry.id === item.id);

    if ( existing ) {

        useCart.set("items", items.map((entry) => (entry.id === item.id ? item : entry)));
        return;

    }

    useCart.set("items", [...items, item]);
}

export function updateCartItem(id: string, patch: Partial<CartItem>) {
    const items = useCart.get("items");

    useCart.set("items", items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
}

export function removeCartItem(id: string) {
    useCart.set("items", useCart.get("items").filter((item) => item.id !== id));
}

export function clearCart() {
    useCart.set("items", []);
}

