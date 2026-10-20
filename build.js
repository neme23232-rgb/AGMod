const fs = require('fs');
const path = require('path');
const asar = require('asar');

function getAppResourcesDir() {
  if (process.env.ANTIGRAVITY_RESOURCES && fs.existsSync(process.env.ANTIGRAVITY_RESOURCES)) {
    return process.env.ANTIGRAVITY_RESOURCES;
  }
  let candidates = [];
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || '';
    const programFiles = process.env.PROGRAMFILES || 'C:\\Program Files';
    const programFilesX86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)';
    candidates = [
      path.join(localAppData, 'Programs', 'Antigravity', 'resources'),
      path.join(localAppData, 'Programs', 'antigravity', 'resources'),
      path.join(localAppData, 'Antigravity', 'resources'),
      path.join(localAppData, 'antigravity', 'resources'),
      path.join(programFiles, 'Antigravity', 'resources'),
      path.join(programFiles, 'Google Antigravity', 'resources'),
      path.join(programFilesX86, 'Antigravity', 'resources')
    ];
  } else if (process.platform === 'darwin') {
    candidates = [
      '/Applications/Antigravity.app/Contents/Resources',
      path.join(process.env.HOME || '', 'Applications/Antigravity.app/Contents/Resources')
    ];
  } else {
    candidates = [
      '/opt/Antigravity/resources',
      '/usr/lib/antigravity/resources'
    ];
  }
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return candidates[0];
}

const RESOURCES_DIR = getAppResourcesDir();
const TARGET_ASAR = path.join(RESOURCES_DIR, 'app.asar');
const BACKUP_ASAR = path.join(RESOURCES_DIR, 'app.asar.backup');
const CLEAN_EXTRACT = path.join(__dirname, 'extracted_clean');
const TEMP_BUILD = path.join(__dirname, 'temp_build');
const OUTPUT_ASAR = path.join(__dirname, 'app.asar.patched');

function loadAllLocales() {
  const localeFiles = ['uk', 'ru', 'de', 'fr', 'es', 'zh'];
  const locales = { en: {} };
  for (const lang of localeFiles) {
    const locPath = path.join(__dirname, 'locales', `${lang}.js`);
    if (fs.existsSync(locPath)) {
      delete require.cache[require.resolve(locPath)];
      locales[lang] = require(locPath);
    }
  }
  return locales;
}

function loadAllThemes() {
  const themesDir = path.join(__dirname, 'themes');
  const themes = {};
  if (fs.existsSync(themesDir)) {
    const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      try {
        const t = JSON.parse(fs.readFileSync(path.join(themesDir, f), 'utf8'));
        if (t.id) themes[t.id] = t;
      } catch (e) {
        console.warn(`[WARN] Failed to parse theme ${f}:`, e.message);
      }
    }
  }
  return themes;
}

function getClientScript() {
  const allLocales = loadAllLocales();
  const allThemes = loadAllThemes();
  const rawClient = fs.readFileSync(path.join(__dirname, 'mod_client.js'), 'utf8');
  return rawClient
    .replace('__ALL_LOCALES__', JSON.stringify(allLocales))
    .replace('__ALL_THEMES__', JSON.stringify(allThemes));
}

async function buildMod() {
  console.log('\n======================================================');
  console.log('   AGMod: Unified Themes & Localization Builder');
  console.log('======================================================\n');

  const CLIENT_JS = getClientScript();
  const themesCount = Object.keys(loadAllThemes()).length;
  const localesCount = Object.keys(loadAllLocales()).length;
  console.log(`[*] Bundled: ${themesCount} themes, ${localesCount} languages`);

  if (fs.existsSync(TEMP_BUILD)) {
    fs.rmSync(TEMP_BUILD, { recursive: true, force: true });
  }

  let sourceAsar = null;
  if (fs.existsSync(TARGET_ASAR)) {
    try {
      const preloadCode = asar.extractFile(TARGET_ASAR, 'dist/preload.js').toString();
      if (!preloadCode.includes('AGMod: Unified Themes')) {
        sourceAsar = TARGET_ASAR;
      }
    } catch (e) {}
  }

  if (!sourceAsar && fs.existsSync(BACKUP_ASAR)) {
    try {
      const backupPreload = asar.extractFile(BACKUP_ASAR, 'dist/preload.js').toString();
      if (!backupPreload.includes('AGMod: Unified Themes')) {
        sourceAsar = BACKUP_ASAR;
      }
    } catch (e) {}
  }

  if (sourceAsar) {
    console.log(`[1/4] Extracting app bundle from installed Antigravity (${sourceAsar})...`);
    
    // Ensure .unpacked directory exists for asar extraction if using backup
    const expectedUnpacked = sourceAsar + '.unpacked';
    let tempUnpackedCreated = false;
    if (!fs.existsSync(expectedUnpacked)) {
      const realUnpacked = path.join(path.dirname(sourceAsar), 'app.asar.unpacked');
      const backupUnpacked = path.join(path.dirname(sourceAsar), 'app.asar.unpacked.backup');
      const actualUnpacked = fs.existsSync(realUnpacked) ? realUnpacked : (fs.existsSync(backupUnpacked) ? backupUnpacked : null);
      if (actualUnpacked) {
        try {
          fs.cpSync(actualUnpacked, expectedUnpacked, { recursive: true });
          tempUnpackedCreated = true;
        } catch (e) {}
      }
    }

    try {
      asar.extractAll(sourceAsar, TEMP_BUILD);
    } finally {
      if (tempUnpackedCreated && fs.existsSync(expectedUnpacked)) {
        try { fs.rmSync(expectedUnpacked, { recursive: true, force: true }); } catch (e) {}
      }
    }

    try {
      if (fs.existsSync(CLEAN_EXTRACT)) {
        fs.rmSync(CLEAN_EXTRACT, { recursive: true, force: true });
      }
      fs.cpSync(TEMP_BUILD, CLEAN_EXTRACT, { recursive: true });
    } catch (e) {}
  } else if (fs.existsSync(CLEAN_EXTRACT)) {
    console.log('[1/4] Copying app bundle from clean template...');
    fs.cpSync(CLEAN_EXTRACT, TEMP_BUILD, { recursive: true });
  } else {
    throw new Error(`Cannot find app.asar in ${RESOURCES_DIR} or clean local template. Please ensure Google Antigravity is installed.`);
  }

  let appVersion = '2.24.0';
  const pkgPath = path.join(TEMP_BUILD, 'package.json');
  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      if (pkg.version) appVersion = pkg.version;
    } catch (e) {}
  }
  console.log(`      Target version: Antigravity v${appVersion}`);

  console.log('[2/4] Injecting AGMod client (Themes, Localization, Settings Tab)...');
  const preloadPath = path.join(TEMP_BUILD, 'dist', 'preload.js');
  if (!fs.existsSync(preloadPath)) {
    throw new Error(`Could not find preload.js at ${preloadPath}`);
  }

  let preloadCode = fs.readFileSync(preloadPath, 'utf8');

  // Strip any old mod injections if present in source
  if (preloadCode.includes('// --- Antigravity Multi-Language & Switcher Mod ---')) {
    preloadCode = preloadCode.replace(/\/\/ --- Antigravity Multi-Language & Switcher Mod ---[\s\S]*?\/\/ --- Antigravity Multi-Language & Switcher Mod End ---/g, '');
  }
  if (preloadCode.includes('// --- AGThemes ---')) {
    preloadCode = preloadCode.replace(/\/\/ --- AGThemes ---[\s\S]*?\/\/ --- AGThemes End ---/g, '');
  }
  if (preloadCode.includes('// --- AGMod: Unified Themes & Localization Mod ---')) {
    preloadCode = preloadCode.replace(/\/\/ --- AGMod: Unified Themes & Localization Mod ---[\s\S]*?\/\/ --- AGMod End ---/g, '');
  }

  const injection = `
// --- AGMod: Unified Themes & Localization Mod ---
try {
  const { webFrame } = require('electron');
  const __agModScript = ${JSON.stringify(CLIENT_JS)};
  webFrame.executeJavaScript(__agModScript);
} catch (e) {
  console.error('[AGMod] Failed to inject AGMod client:', e);
}
// --- AGMod End ---
`;

  preloadCode += injection;
  fs.writeFileSync(preloadPath, preloadCode, 'utf8');

  // Replace default app icon with custom AGMod icon if available
  const customIconSrc = path.join(__dirname, 'icon.png');
  if (fs.existsSync(customIconSrc)) {
    try {
      const targetIcon = path.join(TEMP_BUILD, 'icon.png');
      fs.copyFileSync(customIconSrc, targetIcon);
      console.log('      Custom app icon applied to app bundle (icon.png)');
    } catch (e) {
      console.warn('      Notice: Could not replace app bundle icon:', e.message);
    }
  }

  console.log('[3/4] Packaging app.asar.patched...');
  if (fs.existsSync(OUTPUT_ASAR)) {
    fs.unlinkSync(OUTPUT_ASAR);
  }

  await asar.createPackageWithOptions(
    TEMP_BUILD,
    OUTPUT_ASAR,
    { unpack: '{*.node,**/node_modules/chrome-devtools-mcp/**}' }
  );

  console.log('[4/4] Cleaning up temporary build artifacts...');
  fs.rmSync(TEMP_BUILD, { recursive: true, force: true });

  console.log('\n[SUCCESS] Successfully built: app.asar.patched (for Antigravity v' + appVersion + ')');
  console.log('Run "install.bat" (or "node install.js") to install the mod!\n');
  return OUTPUT_ASAR;
}

if (require.main === module) {
  buildMod().catch(err => {
    console.error('\n[BUILD FAILED]:', err.message);
    process.exit(1);
  });
}

module.exports = { buildMod, getAppResourcesDir, loadAllLocales, loadAllThemes, getClientScript };
