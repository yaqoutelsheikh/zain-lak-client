"use client";

import { CalendarDays, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/elements/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/elements/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/elements/select";
import { useRouter } from "@/lib/utils/i18n";
import { addCartItem } from "@/stores/cart";
import { defaultOption } from "../helpers";
import type { ProductDetail, ProductKey } from "../types";

type ProductPanelProps = {
    item: ProductDetail;
    translate: (key: ProductKey) => string;
};

export function ProductPanel({ item, translate }: ProductPanelProps) {
    const [option, setOption] = useState(defaultOption(item)?.id ?? "");
    const [selectedDate, setSelectedDate] = useState("");
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();
    const locale = useLocale();
    const selectedOption = item.options.find((entry) => entry.id === option) ?? defaultOption(item);

    const change = (value: string | null) => {

        if ( value ) setOption(value);

    };

    const decrement = () => setQuantity((value) => Math.max(1, value - 1));
    const increment = () => setQuantity((value) => Math.min(9, value + 1));
    const submit = () => {

        if ( !selectedOption ) return;

        addCartItem({
            id: `${item.slug}:${selectedOption.id}`,
            slug: item.slug,
            type: item.type,
            name: item.name,
            price: item.price,
            priceValue: item.priceValue,
            quantity,
            option: selectedOption.label,
            selectedDate,
            tone: item.tone,
            meta: item.summary,
        });

        router.push("/cart");

    };

    return (
        <aside className="rounded-lg border bg-card p-5 shadow-xl">
            <div>
                <p className="text-sm font-medium text-muted-foreground">{translate("product.optionLabel")}</p>
                <Select value={option} onValueChange={change}>
                    <SelectTrigger className="mt-2 h-11 w-full bg-background">
                        <SelectValue>{selectedOption ? translate(selectedOption.label) : null}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        {item.options.map((itemOption) => (
                            <SelectItem key={itemOption.id} value={itemOption.id}>
                                {translate(itemOption.label)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="grid gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{translate("product.dateLabel")}</span>
                    <ProductDatePicker
                        locale={locale}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        translate={translate}
                    />
                </div>

                <div className="grid gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{translate("product.quantityLabel")}</span>
                    <div className="flex h-11 items-center justify-between rounded-lg border bg-background px-2">
                        <Button type="button" variant="ghost" size="icon-sm" aria-label={translate("product.quantityLabel")} onClick={decrement}>
                            <Minus aria-hidden className="size-4" />
                        </Button>
                        <span className="text-sm font-semibold text-foreground">{quantity}</span>
                        <Button type="button" variant="ghost" size="icon-sm" aria-label={translate("product.quantityLabel")} onClick={increment}>
                            <Plus aria-hidden className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <Button type="button" size="lg" className="mt-6 min-h-11 w-full" onClick={submit}>
                {translate(item.cta)}
            </Button>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{translate("product.intentNote")}</p>
        </aside>
    );
}

type ProductDatePickerProps = {
    locale: string;
    selectedDate: string;
    setSelectedDate: (value: string) => void;
    translate: (key: ProductKey) => string;
};

function ProductDatePicker({ locale, selectedDate, setSelectedDate, translate }: ProductDatePickerProps) {
    const today = startOfDay(new Date());
    const selected = selectedDate ? parseIsoDate(selectedDate) : today;
    const [open, setOpen] = useState(false);
    const [viewDate, setViewDate] = useState(startOfMonth(selected));
    const days = monthDays(viewDate);
    const canGoPrevious = startOfMonth(viewDate).getTime() > startOfMonth(today).getTime();
    const formatter = new Intl.DateTimeFormat(locale, { dateStyle: "medium" });
    const monthFormatter = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
    const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    const label = selectedDate ? formatter.format(parseIsoDate(selectedDate)) : translate("product.dateLabel");

    const select = (date: Date) => {
        if ( isPast(date, today) ) return;

        setSelectedDate(toIsoDate(date));
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        className="h-11 w-full justify-start bg-background px-3 text-start font-normal"
                    />
                }
            >
                <CalendarDays aria-hidden className="size-4 text-muted-foreground" />
                <span className="min-w-0 truncate">{label}</span>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-3">
                <div className="flex items-center justify-between gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={translate("product.previousMonth")}
                        disabled={!canGoPrevious}
                        onClick={() => setViewDate((date) => addMonths(date, -1))}
                    >
                        <ChevronLeft aria-hidden className="size-4 rtl:rotate-180" />
                    </Button>
                    <p className="text-sm font-semibold text-foreground">{monthFormatter.format(viewDate)}</p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={translate("product.nextMonth")}
                        onClick={() => setViewDate((date) => addMonths(date, 1))}
                    >
                        <ChevronRight aria-hidden className="size-4 rtl:rotate-180" />
                    </Button>
                </div>
                <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
                    {weekdays().map((day) => (
                        <span key={toIsoDate(day)}>{weekdayFormatter.format(day)}</span>
                    ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-1">
                    {days.map((cell) => {
                        if ( !cell.date ) return <span aria-hidden key={cell.id} className="size-9" />;

                        const date = cell.date;
                        const disabled = isPast(date, today);
                        const active = selectedDate === toIsoDate(date);

                        return (
                            <Button
                                key={cell.id}
                                type="button"
                                variant={active ? "default" : "ghost"}
                                size="icon-lg"
                                disabled={disabled}
                                className="size-9 text-sm font-medium disabled:opacity-35"
                                onClick={() => select(date)}
                            >
                                {date.getDate()}
                            </Button>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

function startOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
    return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function parseIsoDate(value: string) {
    const [year, month, day] = value.split("-").map(Number);

    return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

function toIsoDate(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function isPast(date: Date, today: Date) {
    return startOfDay(date).getTime() < today.getTime();
}

function weekdays() {
    const base = new Date(2026, 0, 4);

    return Array.from({ length: 7 }, (_, index) => new Date(base.getFullYear(), base.getMonth(), base.getDate() + index));
}

function monthDays(date: Date) {
    const first = startOfMonth(date);
    const count = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const offset = first.getDay();
    const days: Array<{ id: string; date: Date | null }> = Array.from({ length: offset }, (_, index) => ({
        id: `empty-${date.getFullYear()}-${date.getMonth()}-${index}`,
        date: null,
    }));

    for ( let day = 1; day <= count; day++ ) {
        const cellDate = new Date(date.getFullYear(), date.getMonth(), day);

        days.push({ id: toIsoDate(cellDate), date: cellDate });
    }

    return days;
}
