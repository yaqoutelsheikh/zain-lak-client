import { describe, expect, it } from "vitest";
import { home } from "@/features/home/config";
import type { ProductType } from "@/features/home/types";

describe("home config", () => {

    it("covers every storefront product type", () => {

        const types = new Set(home.products.map((product) => product.type));
        const expected: ProductType[] = ["physical", "digital", "service", "tour", "hotel", "realEstate"];

        expect([...types].sort()).toEqual([...expected].sort());

    });

    it("uses only defined products in rails", () => {

        const products = new Set(home.products.map((product) => product.id));
        const references = home.rails.flatMap((rail) => rail.items);

        expect(references.every((item) => products.has(item))).toBe(true);

    });

});
