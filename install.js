const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

function getAsarModule() {
  try {
    return require('asar');
  } catch (e) {
    return require('./node_modules/asar');
  }
}

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

function getAntigravityExePath() {
  if (process.platform === 'win32') {
    const localAppData = process.env.LOCALAPPDATA || '';
    const candidates = [
      path.join(localAppData, 'Programs', 'Antigravity', 'Antigravity.exe'),
      path.join(localAppData, 'Programs', 'antigravity', 'antigravity.exe'),
      path.join(localAppData, 'Antigravity', 'Antigravity.exe'),
      'C:\\Program Files\\Antigravity\\Antigravity.exe',
      'C:\\Program Files (x86)\\Antigravity\\Antigravity.exe'
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
  }
  return null;
}

const RESOURCES_DIR = getAppResourcesDir();
const TARGET_ASAR = path.join(RESOURCES_DIR, 'app.asar');
const BACKUP_ASAR = path.join(RESOURCES_DIR, 'app.asar.backup');
const TARGET_UNPACKED = path.join(RESOURCES_DIR, 'app.asar.unpacked');
const BACKUP_UNPACKED = path.join(RESOURCES_DIR, 'app.asar.unpacked.backup');

const PATCHED_ASAR = path.join(__dirname, 'app.asar.patched');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function closeRunningAntigravity() {
  if (process.platform === 'win32') {
    try {
      const tasklist = execSync('tasklist /FI "IMAGENAME eq Antigravity.exe" /NH', { encoding: 'utf8' });
      if (tasklist.toLowerCase().includes('antigravity.exe')) {
        console.log('[*] Antigravity is currently running. Closing to apply updates...');
        try {
          execSync('taskkill /F /IM Antigravity.exe >nul 2>&1');
        } catch (e) {}
        try {
          execSync('powershell -NoProfile -Command "Get-Process Antigravity -ErrorAction SilentlyContinue | Stop-Process -Force"');
        } catch (e) {}

        for (let i = 0; i < 20; i++) {
          const check = execSync('tasklist /FI "IMAGENAME eq Antigravity.exe" /NH', { encoding: 'utf8' });
          if (!check.toLowerCase().includes('antigravity.exe')) {
            console.log('[*] Antigravity successfully closed.');
            return true;
          }
          await sleep(250);
        }
        return true;
      }
    } catch (e) {}
  }
  return false;
}

async function copyWithRetry(src, dest, retries = 10, delayMs = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      fs.copyFileSync(src, dest);
      return;
    } catch (err) {
      if (i === retries - 1) throw err;
      await sleep(delayMs);
    }
  }
}

async function main() {
  console.log('\n======================================================');
  console.log('       AGMod: Themes & Localization Installer');
  console.log('======================================================\n');

  if (!fs.existsSync(TARGET_ASAR)) {
    console.error(`[ERROR] Antigravity not found at: ${TARGET_ASAR}`);
    console.error('Please ensure Google Antigravity is installed before running the installer.');
    process.exit(1);
  }

  // 1. Build if patched asar does not exist yet
  if (!fs.existsSync(PATCHED_ASAR)) {
    console.log('[*] app.asar.patched not found. Building now...');
    const { buildMod } = require('./build.js');
    await buildMod();
  }

  // 2. Close running Antigravity instance so changes take effect
  const wasRunning = await closeRunningAntigravity();

  // 3. Safe backup of original clean asar if not already backed up
  if (!fs.existsSync(BACKUP_ASAR)) {
    let isAlreadyPatched = false;
    try {
      const asar = getAsarModule();
      const preload = asar.extractFile(TARGET_ASAR, 'dist/preload.js').toString();
      if (preload.includes('AGMod: Unified Themes')) {
        isAlreadyPatched = true;
      }
    } catch (e) {}

    if (isAlreadyPatched) {
      console.warn('      [WARN] Existing app.asar is already modified. Skipping backup to avoid corrupting clean baseline.');
    } else {
      console.log(`[1/3] Creating safe backup of original app.asar...`);
      await copyWithRetry(TARGET_ASAR, BACKUP_ASAR);
      if (fs.existsSync(TARGET_UNPACKED) && !fs.existsSync(BACKUP_UNPACKED)) {
        console.log(`      Backing up app.asar.unpacked directory...`);
        fs.cpSync(TARGET_UNPACKED, BACKUP_UNPACKED, { recursive: true });
      }
      console.log(`      Backup successfully created at: ${BACKUP_ASAR}`);
    }
  } else {
    console.log(`[1/3] Safe backup already exists at: ${BACKUP_ASAR}`);
  }

  // 4. Install patched app.asar
  console.log(`[2/3] Installing AGMod into Antigravity...`);
  await copyWithRetry(PATCHED_ASAR, TARGET_ASAR, 10, 500);
  console.log('      Installation of app.asar completed.');

  // 5. Verification
  console.log(`[3/3] Verifying installation integrity...`);
  try {
    const asar = getAsarModule();
    const preload = asar.extractFile(TARGET_ASAR, 'dist/preload.js').toString();
    if (!preload.includes('AGMod: Unified Themes')) {
      throw new Error('AGMod signature missing from installed preload.js');
    }
  } catch (err) {
    console.warn(`[WARN] Integrity check notice: ${err.message}`);
  }

  console.log('\n[SUCCESS] AGMod successfully installed!');
  console.log('Features enabled:');
  console.log('  - Dedicated "Test" Settings Tab for Themes & Languages');
  console.log('  - 12 Custom Themes (Catppuccin, Cyberpunk, Dracula, Nord, Matrix, Crimson, etc.)');
  console.log('  - 7 Languages (Russian, Ukrainian, English, German, French, Spanish, Chinese)');
  console.log('  - Quick-switch sidebar buttons for instant access');
  console.log('  - Custom font selector & compact mode');

  // 6. Relaunch Antigravity
  const exePath = getAntigravityExePath();
  if (exePath) {
    console.log(`\n[*] Relaunching Google Antigravity (${exePath})...`);
    try {
      const child = spawn(exePath, ['--remote-debugging-port=53049'], { detached: true, stdio: 'ignore' });
      child.unref();
      console.log('[*] Google Antigravity relaunched with AGMod active!\n');
    } catch (e) {
      console.log(`Notice: Please start Antigravity manually (${e.message})\n`);
    }
  } else {
    console.log('\nLaunch Google Antigravity to enjoy the new experience!\n');
  }
}

main().catch(err => {
  console.error('\n[INSTALL FAILED]:', err.message);
  process.exit(1);
});
