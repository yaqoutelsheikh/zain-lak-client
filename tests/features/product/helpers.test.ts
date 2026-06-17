import { describe, expect, it } from "vitest";
import { product } from "@/features/product/config";
import { defaultOption, findProduct, relatedProducts } from "@/features/product/helpers";

describe("product helpers", () => {
    it("resolves a product by slug", () => {
        const item = findProduct("premium-home-cleaning");

        expect(item?.type).toBe("service");
        expect(item?.facts).toHaveLength(3);
    });

    it("returns undefined for unknown slugs", () => {
        expect(findProduct("missing-item")).toBeUndefined();
    });

    it("returns valid related products only", () => {
        const item = product.products[0];

        if ( !item ) throw new Error("Missing product fixture");

        expect(relatedProducts(item).map((related) => related.slug)).toEqual(["brand-launch-pack", "premium-home-cleaning"]);
    });

    it("returns the first option as the default intent option", () => {
        const item = findProduct("city-view-hotel");

        if ( !item ) throw new Error("Missing product fixture");

        expect(defaultOption(item)?.id).toBe("room");
    });
});
