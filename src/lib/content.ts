import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Publication = CollectionEntry<'publications'>['data'];
export type Project = CollectionEntry<'projects'>['data'];
export type NewsItem = CollectionEntry<'news'>['data'];
export type Profile = CollectionEntry<'profile'>['data'];

export async function getPublications(): Promise<CollectionEntry<'publications'>[]> {
  const entries = await getCollection('publications');

  return [...entries].sort(
    (a, b) =>
      Number(b.data.selected) - Number(a.data.selected) ||
      b.data.year - a.data.year ||
      a.data.title.localeCompare(b.data.title, 'zh-CN'),
  );
}

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const entries = await getCollection('projects');

  return [...entries].sort(
    (a, b) =>
      Number(b.data.end_year === null) - Number(a.data.end_year === null) ||
      b.data.start_year - a.data.start_year ||
      a.data.name.localeCompare(b.data.name, 'zh-CN'),
  );
}

export async function getNews(): Promise<CollectionEntry<'news'>[]> {
  const entries = await getCollection('news');

  return [...entries].sort(
    (a, b) =>
      b.data.date.localeCompare(a.data.date, 'zh-CN') ||
      a.id.localeCompare(b.id, 'zh-CN'),
  );
}

export async function getProfile(): Promise<Profile> {
  const entry = await getEntry('profile', 'profile');

  if (entry === undefined) {
    throw new Error('profile.json 未找到或 parser 未返回 ID 为 profile 的条目');
  }

  return entry.data;
}
