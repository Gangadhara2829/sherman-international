const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const html = fs.readFileSync('raw_industries.html', 'utf8');
const m = html.match(/window\._site\s*=\s*(\{[\s\S]*?\});(?:\s*window|\s*<\/script>)/);

function downloadImage(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return resolve(true);
    }
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { timeout: 15000 }, (res) => {
      if (res.statusCode === 200 || res.statusCode === 302 || res.statusCode === 301) {
        if (res.headers.location) {
          downloadImage(res.headers.location, destPath).then(resolve);
          return;
        }
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

async function run() {
  if (!m) return console.log('No window._site found');
  const obj = JSON.parse(m[1]);
  const page = obj.pages.find(p => p.uriPath === 'industries');
  const section = page.sections[0];
  const list = section.binding.list;

  const destDir = path.join(__dirname, 'public', 'images', 'industries');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  const results = [];

  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    const cleanTitle = item.title.replace(/<[^>]+>/g, '').trim();
    const imgUrl = item.image ? item.image.value : '';
    const slug = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const localFilename = `${slug}.jpg`;
    const localPath = path.join(destDir, localFilename);

    console.log(`[${i+1}] ${cleanTitle}`);
    console.log(`    URL: ${imgUrl}`);

    let localUrl = null;
    if (imgUrl) {
      const ok = await downloadImage(imgUrl, localPath);
      if (ok) {
        localUrl = `/images/industries/${localFilename}`;
        console.log(`    Downloaded -> ${localUrl}`);
      } else {
        console.log(`    Failed to download image`);
      }
    }

    results.push({
      name: cleanTitle,
      slug,
      originalImageUrl: imgUrl,
      localImageUrl: localUrl,
      description: item.description && !item.description.includes('Describe your product') ? item.description : `Specialized engineering and instrumentation solutions for the ${cleanTitle}.`
    });
  }

  fs.writeFileSync('original_industries.json', JSON.stringify(results, null, 2));
}

run();
