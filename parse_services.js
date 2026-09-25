const fs = require('fs');
const html = fs.readFileSync('services_raw.html', 'utf8');

const regex = /(https?:\/\/[^\s"'<>]+)/g;
const matches = html.match(regex) || [];

const media = matches.filter(url => 
  url.includes('storage.googleapis.com') || 
  url.includes('builderservices.io') ||
  url.includes('.jpg') || 
  url.includes('.png') || 
  url.includes('.webp') ||
  url.includes('unsplash')
);

const unique = [...new Set(media)];
console.log('Total media found:', unique.length);
console.log(JSON.stringify(unique, null, 2));
