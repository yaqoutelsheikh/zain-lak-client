"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/shadcn/cn";
import type { HomeConfig, HomeKey } from "../types";
import { toneClassNames } from "./home-media";

type HomeCollectionsProps = {
    collections: HomeConfig["collections"];
    translate: (key: HomeKey) => string;
};

export function HomeCollections({ collections, translate }: HomeCollectionsProps) {
    return (
        <section className="bg-background px-4 py-8 sm:px-6 lg:px-8" id="catalog">
            <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto pb-2">
                {collections.map((collection) => (
                    <motion.a
                        className={cn(
                            "group flex min-w-52 items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold ring-1 transition hover:-translate-y-0.5 hover:bg-card hover:shadow-sm",
                            toneClassNames[collection.tone],
                        )}
                        href={collection.href}
                        key={collection.id}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span>{translate(collection.label)}</span>
                        <ArrowUpRight aria-hidden className="size-4 transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
