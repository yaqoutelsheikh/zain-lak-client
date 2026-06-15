import "server-only";
import { z } from "zod";

const envSchema = z.object({
    GOOGLE_API_KEY:    z.string().min(1),
    GOOGLE_API_SECRET: z.string().min(1),
});
export const env = envSchema.parse({
    GOOGLE_API_KEY:    process.env.GOOGLE_API_KEY,
    GOOGLE_API_SECRET: process.env.GOOGLE_API_SECRET,
});
