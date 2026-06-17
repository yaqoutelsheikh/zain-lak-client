"use client";

import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/elements/button";
import { Link } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn/cn";
import type { ProductDetail, ProductKey } from "../types";
import { ProductToneIcon } from "./product-media";

type ProductRelatedProps = {
    items: ProductDetail[];
    translate: (key: ProductKey) => string;
};

export function ProductRelated({ items, translate }: ProductRelatedProps) {
    if ( !items.length ) return null;

    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{translate("product.related")}</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
                {items.map((item) => (
                    <Link
                        className="group flex items-center gap-3 rounded-lg bg-muted/60 p-3 transition hover:bg-gold-soft"
                        href={`/catalog/${item.slug}`}
                        key={item.slug}
                    >
                        <ProductToneIcon type={item.type} tone={item.tone} />
                        <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-semibold text-foreground">{translate(item.name)}</span>
                            <span className="mt-1 block text-sm text-muted-foreground">{translate(item.price)}</span>
                        </span>
                        <span className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }), "text-primary")}>
                            <ArrowUpRight aria-hidden className="size-4" />
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
