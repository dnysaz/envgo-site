import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'envGo',
      sidebar: [
        {
          label: 'Download',
          slug: 'download',
        },
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
          ],
        },
        {
          label: 'Core Concepts',
          items: [
            { label: 'How It Works', slug: 'core-concepts/how-it-works' },
            { label: 'Security Model', slug: 'core-concepts/security-model' },
            { label: 'Environment Variables', slug: 'core-concepts/environment-variables' },
          ],
        },
        {
          label: 'Modes',
          items: [
            { label: 'Local Mode', slug: 'modes/local-mode' },
            { label: 'Public Mode', slug: 'modes/public-mode' },
          ],
        },
        {
          label: 'Guides',
          items: [
            { label: 'Deploy to VPS', slug: 'guides/deploy-to-vps' },
            { label: 'TLS / HTTPS', slug: 'guides/tls-https' },
            { label: 'PHP Support', slug: 'guides/php-support' },
            { label: 'Docker Deployment', slug: 'guides/docker-deployment' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'CLI Commands', slug: 'reference/cli-commands' },
            { label: 'Configuration', slug: 'reference/configuration' },
            { label: 'Threat Model', slug: 'reference/threat-model' },
          ],
        },
      ],
    }),
  ],
});
