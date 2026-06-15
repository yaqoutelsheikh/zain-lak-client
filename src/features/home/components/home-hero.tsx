"use client";

import { ArrowUpRight, Search } from "lucide-react";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/elements/button";
import { cn } from "@/lib/utils/shadcn/cn";
import type { HomeConfig, HomeKey } from "../types";
import { toneClassNames } from "./home-media";

type HomeHeroProps = {
    hero: HomeConfig["hero"];
    collections: HomeConfig["collections"];
    translate: (key: HomeKey) => string;
};

export function HomeHero({ hero, collections, translate }: HomeHeroProps) {
    const fallbackCollectionLabel = collections[4]?.label ?? collections[0]?.label;

    return (
        <section className="relative overflow-hidden border-b bg-background" id="discover">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow" />
            <div className="relative mx-auto grid min-h-[calc(100dvh-9rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[minmax(0,1fr)_minmax(18rem,28rem)] lg:px-8">
                <motion.div className="max-w-3xl" variants={containerMotion}>
                    <motion.p
                        className="inline-flex items-center gap-2 rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-soft-foreground ring-1 ring-gold/20"
                        variants={itemMotion}
                    >
                        <span aria-hidden className="size-1.5 rotate-45 rounded-sm bg-gold" />
                        {translate(hero.eyebrow)}
                    </motion.p>
                    <motion.h1
                        className="mt-6 text-balance text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
                        variants={itemMotion}
                    >
                        {translate(hero.title)}
                    </motion.h1>
                    <motion.p
                        className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                        variants={itemMotion}
                    >
                        {translate(hero.description)}
                    </motion.p>
                    <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row" variants={itemMotion}>
                        <a
                            className={cn(buttonVariants({ size: "lg" }), "min-h-11 gap-2 px-5")}
                            href={hero.primaryHref}
                        >
                            {translate(hero.primaryCta)}
                            <ArrowUpRight aria-hidden className="size-4" />
                        </a>
                        <a
                            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "min-h-11 gap-2 px-5")}
                            href={hero.secondaryHref}
                        >
                            <Search aria-hidden className="size-4" />
                            {translate(hero.secondaryCta)}
                        </a>
                    </motion.div>
                </motion.div>

                <motion.div
                    aria-hidden
                    className="grid gap-3 rounded-lg border bg-card p-3 shadow-xl"
                    variants={containerMotion}
                >
                    <div className="grid grid-cols-2 gap-3">
                        {collections.slice(0, 4).map((collection) => (
                            <motion.div
                                className={cn(
                                    "flex min-h-28 flex-col justify-between rounded-lg p-4 ring-1",
                                    toneClassNames[collection.tone],
                                )}
                                key={collection.id}
                                variants={itemMotion}
                            >
                                <span className="size-9 rounded-lg bg-current/10" />
                                <span className="text-sm font-semibold text-foreground">{translate(collection.label)}</span>
                            </motion.div>
                        ))}
                    </div>
                    {fallbackCollectionLabel ? (
                        <motion.div
                            className="rounded-lg bg-secondary p-4 text-sm font-medium text-secondary-foreground"
                            variants={itemMotion}
                        >
                            {translate(fallbackCollectionLabel)}
                        </motion.div>
                    ) : null}
                </motion.div>
            </div>
        </section>
    );
}

const containerMotion = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

const itemMotion = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
};
