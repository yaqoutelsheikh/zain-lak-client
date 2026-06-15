"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { isApiError } from "@/api";
import { Button } from "@/components/ui/elements/button";
import { Checkbox } from "@/components/ui/elements/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/elements/input-otp";
import { Label } from "@/components/ui/elements/label";
import { useAuth } from "@/hooks/use-auth";
import { Link, useRouter } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn";
import { AuthCard } from "./components/auth-card";
import { AuthField } from "./components/auth-field";
import { AuthHeader } from "./components/auth-header";
import { SocialButtons } from "./components/social-buttons";
import type { AuthField as AuthFieldName } from "./config";
import { codeLength, config, resendSeconds } from "./config";
import type { ConfirmInput, LoginInput, RecoverInput, RegisterInput, ResetInput } from "./schema";
import { schemas } from "./schema";
import type { AuthMode, AuthValues, SocialProvider } from "./types";

type AuthProps = {
    mode: AuthMode;
    providers?: SocialProvider[];
    affiliateCode?: string;
    initialValues?: Partial<AuthValues>;
};

const defaults = {
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    affiliateCode: "",
    affiliateName: "",
    code: "",
    terms: false,
} satisfies AuthValues;

const codeSlots = ["code-0", "code-1", "code-2", "code-3", "code-4", "code-5"] as const;

function isField ( value: string ): value is AuthFieldName {

    if ( value === "name" ) return true;
    if ( value === "phone" ) return true;
    if ( value === "email" ) return true;
    if ( value === "password" ) return true;
    if ( value === "confirmPassword" ) return true;
    if ( value === "affiliateCode" ) return true;
    if ( value === "affiliateName" ) return true;
    if ( value === "code" ) return true;

    return value === "terms";

}

function inputType ( field: AuthFieldName ) {

    if ( field === "email" ) return "email";
    if ( field === "password" || field === "confirmPassword" ) return "password";
    if ( field === "phone" ) return "tel";

    return "text";

}

function submit ( auth: ReturnType<typeof useAuth>, mode: AuthMode, values: AuthValues ) {

    if ( mode === "login" ) return auth.login.mutateAsync(values as LoginInput);
    if ( mode === "register" ) return auth.register.mutateAsync(values as RegisterInput);
    if ( mode === "recover" ) return auth.recovery.mutateAsync(values as RecoverInput);
    if ( mode === "reset" ) return auth.reset.mutateAsync(values as ResetInput);

    return auth.confirm.mutateAsync(values as ConfirmInput);

}

function pending ( auth: ReturnType<typeof useAuth>, mode: AuthMode ) {

    if ( mode === "login" ) return auth.login.isPending;
    if ( mode === "register" ) return auth.register.isPending;
    if ( mode === "recover" ) return auth.recovery.isPending;
    if ( mode === "reset" ) return auth.reset.isPending;

    return auth.confirm.isPending;

}

function wait () {

    return new Promise((resolve) => setTimeout(resolve, 650));

}

function success ( mode: AuthMode ) {

    if ( mode === "recover" ) return "auth.status.sent";

    return "auth.status.success";

}

export function Auth ({ mode, providers, affiliateCode, initialValues }: AuthProps) {

    const meta = config[mode];
    const t = useTranslations();
    const auth = useAuth();
    const router = useRouter();
    const [formError, setFormError] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>(null);
    const [resendIn, setResendIn] = useState(mode === "confirm" ? resendSeconds : 0);
    const form = useForm<AuthValues>({
        resolver: zodResolver(schemas[mode]) as Resolver<AuthValues>,
        defaultValues: { ...defaults, ...initialValues, affiliateCode: affiliateCode ?? initialValues?.affiliateCode ?? "" },
    });
    const isResending = mode === "confirm" && auth.recovery.isPending;
    const isPending = pending(auth, mode) || auth.social.isPending || isResending;

    const label = ( field: AuthFieldName ) => form.formState.errors[field]?.message;
    const text = ( key: string ) => key.startsWith("auth.") ? t(key) : key;
    const copy = ( key: string ) => t(key);

    useEffect(() => {

        if ( mode !== "confirm" || resendIn <= 0 ) return;

        const timer = window.setTimeout(() => setResendIn((value) => value - 1), 1000);

        return () => window.clearTimeout(timer);

    }, [mode, resendIn]);

    const fail = ( error: unknown ) => {

        if ( !isApiError(error) ) {

            setFormError("auth.errors.server");
            return;

        }

        if ( error.isValidation ) {

            for ( const [field, messages] of Object.entries(error.fields ?? {}) ) {

                if ( !isField(field) ) continue;

                form.setError(field, { message: messages[0] ?? "auth.validation.required" });

            }

            setFormError("auth.errors.validation");
            return;

        }

        if ( error.isAuth ) {

            setFormError("auth.errors.credentials");
            return;

        }

        if ( error.status === 429 ) {

            setFormError("auth.errors.rateLimited");
            return;

        }

        if ( error.isNetwork ) {

            setFormError("auth.errors.network");
            return;

        }

        setFormError("auth.errors.server");

    };

    const send = async ( values: AuthValues ) => {

        setFormError(null);
        setStatus(null);

        try {

            await submit(auth, mode, values);

            if ( mode === "recover" || mode === "reset" || mode === "confirm" ) {

                setStatus(success(mode));
                await wait();

            }

            router.replace(meta.redirect);

        } catch (error) {

            fail(error);

        }

    };

    const select = async ( provider: SocialProvider ) => {

        setFormError(null);
        setStatus(null);

        try {

            await auth.social.mutateAsync({ provider });
            router.replace(meta.redirect);

        } catch (error) {

            fail(error);

        }

    };

    const resend = async () => {

        if ( mode !== "confirm" || resendIn > 0 ) return;

        setFormError(null);
        setStatus(null);

        const valid = await form.trigger("email");

        if ( !valid ) return;

        const email = form.getValues("email");

        if ( typeof email !== "string" ) return;

        try {

            await auth.recovery.mutateAsync({ email });
            setStatus("auth.status.sent");
            setResendIn(resendSeconds);

        } catch (error) {

            fail(error);

        }

    };

    return (

        <main className="relative flex min-h-[calc(100vh-6rem)] flex-1 items-center justify-center overflow-hidden px-4 py-10">

            <div aria-hidden className="pointer-events-none absolute inset-0 bg-glow" />

            <AuthCard>

                <AuthHeader title={copy(meta.title)} description={copy(meta.description)} />

                {
                    formError ? (

                        <p role="alert" className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
                            {text(formError)}
                        </p>

                    ) : null
                }

                {
                    status ? (

                        <p role="status" className="mb-5 rounded-2xl border border-primary/30 bg-gold-soft px-4 py-3 text-sm font-medium text-gold-soft-foreground">
                            {text(status)}
                        </p>

                    ) : null
                }

                <form className="space-y-5" onSubmit={form.handleSubmit(send)}>

                    {
                        meta.fields.map((field) => {

                            if ( field === "terms" ) {

                                return (

                                    <Controller
                                        key={field}
                                        control={form.control}
                                        name={field}
                                        render={({ field: control }) => (

                                            <div className="space-y-2">

                                                <div className="flex items-start gap-3 rounded-2xl border bg-card p-3 shadow-sm">

                                                    <Checkbox
                                                        checked={control.value === true}
                                                        onCheckedChange={(checked) => control.onChange(checked === true)}
                                                        disabled={isPending}
                                                        aria-invalid={!!form.formState.errors.terms}
                                                        className="mt-0.5"
                                                    />

                                                    <span className="text-sm leading-5 text-muted-foreground">
                                                        {copy("auth.fields.terms")}
                                                    </span>

                                                </div>

                                                {
                                                    label(field) ? (

                                                        <p className="text-sm font-medium text-destructive">{text(String(label(field)))}</p>

                                                    ) : null
                                                }

                                            </div>

                                        )}
                                    />

                                );

                            }

                            if ( field === "code" ) {

                                return (

                                    <Controller
                                        key={field}
                                        control={form.control}
                                        name={field}
                                        render={({ field: control }) => (

                                            <div className="space-y-2">

                                                <Label>{copy("auth.fields.code")}</Label>

                                                <InputOTP
                                                    maxLength={codeLength}
                                                    value={typeof control.value === "string" ? control.value : ""}
                                                    onChange={control.onChange}
                                                    disabled={isPending}
                                                    containerClassName="justify-center"
                                                >

                                                    <InputOTPGroup className="shadow-sm">

                                                        {
                                                            codeSlots.map((slot, index) => (

                                                                <InputOTPSlot key={slot} index={index} className="size-11 text-base" />

                                                            ))
                                                        }

                                                    </InputOTPGroup>

                                                </InputOTP>

                                                {
                                                    label(field) ? (

                                                        <p className="text-sm font-medium text-destructive">{text(String(label(field)))}</p>

                                                    ) : null
                                                }

                                            </div>

                                        )}
                                    />

                                );

                            }

                            return (

                                <AuthField
                                    key={field}
                                    name={field}
                                    type={inputType(field)}
                                    label={copy(`auth.fields.${field}`)}
                                    placeholder={copy(`auth.placeholders.${field}`)}
                                    error={label(field) ? text(String(label(field))) : undefined}
                                    disabled={isPending}
                                    defaultValue={typeof initialValues?.[field] === "string" ? initialValues[field] : undefined}
                                    register={form.register}
                                />

                            );

                        })
                    }

                    <Button type="submit" size="lg" disabled={isPending} className="h-11 w-full rounded-xl shadow-md hover:-translate-y-0.5 hover:shadow-lg">
                        {isPending ? copy("auth.status.loading") : copy(meta.cta)}
                    </Button>

                </form>

                <div className={cn("mt-6", meta.providers.length ? "block" : "hidden")}>

                    <SocialButtons
                        providers={providers ?? meta.providers}
                        disabled={isPending}
                        label={copy("auth.social.divider")}
                        text={(provider) => copy(`auth.social.${provider}`)}
                        onSelect={select}
                    />

                </div>

                <footer className="mt-6 flex flex-col items-center gap-2 text-sm">

                    {
                        mode === "confirm" ? (

                            <Button
                                type="button"
                                variant="link"
                                disabled={isPending || resendIn > 0}
                                className="h-auto p-0 font-medium"
                                onClick={resend}
                            >
                                {resendIn > 0 ? t("auth.confirm.resendIn", { seconds: resendIn }) : copy(meta.switch)}
                            </Button>

                        ) : (

                            <Link
                                href={meta.switchHref}
                                className="font-medium text-primary outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                                {copy(meta.switch)}
                            </Link>

                        )
                    }

                    {
                        mode === "login" ? (

                            <Link
                                href="/recover"
                                className="text-muted-foreground outline-none transition-colors hover:text-foreground hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                            >
                                {copy("auth.recover.switch")}
                            </Link>

                        ) : null
                    }

                </footer>

            </AuthCard>

        </main>

    );

}
