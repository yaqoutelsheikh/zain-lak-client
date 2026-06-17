import { describe, expect, it } from "vitest";
import { activitySummary, clampProgress, referralConversionRate, statusTone, walletTotal } from "@/lib/account/summary";

describe("account summary helpers", () => {
    it("maps known statuses to stable tones", () => {
        expect(statusTone("active")).toBe("success");
        expect(statusTone("pending")).toBe("warning");
        expect(statusTone("expired")).toBe("danger");
        expect(statusTone("used")).toBe("muted");
        expect(statusTone("review")).toBe("primary");
    });

    it("clamps progress values", () => {
        expect(clampProgress(-10)).toBe(0);
        expect(clampProgress(48.6)).toBe(49);
        expect(clampProgress(140)).toBe(100);
    });

    it("calculates referral conversion rate safely", () => {
        expect(referralConversionRate({ invited: 0, converted: 3 })).toBe(0);
        expect(referralConversionRate({ invited: 8, converted: 3 })).toBe(38);
    });

    it("summarizes account activity", () => {
        expect(activitySummary({
            totalOrders: 4,
            activeBookings: 2,
            completedBookings: 5,
            savedCoupons: 3,
            openSupport: 1,
        })).toEqual({
            total: 15,
            bookings: 7,
            engagement: 4,
        });
    });

    it("combines wallet balances without changing currency metadata", () => {
        expect(walletTotal({
            pendingBalance: { amount: 25, currency: "USD" },
            withdrawableBalance: { amount: 75, currency: "USD" },
            totalEarned: { amount: 400, currency: "USD" },
        })).toEqual({ amount: 500, currency: "USD" });
    });
});
