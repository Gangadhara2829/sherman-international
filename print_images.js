const fs = require('fs');
const data = JSON.parse(fs.readFileSync('extracted_site_data.json', 'utf8'));

for (const [url, page] of Object.entries(data)) {
  console.log('=== URL:', url);
  console.log('Images:', page.images);
}
