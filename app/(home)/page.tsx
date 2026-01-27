import { BlogCards } from "@/features/blog";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="py-16 px-6 md:px-8 lg:px-12">
      {/* Section hero avec fond decoratif */}
      <section className="relative overflow-hidden">
        {/* Couche 1 : Grille avec masque de fondu */}
        <div className="hero-grid hero-fade-mask absolute inset-0 pointer-events-none" aria-hidden="true" />
        {/* Couche 2 : Halo colore theme-adaptive */}
        <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden="true" />

        {/* Contenu hero */}
        <div className="relative z-10 text-center max-w-6xl mx-auto pt-8 pb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tontons Flingueurs</h1>
          <p className="text-xl text-fd-muted-foreground mb-8 max-w-3xl mx-auto">
            Bienvenu sur le <span className="text-fd-primary font-semibold">Wiki communautaire</span> des Tontons
            Flingueurs, une <span className="text-fd-primary font-semibold">plateforme collaborative</span> où la
            communauté partage <span className="text-fd-primary font-semibold">guides</span>,{" "}
            <span className="text-fd-primary font-semibold">stratégies</span> et{" "}
            <span className="text-fd-primary font-semibold">conseils</span>.
            <br />
            Le contenu est maintenu par une équipe de rédacteurs graphistes passionnés.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/wiki"
              className="px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Decouvrir le Wiki
            </Link>
            <Link
              href="/blog"
              className="px-6 py-3 bg-fd-secondary border border-fd-border rounded-lg font-medium hover:bg-fd-accent transition-colors"
            >
              Voir le Blog
            </Link>
          </div>
        </div>
      </section>

      {/* Section articles recents */}
      <section className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Derniers articles postés</h2>
          <Link href="/blog" className="text-fd-primary hover:underline font-medium">
            Voir tous les articles
          </Link>
        </div>
        <BlogCards limit={4} noPagination />
      </section>

      {/* Section remerciements */}
      <section className="max-w-6xl mx-auto mt-16 border-t border-fd-border pt-8">
        <h2 className="text-2xl font-bold mb-6">Remerciements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xs font-medium text-fd-primary uppercase tracking-wide mb-1">Développement</h3>
            <p className="text-sm text-fd-muted-foreground">Mahzazel</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-fd-primary uppercase tracking-wide mb-1">Rédaction</h3>
            <p className="text-sm text-fd-muted-foreground">Iokee, Perpi-Lyonnais, Skykha, Mahzazel, Dag</p>
          </div>
          <div>
            <h3 className="text-xs font-medium text-fd-primary uppercase tracking-wide mb-1">Graphisme</h3>
            <p className="text-sm text-fd-muted-foreground">Zeld, Phiona, Thalia, Pulse</p>
          </div>
        </div>
      </section>
    </main>
  );
}
