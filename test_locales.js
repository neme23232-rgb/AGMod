const fs = require('fs');
const path = require('path');

function testLocales() {
  console.log('\n======================================================');
  console.log('       AGMod Locales Integrity & Phrase Test');
  console.log('======================================================\n');

  const localesDir = path.join(__dirname, 'locales');
  const langs = ['ru', 'uk', 'de', 'fr', 'es', 'zh'];
  let passed = true;

  for (const lang of langs) {
    const locPath = path.join(localesDir, `${lang}.js`);
    const dict = require(locPath);
    const keys = Object.keys(dict);

    let emptyValues = 0;
    for (const k of keys) {
      if (!dict[k] || typeof dict[k] !== 'string') emptyValues++;
    }

    console.log(`[*] Locale [${lang.toUpperCase()}]: ${keys.length} phrases, empty: ${emptyValues}`);
    if (emptyValues > 0) {
      console.error(`[ERROR] Locale ${lang} contains ${emptyValues} empty translations!`);
      passed = false;
    }
  }

  if (passed) {
    console.log('\n[SUCCESS] All locale files passed integrity tests!\n');
  } else {
    process.exit(1);
  }
}

testLocales();
