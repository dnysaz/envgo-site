import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// GitHub Pages serves a project site from a sub-path, not the domain root.
// Astro applies `base` to its own generated assets and to Starlight's sidebar
// and nav links, but it leaves root-relative links written in Markdown content
// untouched — so `[Installation](/getting-started/installation)` would point at
// the domain root and 404.
//
// This plugin prepends the base to those content links at build time. Keeping it
// here rather than editing 80+ links means the page sources stay portable: to
// move to a custom domain, change BASE to '/' and the content needs no edits.
const BASE = '/envgo-site';

function remarkPrefixBase() {
  const visit = (node) => {
    const isLink = node.type === 'link' || node.type === 'definition';
    if (
      isLink &&
      typeof node.url === 'string' &&
      node.url.startsWith('/') &&
      !node.url.startsWith('//') &&
      node.url !== BASE &&
      !node.url.startsWith(BASE + '/')
    ) {
      node.url = BASE + node.url;
    }
    if (Array.isArray(node.children)) node.children.forEach(visit);
  };
  return (tree) => visit(tree);
}

export default defineConfig({
  site: 'https://dnysaz.github.io',
  base: BASE,
  markdown: {
    remarkPlugins: [remarkPrefixBase],
  },
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
