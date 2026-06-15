import { setRequestLocale } from "next-intl/server";
import { Home } from "@/features/home";

export default async function HomePage ({ params }: { params: Promise<{ locale: string }> }) {

    const { locale } = await params;

    setRequestLocale(locale);

    return <Home />;

}
