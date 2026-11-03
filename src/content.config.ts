import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { site } from "./config/site";

const reviewSchema = z.object({
  productName: z.string(),
  brand: z.string(),
  priceRange: z.string(),
  rating: z
    .number()
    .min(0)
    .max(5)
    .refine((rating) => Number.isInteger(rating * 2), {
      message: "Rating must use half-star increments.",
    }),
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  specs: z.record(z.string(), z.string()),
  verdict: z.string(),
});

const posts = defineCollection({
  loader: glob({ pattern: "content/posts/**/*.mdx", base: "./src" }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string().max(160),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        category: z.enum(["web-development", "peripherals"]),
        tags: z.array(z.string()),
        cover: image().optional(),
        coverAlt: z.string().optional(),
        featured: z.boolean().default(false),
        draft: z.boolean().default(false),
        author: z.string().default(site.author),
        series: z.string().optional(),
        affiliate: z.boolean().default(false),
        format: z
          .enum(["review", "guide", "comparison", "news", "note"])
          .default("guide"),
        gearType: z
          .enum(["keyboards", "mice", "headphones", "other"])
          .optional(),
        review: reviewSchema.optional(),
      })
      .superRefine((post, context) => {
        if (post.cover && !post.coverAlt?.trim()) {
          context.addIssue({
            code: "custom",
            path: ["coverAlt"],
            message: "coverAlt is required when cover is provided.",
          });
        }
      }),
});

export const collections = { posts };
