import { product } from "./config";
import type { ProductDetail } from "./types";

export function findProduct(slug: string): ProductDetail | undefined {
    return product.products.find((item) => item.slug === slug);
}

export function relatedProducts(item: ProductDetail): ProductDetail[] {
    return item.related
        .map(findProduct)
        .filter((related): related is ProductDetail => Boolean(related));
}

export function defaultOption(item: ProductDetail) {
    return item.options[0];
}

