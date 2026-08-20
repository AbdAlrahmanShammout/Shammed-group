import fs from 'node:fs';
import path from 'node:path';

import type { Plugin } from 'vite';

type SeoPrerenderRoute = {
  readonly description: string;
  readonly outputDirectory: string;
  readonly path: string;
  readonly title: string;
};

const SITE_NAME = 'Shammed Group';
const DEFAULT_PUBLIC_SITE_URL = 'http://localhost:5173';

const PRERENDER_ROUTES: readonly SeoPrerenderRoute[] = [
  {
    path: '/',
    outputDirectory: '.',
    title: 'Home',
    description:
      'Shammed Group supplies pharmaceutical and healthcare products through trusted regional partners.',
  },
  {
    path: '/about',
    outputDirectory: 'about',
    title: 'About',
    description:
      'Learn about Shammed Group’s vision, mission, values, and capabilities in healthcare distribution.',
  },
  {
    path: '/partners',
    outputDirectory: 'partners',
    title: 'Partners',
    description:
      'Explore Shammed Group’s partner network across pharmaceutical and healthcare markets.',
  },
  {
    path: '/products',
    outputDirectory: 'products',
    title: 'Products',
    description:
      'Browse Shammed Group’s product catalog by category, including manufacturer and partner details.',
  },
  {
    path: '/services',
    outputDirectory: 'services',
    title: 'Services',
    description:
      'Review Shammed Group services spanning distribution, logistics, and healthcare support.',
  },
  {
    path: '/contact',
    outputDirectory: 'contact',
    title: 'Contact',
    description:
      'Contact Shammed Group by email, phone, location, or the online inquiry form.',
  },
];

function normalizeSiteUrl(value: string): string {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

function buildPageTitle(pageTitle: string): string {
  if (pageTitle === '' || pageTitle === SITE_NAME) {
    return SITE_NAME;
  }
  return `${pageTitle} | ${SITE_NAME}`;
}

function createCanonicalUrl(siteUrl: string, routePath: string): string {
  if (routePath === '/') {
    return `${siteUrl}/`;
  }
  return `${siteUrl}${routePath}`;
}

function upsertHtmlMeta(html: string, attribute: 'name' | 'property', key: string, content: string): string {
  const pattern = new RegExp(`<meta\\s+${attribute}="${key}"\\s+content="[^"]*"\\s*/?>`, 'i');
  const tag = `<meta ${attribute}="${key}" content="${content}" />`;
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertCanonical(html: string, href: string): string {
  const pattern = /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i;
  const tag = `<link rel="canonical" href="${href}" />`;
  if (pattern.test(html)) {
    return html.replace(pattern, tag);
  }
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

function upsertTitle(html: string, title: string): string {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
}

function createRobotsTxt(siteUrl: string): string {
  return [`User-agent: *`, `Allow: /`, `Disallow: /admin`, ``, `Sitemap: ${siteUrl}/sitemap.xml`, ``].join(
    '\n',
  );
}

function createSitemapXml(siteUrl: string): string {
  const urls = PRERENDER_ROUTES.map((route) => {
    const loc = createCanonicalUrl(siteUrl, route.path);
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  }).join('\n');
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
    ``,
  ].join('\n');
}

function createPrerenderHtml(baseHtml: string, route: SeoPrerenderRoute, siteUrl: string): string {
  const title = buildPageTitle(route.title);
  const canonicalUrl = createCanonicalUrl(siteUrl, route.path);
  let html = upsertTitle(baseHtml, title);
  html = upsertHtmlMeta(html, 'name', 'description', route.description);
  html = upsertHtmlMeta(html, 'property', 'og:title', title);
  html = upsertHtmlMeta(html, 'property', 'og:description', route.description);
  html = upsertHtmlMeta(html, 'property', 'og:type', 'website');
  html = upsertHtmlMeta(html, 'property', 'og:url', canonicalUrl);
  html = upsertCanonical(html, canonicalUrl);
  return html;
}

/**
 * Writes robots.txt, sitemap.xml, and per-route HTML shells with SEO tags after Vite build.
 */
export function seoStaticAssetsPlugin(): Plugin {
  let outDir = 'dist';
  let rootDirectory = process.cwd();
  return {
    name: 'seo-static-assets',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
      rootDirectory = config.root;
    },
    closeBundle() {
      const siteUrl = normalizeSiteUrl(
        process.env.VITE_PUBLIC_SITE_URL || DEFAULT_PUBLIC_SITE_URL,
      );
      const distDirectory = path.resolve(rootDirectory, outDir);
      const indexHtmlPath = path.join(distDirectory, 'index.html');
      if (!fs.existsSync(indexHtmlPath)) {
        return;
      }
      const baseHtml = fs.readFileSync(indexHtmlPath, 'utf8');
      fs.writeFileSync(path.join(distDirectory, 'robots.txt'), createRobotsTxt(siteUrl));
      fs.writeFileSync(path.join(distDirectory, 'sitemap.xml'), createSitemapXml(siteUrl));
      for (const route of PRERENDER_ROUTES) {
        const html = createPrerenderHtml(baseHtml, route, siteUrl);
        if (route.outputDirectory === '.') {
          fs.writeFileSync(indexHtmlPath, html);
          continue;
        }
        const routeDirectory = path.join(distDirectory, route.outputDirectory);
        fs.mkdirSync(routeDirectory, { recursive: true });
        fs.writeFileSync(path.join(routeDirectory, 'index.html'), html);
      }
    },
  };
}
