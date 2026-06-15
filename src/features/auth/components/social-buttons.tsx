import type { SVGProps } from "react";
import { Button } from "@/components/ui/elements/button";
import type { SocialProvider } from "../types";

type SocialButtonsProps = {
    providers: SocialProvider[];
    disabled?: boolean;
    label: string;
    text: ( provider: SocialProvider ) => string;
    onSelect: ( provider: SocialProvider ) => void;
};

type BrandIconProps = SVGProps<SVGSVGElement>;

function GoogleIcon ( props: BrandIconProps ) {

    return (
        <svg viewBox="0 0 24 24" {...props} aria-hidden="true" focusable="false">
            <path fill="#4285F4" d="M21.6 12.23c0-.74-.07-1.46-.2-2.14H12v4.05h5.37a4.6 4.6 0 0 1-1.99 3.02v2.52h3.23c1.9-1.75 2.99-4.32 2.99-7.45Z" />
            <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.43l-3.23-2.52c-.9.6-2.04.95-3.39.95-2.61 0-4.82-1.76-5.62-4.13H3.04v2.6A10 10 0 0 0 12 22Z" />
            <path fill="#FBBC05" d="M6.38 13.87A6 6 0 0 1 6.07 12c0-.65.11-1.28.31-1.87v-2.6H3.04A10 10 0 0 0 2 12c0 1.61.39 3.14 1.04 4.47l3.34-2.6Z" />
            <path fill="#EA4335" d="M12 6c1.47 0 2.8.51 3.84 1.5l2.86-2.86A9.58 9.58 0 0 0 12 2a10 10 0 0 0-8.96 5.53l3.34 2.6C7.18 7.76 9.39 6 12 6Z" />
        </svg>
    );

}

function FacebookIcon ( props: BrandIconProps ) {

    return (
        <svg viewBox="0 0 24 24" {...props} aria-hidden="true" focusable="false">
            <path fill="#1877F2" d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.77l-.44 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
            <path fill="#FFFFFF" d="m15.9 14.89.44-2.89h-2.77v-1.87c0-.79.39-1.56 1.63-1.56h1.26V6.11s-1.14-.2-2.24-.2c-2.28 0-3.77 1.39-3.77 3.89V12H7.9v2.89h2.54v6.99c.51.08 1.03.12 1.56.12s1.05-.04 1.56-.12v-6.99h2.33Z" />
        </svg>
    );

}

function GithubIcon ( props: BrandIconProps ) {

    return (
        <svg viewBox="0 0 24 24" {...props} aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.21-.25-4.54-1.11-4.54-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.03A9.6 9.6 0 0 1 12 5.86c.85 0 1.7.11 2.5.34 1.9-1.3 2.74-1.03 2.74-1.03.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.67-4.56 4.92.36.31.68.92.68 1.86v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
    );

}

function AppleIcon ( props: BrandIconProps ) {

    return (
        <svg viewBox="0 0 24 24" {...props} aria-hidden="true" focusable="false">
            <path fill="currentColor" d="M16.37 1.8c.06.77-.22 1.53-.75 2.17-.57.68-1.5 1.21-2.37 1.14-.07-.74.26-1.54.77-2.13.57-.66 1.55-1.16 2.35-1.18Zm2.72 16.14c-.48.72-.98 1.43-1.76 1.44-.76.02-1.01-.46-1.89-.46-.87 0-1.15.44-1.87.48-.75.03-1.32-.77-1.81-1.48-.99-1.46-1.75-4.12-.73-5.92.51-.9 1.42-1.47 2.41-1.49.75-.01 1.46.51 1.92.51.46 0 1.33-.64 2.24-.54.38.02 1.45.16 2.14 1.17-.06.04-1.28.76-1.27 2.3.02 1.84 1.59 2.45 1.62 2.46-.02.05-.25.89-1 1.53Z" />
        </svg>
    );

}

function TelegramIcon ( props: BrandIconProps ) {

    return (
        <svg viewBox="0 0 24 24" {...props} aria-hidden="true" focusable="false">
            <path fill="#2AABEE" d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
            <path fill="#FFFFFF" d="M16.72 7.23c.15-.96-.37-1.34-1.1-1.05L5.3 10.15c-.7.27-.69.65-.12.82l2.65.83 6.14-3.87c.29-.18.55-.08.34.11l-4.97 4.49-.19 2.82c.28 0 .4-.13.56-.28l1.34-1.31 2.79 2.06c.51.28.88.14 1.01-.47l1.84-8.12Z" />
        </svg>
    );

}

const icons = {
    google: GoogleIcon,
    facebook: FacebookIcon,
    github: GithubIcon,
    apple: AppleIcon,
    telegram: TelegramIcon,
} satisfies Record<SocialProvider, ( props: BrandIconProps ) => React.ReactNode>;

export function SocialButtons ({ providers, disabled, label, text, onSelect }: SocialButtonsProps ) {

    if ( !providers.length ) return null;

    return (

        <div className="space-y-3">

            <div className="flex items-center gap-3">

                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium text-muted-foreground">{label}</span>
                <span className="h-px flex-1 bg-border" />

            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

                {
                    providers.map((provider) => {

                        const Icon = icons[provider];

                        return (

                            <Button
                                key={provider}
                                type="button"
                                variant="outline"
                                size="lg"
                                disabled={disabled}
                                onClick={() => onSelect(provider)}
                                className="h-11 rounded-xl bg-card shadow-sm hover:-translate-y-0.5 hover:shadow-md"
                            >

                                <Icon className="size-4 shrink-0" aria-hidden />
                                {text(provider)}

                            </Button>

                        );

                    })
                }

            </div>

        </div>

    );

}
