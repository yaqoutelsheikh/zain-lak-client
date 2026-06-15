"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { buttonVariants } from "@/components/ui/elements/button";
import { fadeRise, stagger, transition } from "@/lib/motion";
import { cn } from "@/lib/utils/shadcn/cn";
import { HomeCollections } from "./components/home-collections";
import { HomeHero } from "./components/home-hero";
import { HomeRails } from "./components/home-rails";
import { HomeTrust } from "./components/home-trust";
import { home } from "./config";
import type { HomeKey } from "./types";

export function Home() {
    const t = useTranslations("home");
    const reduce = useReducedMotion();
    const translate = (key: HomeKey) => t(key.replace("home.", "") as Parameters<typeof t>[0]);

    return (
        <main className="min-h-dvh bg-background">
            <motion.div
                animate="visible"
                initial={reduce ? false : "hidden"}
                variants={stagger}
            >
                <motion.div variants={fadeRise} transition={transition.base}>
                    <HomeHero collections={home.collections} hero={home.hero} translate={translate} />
                </motion.div>
                <motion.div variants={fadeRise} transition={transition.base}>
                    <HomeCollections collections={home.collections} translate={translate} />
                </motion.div>
                <motion.div variants={fadeRise} transition={transition.base}>
                    <HomeRails products={home.products} rails={home.rails} translate={translate} />
                </motion.div>
                <motion.div variants={fadeRise} transition={transition.base}>
                    <HomeTrust support={home.support} translate={translate} trust={home.trust} />
                </motion.div>
                <motion.section
                    className="border-t bg-muted/30 px-4 py-14 sm:px-6 lg:px-8"
                    variants={fadeRise}
                    transition={transition.base}
                >
                    <div className="mx-auto flex max-w-7xl flex-col gap-5 rounded-lg bg-card p-6 shadow-sm sm:p-8 md:flex-row md:items-center md:justify-between">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                {translate(home.footer.title)}
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
                                {translate(home.footer.description)}
                            </p>
                        </div>
                        <a
                            className={cn(buttonVariants({ size: "lg" }), "min-h-11 gap-2 px-5")}
                            href={home.footer.href}
                        >
                            {translate(home.footer.cta)}
                            <ArrowUpRight aria-hidden className="size-4" />
                        </a>
                    </div>
                </motion.section>
            </motion.div>
        </main>
    );
}
