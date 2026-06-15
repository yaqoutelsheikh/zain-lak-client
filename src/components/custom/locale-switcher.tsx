"use client";

import { Check, ChevronDown, Languages } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/elements/dropdown-menu";
import type { Locale } from "@/lib/utils/i18n";
import { locales, usePathname, useRouter } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn";

export function LocaleSwitcher () {

    const t = useTranslations("home");
    const active = useLocale() as Locale;
    const pathname = usePathname();
    const router = useRouter();

    const change = ( locale: Locale ) => {

        router.replace(pathname, { locale });

    };

    return (

        <DropdownMenu>

            <DropdownMenuTrigger
                aria-label={t("switchLanguage")}
                className="group inline-flex h-9 items-center gap-2 rounded-full border bg-card px-3 text-sm font-medium text-foreground shadow-sm outline-none transition-all hover:-translate-y-0.5 hover:bg-gold-soft hover:text-gold-soft-foreground hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >

                <Languages className="size-4 text-primary transition-transform group-hover:scale-110" aria-hidden />
                <span className="hidden sm:inline">{t(`locales.${active}`)}</span>
                <span className="uppercase sm:hidden">{active}</span>
                <ChevronDown className="size-3.5 text-muted-foreground transition-transform group-aria-expanded:rotate-180" aria-hidden />

            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={8} className="min-w-44 rounded-2xl border bg-popover p-1.5 shadow-xl">

                {
                    locales.map((locale) => {

                        const isActive = locale === active;

                        return (

                            <DropdownMenuItem
                                key={locale}
                                aria-current={isActive ? "true" : undefined}
                                onClick={() => change(locale)}
                                className={cn(
                                    "cursor-pointer gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                                    "focus:bg-gold-soft focus:text-gold-soft-foreground",
                                    isActive ? "bg-gold-soft text-gold-soft-foreground" : "text-popover-foreground",
                                )}
                            >

                                <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground">
                                    {locale}
                                </span>

                                <span className="min-w-0 flex-1 truncate font-medium">
                                    {t(`locales.${locale}`)}
                                </span>

                                <Check className={cn("size-4 text-primary transition-opacity", isActive ? "opacity-100" : "opacity-0")} aria-hidden />

                            </DropdownMenuItem>

                        );

                    })
                }

            </DropdownMenuContent>

        </DropdownMenu>

    );

}
