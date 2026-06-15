import type { AuthMode, SocialProvider } from "./types";

export type AuthField =
    | "name"
    | "phone"
    | "email"
    | "password"
    | "confirmPassword"
    | "affiliateCode"
    | "affiliateName"
    | "code"
    | "terms";

export type AuthModeConfig = {
    fields: AuthField[];
    providers: SocialProvider[];
    title: `auth.${AuthMode}.title`;
    description: `auth.${AuthMode}.description`;
    cta: `auth.${AuthMode}.cta`;
    switch: `auth.${AuthMode}.${string}`;
    switchHref: string;
    redirect: string;
};

const providers: SocialProvider[] = ["google", "facebook", "github", "apple", "telegram"];

export const codeLength = 6;
export const resendSeconds = 30;

export const config = {

    login: {
        fields: ["email", "password"],
        providers,
        title: "auth.login.title",
        description: "auth.login.description",
        cta: "auth.login.cta",
        switch: "auth.login.switch",
        switchHref: "/register",
        redirect: "/",
    },
    register: {
        fields: ["name", "phone", "email", "password", "confirmPassword", "affiliateCode", "affiliateName", "terms"],
        providers,
        title: "auth.register.title",
        description: "auth.register.description",
        cta: "auth.register.cta",
        switch: "auth.register.switch",
        switchHref: "/login",
        redirect: "/confirm",
    },
    recover: {
        fields: ["email"],
        providers: [],
        title: "auth.recover.title",
        description: "auth.recover.description",
        cta: "auth.recover.cta",
        switch: "auth.recover.switch",
        switchHref: "/login",
        redirect: "/reset",
    },
    reset: {
        fields: ["code", "password", "confirmPassword"],
        providers: [],
        title: "auth.reset.title",
        description: "auth.reset.description",
        cta: "auth.reset.cta",
        switch: "auth.reset.switch",
        switchHref: "/login",
        redirect: "/login",
    },
    confirm: {
        fields: ["email", "code"],
        providers: [],
        title: "auth.confirm.title",
        description: "auth.confirm.description",
        cta: "auth.confirm.cta",
        switch: "auth.confirm.resend",
        switchHref: "/login",
        redirect: "/login",
    },

} satisfies Record<AuthMode, AuthModeConfig>;
