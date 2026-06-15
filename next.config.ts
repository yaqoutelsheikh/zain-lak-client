import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    reactCompiler: true,
    typedRoutes: true,
    poweredByHeader: false,
    outputFileTracingRoot: __dirname,
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
