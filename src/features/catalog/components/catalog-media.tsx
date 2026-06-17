import type { LucideIcon } from "lucide-react";
import { Building2, Download, Hotel, Package, Sparkles, Ticket } from "lucide-react";
import type { CatalogListingType, CatalogTone } from "../types";

export const listingIcons: Record<CatalogListingType, LucideIcon> = {
    physical: Package,
    digital: Download,
    service: Sparkles,
    tour: Ticket,
    hotel: Hotel,
    realEstate: Building2,
};

export const toneClassNames: Record<CatalogTone, string> = {
    primary: "bg-primary/10 text-primary ring-primary/20",
    sky: "bg-chart-2/10 text-chart-2 ring-chart-2/20",
    violet: "bg-chart-4/10 text-chart-4 ring-chart-4/20",
    emerald: "bg-chart-3/10 text-chart-3 ring-chart-3/20",
    amber: "bg-chart-5/10 text-chart-5 ring-chart-5/20",
    rose: "bg-chart-1/10 text-chart-1 ring-chart-1/20",
};

