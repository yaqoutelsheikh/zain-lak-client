"use client";

import { ArrowUpRight, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/elements/button";
import { Link } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn/cn";
import type { CatalogKey, CatalogListing } from "../types";
import { listingIcons, toneClassNames } from "./catalog-media";

type CatalogCardProps = {
    listing: CatalogListing;
    translate: (key: CatalogKey, values?: Record<string, string | number>) => string;
};

export function CatalogCard({ listing, translate }: CatalogCardProps) {
    const Icon = listingIcons[listing.type];

    return (
        <article
            className="group flex min-h-full flex-col rounded-lg border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            id={listing.id}
        >
            <div className={cn("flex aspect-[5/3] items-center justify-center rounded-lg ring-1", toneClassNames[listing.tone])}>
                <div className="flex size-16 items-center justify-center rounded-lg bg-background/85 shadow-sm">
                    <Icon aria-hidden className="size-8" />
                </div>
            </div>

            <div className="flex flex-1 flex-col pt-4">
                <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-gold-soft-foreground">
                        {translate(listing.badge)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Star aria-hidden className="size-3.5 fill-current text-gold" />
                        {translate("catalog.rating", { rating: listing.rating })}
                    </span>
                </div>

                <p className="mt-4 text-sm font-semibold text-primary">{translate(listing.price)}</p>
                <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">{translate(listing.name)}</h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{translate(listing.description)}</p>
                <p className="mt-4 text-sm font-medium text-foreground">{translate(listing.meta)}</p>

                <Link
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "mt-4 w-full justify-between px-3 text-primary",
                    )}
                    href={listing.href}
                >
                    {translate("catalog.open")}
                    <ArrowUpRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
                </Link>
            </div>
        </article>
    );
}
