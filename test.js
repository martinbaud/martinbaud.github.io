const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (e) {
    console.log(`  \x1b[31m✗\x1b[0m ${name}`);
    console.log(`    ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const html = fs.readFileSync('index.html', 'utf8');

// ============================================================================
console.log('\nHTML Structure:\n');

test('has DOCTYPE', () => {
  assert(html.startsWith('<!DOCTYPE html>'), 'Missing DOCTYPE');
});

test('has html lang attribute', () => {
  assert(html.includes('<html lang="en">'), 'Missing lang attribute');
});

test('has meta charset', () => {
  assert(html.includes('charset="UTF-8"'), 'Missing charset');
});

test('has meta viewport', () => {
  assert(html.includes('name="viewport"'), 'Missing viewport');
});

test('has title', () => {
  assert(html.includes('<title>') && html.includes('</title>'), 'Missing title');
});

test('has favicon', () => {
  assert(html.includes('rel="icon"'), 'Missing favicon');
});

test('has VT323 font', () => {
  assert(html.includes('VT323'), 'Missing Minecraft font VT323');
});

// ============================================================================
console.log('\nHeader:\n');

test('has name Martin Baud', () => {
  assert(html.includes('Martin Baud'), 'Missing name');
});

test('has tagline', () => {
  assert(html.includes('OSS Builder'), 'Missing tagline');
});

test('has avatar from GitHub', () => {
  assert(html.includes('github.com/martinbaud.png'), 'Missing GitHub avatar');
});

test('has portal button', () => {
  assert(html.includes('Enter Portal'), 'Missing portal button');
});

test('has download CV button', () => {
  assert(html.includes('Download CV'), 'Missing CV button');
});

// ============================================================================
console.log('\nContact & Social Links:\n');

const socials = [
  { name: 'email', match: 'martinbaud.git@gmail.com' },
  { name: 'location', match: 'Paris, France' },
  { name: 'GitHub', match: 'github.com/martinbaud' },
  { name: 'LinkedIn', match: 'linkedin.com/in/martinbaud' },
  { name: 'X/Twitter', match: 'x.com/martiin_bd' },
  { name: 'Instagram', match: 'instagram.com/_tiinmar_' },
  { name: 'SoundCloud', match: 'soundcloud.com/shaka-5555' },
];

socials.forEach(s => {
  test(`has ${s.name}`, () => {
    assert(html.includes(s.match), `Missing ${s.name}: ${s.match}`);
  });
});

// ============================================================================
console.log('\nCV Sections:\n');

test('has Profile section', () => {
  assert(html.includes('Profile'), 'Missing Profile section');
});

test('has Experience section', () => {
  assert(html.includes('Experience'), 'Missing Experience section');
});

test('has Internships section', () => {
  assert(html.includes('Internships'), 'Missing Internships section');
});

test('has Education section', () => {
  assert(html.includes('Education'), 'Missing Education section');
});

// ============================================================================
console.log('\nExperience Entries:\n');

const experiences = [
  { name: 'AeryFlux', match: 'AeryFlux' },
  { name: 'Wizards Reply', match: 'Wizards Reply' },
  { name: 'Le Monde', match: 'Le Monde' },
  { name: 'Agryco', match: 'Agryco' },
  { name: 'Akuo Energy', match: 'Akuo Energy' },
  { name: 'SFAF', match: 'SFAF' },
  { name: 'Epitech', match: 'Epitech' },
  { name: 'Ahlia University', match: 'Ahlia University' },
];

experiences.forEach(e => {
  test(`has ${e.name}`, () => {
    assert(html.includes(e.match), `Missing experience: ${e.name}`);
  });
});

// ============================================================================
console.log('\nSkills:\n');

const skills = ['TypeScript', 'React', 'React Native', 'Three.js', 'Expo',
  'Node.js', 'Express', 'PostgreSQL', 'Blender', 'Python', 'Docker'];

skills.forEach(skill => {
  test(`has ${skill}`, () => {
    assert(html.includes(skill), `Missing skill: ${skill}`);
  });
});

// ============================================================================
console.log('\nProject Cards:\n');

const projects = [
  { name: 'Atlas', url: 'atlas.aeryflux.com' },
  { name: 'geojsonto3D', url: 'github.com/martinbaud/geojsonto3D' },
  { name: '@aeryflux/globe', url: 'npmjs.com/package/@aeryflux/globe' },
  { name: '@aeryflux/xenova-bridge', url: 'npmjs.com/package/@aeryflux/xenova-bridge' },
  { name: 'lumos', url: 'aeryflux.com' },
  { name: 'haki', url: 'haki.aeryflux.com' },
  { name: 'aof6_server', url: 'github.com/martinbaud/aof6_server' },
  { name: 'palworld-server', url: 'github.com/martinbaud/palworld-server-docker' },
  { name: 'EnhancedSC', url: 'github.com/martinbaud/EnhancedSC' },
];

projects.forEach(p => {
  test(`${p.name} card with link`, () => {
    assert(html.includes(p.url), `Missing project link: ${p.name} (${p.url})`);
  });
});

// ============================================================================
console.log('\nAssets:\n');

const assetsDir = path.join(__dirname, 'assets');

test('assets directory exists', () => {
  assert(fs.existsSync(assetsDir), 'Assets directory missing');
});

const imgMatches = html.match(/src="assets\/[^"]+"/g) || [];
const hrefMatches = html.match(/href="assets\/[^"]+"/g) || [];
const localAssets = [...imgMatches, ...hrefMatches]
  .map(m => m.match(/"([^"]+)"/)[1])
  .filter((v, i, a) => a.indexOf(v) === i);

localAssets.forEach(asset => {
  test(`${asset} exists`, () => {
    assert(fs.existsSync(path.join(__dirname, asset)), `Missing: ${asset}`);
  });
});

// ============================================================================
console.log('\nPDF Generation:\n');

test('includes html2canvas', () => {
  assert(html.includes('html2canvas'), 'Missing html2canvas library');
});

test('includes jsPDF', () => {
  assert(html.includes('jspdf'), 'Missing jsPDF library');
});

test('has downloadPDF function', () => {
  assert(html.includes('function downloadPDF'), 'Missing downloadPDF function');
});

test('print-hide hides Sandbox section', () => {
  assert(html.includes('class="print-hide"'), 'Missing print-hide class');
});

// ============================================================================
console.log('\nCompany Links:\n');

const companyLinks = [
  { name: 'Wizards Reply', url: 'wizards-reply.com' },
  { name: 'Le Monde', url: 'lemonde.fr' },
  { name: 'Agryco', url: 'agryco.com' },
  { name: 'Akuo Energy', url: 'akuoenergy.com' },
  { name: 'SFAF', url: 'sfaf.com' },
  { name: 'Epitech', url: 'epitech.eu' },
  { name: 'Ahlia University', url: 'ahlia.edu.bh' },
];

companyLinks.forEach(c => {
  test(`${c.name} links to ${c.url}`, () => {
    assert(html.includes(c.url), `Missing company link: ${c.url}`);
  });
});

// ============================================================================
console.log('\n' + '─'.repeat(40));
console.log(`\x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m\n`);

process.exit(failed > 0 ? 1 : 0);
