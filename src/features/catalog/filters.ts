import type { CatalogFilterState, CatalogListing } from "./types";

export function filterCatalog(listings: CatalogListing[], state: CatalogFilterState) {
    const query = state.query.trim().toLowerCase();

    return listings
        .filter((listing) => state.type === "all" || listing.type === state.type)
        .filter((listing) => !query || listing.search.some((term) => term.includes(query)))
        .toSorted((a, b) => sort(a, b, state.sort));
}

function sort(a: CatalogListing, b: CatalogListing, option: CatalogFilterState["sort"]) {
    if ( option === "newest" ) return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    if ( option === "priceLow" ) return a.priceValue - b.priceValue;
    if ( option === "priceHigh" ) return b.priceValue - a.priceValue;

    return b.featured - a.featured;
}

