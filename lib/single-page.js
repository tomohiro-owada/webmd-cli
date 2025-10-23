import fs from 'fs/promises';
import path from 'path';
import { fetchHtml, htmlToMarkdown, urlToFilename } from './converter.js';

function getDirectoryAndFilename(url) {
  const urlObj = new URL(url);
  const hostname = urlObj.hostname.replace(/\./g, '-');
  const pathname = urlObj.pathname
    .replace(/^\/|\/$/g, '')  // Remove leading/trailing slashes
    .replace(/\//g, '-')       // Replace slashes with dashes
    .replace(/[^a-zA-Z0-9-_]/g, '') // Remove special chars
    || 'index';

  return {
    directory: hostname,
    filename: `${pathname}.md`
  };
}

export async function convertSinglePage(url) {
  console.log(`Fetching: ${url}`);

  const html = await fetchHtml(url);
  const markdown = htmlToMarkdown(html, url);

  const { directory, filename } = getDirectoryAndFilename(url);
  const filePath = path.join(directory, filename);

  await fs.mkdir(directory, { recursive: true });
  await fs.writeFile(filePath, markdown, 'utf-8');

  console.log(`✓ Saved: ${filePath}`);
}
