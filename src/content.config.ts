import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const assetTypes = z.enum([
  'real-project-photo',
  'company-photo',
  'stock-photo',
  'generated-image',
  'illustrative-image',
  'placeholder'
]);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(3),
    slug: z.string().min(3),
    locationGeneral: z.string().min(3),
    interventionType: z.string().min(3),
    summary: z.string().min(10),
    servicesInvolved: z.array(z.string().min(2)).min(1),
    images: z.array(
      z.object({
        src: z.string().min(1),
        alt: z.string().min(3),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
        assetType: assetTypes,
        authorizedForPublication: z.boolean(),
        usageNotes: z.string().optional()
      })
    ),
    published: z.boolean(),
    authorizedForPublication: z.boolean()
  })
});

export const collections = {
  projects
};
