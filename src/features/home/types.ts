export type HomeKey = `home.${string}`;

export type ProductType =
    | "physical"
    | "digital"
    | "service"
    | "tour"
    | "hotel"
    | "realEstate";

export type CollectionId =
    | "physical"
    | "digital"
    | "services"
    | "bookings"
    | "stays"
    | "estate";

export type ProductId =
    | "smartKit"
    | "designPack"
    | "homeCleaning"
    | "desertTour"
    | "cityHotel"
    | "marinaApartment";

export type RailId = "featured" | "services" | "bookings";

export type MediaTone = "primary" | "sky" | "violet" | "emerald" | "amber" | "rose";

export type HomeHero = {
    eyebrow: HomeKey;
    title: HomeKey;
    description: HomeKey;
    primaryCta: HomeKey;
    secondaryCta: HomeKey;
    primaryHref: string;
    secondaryHref: string;
};

export type HomeCollection = {
    id: CollectionId;
    label: HomeKey;
    href: string;
    tone: MediaTone;
};

export type HomeProduct = {
    id: ProductId;
    type: ProductType;
    name: HomeKey;
    description: HomeKey;
    price: HomeKey;
    href: string;
    tone: MediaTone;
};

export type HomeRail = {
    id: RailId;
    title: HomeKey;
    items: ProductId[];
};

export type HomeTrustItem = {
    id: "orders" | "vendors" | "support" | "secure";
    label: HomeKey;
};

export type HomeConfig = {
    hero: HomeHero;
    collections: HomeCollection[];
    products: HomeProduct[];
    rails: HomeRail[];
    trust: {
        title: HomeKey;
        description: HomeKey;
        items: HomeTrustItem[];
    };
    support: {
        eyebrow: HomeKey;
        title: HomeKey;
        description: HomeKey;
        chat: HomeKey;
        ai: HomeKey;
        chatHref: string;
        aiHref: string;
    };
    footer: {
        title: HomeKey;
        description: HomeKey;
        cta: HomeKey;
        href: string;
    };
};
