"use client";

import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/elements/button";
import type { CartTotals } from "@/lib/cart/totals";
import { Link } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn/cn";

type CartSummaryProps = {
    format: (value: number) => string;
    totals: CartTotals;
    translate: (key: string) => string;
};

export function CartSummary({ format, totals, translate }: CartSummaryProps) {
    return (
        <aside className="rounded-lg border bg-card p-5 shadow-xl">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">{translate("summary")}</h2>
            <dl className="mt-5 grid gap-3">
                <div className="flex items-center justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">{translate("subtotal")}</dt>
                    <dd className="font-semibold text-foreground">{format(totals.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 text-sm">
                    <dt className="text-muted-foreground">{translate("estimatedFees")}</dt>
                    <dd className="font-semibold text-foreground">{format(totals.estimatedFees)}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-t pt-4">
                    <dt className="font-semibold text-foreground">{translate("total")}</dt>
                    <dd className="text-2xl font-semibold text-primary">{format(totals.total)}</dd>
                </div>
            </dl>
            <Link className={cn(buttonVariants({ size: "lg" }), "mt-6 min-h-11 w-full gap-2")} href="/checkout">
                {translate("checkout")}
                <ArrowUpRight aria-hidden className="size-4" />
            </Link>
            <Link className={cn(buttonVariants({ variant: "outline", size: "lg" }), "mt-3 min-h-11 w-full")} href="/catalog">
                {translate("continueShopping")}
            </Link>
        </aside>
    );
}
