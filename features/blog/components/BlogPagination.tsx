"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function BlogPagination({ currentPage, totalPages, basePath = "/blog" }: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  // Génère les numéros de page à afficher (avec ellipsis)
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    const showEllipsisThreshold = 7;

    if (totalPages <= showEllipsisThreshold) {
      // Affiche toutes les pages si peu nombreuses
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Pages autour de la page courante
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Toujours afficher la dernière page
      pages.push(totalPages);
    }

    return pages;
  };

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {/* Bouton précédent */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors no-underline"
          aria-label="Page précédente"
        >
          <ChevronLeft className="size-4 mr-1" />
          Précédent
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground/50 cursor-not-allowed">
          <ChevronLeft className="size-4 mr-1" />
          Précédent
        </span>
      )}

      {/* Numéros de page */}
      <div className="flex items-center gap-1 mx-2">
        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-fd-muted-foreground">
              …
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page)}
              className={`inline-flex items-center justify-center rounded-md size-9 text-sm font-medium transition-colors no-underline ${
                page === currentPage
                  ? "bg-fd-primary text-fd-primary-foreground"
                  : "text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent"
              }`}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </Link>
          ),
        )}
      </div>

      {/* Bouton suivant */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-accent transition-colors no-underline"
          aria-label="Page suivante"
        >
          Suivant
          <ChevronRight className="size-4 ml-1" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-fd-muted-foreground/50 cursor-not-allowed">
          Suivant
          <ChevronRight className="size-4 ml-1" />
        </span>
      )}
    </nav>
  );
}
