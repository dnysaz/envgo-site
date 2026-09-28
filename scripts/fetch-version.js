#!/usr/bin/env node
// Fetch latest release version from GitHub API and replace {APP_VERSION} in built HTML

import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

async function fetchLatestVersion() {
  // A wrong version here is worse than no deploy at all: the install page
  // would tell people to install a tag that does not exist. Fail the build
  // instead of inventing a fallback.
  const response = await fetch('https://api.github.com/repos/dnysaz/envgo/releases/latest', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'envgo-docs-build'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API returned ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const version = data.tag_name;
  if (!version || !/^v?\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`GitHub API returned an unusable tag_name: ${JSON.stringify(data.tag_name)}`);
  }

  process.env.PUBLIC_APP_VERSION = version;
  console.log(`Set PUBLIC_APP_VERSION=${version}`);

  return version;
}

function getHtmlFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = resolve(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

function replaceVersionInHtml(version) {
  const htmlFiles = getHtmlFiles(distDir);
  let touched = 0;

  for (const file of htmlFiles) {
    let content = readFileSync(file, 'utf-8');
    const replaced = content.replace(/\{APP_VERSION\}/g, version);

    if (content !== replaced) {
      writeFileSync(file, replaced, 'utf-8');
      console.log(`Updated version in ${file.replace(distDir + '/', '')}`);
      touched++;
    }
  }

  return { scanned: htmlFiles.length, touched };
}

// versionBearingSources lists the source files that use the {APP_VERSION}
// placeholder. The check below asserts these specific pages, not "some page
// mentions the version": a generic check passes as long as any one page was
// updated, which is exactly the drift we are trying to catch.
const versionBearingSources = [
  'src/content/docs/download.mdx',
  'src/content/docs/getting-started/installation.mdx',
];

function expectedPageFor(sourcePath) {
  const rel = sourcePath
    .replace(/^src\/content\/docs\//, '')
    .replace(/\.(md|mdx)$/, '');
  return resolve(distDir, rel, 'index.html');
}

function verifyVersionInHtml(version) {
  const problems = [];
  const checked = [];

  for (const source of versionBearingSources) {
    const sourcePath = resolve(rootDir, source);
    const content = readFileSync(sourcePath, 'utf-8');

    if (!content.includes('{APP_VERSION}')) {
      problems.push(
        `${source}: no longer contains {APP_VERSION}. If the version moved elsewhere, update versionBearingSources in scripts/fetch-version.js.`
      );
      continue;
    }

    const page = expectedPageFor(source);
    if (!existsSync(page)) {
      problems.push(`${source}: expected build output is missing (${page.replace(rootDir + '/', '')})`);
      continue;
    }

    const html = readFileSync(page, 'utf-8');
    if (html.includes('{APP_VERSION}')) {
      problems.push(`${page.replace(rootDir + '/', '')}: placeholder was never substituted`);
    } else if (!html.includes(version)) {
      problems.push(`${page.replace(rootDir + '/', '')}: does not mention ${version}`);
    } else {
      checked.push(page.replace(rootDir + '/', ''));
    }
  }

  if (checked.length === 0) {
    problems.push(`no expected page was updated with ${version}`);
  }

  if (problems.length > 0) {
    throw new Error(
      `Version injection check failed for ${version}:\n  - ${problems.join('\n  - ')}`
    );
  }

  console.log(`Verified ${version} in: ${checked.join(', ')}`);
}

async function main() {
  // Resolve the version before building so a transient API failure costs
  // nothing and never reaches the published site.
  const version = await fetchLatestVersion();

  // Run astro build
  console.log('Running astro build...');
  execSync('astro build', { cwd: rootDir, stdio: 'inherit' });

  // Post-process HTML files
  console.log('Post-processing HTML files...');
  const { scanned, touched } = replaceVersionInHtml(version);
  console.log(`Scanned ${scanned} pages, rewrote ${touched}.`);

  // Refuse to publish a page whose version we cannot confirm.
  verifyVersionInHtml(version);

  console.log('Build complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});