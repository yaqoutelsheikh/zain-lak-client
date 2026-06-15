"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/elements/button";

type ThemeToggleProps = {
    label: string;
    size?: "icon-sm" | "icon-lg";
};

export function ThemeToggle({ label, size = "icon-lg" }: ThemeToggleProps) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const nextTheme = mounted && resolvedTheme === "dark" ? "light" : "dark";

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <Button
            aria-label={label}
            onClick={() => setTheme(nextTheme)}
            size={size}
            type="button"
            variant="ghost"
        >
            {mounted && resolvedTheme === "dark" ? (
                <Sun aria-hidden className="size-4" />
            ) : (
                <Moon aria-hidden className="size-4" />
            )}
        </Button>
    );
}
