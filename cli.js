#!/usr/bin/env node

import { convertSinglePage } from './lib/single-page.js';
import { convertFullSite } from './lib/full-site.js';

const args = process.argv.slice(2);

function showHelp() {
  console.log(`
Usage:
  npx md-crawler <URL>           Convert single page to Markdown
  npx md-crawler -f <URL>        Convert full site using sitemap.xml
  npx md-crawler -f -d <URL>     Convert full site with directory structure

Examples:
  npx md-crawler https://example.com/page
  npx md-crawler -f https://example.com
  npx md-crawler -f -d https://example.com
`);
}

async function main() {
  if (args.length === 0) {
    showHelp();
    process.exit(1);
  }

  const hasFullSiteFlag = args.includes('-f');
  const hasDirectoryFlag = args.includes('-d');

  // Extract URL (last non-flag argument)
  const url = args.filter(arg => !arg.startsWith('-')).pop();

  if (!url) {
    console.error('Error: URL is required');
    showHelp();
    process.exit(1);
  }

  try {
    if (hasFullSiteFlag) {
      await convertFullSite(url, { preserveStructure: hasDirectoryFlag });
    } else {
      await convertSinglePage(url);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
