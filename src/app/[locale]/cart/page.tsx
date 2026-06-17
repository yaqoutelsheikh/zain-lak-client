import { setRequestLocale } from "next-intl/server";
import { Cart } from "@/features/cart";

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    setRequestLocale(locale);

    return <Cart />;
}
