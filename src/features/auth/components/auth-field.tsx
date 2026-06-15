import type { UseFormRegister } from "react-hook-form";
import { Input } from "@/components/ui/elements/input";
import { Label } from "@/components/ui/elements/label";
import type { AuthValues } from "../types";

type AuthFieldProps = {
    name: keyof AuthValues & string;
    label: string;
    placeholder: string;
    type?: string;
    error?: string;
    disabled?: boolean;
    defaultValue?: string;
    register: UseFormRegister<AuthValues>;
};

export function AuthField ({ name, label, placeholder, type = "text", error, disabled, defaultValue, register }: AuthFieldProps) {

    return (

        <div className="space-y-2">

            <Label htmlFor={name}>{label}</Label>

            <Input
                id={name}
                type={type}
                placeholder={placeholder}
                aria-invalid={!!error}
                disabled={disabled}
                defaultValue={defaultValue}
                className="h-11 rounded-xl bg-card shadow-sm focus-visible:shadow-focus"
                {...register(name)}
            />

            {
                error ? (

                    <p className="text-sm font-medium text-destructive">{error}</p>

                ) : null
            }

        </div>

    );

}
