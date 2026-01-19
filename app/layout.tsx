import { ColorThemeProvider } from '@/components/color-theme-provider';
import { devTitle } from '@/utils/dev-title';
import { RootProvider } from 'fumadocs-ui/provider/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

// Titre dynamique selon l'environnement (dev vs prod)
const defaultTitle = devTitle('Tontons Flingueurs');

export const metadata: Metadata = {
  metadataBase: new URL('https://tontonsflingueurs.github.io'),
  title: defaultTitle,
  description: 'Wiki et blog communautaire des Tontons Flingueurs',
  openGraph: {
    title: defaultTitle,
    description: 'Wiki et blog communautaire des Tontons Flingueurs',
    images: [{ url: '/wiki/banniere.webp' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: 'Wiki et blog communautaire des Tontons Flingueurs',
    images: ['/wiki/banniere.webp'],
  },
};

// Script pour appliquer le theme avant l'hydratation (evite le flash)
// Initialise localStorage avec "red" si aucune valeur n'existe
const colorThemeScript = `
(function() {
  try {
    // Liste des themes valides - doit correspondre a lib/themes.ts
    var validThemes = ['red', 'green', 'blue', 'purple', 'black', 'orange', 'cyan'];
    var defaultTheme = 'red';
    var theme = localStorage.getItem('color-theme');
    if (!theme || !validThemes.includes(theme)) {
      theme = defaultTheme;
      localStorage.setItem('color-theme', theme);
    }
    document.body.setAttribute('data-theme', theme);
  } catch (e) {
    document.body.setAttribute('data-theme', 'red');
  }
})();
`;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <html lang='fr' className={inter.className} suppressHydrationWarning>
      <body className='flex flex-col min-h-screen' suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: colorThemeScript }} suppressHydrationWarning />
        <RootProvider search={{ options: { type: 'static' } }}>
          <ColorThemeProvider>{children}</ColorThemeProvider>
        </RootProvider>
      </body>
    </html>
  );
}
