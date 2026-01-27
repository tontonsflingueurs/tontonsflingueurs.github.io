"use client";

import { DEFAULT_BLOG_IMAGE } from "@/config/constants";
import { DEFAULT_AVATAR, getAuthorsFromIds, getAvatarUrl } from "@/features/authors";
import { blogSource } from "@/lib/source";
import type { StructuredData } from "fumadocs-core/mdx-plugins";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useId } from "react";
import { estimateReadingTime } from "../utils";
import { BlogPagination } from "./BlogPagination";

const POSTS_PER_PAGE = 15;

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
  const baseId = useId();

  return (
    <Link
      href={post.url}
      className="group flex flex-col rounded-xl border border-fd-border hover:border-fd-primary bg-fd-card hover:bg-fd-card/80 transition-all no-underline"
    >
      {/* Image header - coins arrondis en haut seulement */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-xl bg-fd-muted">
        <Image
          src={imageUrl}
          alt={post.data.title}
          fill
          className="object-cover transition-transform group-hover:scale-105 mt-0"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-4">
        {/* Tags */}
        {post.data.tags && post.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {post.data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-1 text-xs font-medium bg-fd-primary/15 text-fd-primary dark:bg-fd-accent dark:text-fd-accent-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-fd-foreground leading-snug mt-4">{post.data.title}</h3>

        {/* Description */}
        {post.data.description && (
          <p className="mt-1 line-clamp-2 text-sm text-fd-muted-foreground mb-4">{post.data.description}</p>
        )}

        {/* Spacer pour pousser le footer en bas */}
        <div className="flex-1" />

        {/* Footer: separator + author avatars + date + reading time */}
        <div className="flex items-center gap-3 text-sm text-fd-muted-foreground border-t border-fd-border">
          {/* Avatars des auteurs empiles */}
          <div className="flex -space-x-2">
            {authors.length > 0 ? (
              authors.map((author, index) => (
                <Image
                  key={`${baseId}-${index}`}
                  src={getAvatarUrl(author.github)}
                  alt={author.name}
                  width={24}
                  height={24}
                  className="rounded-full ring-2 ring-fd-card not-prose my-4"
                  style={{ zIndex: authors.length - index }}
                  title={author.name}
                />
              ))
            ) : (
              <Image
                src={DEFAULT_AVATAR}
                alt="Auteur"
                width={24}
                height={24}
                className="rounded-full not-prose my-4"
                title="Auteur anonyme"
              />
            )}
          </div>

          {/* Date + reading time */}
          {post.data.date && (
            <time dateTime={post.data.date}>
              {new Date(post.data.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "short",
                day: "numeric",
                timeZone: "UTC",
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
  /** Nombre d'articles par page (défaut: 15) */
  limit?: number;
  /** Désactive la pagination (affiche tous les articles ou le limit spécifié) */
  noPagination?: boolean;
}

// Composant interne qui utilise useSearchParams (nécessite Suspense)
function BlogCardsContent({ limit, noPagination = false }: BlogCardsProps) {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const allPosts = blogSource
    .getPages()
    .filter((page) => page.slugs.length > 0 && page.slugs[0] !== "index")
    .sort((a, b) => {
      const dateA = new Date(a.data.date || "");
      const dateB = new Date(b.data.date || "");
      return dateB.getTime() - dateA.getTime();
    });

  // Mode sans pagination : utilise limit ou affiche tout
  if (noPagination) {
    const postsToDisplay = limit ? allPosts.slice(0, limit) : allPosts;

    if (postsToDisplay.length === 0) {
      return <p className="text-fd-muted-foreground">Aucun article pour le moment.</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {postsToDisplay.map((post) => (
          <BlogCard key={post.url} post={post as BlogPost} />
        ))}
      </div>
    );
  }

  // Mode avec pagination
  const postsPerPage = limit || POSTS_PER_PAGE;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const validPage = Math.min(Math.max(1, currentPage), totalPages || 1);

  const startIndex = (validPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToDisplay = allPosts.slice(startIndex, endIndex);

  if (allPosts.length === 0) {
    return <p className="text-fd-muted-foreground">Aucun article pour le moment.</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {postsToDisplay.map((post) => (
          <BlogCard key={post.url} post={post as BlogPost} />
        ))}
      </div>

      <BlogPagination currentPage={validPage} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}

// Skeleton de chargement pour la pagination
function BlogCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-xl border border-fd-border bg-fd-card animate-pulse">
          <div className="aspect-video w-full rounded-t-xl bg-fd-muted" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-4 w-3/4 rounded bg-fd-muted" />
            <div className="h-3 w-full rounded bg-fd-muted" />
            <div className="h-3 w-2/3 rounded bg-fd-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Composant exporté avec Suspense boundary
export function BlogCards(props: BlogCardsProps = {}) {
  return (
    <Suspense fallback={<BlogCardsSkeleton />}>
      <BlogCardsContent {...props} />
    </Suspense>
  );
}
