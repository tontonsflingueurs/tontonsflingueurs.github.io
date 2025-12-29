import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import packageJson from 'package.json' with { type: 'json' };
import { ColorThemeSwitcher } from './color-theme-switcher';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image src='/logo.png' alt='TTF' width={24} height={24} />
          <span>Tontons Flingueurs</span>
        </>
      ),
    },
    links: [
      {
        type: 'custom',
        secondary: true,
        children: <ColorThemeSwitcher />,
      },
    ],
    githubUrl: packageJson.repository.url,
    themeSwitch: {
      enabled: true,
      mode: 'light-dark-system',
    },
  };
}
