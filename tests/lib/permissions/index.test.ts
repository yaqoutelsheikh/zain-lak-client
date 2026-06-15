import { describe, expect, it } from "vitest";
import { can, canAll, canAny, toSet } from "@/lib/permissions";

describe("permissions", () => {

    it("allows every permission with the global wildcard", () => {

        const set = toSet(["*"]);

        expect(can(set, "orders.show")).toBe(true);
        expect(canAll(set, ["orders.show", "wallet.view"])).toBe(true);

    });

    it("allows direct and resource wildcard permissions", () => {

        const set = toSet(["orders.*", "wallet.view"]);

        expect(can(set, "orders.show")).toBe(true);
        expect(can(set, "wallet.view")).toBe(true);
        expect(canAny(set, ["wallet.withdraw", "wallet.view"])).toBe(true);

    });

    it("denies missing permissions", () => {

        const set = toSet(["orders.show"]);

        expect(can(set, "orders.update")).toBe(false);
        expect(canAll(set, ["orders.show", "orders.update"])).toBe(false);
        expect(canAny(set, ["wallet.view", "orders.update"])).toBe(false);

    });

});
