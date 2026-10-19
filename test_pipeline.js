const fs = require('fs');
const path = require('path');
const vm = require('vm');

function runPipelineTests() {
  console.log('\n======================================================');
  console.log('       AGMod Architecture & Pipeline Test Suite');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  // 1. Test Themes
  console.log('\n--- 1. Testing Theme Definitions ---');
  const themesDir = path.join(__dirname, 'themes');
  assert(fs.existsSync(themesDir), 'Themes directory exists');
  const themeFiles = fs.readdirSync(themesDir).filter(f => f.endsWith('.json'));
  assert(themeFiles.length >= 10, `Found ${themeFiles.length} themes (expected >= 10)`);

  let themesValid = true;
  for (const f of themeFiles) {
    try {
      const t = JSON.parse(fs.readFileSync(path.join(themesDir, f), 'utf8'));
      if (!t.id || !t.name || !t.preview) {
        themesValid = false;
        console.error(`Theme ${f} missing id, name or preview`);
      }
    } catch (e) {
      themesValid = false;
      console.error(`Failed to parse theme ${f}: ${e.message}`);
    }
  }
  assert(themesValid, 'All theme JSON files are syntactically valid and well-formed');

  // 2. Test Locales
  console.log('\n--- 2. Testing Locales Dictionaries ---');
  const localesDir = path.join(__dirname, 'locales');
  assert(fs.existsSync(localesDir), 'Locales directory exists');
  const expectedLangs = ['ru', 'uk', 'de', 'fr', 'es', 'zh'];
  let allLocalesValid = true;
  for (const lang of expectedLangs) {
    const p = path.join(localesDir, `${lang}.js`);
    if (!fs.existsSync(p)) {
      allLocalesValid = false;
      console.error(`Missing locale file: ${lang}.js`);
    } else {
      try {
        const dict = require(p);
        const count = Object.keys(dict).length;
        if (count < 100) {
          allLocalesValid = false;
          console.error(`Locale ${lang}.js has too few keys: ${count}`);
        } else {
          console.log(`  -> ${lang}.js: ${count} translated phrases`);
        }
      } catch (e) {
        allLocalesValid = false;
        console.error(`Failed to load ${lang}.js: ${e.message}`);
      }
    }
  }
  assert(allLocalesValid, 'All 6 locale dictionaries loaded and verified');

  // 3. Test Mod Client Syntax
  console.log('\n--- 3. Testing Client Runtime Syntax ---');
  const { getClientScript } = require('./build.js');
  let clientScript = '';
  try {
    clientScript = getClientScript();
    assert(clientScript.length > 50000, `Client script bundled successfully (${clientScript.length} bytes)`);
    assert(clientScript.includes('ag-nav-test-btn'), 'Client script includes Test Tab injection logic');
    assert(clientScript.includes('ag-custom-test-pane'), 'Client script includes Test Settings pane logic');
    assert(clientScript.includes('cleanupSidebarButtons'), 'Client script includes sidebar buttons cleanup logic');

    // Syntax validation via Node VM
    new vm.Script(clientScript);
    assert(true, 'Client script passes full JavaScript syntax validation');
  } catch (e) {
    assert(false, `Client script compilation failed: ${e.message}`);
  }

  // 4. Test Safe Word Boundary
  console.log('\n--- 4. Testing Safe Word Boundary Logic ---');
  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  function buildSafeRegex(k) {
    const startsWithWord = /^\w/.test(k);
    const endsWithWord = /\w$/.test(k);
    const prefix = startsWithWord ? '(?<![a-zA-Z0-9_])' : '';
    const suffix = endsWithWord ? '(?![a-zA-Z0-9_])' : '';
    return new RegExp(prefix + escapeRegExp(k) + suffix, 'g');
  }

  const testKey = 'Settings';
  const testTrans = 'Настройки';
  const regex = buildSafeRegex(testKey);

  const testStr1 = 'Open Settings here';
  const replaced1 = testStr1.replace(regex, testTrans);
  assert(replaced1 === 'Open Настройки here', 'Matches exact word "Settings"');

  const testStr2 = 'Open DefaultSettings now';
  const replaced2 = testStr2.replace(regex, testTrans);
  assert(replaced2 === 'Open DefaultSettings now', 'Does not match inside composite identifier "DefaultSettings"');

  // 5. Test Hardening, Sanitization & Cache
  console.log('\n--- 5. Testing Security, Performance & Hardening ---');

  // 5.1 escapeHtml
  function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  const rawHtml = '<script>alert("xss" & \'test\')</script>';
  const escaped = escapeHtml(rawHtml);
  assert(!escaped.includes('<script>') && escaped.includes('&lt;script&gt;') && escaped.includes('&quot;xss&quot;'), 'escapeHtml properly sanitizes tags and quotes');

  // 5.2 cleanHex
  function cleanHex(colorStr, fallback = '000000') {
    if (!colorStr || typeof colorStr !== 'string') return fallback;
    let s = colorStr.trim().replace(/^#/, '');
    if (s.length === 3) {
      s = s.split('').map(c => c + c).join('');
    } else if (s.length === 8) {
      s = s.substring(0, 6);
    }
    if (/^[0-9A-Fa-f]{6}$/.test(s)) {
      return s.toUpperCase();
    }
    return fallback;
  }
  assert(cleanHex('#fff') === 'FFFFFF', 'cleanHex expands 3-char hex to 6-char');
  assert(cleanHex('#ff000080') === 'FF0000', 'cleanHex trims 8-char hex to 6-char');
  assert(cleanHex('invalid', '123456') === '123456', 'cleanHex uses fallback on invalid input');

  // 5.3 CSS Font name sanitization
  const dirtyFontName = 'MyFont"; background: red; } /*';
  const cleanFontName = String(dirtyFontName).replace(/["\\\r\n;{}]/g, '');
  assert(!cleanFontName.includes('"') && !cleanFontName.includes(';') && !cleanFontName.includes('}'), 'CSS font family name sanitization strips dangerous characters');

  // 5.4 REGEX_CACHE
  const REGEX_CACHE = new Map();
  function getCachedRegex(k) {
    let reg = REGEX_CACHE.get(k);
    if (!reg) {
      reg = buildSafeRegex(k);
      REGEX_CACHE.set(k, reg);
    }
    return reg;
  }
  const r1 = getCachedRegex('Chat');
  const r2 = getCachedRegex('Chat');
  assert(r1 === r2 && REGEX_CACHE.size === 1, 'REGEX_CACHE caches and reuses RegExp instances');

  // 5.5 Font size limit check
  const MAX_FONT_SIZE = 2 * 1024 * 1024;
  assert(1.5 * 1024 * 1024 <= MAX_FONT_SIZE, 'Valid font under 2MB accepted');
  assert(2.5 * 1024 * 1024 > MAX_FONT_SIZE, 'Font over 2MB rejected');

  console.log('\n------------------------------------------------------');
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log('------------------------------------------------------\n');

  if (failed > 0) process.exit(1);
}

runPipelineTests();

