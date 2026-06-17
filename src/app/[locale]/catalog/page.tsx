import { setRequestLocale } from "next-intl/server";
import { Catalog } from "@/features/catalog";

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    setRequestLocale(locale);

    return <Catalog />;
}

