const fs = require('fs');
const path = require('path');

const pageSlugs = [
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
  'contact-us',
  'home'
];

function extractSiteJson(html) {
  const m = html.match(/window\._site\s*=\s*(\{[\s\S]*?\});(?:\s*window|\s*<\/script>)/);
  if (m) {
    try {
      return JSON.parse(m[1]);
    } catch (e) {
      // try eval safe in sandbox
      try {
        const fn = new Function('return ' + m[1]);
        return fn();
      } catch (e2) {
        console.error('Failed to parse window._site json', e2.message);
      }
    }
  }
  return null;
}

async function run() {
  const extractedPages = {};

  for (const slug of pageSlugs) {
    const rawFile = path.join(__dirname, `raw_${slug}.html`);
    if (!fs.existsSync(rawFile)) continue;
    const html = fs.readFileSync(rawFile, 'utf8');
    const siteObj = extractSiteJson(html);
    if (!siteObj) {
      console.log('No window._site found in', slug);
      continue;
    }

    // find the active page in siteObj.pages
    const activePage = siteObj.pages.find(p => p.uriPath === slug || (slug === 'home' && p.id === 'home')) || siteObj.pages[0];
    
    extractedPages[slug] = {
      title: activePage ? activePage.title : slug,
      uriPath: activePage ? activePage.uriPath : slug,
      sections: activePage ? activePage.sections : [],
      allPages: siteObj.pages.map(p => ({
        id: p.id,
        title: p.title,
        uriPath: p.uriPath,
        sectionsCount: (p.sections || []).length
      })),
      navigation: siteObj.navigation,
      globalBinding: siteObj.globalBinding
    };
  }

  fs.writeFileSync(path.join(__dirname, 'complete_extracted_schema.json'), JSON.stringify(extractedPages, null, 2));
  console.log('Saved complete_extracted_schema.json');

  // Print summary of each category and its exact sections
  for (const [slug, data] of Object.entries(extractedPages)) {
    console.log(`\n================== PAGE: ${slug} (${data.title}) ==================`);
    if (data.sections && data.sections.length > 0) {
      data.sections.forEach((s, idx) => {
        const b = s.binding || {};
        console.log(`  [Section ${idx + 1}] Title: "${b.title || ''}" | Subtitle: "${(b.subtitle || '').slice(0, 80)}..." | Image: ${b.image?.value || 'none'}`);
      });
    } else {
      console.log('  No direct sections array on this page object in current payload.');
    }
  }
}

run();
