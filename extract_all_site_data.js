const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://www.sherman-india.com/',
  'https://www.sherman-india.com/products',
  'https://www.sherman-india.com/services',
  'https://www.sherman-india.com/industries',
  'https://www.sherman-india.com/about-us',
  'https://www.sherman-india.com/contact-us',
  'https://www.sherman-india.com/flow-measurement',
  'https://www.sherman-india.com/process-switches',
  'https://www.sherman-india.com/balancing-machine',
  'https://www.sherman-india.com/process-technology',
  'https://www.sherman-india.com/vibration-monitoring-system',
  'https://www.sherman-india.com/combustion-control',
  'https://www.sherman-india.com/fluid-control',
  'https://www.sherman-india.com/ohe-fitttings-and-accessories-'
];

function fetchPage(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, data }));
    }).on('error', (err) => resolve({ url, error: err.message }));
  });
}

async function run() {
  console.log('Fetching all 14 pages from sherman-india.com...');
  const results = await Promise.all(urls.map(fetchPage));
  const fullData = {};

  for (const r of results) {
    if (r.error || !r.data) {
      console.log('Error fetching', r.url, r.error);
      continue;
    }
    
    // Extract title
    const titleMatch = r.data.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract all image urls (including encoded ones in builderservices)
    const images = new Set();
    
    // regex for url(...) or src="..."
    const regex1 = /(?:url\(['"]?|src=['"])(https?:[^'")\s]+)/gi;
    let m;
    while ((m = regex1.exec(r.data)) !== null) {
      let imgUrl = m[1].replace(/&amp;/g, '&');
      if (imgUrl.includes('builderservices.io') || imgUrl.includes('storage.googleapis.com') || imgUrl.includes('unsplash.com')) {
        images.add(imgUrl);
      }
    }

    // Also look for data-src or background-image inline or JSON payloads inside scripts
    const regex2 = /https%3A%2F%2Fstorage\.googleapis\.com[^"'\s&]+/gi;
    while ((m = regex2.exec(r.data)) !== null) {
      const decoded = decodeURIComponent(m[0]);
      images.add(decoded);
    }

    const regex3 = /https:\/\/storage\.googleapis\.com\/production-bigrock-v1-0-4\/[^"'\s\)]+/gi;
    while ((m = regex3.exec(r.data)) !== null) {
      images.add(m[0]);
    }

    // Clean text
    const clean = r.data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    const text = clean.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    fullData[r.url] = {
      title,
      images: Array.from(images),
      rawHtmlLength: r.data.length,
      fullText: text
    };
  }

  fs.writeFileSync(path.join(__dirname, 'full_scraped_audit.json'), JSON.stringify(fullData, null, 2));
  console.log('Finished full scrape. Total pages:', Object.keys(fullData).length);
  for (const [url, d] of Object.entries(fullData)) {
    console.log(`\nURL: ${url}`);
    console.log(`Title: ${d.title}`);
    console.log(`Images (${d.images.length}):`, d.images.slice(0, 5));
  }
}

run();
