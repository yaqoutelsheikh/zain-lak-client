export type AccountStatusTone = "primary" | "muted" | "success" | "warning" | "danger";

export type AccountMoneyInput = {
    amount: number;
    currency: string;
};

export type AccountActivityInput = {
    totalOrders: number;
    activeBookings: number;
    completedBookings: number;
    savedCoupons: number;
    openSupport?: number;
};

export type AccountWalletInput = {
    pendingBalance: AccountMoneyInput;
    withdrawableBalance: AccountMoneyInput;
    totalEarned: AccountMoneyInput;
};

export type AccountReferralInput = {
    invited: number;
    converted: number;
    points: number;
    progress: number;
};

export type AccountActivitySummary = {
    total: number;
    bookings: number;
    engagement: number;
};

export function statusTone(status: string): AccountStatusTone {
    const normalized = status.toLowerCase();

    if ( ["active", "available", "completed", "credit", "reward"].includes(normalized) ) return "success";
    if ( ["pending"].includes(normalized) ) return "warning";
    if ( ["cancelled", "expired", "debit"].includes(normalized) ) return "danger";
    if ( ["used"].includes(normalized) ) return "muted";

    return "primary";
}

export function clampProgress(value: number) {
    if ( value < 0 ) return 0;
    if ( value > 100 ) return 100;

    return Math.round(value);
}

export function referralConversionRate(referral: Pick<AccountReferralInput, "converted" | "invited">) {
    if ( referral.invited <= 0 ) return 0;

    return clampProgress((referral.converted / referral.invited) * 100);
}

export function activitySummary(activity: AccountActivityInput): AccountActivitySummary {
    const bookings = activity.activeBookings + activity.completedBookings;
    const support = activity.openSupport ?? 0;

    return {
        total: activity.totalOrders + bookings + activity.savedCoupons + support,
        bookings,
        engagement: activity.savedCoupons + support,
    };
}

export function walletTotal(wallet: AccountWalletInput): AccountMoneyInput {
    return {
        amount: wallet.pendingBalance.amount + wallet.withdrawableBalance.amount + wallet.totalEarned.amount,
        currency: wallet.totalEarned.currency,
    };
}
