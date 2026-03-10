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

console.log('\nPortfolio Tests\n');

// HTML Structure Tests
console.log('HTML Structure:');
const html = fs.readFileSync('index.html', 'utf8');

test('has DOCTYPE', () => {
  assert(html.startsWith('<!DOCTYPE html>'), 'Missing DOCTYPE');
});

test('has html lang attribute', () => {
  assert(html.includes('<html lang="en">'), 'Missing or incorrect lang attribute');
});

test('has meta charset', () => {
  assert(html.includes('charset="UTF-8"'), 'Missing charset meta');
});

test('has meta viewport', () => {
  assert(html.includes('name="viewport"'), 'Missing viewport meta');
});

test('has title', () => {
  assert(html.includes('<title>') && html.includes('</title>'), 'Missing title');
});

test('has favicon', () => {
  assert(html.includes('rel="icon"'), 'Missing favicon');
});

// Content Tests
console.log('\nContent:');

test('has header with name', () => {
  assert(html.includes('martinbaud'), 'Missing name in header');
});

test('has Pro section', () => {
  assert(html.includes('Pro — AeryFlux'), 'Missing Pro section');
});

test('has Hobby section', () => {
  assert(html.includes('Hobby — Game Servers'), 'Missing Hobby section');
});

test('has Research section', () => {
  assert(html.includes('Research'), 'Missing Research section');
});

test('has footer with links', () => {
  assert(html.includes('github.com/martinbaud'), 'Missing GitHub link');
  assert(html.includes('github.com/aeryflux'), 'Missing AeryFlux link');
  assert(html.includes('npmjs.com/org/aeryflux'), 'Missing npm link');
});

// Asset Tests
console.log('\nAssets:');
const assetsDir = path.join(__dirname, 'assets');

// Extract all local image paths from HTML
const imgMatches = html.match(/src="assets\/[^"]+"/g) || [];
const hrefMatches = html.match(/href="assets\/[^"]+"/g) || [];
const localAssets = [...imgMatches, ...hrefMatches]
  .map(m => m.match(/"([^"]+)"/)[1])
  .filter((v, i, a) => a.indexOf(v) === i);

test('assets directory exists', () => {
  assert(fs.existsSync(assetsDir), 'Assets directory missing');
});

localAssets.forEach(asset => {
  test(`${asset} exists`, () => {
    assert(fs.existsSync(path.join(__dirname, asset)), `Missing: ${asset}`);
  });
});

// Project Links Tests
console.log('\nProject Links:');

const expectedProjects = [
  { name: 'geojsonto3D', url: 'github.com/martinbaud/geojsonto3D' },
  { name: 'lumos', url: 'aeryflux.com' },
  { name: '@aeryflux/globe', url: 'npmjs.com/package/@aeryflux/globe' },
  { name: '@aeryflux/xenova-bridge', url: 'npmjs.com/package/@aeryflux/xenova-bridge' },
  { name: 'haki', url: 'github.com/aeryflux/haki' },
  { name: 'aof6_server', url: 'github.com/martinbaud/aof6_server' },
  { name: 'palworld-server', url: 'github.com/martinbaud/palworld-server-docker' },
  { name: 'EnhancedSC', url: 'github.com/martinbaud/EnhancedSC' },
  { name: 'UrbzMMO', url: 'sim2team.github.io' },
];

expectedProjects.forEach(proj => {
  test(`${proj.name} link present`, () => {
    assert(html.includes(proj.url), `Missing link for ${proj.name}`);
  });
});

// Summary
console.log('\n' + '─'.repeat(40));
console.log(`\x1b[32m${passed} passed\x1b[0m, \x1b[31m${failed} failed\x1b[0m\n`);

process.exit(failed > 0 ? 1 : 0);
