const fs = require('fs');
const data = JSON.parse(fs.readFileSync('extracted_site_data.json', 'utf8'));

for (const [url, info] of Object.entries(data)) {
  console.log('==============================================');
  console.log('URL:', url);
  console.log('Title:', info.title);
  console.log('Images Count:', info.images ? info.images.length : 0);
  if (info.images && info.images.length) {
    console.log('Images Sample:', info.images.slice(0, 5));
  }
  console.log('Text (first 600 chars):');
  console.log(info.fullText ? info.fullText.slice(0, 600) : 'NO TEXT');
}
