import { defineCollection, z } from "astro:content";

// One collection: blog. Each post lives at src/content/blog/<slug>.md
// with frontmatter validated by this schema.
const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    // Language code drives <html lang="..." dir="..."> on the post page.
    lang: z.enum(["en", "ur", "ar"]).default("en"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
