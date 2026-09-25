const https = require('https');
const fs = require('fs');

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

function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, data }));
    }).on('error', (err) => resolve({ url, error: err.message }));
  });
}

async function run() {
  const results = await Promise.all(urls.map(fetchUrl));
  const summary = {};
  for (const r of results) {
    if (r.error || !r.data) {
      summary[r.url] = { error: r.error };
      continue;
    }
    const clean = r.data.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    const text = clean.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    
    // find all img tags
    const imgMatches = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
    let m;
    while ((m = imgRegex.exec(r.data)) !== null) {
      imgMatches.push(m[1]);
    }
    
    // find all links
    const links = [];
    const linkRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    while ((m = linkRegex.exec(r.data)) !== null) {
      links.push({ href: m[1], text: m[2].replace(/<[^>]+>/g, '').trim() });
    }

    summary[r.url] = {
      title: (r.data.match(/<title>(.*?)<\/title>/i) || [])[1] || '',
      fullText: text,
      images: imgMatches,
      links: links
    };
  }
  fs.writeFileSync('extracted_site_data.json', JSON.stringify(summary, null, 2));
  console.log('Saved extracted_site_data.json with ' + Object.keys(summary).length + ' pages');
}

run();
