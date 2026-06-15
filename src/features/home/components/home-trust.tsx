"use client";

import { Bot, MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/elements/button";
import { cn } from "@/lib/utils/shadcn/cn";
import type { HomeConfig, HomeKey } from "../types";
import { TrustIcon } from "./home-media";

type HomeTrustProps = {
    support: HomeConfig["support"];
    trust: HomeConfig["trust"];
    translate: (key: HomeKey) => string;
};

export function HomeTrust({ support, trust, translate }: HomeTrustProps) {
    return (
        <section className="bg-background px-4 py-14 sm:px-6 lg:px-8" id="support">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,30rem)]">
                <div className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">{translate(trust.title)}</h2>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                        {translate(trust.description)}
                    </p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {trust.items.map((item) => (
                            <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3" key={item.id}>
                                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <TrustIcon aria-hidden className="size-4" />
                                </span>
                                <span className="text-sm font-medium text-foreground">{translate(item.label)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-lg bg-primary p-6 text-primary-foreground shadow-xl sm:p-8">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
                        {translate(support.eyebrow)}
                    </p>
                    <h2 className="mt-4 text-3xl font-semibold tracking-tight">{translate(support.title)}</h2>
                    <p className="mt-3 text-sm leading-6 text-primary-foreground/80">{translate(support.description)}</p>
                    <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                        <a
                            className={cn(
                                buttonVariants({ variant: "secondary", size: "lg" }),
                                "min-h-11 justify-start gap-2 bg-background text-foreground hover:bg-background/90",
                            )}
                            href={support.chatHref}
                        >
                            <MessageCircle aria-hidden className="size-4" />
                            {translate(support.chat)}
                        </a>
                        <a
                            className={cn(
                                buttonVariants({ variant: "outline", size: "lg" }),
                                "min-h-11 justify-start gap-2 border-primary-foreground/25 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground",
                            )}
                            href={support.aiHref}
                        >
                            <Bot aria-hidden className="size-4" />
                            {translate(support.ai)}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
