import { defineCollection, z } from 'astro:content';

import { glob } from 'astro/loaders';

const docs = defineCollection({
    loader: glob({
        pattern: '*.md',
        base: './src/content/docs'
    }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
    })
});

export const collections = { docs };