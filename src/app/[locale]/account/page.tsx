import { setRequestLocale } from "next-intl/server";
import { Account } from "@/features/account";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    setRequestLocale(locale);

    return <Account view="overview" />;
}
