'use client';

import { blogSource } from '@/lib/source';
import { DEFAULT_AVATAR, getAuthorsFromIds, getAvatarUrl } from '@/utils/authors';
import { DEFAULT_BLOG_IMAGE } from '@/utils/constants';
import { estimateReadingTime } from '@/utils/reading-time';
import type { StructuredData } from 'fumadocs-core/mdx-plugins';
import Image from 'next/image';
import Link from 'next/link';

interface BlogPost {
  url: string;
  data: {
    title: string;
    description?: string;
    date?: string;
    authors?: string[];
    image?: string;
    tags?: string[];
    structuredData: StructuredData;
  };
}

function BlogCard({ post }: { post: BlogPost }) {
  const readingTime = estimateReadingTime(post.data.structuredData);
  const authors = post.data.authors ? getAuthorsFromIds(post.data.authors) : [];
  const imageUrl = post.data.image || DEFAULT_BLOG_IMAGE;

  return (
    <Link
      href={post.url}
      className='group flex flex-col rounded-xl border border-fd-border hover:border-fd-primary bg-fd-card hover:bg-fd-card/80 transition-all no-underline'>
      {/* Image header - coins arrondis en haut seulement */}
      <div className='relative aspect-video w-full overflow-hidden rounded-t-xl bg-fd-muted'>
        <Image
          src={imageUrl}
          alt={post.data.title}
          fill
          className='object-cover transition-transform group-hover:scale-105 mt-0'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
        />
      </div>

      {/* Content */}
      <div className='flex flex-1 flex-col px-4'>
        {/* Tags */}
        {post.data.tags && post.data.tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mt-3'>
            {post.data.tags.map((tag) => (
              <span
                key={tag}
                className='rounded-md px-2 py-1 text-xs font-medium bg-fd-primary/15 text-fd-primary dark:bg-fd-accent dark:text-fd-accent-foreground'>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className='font-semibold text-fd-foreground leading-snug mt-4'>{post.data.title}</h3>

        {/* Description */}
        {post.data.description && (
          <p className='mt-1 line-clamp-2 text-sm text-fd-muted-foreground flex-1 mb-4'>{post.data.description}</p>
        )}

        {/* Footer: separator + author avatar + date + reading time */}
        <div className='flex items-center gap-2 text-sm text-fd-muted-foreground border-t border-fd-border'>
          {/* Author avatar - toujours affiche */}
          <Image
            src={authors.length > 0 ? getAvatarUrl(authors[0].github) : DEFAULT_AVATAR}
            alt={authors.length > 0 ? authors[0].name : 'Auteur'}
            width={24}
            height={24}
            className='rounded-full mt-4 mb-4'
            title={authors.length > 0 ? authors[0].name : 'Auteur anonyme'}
          />

          {/* Date + reading time */}
          {post.data.date && (
            <time dateTime={post.data.date}>
              {new Date(post.data.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
              })}
            </time>
          )}
          <span>•</span>
          <span>{readingTime} min</span>
        </div>
      </div>
    </Link>
  );
}

interface BlogCardsProps {
  limit?: number;
}

export function BlogCards({ limit }: BlogCardsProps = {}) {
  const allPosts = blogSource
    .getPages()
    .filter((page) => page.slugs.length > 0 && page.slugs[0] !== 'index')
    .sort((a, b) => {
      const dateA = new Date(a.data.date || '');
      const dateB = new Date(b.data.date || '');
      return dateB.getTime() - dateA.getTime();
    });

  const postsToDisplay = limit ? allPosts.slice(0, limit) : allPosts;

  if (postsToDisplay.length === 0) {
    return <p className='text-fd-muted-foreground'>Aucun article pour le moment.</p>;
  }

  return (
    <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {postsToDisplay.map((post) => (
        <BlogCard key={post.url} post={post as BlogPost} />
      ))}
    </div>
  );
}
