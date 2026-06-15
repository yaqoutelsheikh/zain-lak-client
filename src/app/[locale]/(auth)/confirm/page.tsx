import { Auth } from "@/features/auth";

type ConfirmPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first ( value: string | string[] | undefined ) {

    if ( Array.isArray(value) ) return value[0] ?? "";

    return value ?? "";

}

export default async function ConfirmPage ({ searchParams }: ConfirmPageProps) {

    const params = await searchParams;

    return <Auth mode="confirm" initialValues={{ email: first(params.email), code: first(params.code) }} />;

}
