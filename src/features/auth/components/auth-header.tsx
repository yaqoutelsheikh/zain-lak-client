import { ShieldCheck } from "lucide-react";

export function AuthHeader ({ title, description }: { title: string; description: string }) {

    return (

        <header className="mb-7 text-center">

            <div className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <ShieldCheck className="size-5" aria-hidden />
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {description}
            </p>

        </header>

    );

}
