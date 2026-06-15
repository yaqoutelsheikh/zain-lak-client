import { z } from "zod";
import type { ApiEntry } from "@/api/client";

export const token = z.object({
    token: z.string().min(1),
});

export const status = z.object({
    status: z.string(),
});

export const identity = z.object({
    user: z.object({
        id: z.union([z.string(), z.number()]),
        name: z.string().optional(),
        email: z.email().optional(),
    }).passthrough(),
});

export type AuthToken = z.infer<typeof token>;
export type AuthStatus = z.infer<typeof status>;
export type AuthIdentity = z.infer<typeof identity>;

const login = {
    resource: "auth",
    action: "login",
    method: "POST",
    path: "/auth/login",
    guest: true,
    schema: token,
} satisfies ApiEntry<AuthToken>;

const logout = {
    resource: "auth",
    action: "logout",
    method: "POST",
    path: "/auth/logout",
    schema: status,
} satisfies ApiEntry<AuthStatus>;

const register = {
    resource: "auth",
    action: "register",
    method: "POST",
    path: "/auth/register",
    guest: true,
    schema: token,
} satisfies ApiEntry<AuthToken>;

const recovery = {
    resource: "auth",
    action: "recovery",
    method: "POST",
    path: "/auth/recovery",
    guest: true,
    schema: status,
} satisfies ApiEntry<AuthStatus>;

const reset = {
    resource: "auth",
    action: "reset",
    method: "POST",
    path: "/auth/reset",
    guest: true,
    schema: status,
} satisfies ApiEntry<AuthStatus>;

const confirm = {
    resource: "auth",
    action: "confirm",
    method: "POST",
    path: "/auth/confirm",
    guest: true,
    schema: status,
} satisfies ApiEntry<AuthStatus>;

const session = {
    resource: "auth",
    action: "session",
    method: "GET",
    path: "/auth/session",
    schema: identity,
} satisfies ApiEntry<AuthIdentity>;

const refresh = {
    resource: "auth",
    action: "refresh",
    method: "POST",
    path: "/auth/refresh",
    guest: true,
    credentials: "include",
    schema: token,
} satisfies ApiEntry<AuthToken>;

const socialLogin = {
    resource: "auth",
    action: "socialLogin",
    method: "POST",
    path: "/auth/social-login/:provider",
    guest: true,
    schema: token,
} satisfies ApiEntry<AuthToken>;

export const auth = {

    login,
    logout,
    register,
    recovery,
    reset,
    confirm,
    session,
    refresh,
    socialLogin,

} as const;
