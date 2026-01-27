"use client";

import Image from "next/image";
import { useId } from "react";
import { getAuthorsFromIds, getAvatarUrl } from "../utils";

interface AuthorBannerProps {
  authorIds?: string[];
}

// Auteur par defaut si aucun auteur n'est specifie
const DEFAULT_AUTHOR = {
  id: "default",
  name: "L'équipe rédactrice",
  role: "Responsable Rush Royale",
  github: undefined,
};

export function AuthorBanner({ authorIds }: AuthorBannerProps) {
  const baseId = useId();
  const authors = authorIds && authorIds.length > 0 ? getAuthorsFromIds(authorIds) : [DEFAULT_AUTHOR];

  return (
    <div className="mt-4 mb-4 rounded-xl border border-fd-border bg-fd-card/50">
      <div className="px-4 py-2 border-b border-fd-border">
        <span className="text-xs font-medium text-fd-primary uppercase tracking-wide">Écrit par</span>
      </div>
      <div className="flex flex-wrap items-center gap-8 p-4 pl-8">
        {authors.map((author, index) => (
          <div key={`${baseId}-${index}`} className="flex items-center gap-3">
            {/* Avatar */}
            <Image src={getAvatarUrl(author.github)} alt={author.name} width={48} height={48} className="rounded-lg" />

            {/* Nom et role */}
            <div className="flex flex-col">
              <span className="font-semibold text-fd-foreground text-sm">{author.name}</span>
              {author.role && <span className="text-xs text-fd-muted-foreground">{author.role}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
