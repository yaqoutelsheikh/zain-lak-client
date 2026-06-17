import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Product } from "@/features/product";
import { findProduct } from "@/features/product/helpers";

export default async function ProductPage({ params }: { params: Promise<{ locale: string; item: string }> }) {
    const { item, locale } = await params;
    const product = findProduct(item);

    setRequestLocale(locale);

    if ( !product ) notFound();

    return <Product item={product} />;
}

