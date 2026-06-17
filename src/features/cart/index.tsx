"use client";

import { useFormatter, useTranslations } from "next-intl";
import { cartTotals } from "@/lib/cart/totals";
import { useCart } from "@/stores/cart";
import { CartEmpty } from "./components/cart-empty";
import { CartItemCard } from "./components/cart-item-card";
import { CartSummary } from "./components/cart-summary";

export function Cart() {
    const t = useTranslations("cart");
    const productT = useTranslations("product");
    const format = useFormatter();
    const items = useCart((state) => state.items);
    const totals = cartTotals(items);
    const money = (value: number) => format.number(value, { style: "currency", currency: "USD" });

    if ( !items.length ) return <CartEmpty translate={t} />;

    return (
        <main className="min-h-dvh bg-background">
            <section className="border-b bg-background px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">{t("cartTitle")}</h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">{t("cartDescription")}</p>
                </div>
            </section>

            <section className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
                    <div className="grid gap-4">
                        {items.map((item) => (
                            <CartItemCard
                                item={item}
                                key={item.id}
                                translate={t}
                                translateProduct={(key) => productT(key.replace("product.", "") as Parameters<typeof productT>[0])}
                            />
                        ))}
                    </div>
                    <CartSummary format={money} totals={totals} translate={t} />
                </div>
            </section>
        </main>
    );
}
