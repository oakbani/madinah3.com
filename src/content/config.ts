import { defineCollection, z } from "astro:content";

// Blog posts live at src/content/blog/<slug>.md with frontmatter validated below.
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

// Right-panel content for roadmap nodes. Files live at
// src/content/roadmap-nodes/<roadmap-id>/<node-id>.md
const roadmapNodes = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string().optional(),
    links: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
    resources: z
      .array(z.object({ label: z.string(), href: z.string().url() }))
      .default([]),
  }),
});

export const collections = { blog, roadmapNodes };
