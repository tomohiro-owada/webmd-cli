import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

export async function fetchHtml(url) {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch ${url}: ${error.message}`);
  }
}

function toAbsoluteUrl(url, baseUrl) {
  if (!url) return '';
  try {
    // If already absolute, return as-is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    // Convert relative to absolute
    return new URL(url, baseUrl).href;
  } catch (error) {
    return url; // Return original if conversion fails
  }
}

export function htmlToMarkdown(html, baseUrl) {
  const $ = cheerio.load(html);

  // Extract body content
  const bodyHtml = $('body').html() || html;

  // Initialize Turndown with configuration
  const turndownService = new TurndownService({
    headingStyle: 'atx',  // Use # for headings
    codeBlockStyle: 'fenced',
    bulletListMarker: '-'
  });

  // Ensure images are kept with their URLs: ![](url)
  turndownService.addRule('images', {
    filter: 'img',
    replacement: (content, node) => {
      const src = node.getAttribute('src') || '';
      const alt = node.getAttribute('alt') || '';
      const absoluteSrc = toAbsoluteUrl(src, baseUrl);
      return `![${alt}](${absoluteSrc})`;
    }
  });

  // Ensure links are kept: [text](url)
  turndownService.addRule('links', {
    filter: 'a',
    replacement: (content, node) => {
      const href = node.getAttribute('href') || '';
      const absoluteHref = toAbsoluteUrl(href, baseUrl);
      return `[${content}](${absoluteHref})`;
    }
  });

  const markdown = turndownService.turndown(bodyHtml);
  return markdown;
}

export function urlToFilename(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace(/\./g, '-');
    const pathname = urlObj.pathname
      .replace(/^\/|\/$/g, '')  // Remove leading/trailing slashes
      .replace(/\//g, '-')       // Replace slashes with dashes
      .replace(/[^a-zA-Z0-9-_]/g, '') // Remove special chars
      || 'index';

    return `${hostname}-${pathname}.md`;
  } catch (error) {
    throw new Error(`Invalid URL: ${url}`);
  }
}
