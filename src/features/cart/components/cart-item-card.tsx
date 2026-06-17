"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/elements/button";
import type { CartItem } from "@/stores/cart";
import { removeCartItem, updateCartItem } from "@/stores/cart";

type CartItemCardProps = {
    item: CartItem;
    translate: (key: string) => string;
    translateProduct: (key: CartItem["name"]) => string;
};

export function CartItemCard({ item, translate, translateProduct }: CartItemCardProps) {
    const decrement = () => updateCartItem(item.id, { quantity: Math.max(1, item.quantity - 1) });
    const increment = () => updateCartItem(item.id, { quantity: Math.min(9, item.quantity + 1) });
    const remove = () => removeCartItem(item.id);

    return (
        <article className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{translate("item")}</p>
                    <h2 className="mt-2 truncate text-xl font-semibold tracking-tight text-foreground">
                        {translateProduct(item.name)}
                    </h2>
                    <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                        <p>
                            <span className="font-medium text-foreground">{translate("option")}:</span>{" "}
                            {translateProduct(item.option)}
                        </p>
                        {item.selectedDate ? (
                            <p>
                                <span className="font-medium text-foreground">{translate("date")}:</span>{" "}
                                {item.selectedDate}
                            </p>
                        ) : null}
                        <p>{translateProduct(item.meta)}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                    <p className="text-lg font-semibold text-primary">{translateProduct(item.price)}</p>
                    <div className="flex h-10 items-center rounded-lg border bg-background px-1">
                        <Button type="button" variant="ghost" size="icon-sm" aria-label={translate("quantity")} onClick={decrement}>
                            <Minus aria-hidden className="size-4" />
                        </Button>
                        <span className="min-w-8 text-center text-sm font-semibold text-foreground">{item.quantity}</span>
                        <Button type="button" variant="ghost" size="icon-sm" aria-label={translate("quantity")} onClick={increment}>
                            <Plus aria-hidden className="size-4" />
                        </Button>
                    </div>
                    <Button type="button" variant="destructive" size="sm" onClick={remove}>
                        <Trash2 aria-hidden className="size-4" />
                        {translate("remove")}
                    </Button>
                </div>
            </div>
        </article>
    );
}

