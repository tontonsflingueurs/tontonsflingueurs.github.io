import { BlogCards } from "@/components/blog-cards";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="py-16 px-6 md:px-8 lg:px-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Tontons Flingueurs</h1>
        <p className="text-xl text-fd-muted-foreground mb-8 max-w-2xl mx-auto">
          Bienvenue sur le wiki de la communaute des Tontons Flingueurs.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/wiki"
            className="px-6 py-3 bg-fd-primary text-fd-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Decouvrir le Wiki
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 border border-fd-border rounded-lg font-medium hover:bg-fd-accent transition-colors">
            Voir le Blog
          </Link>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Derniers articles postés</h2>
          <Link href="/blog" className="text-fd-primary hover:underline font-medium">
            Voir tous les articles
          </Link>
        </div>
        <BlogCards limit={4} />
      </section>
    </main>
  );
}
