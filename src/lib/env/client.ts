import { z } from "zod";
import { locales } from "@/lib/utils/i18n/direction";

const envSchema = z.object({
    NEXT_PUBLIC_APP_NAME:        z.string().catch("Zain Lak"),
    NEXT_PUBLIC_APP_LOCALE:      z.enum(locales).catch("en"),
    NEXT_PUBLIC_API_URL:         z.url().default("http://localhost:8000/v1"),
    NEXT_PUBLIC_SITE_URL:        z.url().catch("http://localhost:3000"),
    NEXT_PUBLIC_APP_DESCRIPTION: z.string().catch("Enterprise web platform"),
});
export const env = envSchema.parse({
    NEXT_PUBLIC_APP_NAME:        process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_LOCALE:      process.env.NEXT_PUBLIC_APP_LOCALE,
    NEXT_PUBLIC_API_URL:         process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_SITE_URL:        process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
});
