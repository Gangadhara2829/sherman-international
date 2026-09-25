const fs = require('fs');
const path = require('path');

// Let's inspect the HTML of each product page
const pages = [
  'flow-measurement',
  'process-switches',
  'balancing-machine',
  'process-technology',
  'vibration-monitoring-system',
  'combustion-control',
  'fluid-control',
  'ohe-fitttings-and-accessories-',
  'products',
  'services',
  'industries',
  'about-us',
  'home'
];

for (const p of pages) {
  const file = path.join(__dirname, `raw_${p}.html`);
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  console.log(`=== Page: ${p} (Size: ${content.length}) ===`);
}
