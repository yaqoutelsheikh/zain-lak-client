import { z } from "zod";
import type { ApiEntry } from "@/api/client";

const money = z.object({
    amount: z.number(),
    currency: z.string().min(1),
});

const profile = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1),
    email: z.email(),
    phone: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
    status: z.enum(["active", "pending", "completed", "cancelled"]).or(z.string()),
    joinedAt: z.string(),
});

const activity = z.object({
    totalOrders: z.number().int().nonnegative(),
    activeBookings: z.number().int().nonnegative(),
    completedBookings: z.number().int().nonnegative(),
    savedCoupons: z.number().int().nonnegative(),
    openSupport: z.number().int().nonnegative().optional(),
});

const accountOverview = z.object({
    profile,
    activity,
});

const activityItem = z.object({
    id: z.union([z.string(), z.number()]),
    code: z.string().min(1),
    title: z.string().min(1),
    type: z.enum(["physical", "digital", "service", "tour", "hotel", "realEstate"]).or(z.string()),
    status: z.enum(["active", "pending", "completed", "cancelled"]).or(z.string()),
    date: z.string(),
    total: money,
    href: z.string().min(1).optional(),
});

const wallet = z.object({
    pendingBalance: money,
    withdrawableBalance: money,
    totalEarned: money,
    lastUpdatedAt: z.string(),
});

const transaction = z.object({
    id: z.union([z.string(), z.number()]),
    type: z.enum(["credit", "debit", "reward", "refund"]).or(z.string()),
    amount: money,
    status: z.enum(["active", "pending", "completed", "cancelled"]).or(z.string()),
    date: z.string(),
    description: z.string().min(1),
});

const coupon = z.object({
    code: z.string().min(1),
    label: z.string().min(1),
    discount: z.string().min(1),
    status: z.enum(["available", "used", "expired"]).or(z.string()),
    expiresAt: z.string().optional().nullable(),
});

const referrals = z.object({
    code: z.string().min(1),
    link: z.string().min(1),
    invited: z.number().int().nonnegative(),
    converted: z.number().int().nonnegative(),
    points: z.number().int().nonnegative(),
    level: z.string().min(1),
    progress: z.number().min(0).max(100),
});

export type AccountMoney = z.infer<typeof money>;
export type AccountProfile = z.infer<typeof profile>;
export type AccountActivity = z.infer<typeof activity>;
export type AccountOverview = z.infer<typeof accountOverview>;
export type AccountActivityItem = z.infer<typeof activityItem>;
export type AccountWallet = z.infer<typeof wallet>;
export type AccountTransaction = z.infer<typeof transaction>;
export type AccountCoupon = z.infer<typeof coupon>;
export type AccountReferrals = z.infer<typeof referrals>;

const overview = {
    resource: "account",
    action: "overview",
    method: "GET",
    path: "/account",
    need: "account.show",
    schema: accountOverview,
} satisfies ApiEntry<AccountOverview>;

const accountProfile = {
    resource: "account",
    action: "profile",
    method: "GET",
    path: "/account/profile",
    need: "account.show",
    schema: profile,
} satisfies ApiEntry<AccountProfile>;

const updateProfile = {
    resource: "account",
    action: "updateProfile",
    method: "PATCH",
    path: "/account/profile",
    need: "account.update",
    schema: profile,
} satisfies ApiEntry<AccountProfile>;

const orders = {
    resource: "account",
    action: "orders",
    method: "GET",
    path: "/account/orders",
    need: "orders.list",
    schema: z.array(activityItem),
} satisfies ApiEntry<AccountActivityItem[]>;

const order = {
    resource: "account",
    action: "order",
    method: "GET",
    path: "/account/orders/:id",
    need: "orders.show",
    schema: activityItem,
} satisfies ApiEntry<AccountActivityItem>;

const bookings = {
    resource: "account",
    action: "bookings",
    method: "GET",
    path: "/account/bookings",
    need: "bookings.list",
    schema: z.array(activityItem),
} satisfies ApiEntry<AccountActivityItem[]>;

const accountWallet = {
    resource: "account",
    action: "wallet",
    method: "GET",
    path: "/account/wallet",
    need: "wallet.show",
    schema: wallet,
} satisfies ApiEntry<AccountWallet>;

const transactions = {
    resource: "account",
    action: "transactions",
    method: "GET",
    path: "/account/wallet/transactions",
    need: "wallet.transactions.list",
    schema: z.array(transaction),
} satisfies ApiEntry<AccountTransaction[]>;

const coupons = {
    resource: "account",
    action: "coupons",
    method: "GET",
    path: "/account/coupons",
    need: "coupons.list",
    schema: z.array(coupon),
} satisfies ApiEntry<AccountCoupon[]>;

const accountReferrals = {
    resource: "account",
    action: "referrals",
    method: "GET",
    path: "/account/referrals",
    need: "referrals.show",
    schema: referrals,
} satisfies ApiEntry<AccountReferrals>;

export const account = {
    overview,
    profile: accountProfile,
    updateProfile,
    orders,
    order,
    bookings,
    wallet: accountWallet,
    transactions,
    coupons,
    referrals: accountReferrals,
} as const;
