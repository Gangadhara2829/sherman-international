const https = require('https');
const http = require('http');
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

function fetchWithRetry(url, retries = 3) {
  return new Promise((resolve) => {
    const attempt = (n) => {
      const req = https.get(url, { timeout: 15000 }, (res) => {
        let d = '';
        res.on('data', chunk => d += chunk);
        res.on('end', () => resolve(d));
      });
      req.on('timeout', () => {
        req.destroy();
        if (n > 0) setTimeout(() => attempt(n - 1), 1000);
        else resolve('');
      });
      req.on('error', (e) => {
        if (n > 0) setTimeout(() => attempt(n - 1), 1000);
        else resolve('');
      });
    };
    attempt(retries);
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return resolve(true); // already downloaded
    }
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(destPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    });
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.on('error', () => resolve(false));
  });
}

async function analyze() {
  const outputDir = path.join(__dirname, 'public', 'images', 'original');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const detailedAudit = [];

  for (const url of urls) {
    const pageSlug = url.replace('https://www.sherman-india.com/', '').replace('/', '') || 'home';
    console.log('Fetching:', pageSlug);
    const html = await fetchWithRetry(url);
    if (!html) {
      console.log('Failed to fetch', pageSlug);
      continue;
    }
    
    fs.writeFileSync(path.join(__dirname, `raw_${pageSlug}.html`), html);

    const gcsMatches = [];
    const gcsRegex = /https%3A%2F%2Fstorage\.googleapis\.com%2Fproduction-bigrock-v1-0-4%2F884%2F1564884%2FuegNzVVS%2F([a-zA-Z0-9]+)/gi;
    let m;
    while ((m = gcsRegex.exec(html)) !== null) {
      gcsMatches.push(m[1]);
    }
    const directRegex = /https:\/\/storage\.googleapis\.com\/production-bigrock-v1-0-4\/884\/1564884\/uegNzVVS\/([a-zA-Z0-9]+)/gi;
    while ((m = directRegex.exec(html)) !== null) {
      gcsMatches.push(m[1]);
    }

    const uniqueHashes = Array.from(new Set(gcsMatches));
    console.log(`Page ${pageSlug} unique images:`, uniqueHashes.length);

    const downloadedImages = [];
    for (const hash of uniqueHashes) {
      const gcsUrl = `https://storage.googleapis.com/production-bigrock-v1-0-4/884/1564884/uegNzVVS/${hash}`;
      const localFilename = `${pageSlug}_${hash}.jpg`;
      const localPath = path.join(outputDir, localFilename);
      const ok = await downloadImage(gcsUrl, localPath);
      if (ok) {
        downloadedImages.push({
          hash,
          localUrl: `/images/original/${localFilename}`,
          remoteUrl: gcsUrl
        });
      }
    }

    detailedAudit.push({
      url,
      pageSlug,
      images: downloadedImages
    });
  }

  fs.writeFileSync(path.join(__dirname, 'downloaded_assets_map.json'), JSON.stringify(detailedAudit, null, 2));
  console.log('All pages processed and mapped successfully.');
}

analyze();
