"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/elements/button";
import { cn } from "@/lib/utils/shadcn/cn";
import type { HomeConfig, HomeKey, HomeProduct } from "../types";
import { productIcons, toneClassNames } from "./home-media";

type HomeRailsProps = {
    products: HomeConfig["products"];
    rails: HomeConfig["rails"];
    translate: (key: HomeKey) => string;
};

export function HomeRails({ products, rails, translate }: HomeRailsProps) {
    const productById = new Map(products.map((product) => [product.id, product]));

    return (
        <section className="bg-muted/30 px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-12">
                {rails.map((rail) => (
                    <div className="space-y-5" id={rail.id === "featured" ? "deals" : rail.id} key={rail.id}>
                        <div className="flex items-end justify-between gap-4">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                {translate(rail.title)}
                            </h2>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {rail.items.map((id) => {
                                const product = productById.get(id);

                                if (!product) {
                                    return null;
                                }

                                return <ProductCard key={product.id} product={product} translate={translate} />;
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

type ProductCardProps = {
    product: HomeProduct;
    translate: (key: HomeKey) => string;
};

function ProductCard({ product, translate }: ProductCardProps) {
    const Icon = productIcons[product.type];

    return (
        <motion.article
            className="group flex min-h-full flex-col rounded-lg border bg-card p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.99 }}
        >
            <div className={cn("flex aspect-[4/3] items-center justify-center rounded-lg ring-1", toneClassNames[product.tone])}>
                <div className="flex size-20 items-center justify-center rounded-lg bg-background/80 shadow-sm">
                    <Icon aria-hidden className="size-9" />
                </div>
            </div>
            <div className="flex flex-1 flex-col pt-5">
                <p className="text-sm font-semibold text-primary">{translate(product.price)}</p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{translate(product.name)}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{translate(product.description)}</p>
                <a
                    className={cn(
                        buttonVariants({ variant: "ghost", size: "lg" }),
                        "mt-5 w-full justify-between px-3 text-primary",
                    )}
                    href={product.href}
                >
                    {translate(product.name)}
                    <ArrowUpRight aria-hidden className="size-4 transition group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                </a>
            </div>
        </motion.article>
    );
}
