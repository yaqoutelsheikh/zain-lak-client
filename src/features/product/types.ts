export type ProductKey = `product.${string}`;

export type ProductType =
    | "physical"
    | "digital"
    | "service"
    | "tour"
    | "hotel"
    | "realEstate";

export type ProductTone = "primary" | "sky" | "violet" | "emerald" | "amber" | "rose";

export type ProductFact = {
    label: ProductKey;
    value: ProductKey;
};

export type ProductOption = {
    id: string;
    label: ProductKey;
};

export type ProductDetail = {
    slug: string;
    type: ProductType;
    name: ProductKey;
    summary: ProductKey;
    description: ProductKey;
    price: ProductKey;
    priceValue: number;
    badge: ProductKey;
    cta: ProductKey;
    tone: ProductTone;
    rating: number;
    highlights: ProductKey[];
    facts: ProductFact[];
    policies: ProductKey[];
    trust: ProductKey[];
    options: ProductOption[];
    related: string[];
};

export type ProductConfig = {
    products: ProductDetail[];
};
