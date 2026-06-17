"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/elements/button";
import { Skeleton } from "@/components/ui/elements/skeleton";
import type { AccountKey } from "../types";

type AccountStateProps = {
    title: string;
    description: string;
    retry?: () => void;
    retryLabel: string;
    tone: "empty" | "error";
};

export function AccountState({ description, retry, retryLabel, title, tone }: AccountStateProps) {
    const Icon = tone === "error" ? AlertCircle : Inbox;

    return (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border bg-card p-8 text-center shadow-sm">
            <span className="grid size-14 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden className="size-7" />
            </span>
            <h2 className="mt-5 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
            {retry ? (
                <Button type="button" className="mt-5 min-h-10 px-4" onClick={retry}>
                    {retryLabel}
                </Button>
            ) : null}
        </div>
    );
}

type AccountSkeletonProps = {
    label: (key: AccountKey) => string;
};

export function AccountSkeleton({ label }: AccountSkeletonProps) {
    return (
        <div role="status" aria-label={label("account.title")} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]">
            <div className="grid gap-5">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-64 rounded-lg" />
            </div>
            <Skeleton className="h-80 rounded-lg" />
        </div>
    );
}
