"use client";

import { BadgePercent, CreditCard, Gift, History, UserRound, Wallet } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { AccountActivityItem, AccountCoupon, AccountProfile, AccountReferrals, AccountTransaction, AccountWallet } from "@/api/account";
import {
    useAccountBookings,
    useAccountCoupons,
    useAccountOrders,
    useAccountOverview,
    useAccountReferrals,
    useAccountTransactions,
    useAccountWallet,
} from "@/hooks/use-account";
import { activitySummary, referralConversionRate, statusTone, walletTotal } from "@/lib/account/summary";
import { Link } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn/cn";
import { AccountSkeleton, AccountState } from "./components/account-state";
import { accountTitles, accountViews, knownStatuses, knownTransactionTypes } from "./config";
import type { AccountKey, AccountView } from "./types";

type AccountProps = {
    view?: AccountView;
};

type Money = {
    amount: number;
    currency: string;
};

export function Account({ view = "overview" }: AccountProps) {
    const t = useTranslations("account");
    const format = useFormatter();
    const overview = useAccountOverview();
    const orders = useAccountOrders();
    const bookings = useAccountBookings();
    const wallet = useAccountWallet();
    const transactions = useAccountTransactions();
    const coupons = useAccountCoupons();
    const referrals = useAccountReferrals();
    const translate = (key: AccountKey) => t(key.replace("account.", "") as Parameters<typeof t>[0]);
    const money = (value: Money) => format.number(value.amount, { style: "currency", currency: value.currency });
    const date = (value: string) => format.dateTime(new Date(value), { dateStyle: "medium" });
    const number = (value: number) => format.number(value);

    const retry = () => {
        void overview.refetch();
        void orders.refetch();
        void bookings.refetch();
        void wallet.refetch();
        void transactions.refetch();
        void coupons.refetch();
        void referrals.refetch();
    };

    const pending = [overview, orders, bookings, wallet, transactions, coupons, referrals].some((query) => query.isPending);
    const primaryError = view === "overview"
        ? overview.isError
        : view === "orders"
            ? orders.isError && bookings.isError
            : view === "wallet"
                ? wallet.isError && transactions.isError
                : referrals.isError && coupons.isError;

    return (
        <main className="min-h-dvh overflow-x-hidden bg-background">
            <section className="border-b bg-background px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
                    <div className="min-w-0">
                        <h1 className="max-w-full text-balance break-words text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                            {translate(accountTitles[view])}
                        </h1>
                        <p className="mt-3 max-w-3xl text-pretty text-base leading-7 text-muted-foreground">
                            {translate("account.description")}
                        </p>
                    </div>
                    <AccountNavigation active={view} translate={translate} />
                </div>
            </section>

            <section className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl min-w-0">
                    {pending ? <AccountSkeleton label={translate} /> : null}
                    {!pending && primaryError ? (
                        <AccountState
                            title={translate("account.errorTitle")}
                            description={translate("account.errorDescription")}
                            retry={retry}
                            retryLabel={translate("account.retry")}
                            tone="error"
                        />
                    ) : null}
                    {!pending && !primaryError ? (
                        <AccountContent
                            bookings={bookings.data ?? []}
                            coupons={coupons.data ?? []}
                            date={date}
                            money={money}
                            number={number}
                            orders={orders.data ?? []}
                            overview={overview.data}
                            referrals={referrals.data}
                            retry={retry}
                            transactions={transactions.data ?? []}
                            translate={translate}
                            view={view}
                            wallet={wallet.data}
                        />
                    ) : null}
                </div>
            </section>
        </main>
    );
}

type AccountNavigationProps = {
    active: AccountView;
    translate: (key: AccountKey) => string;
};

function AccountNavigation({ active, translate }: AccountNavigationProps) {
    return (
        <nav aria-label={translate("account.title")} className="grid max-w-full grid-cols-2 gap-2 rounded-lg border bg-card p-1 shadow-sm sm:flex sm:overflow-x-auto">
            {accountViews.map((item) => (
                <Link
                    key={item.id}
                    href={item.href}
                    aria-current={active === item.id ? "page" : undefined}
                    className={cn(
                        "rounded-lg px-3 py-2 text-center text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-ring sm:shrink-0",
                        active === item.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                >
                    {translate(item.label)}
                </Link>
            ))}
        </nav>
    );
}

type AccountContentProps = {
    bookings: AccountActivityItem[];
    coupons: AccountCoupon[];
    date: (value: string) => string;
    money: (value: Money) => string;
    number: (value: number) => string;
    orders: AccountActivityItem[];
    overview?: { profile: AccountProfile; activity: Parameters<typeof activitySummary>[0] };
    referrals?: AccountReferrals;
    retry: () => void;
    transactions: AccountTransaction[];
    translate: (key: AccountKey) => string;
    view: AccountView;
    wallet?: AccountWallet;
};

function AccountContent(props: AccountContentProps) {
    if ( props.view === "orders" ) return <OrdersView {...props} />;
    if ( props.view === "wallet" ) return <WalletView {...props} />;
    if ( props.view === "referrals" ) return <ReferralsView {...props} />;

    return <OverviewView {...props} />;
}

function OverviewView({ bookings, coupons, date, money, number, orders, overview, referrals, translate, wallet }: AccountContentProps) {
    if ( !overview && !wallet && !orders.length && !bookings.length && !coupons.length && !referrals ) {
        return <Empty translate={translate} />;
    }

    const activity = overview ? activitySummary(overview.activity) : null;

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
            <div className="grid gap-5">
                {overview ? <ProfileCard date={date} profile={overview.profile} translate={translate} /> : null}
                {overview && activity ? (
                    <section className="grid gap-3 sm:grid-cols-3">
                        <MetricCard label={translate("account.totalOrders")} value={number(overview.activity.totalOrders)} />
                        <MetricCard label={translate("account.activeBookings")} value={number(activity.bookings)} />
                        <MetricCard label={translate("account.availableCoupons")} value={number(overview.activity.savedCoupons)} />
                    </section>
                ) : null}
                <ActivityList date={date} emptyLabel={translate("account.emptyTitle")} items={[...orders, ...bookings].slice(0, 5)} money={money} translate={translate} />
            </div>
            <div className="grid h-fit gap-5">
                {wallet ? <WalletCard money={money} translate={translate} wallet={wallet} /> : null}
                {referrals ? <ReferralCard number={number} referrals={referrals} translate={translate} /> : null}
            </div>
        </div>
    );
}

function OrdersView({ bookings, date, money, orders, translate }: AccountContentProps) {
    const items = [...orders, ...bookings];

    if ( !items.length ) return <Empty translate={translate} />;

    return <ActivityList date={date} emptyLabel={translate("account.emptyTitle")} items={items} money={money} translate={translate} />;
}

function WalletView({ date, money, transactions, translate, wallet }: AccountContentProps) {
    if ( !wallet && !transactions.length ) return <Empty translate={translate} />;

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
            <TransactionList date={date} money={money} transactions={transactions} translate={translate} />
            {wallet ? <WalletCard money={money} translate={translate} wallet={wallet} /> : null}
        </div>
    );
}

function ReferralsView({ coupons, number, referrals, translate }: AccountContentProps) {
    if ( !referrals && !coupons.length ) return <Empty translate={translate} />;

    return (
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
            <CouponList coupons={coupons} translate={translate} />
            {referrals ? <ReferralCard number={number} referrals={referrals} translate={translate} /> : null}
        </div>
    );
}

type ProfileCardProps = {
    date: (value: string) => string;
    profile: AccountProfile;
    translate: (key: AccountKey) => string;
};

function ProfileCard({ date, profile, translate }: ProfileCardProps) {
    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-start gap-4">
                <span className="grid size-14 place-items-center rounded-lg bg-primary/10 text-primary">
                    <UserRound aria-hidden className="size-7" />
                </span>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-2xl font-semibold tracking-tight text-foreground">{profile.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <StatusBadge status={profile.status} translate={translate} />
            </div>
            <dl className="mt-5 grid gap-3 sm:grid-cols-3">
                <Info label={translate("account.phone")} value={profile.phone ?? translate("account.notAvailable")} />
                <Info label={translate("account.joined")} value={date(profile.joinedAt)} />
                <Info label={translate("account.status")} value={<StatusText status={profile.status} translate={translate} />} />
            </dl>
        </section>
    );
}

function MetricCard({ label, value }: { label: string; value: string }) {
    return (
        <article className="rounded-lg border bg-card p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </article>
    );
}

function WalletCard({ money, translate, wallet }: { money: (value: Money) => string; translate: (key: AccountKey) => string; wallet: AccountWallet }) {
    const total = walletTotal(wallet);

    return (
        <aside className="rounded-lg border bg-card p-5 shadow-xl">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Wallet aria-hidden className="size-5" />
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{translate("account.walletTitle")}</h2>
            </div>
            <p className="mt-5 text-sm font-medium text-muted-foreground">{translate("account.totalEarned")}</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight text-primary">{money(wallet.totalEarned)}</p>
            <dl className="mt-5 grid gap-3 border-t pt-4">
                <Info label={translate("account.pendingBalance")} value={money(wallet.pendingBalance)} />
                <Info label={translate("account.withdrawableBalance")} value={money(wallet.withdrawableBalance)} />
                <Info label={translate("account.amount")} value={money(total)} />
            </dl>
        </aside>
    );
}

function ReferralCard({ number, referrals, translate }: { number: (value: number) => string; referrals: AccountReferrals; translate: (key: AccountKey) => string }) {
    const progress = referralConversionRate(referrals);

    return (
        <aside className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Gift aria-hidden className="size-5" />
                </span>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">{translate("account.referralsTitle")}</h2>
            </div>
            <dl className="mt-5 grid gap-3">
                <Info label={translate("account.referralCode")} value={referrals.code} />
                <Info label={translate("account.invited")} value={number(referrals.invited)} />
                <Info label={translate("account.converted")} value={number(referrals.converted)} />
                <Info label={translate("account.points")} value={number(referrals.points)} />
            </dl>
            <div className="mt-5">
                <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-medium text-muted-foreground">{translate("account.progress")}</span>
                    <span className="font-semibold text-foreground">{number(progress)}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ inlineSize: `${progress}%` }} />
                </div>
            </div>
        </aside>
    );
}

function ActivityList({ date, emptyLabel, items, money, translate }: { date: (value: string) => string; emptyLabel: string; items: AccountActivityItem[]; money: (value: Money) => string; translate: (key: AccountKey) => string }) {
    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <PanelTitle icon={<History aria-hidden className="size-5" />} title={translate("account.activity")} />
            {items.length ? (
                <div className="mt-4 grid gap-3">
                    {items.map((item) => (
                        <ActivityRow date={date} item={item} key={item.id} money={money} translate={translate} />
                    ))}
                </div>
            ) : (
                <p className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">{emptyLabel}</p>
            )}
        </section>
    );
}

function TransactionList({ date, money, transactions, translate }: { date: (value: string) => string; money: (value: Money) => string; transactions: AccountTransaction[]; translate: (key: AccountKey) => string }) {
    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <PanelTitle icon={<CreditCard aria-hidden className="size-5" />} title={translate("account.transactions")} />
            <div className="mt-4 grid gap-3">
                {transactions.length ? transactions.map((transaction) => (
                    <article className="rounded-lg border bg-background p-4" key={transaction.id}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-semibold text-foreground">{transaction.description}</p>
                                <p className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                                    <span>{transactionType(transaction.type, translate)}</span>
                                    <span>{date(transaction.date)}</span>
                                </p>
                            </div>
                            <p className="font-semibold text-primary">{money(transaction.amount)}</p>
                        </div>
                    </article>
                )) : <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">{translate("account.emptyTitle")}</p>}
            </div>
        </section>
    );
}

function CouponList({ coupons, translate }: { coupons: AccountCoupon[]; translate: (key: AccountKey) => string }) {
    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <PanelTitle icon={<BadgePercent aria-hidden className="size-5" />} title={translate("account.coupons")} />
            <div className="mt-4 grid gap-3">
                {coupons.length ? coupons.map((coupon) => (
                    <article className="rounded-lg border bg-background p-4" key={coupon.code}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="font-semibold text-foreground">{coupon.label}</p>
                                <p className="mt-1 text-sm text-muted-foreground">{coupon.discount}</p>
                            </div>
                            <StatusBadge status={coupon.status} translate={translate} />
                        </div>
                    </article>
                )) : <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">{translate("account.emptyTitle")}</p>}
            </div>
        </section>
    );
}

function ActivityRow({ date, item, money, translate }: { date: (value: string) => string; item: AccountActivityItem; money: (value: Money) => string; translate: (key: AccountKey) => string }) {
    return (
        <article className="rounded-lg border bg-background p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                        <span>{item.code}</span>
                        <span>{date(item.date)}</span>
                    </p>
                </div>
                <div className="text-end">
                    <p className="font-semibold text-foreground">{money(item.total)}</p>
                    <StatusBadge status={item.status} translate={translate} />
                </div>
            </div>
        </article>
    );
}

function PanelTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</span>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
    );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-foreground">{value}</dd>
        </div>
    );
}

function Empty({ translate }: { translate: (key: AccountKey) => string }) {
    return (
        <AccountState
            title={translate("account.emptyTitle")}
            description={translate("account.emptyDescription")}
            retryLabel={translate("account.retry")}
            tone="empty"
        />
    );
}

function StatusBadge({ status, translate }: { status: string; translate: (key: AccountKey) => string }) {
    return (
        <span className={cn("mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", statusToneClass(status))}>
            <StatusText status={status} translate={translate} />
        </span>
    );
}

function StatusText({ status, translate }: { status: string; translate: (key: AccountKey) => string }) {
    return knownStatuses.includes(status as (typeof knownStatuses)[number])
        ? translate(`account.statuses.${status}` as AccountKey)
        : status;
}

function transactionType(type: string, translate: (key: AccountKey) => string) {
    return knownTransactionTypes.includes(type as (typeof knownTransactionTypes)[number])
        ? translate(`account.transactionTypes.${type}` as AccountKey)
        : type;
}

function statusToneClass(status: string) {
    const tone = statusTone(status);

    if ( tone === "success" ) return "bg-primary/10 text-primary";
    if ( tone === "warning" ) return "bg-gold-soft text-gold-soft-foreground";
    if ( tone === "danger" ) return "bg-destructive/10 text-destructive";
    if ( tone === "muted" ) return "bg-muted text-muted-foreground";

    return "bg-secondary text-secondary-foreground";
}
