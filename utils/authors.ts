export const DEFAULT_AVATAR = '/logo.png';

export const authors = {
  mathias: {
    name: 'Mathias',
    github: 'mathiasdotdev',
  },
} as const;

export type AuthorId = keyof typeof authors;

export interface Author {
  name: string;
  github: string;
}

export function getAuthor(id: string): Author | null {
  return (authors as Record<string, Author>)[id] ?? null;
}

export function getAvatarUrl(github: string | undefined): string {
  if (!github) return DEFAULT_AVATAR;
  return `https://github.com/${github}.png`;
}

export function getAuthorsFromIds(ids: string[]): (Author & { id: string })[] {
  return ids
    .map((id) => {
      const author = getAuthor(id);
      return author ? { ...author, id } : null;
    })
    .filter((a): a is Author & { id: string } => a !== null);
}
