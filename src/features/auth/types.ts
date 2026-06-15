export type AuthMode = "login" | "register" | "recover" | "reset" | "confirm";

export type SocialProvider = "google" | "facebook" | "github" | "apple" | "telegram";

export type AuthValues = {
    name?: string;
    phone?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    affiliateCode?: string;
    affiliateName?: string;
    code?: string;
    terms?: boolean;
};
