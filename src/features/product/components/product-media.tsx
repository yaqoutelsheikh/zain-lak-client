"use client";

import type { LucideIcon } from "lucide-react";
import { Building2, Download, Hotel, Package, Sparkles, Ticket } from "lucide-react";
import { cn } from "@/lib/utils/shadcn/cn";
import type { ProductTone, ProductType } from "../types";

const icons: Record<ProductType, LucideIcon> = {
    physical: Package,
    digital: Download,
    service: Sparkles,
    tour: Ticket,
    hotel: Hotel,
    realEstate: Building2,
};

const tones: Record<ProductTone, string> = {
    primary: "bg-primary/10 text-primary ring-primary/20",
    sky: "bg-chart-2/10 text-chart-2 ring-chart-2/20",
    violet: "bg-chart-4/10 text-chart-4 ring-chart-4/20",
    emerald: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
    amber: "bg-chart-5/10 text-chart-5 ring-chart-5/20",
    rose: "bg-chart-1/10 text-chart-1 ring-chart-1/20",
};

type ProductMediaProps = {
    type: ProductType;
    tone: ProductTone;
};

export function ProductMedia({ type, tone }: ProductMediaProps) {
    const Icon = icons[type];

    return (
        <div className={cn("flex aspect-[5/4] items-center justify-center rounded-lg ring-1 shadow-xl", tones[tone])}>
            <div className="grid size-28 place-items-center rounded-lg border bg-background/85 shadow-lg">
                <Icon aria-hidden className="size-14" />
            </div>
        </div>
    );
}

export function ProductToneIcon({ type, tone }: ProductMediaProps) {
    const Icon = icons[type];

    return (
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg ring-1", tones[tone])}>
            <Icon aria-hidden className="size-5" />
        </span>
    );
}

