"use client";

import { ArrowUpRight, CheckCircle2, CreditCard, PackageCheck, ShoppingBag, UserRound } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { Button, buttonVariants } from "@/components/ui/elements/button";
import { Input } from "@/components/ui/elements/input";
import { Label } from "@/components/ui/elements/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/elements/select";
import { cartTotals } from "@/lib/cart/totals";
import { Link } from "@/lib/utils/i18n";
import { cn } from "@/lib/utils/shadcn/cn";
import { useCart } from "@/stores/cart";

type ContactFields = {
    name: string;
    email: string;
    phone: string;
    notes: string;
};

type ContactError = Partial<Record<keyof Pick<ContactFields, "name" | "email" | "phone">, boolean>>;
type FulfillmentMethod = "delivery" | "booking" | "contact";
type PaymentMethod = "card" | "wallet";

const fulfillmentMethods = ["delivery", "booking", "contact"] as const satisfies FulfillmentMethod[];
const paymentMethods = ["card", "wallet"] as const satisfies PaymentMethod[];

const emptyFields = {
    name: "",
    email: "",
    phone: "",
    notes: "",
} satisfies ContactFields;

export function Checkout() {
    const t = useTranslations("cart");
    const productT = useTranslations("product");
    const format = useFormatter();
    const items = useCart((state) => state.items);
    const [fields, setFields] = useState<ContactFields>(emptyFields);
    const [errors, setErrors] = useState<ContactError>({});
    const [fulfillment, setFulfillment] = useState<FulfillmentMethod>("delivery");
    const [payment, setPayment] = useState<PaymentMethod>("card");
    const [confirmationId, setConfirmationId] = useState("");
    const totals = cartTotals(items);
    const money = (value: number) => format.number(value, { style: "currency", currency: "USD" });
    const translateProduct = (key: string) => productT(key.replace("product.", "") as Parameters<typeof productT>[0]);

    const updateField = (field: keyof ContactFields, value: string) => {
        setFields((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: false }));
    };

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const nextErrors = {
            name: !fields.name.trim(),
            email: !fields.email.trim(),
            phone: !fields.phone.trim(),
        } satisfies ContactError;

        setErrors(nextErrors);

        if ( nextErrors.name || nextErrors.email || nextErrors.phone ) return;

        setConfirmationId(`ZL-${Date.now().toString(36).toUpperCase()}`);
    };

    if ( confirmationId ) {
        return (
            <main className="min-h-dvh bg-background px-4 py-10 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-3xl rounded-lg border bg-card p-6 text-center shadow-xl sm:p-8">
                    <span className="mx-auto grid size-16 place-items-center rounded-lg bg-primary/10 text-primary">
                        <CheckCircle2 aria-hidden className="size-8" />
                    </span>
                    <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                        {t("confirmationTitle")}
                    </h1>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                        {t("confirmationDescription")}
                    </p>
                    <div className="mx-auto mt-6 grid max-w-sm gap-3 rounded-lg border bg-background p-4 text-sm">
                        <div className="flex items-center justify-between gap-4">
                            <span className="text-muted-foreground">{t("confirmationId")}</span>
                            <strong className="text-foreground">{confirmationId}</strong>
                        </div>
                        <div className="flex items-center justify-between gap-4 border-t pt-3">
                            <span className="text-muted-foreground">{t("total")}</span>
                            <strong className="text-primary">{money(totals.total)}</strong>
                        </div>
                    </div>
                    <Link className={cn(buttonVariants({ size: "lg" }), "mt-7 min-h-11 px-5")} href="/catalog">
                        {t("backToCatalog")}
                        <ArrowUpRight aria-hidden className="size-4" />
                    </Link>
                </section>
            </main>
        );
    }

    if ( !items.length ) {
        return (
            <main className="min-h-dvh bg-background">
                <section className="flex min-h-[calc(100dvh-10rem)] items-center justify-center px-4 py-14 sm:px-6 lg:px-8">
                    <div className="mx-auto flex max-w-lg flex-col items-center rounded-lg border bg-card p-8 text-center shadow-xl">
                        <span className="grid size-16 place-items-center rounded-lg bg-primary/10 text-primary">
                            <ShoppingBag aria-hidden className="size-8" />
                        </span>
                        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-foreground">{t("emptyTitle")}</h1>
                        <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("emptyDescription")}</p>
                        <Link className={cn(buttonVariants({ size: "lg" }), "mt-7 min-h-11 px-5")} href="/catalog">
                            {t("backToCatalog")}
                        </Link>
                    </div>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-dvh bg-background">
            <section className="border-b bg-background px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                        {t("checkoutTitle")}
                    </h1>
                    <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
                        {t("checkoutDescription")}
                    </p>
                </div>
            </section>

            <section className="px-4 py-8 sm:px-6 lg:px-8">
                <form
                    noValidate
                    className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,24rem)]"
                    onSubmit={submit}
                >
                    <div className="grid gap-5">
                        <section className="rounded-lg border bg-card p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                    <UserRound aria-hidden className="size-5" />
                                </span>
                                <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("contact")}</h2>
                            </div>
                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <Field
                                    id="checkout-name"
                                    label={t("name")}
                                    value={fields.name}
                                    error={errors.name}
                                    message={t("validationRequired")}
                                    onChange={(value) => updateField("name", value)}
                                />
                                <Field
                                    id="checkout-email"
                                    label={t("email")}
                                    type="email"
                                    value={fields.email}
                                    error={errors.email}
                                    message={t("validationRequired")}
                                    onChange={(value) => updateField("email", value)}
                                />
                                <Field
                                    id="checkout-phone"
                                    label={t("phone")}
                                    type="tel"
                                    value={fields.phone}
                                    error={errors.phone}
                                    message={t("validationRequired")}
                                    onChange={(value) => updateField("phone", value)}
                                />
                                <div className="grid gap-2">
                                    <Label htmlFor="checkout-fulfillment">{t("fulfillment")}</Label>
                                    <Select
                                        value={fulfillment}
                                        onValueChange={(value) => setFulfillment(value as FulfillmentMethod)}
                                    >
                                        <SelectTrigger id="checkout-fulfillment" className="h-11 w-full bg-background">
                                            <SelectValue>{t(`methods.${fulfillment}`)}</SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fulfillmentMethods.map((method) => (
                                                <SelectItem key={method} value={method}>
                                                    {t(`methods.${method}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2 sm:col-span-2">
                                    <Label htmlFor="checkout-notes">{t("notes")}</Label>
                                    <textarea
                                        id="checkout-notes"
                                        value={fields.notes}
                                        className="min-h-28 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                                        onChange={(event) => updateField("notes", event.target.value)}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-lg border bg-card p-5 shadow-sm">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                    <CreditCard aria-hidden className="size-5" />
                                </span>
                                <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("payment")}</h2>
                            </div>
                            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t("paymentPlaceholder")}</p>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {paymentMethods.map((method) => (
                                    <Button
                                        key={method}
                                        type="button"
                                        variant={payment === method ? "default" : "outline"}
                                        className="h-12 justify-start px-4"
                                        onClick={() => setPayment(method)}
                                    >
                                        <CreditCard aria-hidden className="size-4" />
                                        {t(`methods.${method}`)}
                                    </Button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="h-fit rounded-lg border bg-card p-5 shadow-xl">
                        <div className="flex items-center gap-3">
                            <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                                <PackageCheck aria-hidden className="size-5" />
                            </span>
                            <h2 className="text-xl font-semibold tracking-tight text-foreground">{t("summary")}</h2>
                        </div>
                        <div className="mt-5 grid gap-3 border-b pb-4">
                            {items.map((item) => (
                                <div className="grid gap-1 text-sm" key={item.id}>
                                    <div className="flex items-start justify-between gap-4">
                                        <span className="font-medium text-foreground">{translateProduct(item.name)}</span>
                                        <span className="text-muted-foreground">x{item.quantity}</span>
                                    </div>
                                    <p className="text-muted-foreground">{translateProduct(item.option)}</p>
                                </div>
                            ))}
                        </div>
                        <dl className="mt-5 grid gap-3">
                            <TotalLine label={t("subtotal")} value={money(totals.subtotal)} />
                            <TotalLine label={t("estimatedFees")} value={money(totals.estimatedFees)} />
                            <div className="flex items-center justify-between gap-4 border-t pt-4">
                                <dt className="font-semibold text-foreground">{t("total")}</dt>
                                <dd className="text-2xl font-semibold text-primary">{money(totals.total)}</dd>
                            </div>
                        </dl>
                        <Button type="submit" size="lg" className="mt-6 min-h-11 w-full gap-2">
                            {t("confirm")}
                            <ArrowUpRight aria-hidden className="size-4" />
                        </Button>
                    </aside>
                </form>
            </section>
        </main>
    );
}

type FieldProps = {
    id: string;
    label: string;
    message: string;
    value: string;
    error?: boolean;
    type?: string;
    onChange: (value: string) => void;
};

function Field({ id, label, message, value, error = false, type = "text", onChange }: FieldProps) {
    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                value={value}
                aria-invalid={error}
                className="h-11 bg-background"
                onChange={(event) => onChange(event.target.value)}
            />
            {error ? <p className="text-xs font-medium text-destructive">{message}</p> : null}
        </div>
    );
}

type TotalLineProps = {
    label: string;
    value: string;
};

function TotalLine({ label, value }: TotalLineProps) {
    return (
        <div className="flex items-center justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold text-foreground">{value}</dd>
        </div>
    );
}
