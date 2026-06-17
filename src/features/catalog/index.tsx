"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/elements/select";
import { cn } from "@/lib/utils/shadcn/cn";
import { CatalogCard } from "./components/catalog-card";
import { CatalogEmpty } from "./components/catalog-empty";
import { catalog } from "./config";
import { filterCatalog } from "./filters";
import type { CatalogFilterState, CatalogKey, CatalogSort, CatalogType } from "./types";

export function Catalog() {
    return (
        <Suspense fallback={null}>
            <CatalogContent />
        </Suspense>
    );
}

function CatalogContent() {
    const t = useTranslations("catalog");
    const searchParams = useSearchParams();
    const [filters, setFilters] = useState<CatalogFilterState>(() => ({
        query: searchParams.get("q") ?? "",
        type: readType(searchParams.get("type")),
        sort: readSort(searchParams.get("sort")),
    }));
    const translate = (key: CatalogKey, values?: Record<string, string | number>) =>
        t(key.replace("catalog.", "") as Parameters<typeof t>[0], values);
    const results = filterCatalog(catalog.listings, filters);
    const selectedSortLabel = catalog.sorts.find((sort) => sort.id === filters.sort)?.label ?? "catalog.sorts.featured";

    const update = (next: Partial<CatalogFilterState>) => {

        const state = { ...filters, ...next };

        setFilters(state);
        sync(state);

    };

    return (
        <main className="min-h-dvh bg-background">
            <section className="border-b bg-background px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <p className="inline-flex rounded-full bg-gold-soft px-3 py-1 text-xs font-semibold uppercase tracking-widest text-gold-soft-foreground">
                        {translate("catalog.eyebrow")}
                    </p>
                    <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)] lg:items-end">
                        <div>
                            <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                                {translate("catalog.title")}
                            </h1>
                            <p className="mt-4 max-w-3xl text-pretty text-base leading-7 text-muted-foreground">
                                {translate("catalog.description")}
                            </p>
                        </div>
                        <p className="rounded-lg border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm">
                            {translate("catalog.results", { count: results.length })}
                        </p>
                    </div>
                </div>
            </section>

            <section className="px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5">
                    <div className="rounded-lg border bg-card p-3 shadow-sm">
                        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                            <label className="flex h-11 min-w-0 items-center rounded-lg border bg-background px-3 shadow-xs focus-within:shadow-focus">
                                <Search aria-hidden className="size-4 shrink-0 text-muted-foreground" />
                                <span className="sr-only">{translate("catalog.searchLabel")}</span>
                                <input
                                    type="search"
                                    value={filters.query}
                                    onChange={(event) => update({ query: event.target.value })}
                                    placeholder={translate("catalog.searchPlaceholder")}
                                    className="min-w-0 flex-1 bg-transparent ps-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />
                            </label>

                            <div className="flex items-center gap-2">
                                <span className="sr-only">{translate("catalog.sortLabel")}</span>
                                <Select
                                    value={filters.sort}
                                    onValueChange={(value) => {
                                        if ( value ) update({ sort: value as CatalogSort });
                                    }}
                                >
                                    <SelectTrigger className="h-11 w-full bg-background lg:w-48">
                                        <SelectValue>{translate(selectedSortLabel)}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {catalog.sorts.map((sort) => (
                                            <SelectItem key={sort.id} value={sort.id}>
                                                {translate(sort.label)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                            {catalog.tabs.map((tab) => {
                                const isActive = filters.type === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => update({ type: tab.id })}
                                        className={cn(
                                            "shrink-0 rounded-lg px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                                            isActive
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "bg-muted text-muted-foreground hover:bg-gold-soft hover:text-gold-soft-foreground",
                                        )}
                                    >
                                        {translate(tab.label)}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {results.length ? (
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {results.map((listing) => (
                                <CatalogCard key={listing.id} listing={listing} translate={translate} />
                            ))}
                        </div>
                    ) : (
                        <CatalogEmpty translate={translate} />
                    )}
                </div>
            </section>
        </main>
    );
}

function readType(value: string | null): CatalogType {
    if ( catalog.tabs.some((tab) => tab.id === value) ) return value as CatalogType;

    return "all";
}

function readSort(value: string | null): CatalogSort {
    if ( catalog.sorts.some((sort) => sort.id === value) ) return value as CatalogSort;

    return "featured";
}

function sync(state: CatalogFilterState) {
    const params = new URLSearchParams();

    if ( state.query ) params.set("q", state.query);
    if ( state.type !== "all" ) params.set("type", state.type);
    if ( state.sort !== "featured" ) params.set("sort", state.sort);

    const query = params.toString();
    const next = query ? `${window.location.pathname}?${query}` : window.location.pathname;

    window.history.replaceState(null, "", next);
}
