import type { ImageMetadata } from "astro";
import type { GearItem } from "../data/gear/types";

const productImageFiles = import.meta.glob<ImageMetadata>(
  "../assets/images/products/*/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

const categoryByKind = {
  keyboard: "keyboards",
  mouse: "mice",
  iem: "iems",
} as const;
const extensions = ["jpg", "jpeg", "png", "webp", "avif"] as const;

export function getLocalProductImage(item: GearItem): ImageMetadata | undefined {
  const category = categoryByKind[item.kind];

  for (const extension of extensions) {
    const path = `../assets/images/products/${category}/${item.id}.${extension}`;
    const image = productImageFiles[path];
    if (image) return image;
  }

  return undefined;
}