"use client";

import { Check, Star } from "lucide-react";
import type { ProductDetail, ProductKey } from "../types";

type ProductSummaryProps = {
    item: ProductDetail;
    translate: (key: ProductKey, values?: Record<string, string | number>) => string;
};

export function ProductSummary({ item, translate }: ProductSummaryProps) {
    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold text-gold-soft-foreground">
                    {translate(item.badge)}
                </span>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {translate(`product.types.${item.type}`)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    <Star aria-hidden className="size-3.5 fill-current text-gold" />
                    {translate("product.rating", { rating: item.rating })}
                </span>
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {translate(item.name)}
            </h1>
            <p className="mt-4 max-w-3xl text-pretty text-base leading-7 text-muted-foreground">
                {translate(item.summary)}
            </p>
            <p className="mt-5 text-lg font-semibold text-primary">{translate(item.price)}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {item.highlights.map((highlight) => (
                    <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3" key={highlight}>
                        <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span className="text-sm font-medium text-foreground">{translate(highlight)}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}

