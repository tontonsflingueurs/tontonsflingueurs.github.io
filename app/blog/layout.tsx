import { baseOptions } from "@/components/layout-shared";
import { blogSource } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { PropsWithChildren } from "react";

export default function BlogLayout({ children }: PropsWithChildren) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={blogSource.getPageTree()}
      tabMode="navbar"
      sidebar={{
        tabs: [
          {
            title: "Accueil",
            description: "Page d'accueil du site",
            url: "/",
          },
          {
            title: "Wiki",
            description: "Documentation et guides",
            url: "/wiki",
          },
          {
            title: "Blog",
            description: "Annonces et articles",
            url: "/blog",
          },
        ],
      }}>
      {children}
    </DocsLayout>
  );
}
