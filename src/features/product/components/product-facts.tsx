"use client";

import { ShieldCheck } from "lucide-react";
import type { ProductDetail, ProductKey } from "../types";

type ProductFactsProps = {
    item: ProductDetail;
    translate: (key: ProductKey) => string;
};

export function ProductFacts({ item, translate }: ProductFactsProps) {
    return (
        <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{translate("product.included")}</h2>
                <div className="mt-4 grid gap-3">
                    {item.facts.map((fact) => (
                        <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/60 p-3" key={fact.label}>
                            <span className="text-sm text-muted-foreground">{translate(fact.label)}</span>
                            <span className="text-sm font-semibold text-foreground">{translate(fact.value)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-lg border bg-card p-5 shadow-sm">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">{translate("product.trust")}</h2>
                <div className="mt-4 grid gap-3">
                    {item.trust.map((trust) => (
                        <div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3" key={trust}>
                            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                                <ShieldCheck aria-hidden className="size-4" />
                            </span>
                            <span className="text-sm font-medium text-foreground">{translate(trust)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function ProductPolicies({ item, translate }: ProductFactsProps) {
    return (
        <section className="rounded-lg border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">{translate("product.policies")}</h2>
            <div className="mt-4 grid gap-3">
                {item.policies.map((policy) => (
                    <p className="rounded-lg bg-muted/60 p-3 text-sm leading-6 text-muted-foreground" key={policy}>
                        {translate(policy)}
                    </p>
                ))}
            </div>
        </section>
    );
}

