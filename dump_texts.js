const fs = require('fs');
const data = JSON.parse(fs.readFileSync('extracted_site_data.json', 'utf8'));

const detailed = {};
for (const [url, info] of Object.entries(data)) {
  detailed[url] = {
    title: info.title,
    fullText: info.fullText,
    images: info.images
  };
}

fs.writeFileSync('all_content_detailed.json', JSON.stringify(detailed, null, 2));
console.log('Written all_content_detailed.json');
