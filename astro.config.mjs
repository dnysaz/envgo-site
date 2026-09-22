import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Custom domain: envgo.dev serves from root, so BASE is "/".
// Keep remarkPrefixBase portable: it no-ops when BASE is "/".
const BASE = '/';

function remarkPrefixBase() {
  if (BASE === '/' || BASE === '') return () => {};
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
  site: 'https://envgo.dev',
  base: BASE,
  markdown: {
    remarkPlugins: [remarkPrefixBase],
  },
  integrations: [
    starlight({
      title: 'envGo',
      description: 'Keep .env values out of the browser safe and securely. One Go binary serves your static site and injects .env secrets server-side — no Node, no build, secrets never reach the browser.',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      head: [
        // Favicon & icons
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' } },
        { tag: 'link', attrs: { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#007d9c' } },
        // OG
        { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
        { tag: 'meta', attrs: { property: 'og:url', content: 'https://envgo.dev/' } },
        { tag: 'meta', attrs: { property: 'og:title', content: 'envGo — Keep .env values out of the browser' } },
        { tag: 'meta', attrs: { property: 'og:description', content: 'Zero-dependency Go binary that serves your static HTML and injects .env secrets server-side. No Node, no build — secrets never reach the browser. MIT, no telemetry.' } },
        { tag: 'meta', attrs: { property: 'og:image', content: 'https://envgo.dev/og-image.png' } },
        { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
        { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
        { tag: 'meta', attrs: { property: 'og:image:alt', content: 'envGo — Keep .env values out of the browser safe and securely' } },
        // Twitter
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        { tag: 'meta', attrs: { name: 'twitter:title', content: 'envGo — Keep .env values out of the browser' } },
        { tag: 'meta', attrs: { name: 'twitter:description', content: 'One Go binary serves your static site and injects .env secrets server-side. No Node, no build.' } },
        { tag: 'meta', attrs: { name: 'twitter:image', content: 'https://envgo.dev/og-image.png' } },
        // SEO
        { tag: 'link', attrs: { rel: 'canonical', href: 'https://envgo.dev/' } },
        { tag: 'meta', attrs: { name: 'keywords', content: 'envGo, Go, .env, environment variables, static site, vanilla JS, secrets, proxy, API key, zero-dependency' } },
        { tag: 'meta', attrs: { name: 'author', content: 'Ketut Dana' } },
      ],
      customCss: ['./src/styles/custom.css'],
      components: {
        Hero: './src/components/Hero.astro',
        Footer: './src/components/Footer.astro',
        SiteTitle: './src/components/SiteTitle.astro',
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/dnysaz/envgo' }],
      editLink: { baseUrl: 'https://github.com/dnysaz/envgo-site/edit/main/' },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Download',
          slug: 'download',
        },
        {
          label: 'Comparison',
          slug: 'reference/comparison',
        },
        {
          label: 'License & feedback',
          slug: 'license',
        },
        {
          label: 'Getting Started',
          items: [
            { label: 'Introduction', slug: 'getting-started/introduction' },
            { label: 'Installation', slug: 'getting-started/installation' },
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'Project Structure', slug: 'getting-started/project-structure' },
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
