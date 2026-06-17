"use client";

import {
    Bot,
    Menu,
    Search,
    ShoppingCart,
    Store,
    UserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LocaleSwitcher } from "@/components/custom/locale-switcher";
import { ThemeToggle } from "@/components/custom/theme-toggle";
import { Button, buttonVariants } from "@/components/ui/elements/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/elements/sheet";
import { Link, usePathname } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn";
import { useCart } from "@/stores/cart";

const nav = [
    { key: "discover", href: "/" },
    { key: "catalog", href: "/catalog" },
    { key: "bookings", href: "/#bookings" },
    { key: "deals", href: "/#deals" },
    { key: "support", href: "/#support" },
] as const;

export function Header () {

    const t = useTranslations("header");
    const pathname = usePathname();
    const itemCount = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
    const [open, setOpen] = useState(false);

    return (

        <header className="sticky top-0 z-40 border-b bg-background/85 shadow-sm backdrop-blur-xl">

            <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">

                <Link
                    href="/"
                    aria-label={t("home")}
                    className="group flex min-w-0 items-center gap-3 rounded-2xl outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >

                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl border bg-primary text-primary-foreground shadow-md transition-shadow group-hover:shadow-lg">
                        <Store className="size-5" aria-hidden />
                    </span>

                    <span className="truncate text-base font-semibold tracking-tight text-foreground sm:block">
                        {t("brand")}
                    </span>

                </Link>

                <nav aria-label={t("navigation")} className="hidden items-center gap-1 rounded-full border bg-card/70 p-1 shadow-sm md:flex">

                    {
                        nav.map((item) => {

                            const isActive = item.href === pathname;

                            return (

                                <Link
                                    key={item.key}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "group/nav relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 text-sm font-medium outline-none transition-all",
                                        "after:absolute after:inset-x-4 after:bottom-1 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform after:duration-300",
                                        "hover:-translate-y-0.5 hover:bg-gold-soft hover:text-gold-soft-foreground hover:shadow-xs hover:after:scale-x-100",
                                        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                                        isActive
                                            ? "bg-gold-soft text-gold-soft-foreground shadow-xs after:scale-x-100"
                                            : "text-muted-foreground",
                                    )}
                                >

                                    <span>{t(`nav.${item.key}`)}</span>

                                </Link>

                            );

                        })
                    }

                </nav>

                <div className="ms-auto hidden min-w-64 flex-1 items-center rounded-full border bg-card/80 px-3 py-2 shadow-sm transition-shadow focus-within:shadow-focus xl:flex">

                    <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />

                    <input
                        type="search"
                        aria-label={t("search")}
                        placeholder={t("searchPlaceholder")}
                        className="min-w-0 flex-1 bg-transparent ps-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />

                </div>

                <div className="hidden items-center gap-2 md:flex">

                    <ThemeToggle label={t("theme")} />

                    <Link
                        href="/cart"
                        aria-label={t("cart")}
                        aria-current={pathname === "/cart" ? "page" : undefined}
                        className={cn(
                            buttonVariants({ variant: pathname === "/cart" ? "default" : "outline", size: "icon-lg" }),
                            "relative",
                        )}
                    >
                        <ShoppingCart className="size-4" aria-hidden />
                        {itemCount ? (
                            <span className="-end-1.5 -top-1.5 absolute grid min-h-5 min-w-5 place-items-center rounded-full bg-gold-soft px-1 text-[0.7rem] font-semibold text-gold-soft-foreground ring-2 ring-background">
                                {itemCount}
                            </span>
                        ) : null}
                    </Link>

                    <Button variant="ghost" size="icon-lg" aria-label={t("ai")}>
                        <Bot className="size-4 text-gold-soft-foreground" aria-hidden />
                    </Button>

                    <Link
                        href="/account"
                        aria-label={t("account")}
                        aria-current={pathname.startsWith("/account") ? "page" : undefined}
                        className={cn(
                            buttonVariants({
                                variant: pathname.startsWith("/account") ? "default" : "outline",
                                size: "icon-lg",
                            }),
                        )}
                    >
                        <UserRound className="size-4" aria-hidden />
                    </Link>

                </div>

                <div className="hidden md:block">
                    <LocaleSwitcher />
                </div>

                <Sheet open={open} onOpenChange={setOpen}>

                    <SheetTrigger
                        render={
                            <Button
                                variant="outline"
                                size="icon-lg"
                                aria-label={t("navigation")}
                                className="ms-auto md:hidden"
                            />
                        }
                    >
                        <Menu className="size-5" aria-hidden />
                    </SheetTrigger>

                    <SheetContent side="right" className="w-[min(22rem,calc(100vw-2rem))] border-border/80 bg-background/95 p-0 backdrop-blur-xl">

                        <SheetHeader className="px-5 py-5 text-start">

                            <SheetTitle className="flex items-center gap-3 text-start">

                                <span className="grid size-10 place-items-center rounded-2xl border bg-primary text-primary-foreground shadow-md">
                                    <Store className="size-5" aria-hidden />
                                </span>

                                <span>{t("brand")}</span>

                            </SheetTitle>

                            <SheetDescription>{t("navigation")}</SheetDescription>

                        </SheetHeader>

                        <div className="px-5 pb-4">

                            <div className="flex h-10 items-center rounded-lg border bg-card px-3 shadow-sm">

                                <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />

                                <input
                                    type="search"
                                    aria-label={t("search")}
                                    placeholder={t("searchPlaceholder")}
                                    className="min-w-0 flex-1 bg-transparent ps-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />

                            </div>

                        </div>

                        <nav aria-label={t("navigation")} className="grid gap-1 border-t px-4 py-4">

                            {
                                nav.map((item) => {

                                    const isActive = item.href === pathname;

                                    return (

                                        <Link
                                            key={item.key}
                                            href={item.href}
                                            aria-current={isActive ? "page" : undefined}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "rounded-lg px-3 py-2.5 text-sm font-medium outline-none transition-all",
                                                "hover:bg-gold-soft hover:text-gold-soft-foreground focus-visible:ring-2 focus-visible:ring-ring",
                                                isActive ? "bg-gold-soft text-gold-soft-foreground shadow-xs" : "text-foreground",
                                            )}
                                        >

                                            {t(`nav.${item.key}`)}

                                        </Link>

                                    );

                                })
                            }

                        </nav>

                        <div className="grid gap-5 border-t px-5 py-5">

                            <div className="grid gap-1">

                                <Link
                                    href="/cart"
                                    onClick={() => setOpen(false)}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                                >

                                    <span className="relative grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                        <ShoppingCart className="size-4" aria-hidden />
                                        {itemCount ? (
                                            <span className="-end-1.5 -top-1.5 absolute grid min-h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground ring-2 ring-background">
                                                {itemCount}
                                            </span>
                                        ) : null}
                                    </span>

                                    <span>{t("cart")}</span>

                                </Link>

                                <Link
                                    href="/account"
                                    onClick={() => setOpen(false)}
                                    aria-current={pathname.startsWith("/account") ? "page" : undefined}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
                                        pathname.startsWith("/account") ? "bg-muted" : "",
                                    )}
                                >

                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                        <UserRound className="size-4" aria-hidden />
                                    </span>

                                    <span>{t("account")}</span>

                                </Link>

                                <Link
                                    href="/#discover"
                                    onClick={() => setOpen(false)}
                                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground outline-none transition-all hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                                >

                                    <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition group-hover:bg-primary/10 group-hover:text-primary">
                                        <Bot className="size-4" aria-hidden />
                                    </span>

                                    <span>{t("ai")}</span>

                                </Link>

                            </div>

                            <div className="grid gap-3 border-t pt-5">

                                <div className="flex items-center justify-between gap-3 px-3">

                                    <span className="text-sm font-medium text-muted-foreground">{t("theme")}</span>
                                    <ThemeToggle label={t("theme")} size="icon-lg" />

                                </div>

                                <LocaleSwitcher />

                            </div>

                        </div>

                        <SheetFooter className="sr-only">
                            <span>{t("navigation")}</span>
                        </SheetFooter>

                    </SheetContent>

                </Sheet>

            </div>

        </header>

    );

}
