const fs = require('fs');
const data = JSON.parse(fs.readFileSync('all_content_detailed.json', 'utf8'));

for (const [url, item] of Object.entries(data)) {
  console.log('====================================');
  console.log('PAGE:', url);
  console.log(item.fullText);
}
