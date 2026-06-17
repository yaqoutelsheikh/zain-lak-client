"use client";

import { SearchX } from "lucide-react";
import type { CatalogKey } from "../types";

type CatalogEmptyProps = {
    translate: (key: CatalogKey) => string;
};

export function CatalogEmpty({ translate }: CatalogEmptyProps) {
    return (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center shadow-sm">
            <span className="grid size-14 place-items-center rounded-lg bg-muted text-muted-foreground">
                <SearchX aria-hidden className="size-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{translate("catalog.emptyTitle")}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{translate("catalog.emptyDescription")}</p>
        </div>
    );
}

