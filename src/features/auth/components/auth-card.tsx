export function AuthCard ({ children }: { children: React.ReactNode }) {

    return (

        <section className="relative mx-auto w-full max-w-md rounded-3xl border bg-card bg-surface p-6 shadow-xl sm:p-8">

            {children}

        </section>

    );

}
