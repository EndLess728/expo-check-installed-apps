// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://endless728.github.io',
  base: '/expo-check-installed-apps',
  trailingSlash: 'always',
  // The package root's tsconfig.json extends expo-module-scripts, which isn't installed
  // for the docs build. Turn off tsconfig path lookups so Vite doesn't try to load it.
  vite: { resolve: { tsconfigPaths: false } },
  integrations: [
    starlight({
      title: 'expo-check-installed-apps',
      description:
        'Check whether other apps are installed on Android and iOS from Expo and React Native. Query by Android package name or iOS URL scheme, with a config plugin that handles package visibility and LSApplicationQueriesSchemes.',
      logo: { src: './src/assets/logo.svg' },
      favicon: '/favicon.svg',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/EndLess728/expo-check-installed-apps',
        },
        {
          icon: 'npm',
          label: 'npm',
          href: 'https://www.npmjs.com/package/expo-check-installed-apps',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/EndLess728/expo-check-installed-apps/edit/main/docs/',
      },
      lastUpdated: true,
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'keywords',
            content:
              'expo check installed apps, react native check if app is installed, canOpenURL expo, android package visibility expo, LSApplicationQueriesSchemes expo, expo config plugin queries',
          },
        },
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          content: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: 'expo-check-installed-apps',
            description:
              'Check whether apps are installed on Android and iOS from Expo and React Native.',
            codeRepository: 'https://github.com/EndLess728/expo-check-installed-apps',
            programmingLanguage: ['TypeScript', 'Swift', 'Kotlin'],
            license: 'https://opensource.org/licenses/MIT',
            author: { '@type': 'Person', name: 'Mantu', url: 'https://github.com/EndLess728' },
          }),
        },
      ],
      sidebar: [
        {
          label: 'Getting started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Configuration', slug: 'getting-started/configuration' },
            { label: 'Quick start', slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Finding package names & schemes', slug: 'guides/finding-identifiers' },
            { label: 'Open an app or fall back to the store', slug: 'guides/open-or-fallback' },
            { label: 'Platform notes', slug: 'guides/platform-notes' },
            { label: 'Troubleshooting', slug: 'guides/troubleshooting' },
          ],
        },
        {
          label: 'API reference',
          items: [
            { label: 'checkInstalledApps', slug: 'api/check-installed-apps' },
            { label: 'Config plugin', slug: 'api/config-plugin' },
          ],
        },
      ],
    }),
  ],
});
