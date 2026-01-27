import { baseOptions } from "@/config/layout";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/notebook";
import type { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <DocsLayout
      {...baseOptions()}
      tree={source.getPageTree()}
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
      }}
    >
      {children}
    </DocsLayout>
  );
}
