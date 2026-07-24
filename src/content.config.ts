import { defineCollection, z } from "astro:content"
import { file } from "astro/loaders"

const projects = defineCollection({
  loader: file("src/content/projects/projects.json"),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    image: z.string(),
    image_alt: z.string(),
    githubURL: z.string().url(),
    deployedURL: z.string().url().optional(),
    description: z.string(),
    tags: z.array(z.string()).max(3),
  }),
})

const skills = defineCollection({
  loader: file("src/content/skills/skills.json"),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    icon: z.string(),
    icon_alt: z.string(),
  }),
})

export const collections = { projects, skills }
