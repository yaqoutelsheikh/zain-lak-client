import { Auth } from "@/features/auth";

type ResetPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first ( value: string | string[] | undefined ) {

    if ( Array.isArray(value) ) return value[0] ?? "";

    return value ?? "";

}

export default async function ResetPage ({ searchParams }: ResetPageProps) {

    const params = await searchParams;

    return <Auth mode="reset" initialValues={{ code: first(params.code ?? params.token) }} />;

}
