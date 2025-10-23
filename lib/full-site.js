import fs from 'fs/promises';
import path from 'path';
import { getSitemapUrls } from './sitemap.js';
import { fetchHtml, htmlToMarkdown } from './converter.js';

function getDirectoryName(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/\./g, '-');
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }
}

function getFilePathFromUrl(url, baseDir, preserveStructure) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname.replace(/^\/|\/$/g, '') || 'index';

  if (preserveStructure) {
    // Maintain directory structure: about/team.md
    const parts = pathname.split('/');
    const filename = parts.pop() || 'index';
    const dirs = parts.join('/');
    const safeDirs = dirs.replace(/[^a-zA-Z0-9\/-_]/g, '');
    const safeFilename = filename.replace(/[^a-zA-Z0-9-_]/g, '') || 'index';

    return path.join(baseDir, safeDirs, `${safeFilename}.md`);
  } else {
    // Flat structure: about-team.md
    const flatName = pathname
      .replace(/\//g, '-')
      .replace(/[^a-zA-Z0-9-_]/g, '') || 'index';

    return path.join(baseDir, `${flatName}.md`);
  }
}

async function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export async function convertFullSite(baseUrl, options = {}) {
  const { preserveStructure = false } = options;

  // Get URLs from sitemap
  const urls = await getSitemapUrls(baseUrl);

  // Create output directory
  const outputDir = getDirectoryName(baseUrl);
  await fs.mkdir(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}/`);

  // Convert each page
  let successCount = 0;
  let errorCount = 0;

  for (const url of urls) {
    try {
      console.log(`Fetching: ${url}`);

      const html = await fetchHtml(url);
      const markdown = htmlToMarkdown(html, url);
      const filePath = getFilePathFromUrl(url, outputDir, preserveStructure);

      await ensureDirectoryExists(filePath);
      await fs.writeFile(filePath, markdown, 'utf-8');

      console.log(`✓ Saved: ${filePath}`);
      successCount++;

      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`✗ Failed: ${url} - ${error.message}`);
      errorCount++;
    }
  }

  console.log(`\nCompleted: ${successCount} succeeded, ${errorCount} failed`);
}
