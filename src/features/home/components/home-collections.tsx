"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/shadcn/cn";
import type { CollectionId, HomeConfig, HomeKey, ProductType } from "../types";
import { productIcons, toneClassNames } from "./home-media";

type HomeCollectionsProps = {
    collections: HomeConfig["collections"];
    translate: (key: HomeKey) => string;
};

const collectionTypes = {
    physical: "physical",
    digital: "digital",
    services: "service",
    bookings: "tour",
    stays: "hotel",
    estate: "realEstate",
} satisfies Record<CollectionId, ProductType>;

export function HomeCollections({ collections, translate }: HomeCollectionsProps) {
    return (
        <section className="bg-background px-4 py-10 sm:px-6 lg:px-8" id="catalog">
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                    <div className="max-w-3xl">
                        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                            {translate("home.collections.eyebrow")}
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                            {translate("home.collections.title")}
                        </h2>
                    </div>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-end">
                        {translate("home.collections.description")}
                    </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {collections.map((collection) => (
                        <CollectionCard collection={collection} key={collection.id} translate={translate} />
                ))}
                </div>
            </div>
        </section>
    );
}

type CollectionCardProps = {
    collection: HomeConfig["collections"][number];
    translate: (key: HomeKey) => string;
};

function CollectionCard({ collection, translate }: CollectionCardProps) {
    const Icon = productIcons[collectionTypes[collection.id]];

    return (
        <motion.a
            className={cn(
                "group grid min-h-32 rounded-lg border bg-card p-4 shadow-sm outline-none transition-all hover:-translate-y-1 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-ring",
                "before:h-1 before:w-10 before:rounded-full before:bg-current before:opacity-45",
                toneClassNames[collection.tone],
            )}
            href={collection.href}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
        >
            <span className="flex items-start justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-lg bg-background/80 shadow-xs ring-1 ring-current/15">
                    <Icon aria-hidden className="size-5" />
                </span>
                <span className="grid size-8 place-items-center rounded-lg bg-background/70 text-current transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <ArrowUpRight aria-hidden className="size-4 transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </span>
            </span>
            <span className="mt-5 self-end text-sm font-semibold text-foreground">{translate(collection.label)}</span>
        </motion.a>
    );
}
