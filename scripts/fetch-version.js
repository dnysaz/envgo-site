#!/usr/bin/env node
// Fetch latest release version from GitHub API and replace {APP_VERSION} in built HTML

import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, '..');
const distDir = resolve(rootDir, 'dist');

async function fetchLatestVersion() {
  try {
    const response = await fetch('https://api.github.com/repos/dnysaz/envgo/releases/latest', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'envgo-docs-build'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const version = data.tag_name || 'dev';
    
    process.env.PUBLIC_APP_VERSION = version;
    console.log(`Set PUBLIC_APP_VERSION=${version}`);
    
    return version;
  } catch (error) {
    console.warn('Failed to fetch version from GitHub API, using fallback:', error.message);
    process.env.PUBLIC_APP_VERSION = 'dev';
    return 'dev';
  }
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
  
  for (const file of htmlFiles) {
    let content = readFileSync(file, 'utf-8');
    const replaced = content.replace(/\{APP_VERSION\}/g, version);
    
    if (content !== replaced) {
      writeFileSync(file, replaced, 'utf-8');
      console.log(`Updated version in ${file.replace(distDir + '/', '')}`);
    }
  }
}

async function main() {
  const version = await fetchLatestVersion();
  
  // Run astro build
  console.log('Running astro build...');
  execSync('astro build', { cwd: rootDir, stdio: 'inherit' });
  
  // Post-process HTML files
  console.log('Post-processing HTML files...');
  replaceVersionInHtml(version);
  
  console.log('Build complete!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});