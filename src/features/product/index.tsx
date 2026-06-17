"use client";

import { useTranslations } from "next-intl";
import { ProductFacts, ProductPolicies } from "./components/product-facts";
import { ProductMedia } from "./components/product-media";
import { ProductPanel } from "./components/product-panel";
import { ProductRelated } from "./components/product-related";
import { ProductSummary } from "./components/product-summary";
import { relatedProducts } from "./helpers";
import type { ProductDetail, ProductKey } from "./types";

type ProductProps = {
    item: ProductDetail;
};

export function Product({ item }: ProductProps) {
    const t = useTranslations("product");
    const translate = (key: ProductKey, values?: Record<string, string | number>) =>
        t(key.replace("product.", "") as Parameters<typeof t>[0], values);
    const related = relatedProducts(item);

    return (
        <main className="min-h-dvh bg-background">
            <section className="border-b bg-background px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
                    <div className="grid gap-5">
                        <ProductMedia type={item.type} tone={item.tone} />
                        <ProductSummary item={item} translate={translate} />
                    </div>
                    <ProductPanel item={item} translate={translate} />
                </div>
            </section>

            <section className="px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl gap-5">
                    <p className="rounded-lg border bg-card p-5 text-base leading-7 text-muted-foreground shadow-sm">
                        {translate(item.description)}
                    </p>
                    <ProductFacts item={item} translate={translate} />
                    <ProductPolicies item={item} translate={translate} />
                    <ProductRelated items={related} translate={translate} />
                </div>
            </section>
        </main>
    );
}

