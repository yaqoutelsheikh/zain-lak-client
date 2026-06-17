import { afterEach, describe, expect, it } from "vitest";
import { cartTotals, lineTotal } from "@/lib/cart/totals";
import {
    addCartItem,
    type CartItem,
    clearCart,
    removeCartItem,
    updateCartItem,
    useCart,
} from "@/stores/cart";

const item = {
    id: "smart-living-kit:starter",
    slug: "smart-living-kit",
    type: "physical",
    name: "product.products.smartLivingKit.name",
    price: "product.products.smartLivingKit.price",
    priceValue: 129,
    quantity: 2,
    option: "product.products.smartLivingKit.optionOne",
    selectedDate: "2026-06-20",
    tone: "primary",
    meta: "product.products.smartLivingKit.delivery",
} satisfies CartItem;

const service = {
    ...item,
    id: "premium-home-cleaning:deep",
    slug: "premium-home-cleaning",
    type: "service",
    priceValue: 35,
    quantity: 1,
    option: "product.products.premiumHomeCleaning.optionTwo",
    tone: "emerald",
    meta: "product.products.premiumHomeCleaning.duration",
} satisfies CartItem;

describe("cart totals", () => {
    afterEach(() => {
        clearCart();
    });

    it("calculates line totals", () => {
        expect(lineTotal(item)).toBe(258);
    });

    it("calculates subtotal, estimated fees, total, and count", () => {
        expect(cartTotals([item, service])).toEqual({
            subtotal: 293,
            estimatedFees: 9,
            total: 302,
            count: 3,
        });
    });

    it("keeps cart state ephemeral and mutable", () => {
        addCartItem(item);
        addCartItem(service);
        updateCartItem(item.id, { quantity: 3 });
        removeCartItem(service.id);

        expect(useCart.get("items")).toMatchObject([{ id: item.id, quantity: 3 }]);
    });
});
