import { z } from "zod";
import { isEmail, isStrongPassword } from "@/lib/std/validate";
import type { AuthMode } from "./types";

const email = z.string().trim().refine(isEmail, "auth.validation.email");
const password = z.string().refine(isStrongPassword, "auth.validation.password");
const required = z.string().trim().min(1, "auth.validation.required");
const optional = z.string().trim().optional();
const code = z.string().trim().min(1, "auth.validation.code");

export const login = z.object({
    email,
    password: required,
});

export const register = z.object({
    name: required,
    phone: required,
    email,
    password,
    confirmPassword: z.string(),
    affiliateCode: optional,
    affiliateName: optional,
    terms: z.literal(true, { error: "auth.validation.terms" }),
}).refine(
    (value) => value.password === value.confirmPassword,
    { path: ["confirmPassword"], message: "auth.validation.passwordMatch" },
);

export const recover = z.object({
    email,
});

export const reset = z.object({
    code,
    password,
    confirmPassword: z.string(),
}).refine(
    (value) => value.password === value.confirmPassword,
    { path: ["confirmPassword"], message: "auth.validation.passwordMatch" },
);

export const confirm = z.object({
    email,
    code,
});

export const schemas = {

    login,
    register,
    recover,
    reset,
    confirm,

} satisfies Record<AuthMode, z.ZodType>;

export type LoginInput = z.infer<typeof login>;
export type RegisterInput = z.infer<typeof register>;
export type RecoverInput = z.infer<typeof recover>;
export type ResetInput = z.infer<typeof reset>;
export type ConfirmInput = z.infer<typeof confirm>;
