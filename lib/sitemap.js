import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export async function fetchSitemap(baseUrl) {
  // Ensure baseUrl ends without trailing slash
  const cleanUrl = baseUrl.replace(/\/$/, '');
  const sitemapUrl = `${cleanUrl}/sitemap.xml`;

  try {
    console.log(`Fetching sitemap: ${sitemapUrl}`);
    const response = await axios.get(sitemapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error('sitemap.xml not found. Please ensure the site has a sitemap.xml file.');
    }
    throw new Error(`Failed to fetch sitemap: ${error.message}`);
  }
}

export function parseSitemap(xmlContent) {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_'
  });

  const result = parser.parse(xmlContent);

  // Handle different sitemap structures
  let urls = [];

  if (result.urlset && result.urlset.url) {
    const urlEntries = Array.isArray(result.urlset.url)
      ? result.urlset.url
      : [result.urlset.url];

    urls = urlEntries.map(entry => entry.loc);
  } else if (result.sitemapindex && result.sitemapindex.sitemap) {
    // Handle sitemap index (contains references to other sitemaps)
    throw new Error('Sitemap index detected. Please provide a direct sitemap URL instead of a sitemap index.');
  }

  if (urls.length === 0) {
    throw new Error('No URLs found in sitemap.xml');
  }

  return urls;
}

export async function getSitemapUrls(baseUrl) {
  const xmlContent = await fetchSitemap(baseUrl);
  const urls = parseSitemap(xmlContent);
  console.log(`Found ${urls.length} URLs in sitemap`);
  return urls;
}
