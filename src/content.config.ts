import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const urlSchema = z.string().url().or(z.literal(''));
const yearSchema = z.number().int().min(1900).max(2100);
const nonEmptyStringArray = z.array(z.string().min(1)).min(1);

const publications = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/publications',
  }),
  schema: z.object({
    title: z.string(),
    authors: nonEmptyStringArray,
    venue: z.string(),
    year: yearSchema,
    paper_url: urlSchema,
    code_url: urlSchema,
    selected: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/projects',
  }),
  schema: z
    .object({
      name: z.string(),
      description: z.string(),
      tech_stack: nonEmptyStringArray,
      repo_url: urlSchema,
      demo_url: urlSchema,
      start_year: yearSchema,
      end_year: yearSchema.nullable(),
    })
    .refine(
      (project) =>
        project.end_year === null || project.end_year >= project.start_year,
      {
        path: ['end_year'],
        error: (issue) => {
          const project = issue.input as { name: string };
          return `项目“${project.name}”：end_year 必须为 null 或大于等于 start_year。`;
        },
      },
    ),
});

const news = defineCollection({
  loader: glob({
    pattern: '*.json',
    base: './src/content/news',
  }),
  schema: z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    content: z.string().min(1),
  }),
});

const profile = defineCollection({
  loader: file('src/content/profile.json', {
    parser: (text) => ({ profile: JSON.parse(text) }),
  }),
  schema: z.object({
    name: z.string(),
    title: z.string(),
    affiliation: z.string(),
    bio: z.string(),
    email: z.email(),
    github: urlSchema,
    scholar_url: urlSchema,
  }),
});

export const collections = { publications, projects, news, profile };
