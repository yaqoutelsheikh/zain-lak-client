import type { AccountKey, AccountView } from "./types";

export const accountViews = [
    { id: "overview", label: "account.tabs.overview", href: "/account" },
    { id: "orders", label: "account.tabs.orders", href: "/account/orders" },
    { id: "wallet", label: "account.tabs.wallet", href: "/account/wallet" },
    { id: "referrals", label: "account.tabs.referrals", href: "/account/referrals" },
] as const satisfies Array<{ id: AccountView; label: AccountKey; href: string }>;

export const accountTitles = {
    overview: "account.overviewTitle",
    orders: "account.ordersTitle",
    wallet: "account.walletTitle",
    referrals: "account.referralsTitle",
} as const satisfies Record<AccountView, AccountKey>;

export const knownStatuses = ["active", "pending", "completed", "cancelled", "expired", "used", "available"] as const;
export const knownTransactionTypes = ["credit", "debit", "reward", "refund"] as const;
