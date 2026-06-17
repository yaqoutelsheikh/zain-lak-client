import { describe, expect, it } from "vitest";
import { catalog } from "@/features/catalog/config";
import { filterCatalog } from "@/features/catalog/filters";

describe("filterCatalog", () => {
    it("filters by listing type and query", () => {
        const result = filterCatalog(catalog.listings, {
            query: "hotel",
            type: "hotel",
            sort: "featured",
        });

        expect(result).toHaveLength(1);
        expect(result[0]?.id).toBe("city-view-hotel");
    });

    it("sorts by price from low to high", () => {
        const result = filterCatalog(catalog.listings, {
            query: "",
            type: "all",
            sort: "priceLow",
        });

        expect(result.map((item) => item.priceValue)).toEqual([35, 49, 76, 118, 129, 420000]);
    });

    it("returns an empty result for unmatched searches", () => {
        const result = filterCatalog(catalog.listings, {
            query: "nonexistent",
            type: "all",
            sort: "featured",
        });

        expect(result).toEqual([]);
    });
});

