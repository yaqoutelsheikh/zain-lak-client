export type CatalogKey = `catalog.${string}`;

export type CatalogListingType =
    | "physical"
    | "digital"
    | "service"
    | "tour"
    | "hotel"
    | "realEstate";

export type CatalogType = "all" | CatalogListingType;

export type CatalogSort = "featured" | "newest" | "priceLow" | "priceHigh";

export type CatalogTone = "primary" | "sky" | "violet" | "emerald" | "amber" | "rose";

export type CatalogTab = {
    id: CatalogType;
    label: CatalogKey;
};

export type CatalogSortOption = {
    id: CatalogSort;
    label: CatalogKey;
};

export type CatalogListing = {
    id: string;
    type: CatalogListingType;
    name: CatalogKey;
    description: CatalogKey;
    price: CatalogKey;
    meta: CatalogKey;
    badge: CatalogKey;
    href: string;
    tone: CatalogTone;
    rating: number;
    priceValue: number;
    featured: number;
    createdAt: string;
    search: string[];
};

export type CatalogConfig = {
    tabs: CatalogTab[];
    sorts: CatalogSortOption[];
    listings: CatalogListing[];
};

export type CatalogFilterState = {
    query: string;
    type: CatalogType;
    sort: CatalogSort;
};

