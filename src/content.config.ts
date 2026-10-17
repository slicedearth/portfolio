import { defineCollection } from "astro:content"
import { file } from "astro/loaders"
import { z } from "astro/zod"

const projects = defineCollection({
  loader: file("src/content/projects/projects.json"),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    eyebrow: z.string(),
    image: z.string(),
    image_alt: z.string(),
    githubURL: z.url(),
    deployedURL: z.url().optional(),
    deployedLabel: z.string().optional(),
    caseStudyURL: z.url().optional(),
    caseStudyLabel: z.string().optional(),
    presentation: z
      .enum(["featured", "secondary", "compact"])
      .default("compact"),
    description: z.string(),
    highlights: z.array(z.string()).min(1).max(3),
    tags: z.array(z.string()).max(4),
  }),
})

const skills = defineCollection({
  loader: file("src/content/skills/skills.json"),
  schema: z.object({
    order: z.number(),
    title: z.enum([
      "TypeScript",
      "Svelte",
      "React",
      "Python",
      "Node.js",
      "Astro",
      "Playwright",
    ]),
  }),
})

export const collections = { projects, skills }
