"use client";

import { ShoppingBag } from "lucide-react";
import { buttonVariants } from "@/components/ui/elements/button";
import { Link } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn/cn";

type CartEmptyProps = {
    translate: (key: string) => string;
};

export function CartEmpty({ translate }: CartEmptyProps) {
    return (
        <section className="flex min-h-[calc(100dvh-10rem)] items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-lg flex-col items-center rounded-lg border bg-card p-8 text-center shadow-xl">
                <span className="grid size-16 place-items-center rounded-lg bg-primary/10 text-primary">
                    <ShoppingBag aria-hidden className="size-8" />
                </span>
                <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">{translate("emptyTitle")}</h1>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{translate("emptyDescription")}</p>
                <Link className={cn(buttonVariants({ size: "lg" }), "mt-7 min-h-11 px-5")} href="/catalog">
                    {translate("backToCatalog")}
                </Link>
            </div>
        </section>
    );
}

