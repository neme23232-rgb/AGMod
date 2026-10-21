const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');

const PROFILES_ROOT = path.join(os.homedir(), '.gemini', 'agmod_profiles');
const PROFILES_DIR = path.join(PROFILES_ROOT, 'profiles');
const BACKUPS_DIR = path.join(PROFILES_ROOT, 'backups');
const META_FILE = path.join(PROFILES_ROOT, 'profiles.json');
const GEMINI_APP_DIR = path.join(os.homedir(), '.gemini', 'antigravity');
const APP_STORAGE_FILE = path.join(
  process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
  'Antigravity',
  'app_storage.json'
);
const COOKIES_FILE = path.join(
  process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
  'Antigravity',
  'Network',
  'Cookies'
);

const CHAT_ITEMS = [
  'conversation_summaries.db',
  'conversation_summaries.db-shm',
  'conversation_summaries.db-wal',
  'conversations',
  'brain',
  'annotations',
  'presence',
  'antigravity_state.pbtxt',
  'agyhub_summaries_proto.pb',
  'installation_id'
];

// --- Win32 Credential Manager Integration ---
function runPowerShell(cmd) {
  if (process.platform !== 'win32') return null;
  try {
    const wrapped = `$ProgressPreference = 'SilentlyContinue';\r\n${cmd}`;
    const b64 = Buffer.from(wrapped, 'utf16le').toString('base64');
    return execSync(
      `powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -EncodedCommand ${b64}`,
      { encoding: 'utf8', timeout: 8000, stdio: ['pipe', 'pipe', 'pipe'] }
    ).trim();
  } catch (err) {
    return null;
  }
}

const CRED_PS_TYPE = `
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class AGModCred {
    [DllImport("advapi32.dll", EntryPoint = "CredReadW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);
    [DllImport("advapi32.dll", EntryPoint = "CredWriteW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredWrite(ref CREDENTIAL credential, uint flags);
    [DllImport("advapi32.dll", EntryPoint = "CredDeleteW", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CredDelete(string target, int type, int flags);
    [DllImport("advapi32.dll", EntryPoint = "CredFree", SetLastError = true)]
    public static extern void CredFree(IntPtr credential);
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
    }
    public static string Read(string target) {
        IntPtr ptr;
        if (CredRead(target, 1, 0, out ptr)) {
            var cred = (CREDENTIAL)Marshal.PtrToStructure(ptr, typeof(CREDENTIAL));
            byte[] bytes = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, bytes, 0, cred.CredentialBlobSize);
            CredFree(ptr);
            return Convert.ToBase64String(bytes);
        }
        return null;
    }
    public static bool Write(string target, string userName, string b64Secret) {
        byte[] bytes = Convert.FromBase64String(b64Secret);
        IntPtr blobPtr = Marshal.AllocHGlobal(bytes.Length);
        Marshal.Copy(bytes, 0, blobPtr, bytes.Length);
        var cred = new CREDENTIAL();
        cred.Type = 1;
        cred.TargetName = target;
        cred.UserName = userName;
        cred.CredentialBlobSize = bytes.Length;
        cred.CredentialBlob = blobPtr;
        cred.Persist = 2;
        bool ok = CredWrite(ref cred, 0);
        Marshal.FreeHGlobal(blobPtr);
        return ok;
    }
    public static bool Delete(string target) {
        return CredDelete(target, 1, 0);
    }
}
"@;
`;

function readCredential(target = 'gemini:antigravity') {
  if (process.platform !== 'win32') return null;
  const script = `${CRED_PS_TYPE}\r\n[AGModCred]::Read('${target}')`;
  const b64 = runPowerShell(script);
  if (!b64) return null;
  try {
    return Buffer.from(b64, 'base64').toString('utf8');
  } catch (e) {
    return null;
  }
}

function writeCredential(target = 'gemini:antigravity', userName = 'antigravity', secret) {
  if (process.platform !== 'win32' || !secret) return false;
  const b64 = Buffer.from(secret, 'utf8').toString('base64');
  const script = `${CRED_PS_TYPE}\r\n[AGModCred]::Write('${target}', '${userName}', '${b64}')`;
  const res = runPowerShell(script);
  return res && res.toLowerCase().includes('true');
}

function deleteCredential(target = 'gemini:antigravity') {
  if (process.platform !== 'win32') return false;
  const script = `${CRED_PS_TYPE}\r\n[AGModCred]::Delete('${target}')`;
  const res = runPowerShell(script);
  return res && res.toLowerCase().includes('true');
}

function extractEmailFromToken(tokenString) {
  if (!tokenString) return null;
  try {
    const data = JSON.parse(tokenString);
    if (data && data.id_token) {
      const parts = data.id_token.split('.');
      if (parts.length >= 2) {
        const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
        if (payload && payload.email) return payload.email.toLowerCase().trim();
      }
    }
  } catch (e) {}
  return null;
}

// --- Directory & Metadata Management ---
function ensureDirs() {
  if (!fs.existsSync(PROFILES_ROOT)) fs.mkdirSync(PROFILES_ROOT, { recursive: true });
  if (!fs.existsSync(PROFILES_DIR)) fs.mkdirSync(PROFILES_DIR, { recursive: true });
  if (!fs.existsSync(BACKUPS_DIR)) fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

function loadMeta() {
  ensureDirs();
  const defaultMeta = {
    activeProfileId: null,
    profiles: [],
    pendingNewAccount: false,
    isolateChats: false // Shared chats by default so work is never lost!
  };
  if (!fs.existsSync(META_FILE)) {
    return defaultMeta;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
    return Object.assign(defaultMeta, parsed);
  } catch (e) {
    return defaultMeta;
  }
}

function saveMeta(meta) {
  ensureDirs();
  fs.writeFileSync(META_FILE, JSON.stringify(meta, null, 2), 'utf8');
}

function ensureOnboardingAccepted(storage) {
  if (!storage || typeof storage !== 'object') storage = {};
  storage['jetski.onboarding.lastLoginIsGcpTos'] = 'true';
  storage['jetski.onboarding.hasCompletedOnboarding'] = 'true';
  storage['jetski.onboarding.termsVersion'] = '1';
  storage['jetski.onboarding.acceptedTerms'] = 'true';
  storage['jetski.onboarding.completed'] = 'true';
  storage['jetski.telemetry.hasPromptedForTelemetry'] = 'true';
  storage['jetski.telemetry.hasPromptedForCrashReporting'] = 'true';
  storage['didAskForNotificationPermission'] = 'true';
  storage['ide-install-wizard-shown'] = 'true';
  return storage;
}

function getCurrentEmail() {
  const token = readCredential('gemini:antigravity');
  const fromToken = extractEmailFromToken(token);
  if (fromToken) return fromToken;

  if (fs.existsSync(APP_STORAGE_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(APP_STORAGE_FILE, 'utf8'));
      if (data && data['jetski.onboarding.lastLoginUsername']) {
        return data['jetski.onboarding.lastLoginUsername'].toLowerCase().trim();
      }
    } catch (e) {}
  }
  return 'default';
}

function countChatsInProfile(profileDataDir) {
  let count = 0;
  if (!fs.existsSync(profileDataDir)) return 0;
  const convosDir = path.join(profileDataDir, 'conversations');
  if (fs.existsSync(convosDir)) {
    try {
      const files = fs.readdirSync(convosDir).filter(f => f.endsWith('.db'));
      count = files.length;
    } catch (e) {}
  }
  if (count === 0) {
    const annotDir = path.join(profileDataDir, 'annotations');
    if (fs.existsSync(annotDir)) {
      try {
        count = fs.readdirSync(annotDir).filter(f => f.endsWith('.pbtxt')).length;
      } catch (e) {}
    }
  }
  return count;
}

function copyChatItems(sourceDir, destDir) {
  if (!fs.existsSync(sourceDir)) return;
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  for (const item of CHAT_ITEMS) {
    const src = path.join(sourceDir, item);
    const dst = path.join(destDir, item);
    if (!fs.existsSync(src)) continue;

    try {
      const stat = fs.statSync(src);
      if (stat.isDirectory()) {
        fs.cpSync(src, dst, { recursive: true, force: true });
      } else {
        fs.copyFileSync(src, dst);
      }
    } catch (e) {
      console.warn(`[AGMod:AccountManager] Could not copy ${item}:`, e.message);
    }
  }
}

function clearActiveChatItems() {
  if (!fs.existsSync(GEMINI_APP_DIR)) return;
  for (const item of CHAT_ITEMS) {
    const p = path.join(GEMINI_APP_DIR, item);
    if (!fs.existsSync(p)) continue;
    try {
      const stat = fs.statSync(p);
      if (stat.isDirectory()) {
        fs.rmSync(p, { recursive: true, force: true });
      } else {
        fs.unlinkSync(p);
      }
    } catch (e) {
      console.warn(`[AGMod:AccountManager] Could not clean ${item}:`, e.message);
    }
  }
}

function getDirectorySize(dir) {
  let size = 0;
  if (!fs.existsSync(dir)) return 0;
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        size += getDirectorySize(fullPath);
      } else {
        size += stat.size;
      }
    }
  } catch (e) {}
  return size;
}

function pruneOldBackups(maxKeep = 10) {
  if (!fs.existsSync(BACKUPS_DIR)) return;
  try {
    const entries = fs.readdirSync(BACKUPS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name.startsWith('backup_'))
      .map(d => {
        const metaPath = path.join(BACKUPS_DIR, d.name, 'meta.json');
        let ts = 0;
        if (fs.existsSync(metaPath)) {
          try {
            ts = JSON.parse(fs.readFileSync(metaPath, 'utf8')).timestamp || 0;
          } catch (e) {}
        }
        if (!ts) {
          const parts = d.name.split('_');
          ts = parseInt(parts[1], 10) || 0;
        }
        return { name: d.name, ts, path: path.join(BACKUPS_DIR, d.name) };
      })
      .sort((a, b) => b.ts - a.ts);

    if (entries.length > maxKeep) {
      for (let i = maxKeep; i < entries.length; i++) {
        try {
          fs.rmSync(entries[i].path, { recursive: true, force: true });
        } catch (e) {}
      }
    }
  } catch (e) {}
}

// --- Backup & Protection System ---
function createBackup(label = 'Ручное сохранение') {
  ensureDirs();
  const chatCount = countChatsInProfile(GEMINI_APP_DIR);
  const now = new Date();
  const timestamp = Date.now();
  const backupId = `backup_${timestamp}`;
  const backupFolder = path.join(BACKUPS_DIR, backupId);

  try {
    fs.mkdirSync(backupFolder, { recursive: true });
    const dataDir = path.join(backupFolder, 'data');
    copyChatItems(GEMINI_APP_DIR, dataDir);

    const email = getCurrentEmail();
    const meta = {
      id: backupId,
      timestamp,
      date: now.toLocaleString('ru-RU'),
      label: label || 'Резервная копия',
      chatCount,
      account: email !== 'default' ? email : 'default',
      sizeBytes: getDirectorySize(dataDir)
    };
    fs.writeFileSync(path.join(backupFolder, 'meta.json'), JSON.stringify(meta, null, 2), 'utf8');

    pruneOldBackups(10);
    return { success: true, backup: meta };
  } catch (err) {
    console.error('[AGMod:Backup] Error creating backup:', err);
    return { success: false, error: err.message };
  }
}

function listBackups() {
  ensureDirs();
  const backups = [];
  try {
    const entries = fs.readdirSync(BACKUPS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name.startsWith('backup_'));

    for (const d of entries) {
      const metaPath = path.join(BACKUPS_DIR, d.name, 'meta.json');
      if (fs.existsSync(metaPath)) {
        try {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          backups.push(meta);
        } catch (e) {}
      }
    }
    backups.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } catch (e) {}
  return backups;
}

function restoreBackup(backupId) {
  ensureDirs();
  if (!backupId) throw new Error('Backup ID is required');
  const backupFolder = path.join(BACKUPS_DIR, backupId);
  const dataDir = path.join(backupFolder, 'data');
  if (!fs.existsSync(dataDir)) {
    throw new Error(`Backup data not found: ${backupId}`);
  }

  // Safety snapshot before restoring
  createBackup('Автосохранение перед восстановлением');

  clearActiveChatItems();
  copyChatItems(dataDir, GEMINI_APP_DIR);
  const count = countChatsInProfile(GEMINI_APP_DIR);
  return { success: true, chatCount: count, relaunch: true };
}

// --- Core API ---
function initAccountManager() {
  ensureDirs();
  const meta = loadMeta();
  const currentToken = readCredential('gemini:antigravity');
  const currentEmail = extractEmailFromToken(currentToken) || getCurrentEmail();

  // Baseline automatic backup if none exists
  const existingBackups = listBackups();
  if (existingBackups.length === 0 && countChatsInProfile(GEMINI_APP_DIR) > 0) {
    createBackup('Базовая резервная копия при инициализации');
  }

  // Case 1: First run - initialize existing account as profile_1
  if (!meta.profiles || meta.profiles.length === 0) {
    const pId = 'profile_1';
    const profileFolder = path.join(PROFILES_DIR, pId);
    fs.mkdirSync(profileFolder, { recursive: true });

    copyChatItems(GEMINI_APP_DIR, path.join(profileFolder, 'data'));
    if (currentToken) {
      fs.writeFileSync(path.join(profileFolder, 'token.json'), currentToken, 'utf8');
    }
    if (fs.existsSync(APP_STORAGE_FILE)) {
      try {
        let storage = JSON.parse(fs.readFileSync(APP_STORAGE_FILE, 'utf8'));
        storage = ensureOnboardingAccepted(storage);
        fs.writeFileSync(APP_STORAGE_FILE, JSON.stringify(storage, null, 2), 'utf8');
        fs.copyFileSync(APP_STORAGE_FILE, path.join(profileFolder, 'app_storage.json'));
      } catch (e) {}
    }
    if (fs.existsSync(COOKIES_FILE)) {
      try {
        fs.copyFileSync(COOKIES_FILE, path.join(profileFolder, 'Cookies'));
      } catch (e) {}
    }

    meta.activeProfileId = pId;
    meta.pendingNewAccount = false;
    meta.profiles = [
      {
        id: pId,
        name: currentEmail !== 'default' ? currentEmail : 'Основной аккаунт',
        email: currentEmail,
        createdAt: Date.now(),
        lastUsed: Date.now()
      }
    ];
    saveMeta(meta);
    return meta;
  }

  // Case 2: Multi-profile resolution
  if (currentToken && currentEmail && currentEmail !== 'default') {
    let matchingProfile = meta.profiles.find(
      p => p.email && p.email.toLowerCase() === currentEmail.toLowerCase()
    );

    if (matchingProfile) {
      meta.activeProfileId = matchingProfile.id;
      matchingProfile.lastUsed = Date.now();
      const pFolder = path.join(PROFILES_DIR, matchingProfile.id);
      fs.mkdirSync(pFolder, { recursive: true });
      fs.writeFileSync(path.join(pFolder, 'token.json'), currentToken, 'utf8');
    } else {
      // New account detected - create distinct profile!
      const newPId = `profile_${Date.now()}`;
      const newFolder = path.join(PROFILES_DIR, newPId);
      fs.mkdirSync(newFolder, { recursive: true });

      fs.writeFileSync(path.join(newFolder, 'token.json'), currentToken, 'utf8');
      if (fs.existsSync(APP_STORAGE_FILE)) {
        try {
          let storage = JSON.parse(fs.readFileSync(APP_STORAGE_FILE, 'utf8'));
          storage = ensureOnboardingAccepted(storage);
          fs.writeFileSync(path.join(newFolder, 'app_storage.json'), JSON.stringify(storage, null, 2), 'utf8');
        } catch (e) {}
      }
      if (fs.existsSync(COOKIES_FILE)) {
        try {
          fs.copyFileSync(COOKIES_FILE, path.join(newFolder, 'Cookies'));
        } catch (e) {}
      }

      // Copy current chats into this new profile so user never loses work
      copyChatItems(GEMINI_APP_DIR, path.join(newFolder, 'data'));

      meta.profiles.push({
        id: newPId,
        name: currentEmail,
        email: currentEmail,
        createdAt: Date.now(),
        lastUsed: Date.now()
      });
      meta.activeProfileId = newPId;
    }
    meta.pendingNewAccount = false;
    saveMeta(meta);
  }

  return meta;
}

function getAccountsList() {
  const meta = initAccountManager();
  const currentEmail = getCurrentEmail();

  return {
    activeProfileId: meta.activeProfileId,
    currentEmail,
    isolateChats: Boolean(meta.isolateChats),
    profiles: (meta.profiles || []).map(p => {
      const pFolder = path.join(PROFILES_DIR, p.id);
      const targetData = path.join(pFolder, 'data');
      const chatCount = p.id === meta.activeProfileId
        ? countChatsInProfile(GEMINI_APP_DIR)
        : countChatsInProfile(targetData);
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        chatCount,
        isActive: p.id === meta.activeProfileId,
        lastUsed: p.lastUsed || p.createdAt || 0
      };
    })
  };
}

function saveActiveProfile(customName) {
  const meta = loadMeta();
  if (!meta.activeProfileId) return false;

  const pFolder = path.join(PROFILES_DIR, meta.activeProfileId);
  fs.mkdirSync(pFolder, { recursive: true });

  // 1. Save chats: ALWAYS save live chats into active profile folder upon exit or switch
  const targetDataDir = path.join(pFolder, 'data');
  const curChats = countChatsInProfile(GEMINI_APP_DIR);
  if (curChats > 0) {
    copyChatItems(GEMINI_APP_DIR, targetDataDir);
  } else if (!fs.existsSync(targetDataDir)) {
    fs.mkdirSync(targetDataDir, { recursive: true });
  }

  // 2. Save token
  const token = readCredential('gemini:antigravity');
  if (token) {
    fs.writeFileSync(path.join(pFolder, 'token.json'), token, 'utf8');
  }

  // 3. Save UI storage and ensure onboarding accepted
  if (fs.existsSync(APP_STORAGE_FILE)) {
    try {
      let storage = JSON.parse(fs.readFileSync(APP_STORAGE_FILE, 'utf8'));
      storage = ensureOnboardingAccepted(storage);
      fs.writeFileSync(path.join(pFolder, 'app_storage.json'), JSON.stringify(storage, null, 2), 'utf8');
    } catch (e) {}
  }

  // 4. Save Cookies
  if (fs.existsSync(COOKIES_FILE)) {
    try {
      fs.copyFileSync(COOKIES_FILE, path.join(pFolder, 'Cookies'));
    } catch (e) {}
  }

  // 5. Update meta
  const p = meta.profiles.find(x => x.id === meta.activeProfileId);
  if (p) {
    p.lastUsed = Date.now();
    if (customName && typeof customName === 'string' && customName.trim()) {
      p.name = customName.trim();
    }
  }
  saveMeta(meta);
  return true;
}

function switchAccount(targetId) {
  const meta = loadMeta();
  if (!targetId || targetId === meta.activeProfileId) {
    return { success: true, message: 'Already active' };
  }

  const target = meta.profiles.find(p => p.id === targetId);
  if (!target) {
    throw new Error(`Profile ${targetId} not found`);
  }

  const targetFolder = path.join(PROFILES_DIR, targetId);
  if (!fs.existsSync(targetFolder)) {
    throw new Error(`Profile folder ${targetFolder} does not exist`);
  }

  // Automatic backup before switching
  createBackup('Автосохранение перед переключением аккаунта');

  // 1. Save current active profile state FIRST (chats, tokens, storage, cookies)
  saveActiveProfile();

  // 2. Chat handling:
  const targetDataDir = path.join(targetFolder, 'data');
  if (meta.isolateChats) {
    // If target profile has chats, load them.
    // If target profile has NO chats yet, automatically preserve current chats so user never has to press "Восстановить"!
    if (fs.existsSync(targetDataDir) && countChatsInProfile(targetDataDir) > 0) {
      clearActiveChatItems();
      copyChatItems(targetDataDir, GEMINI_APP_DIR);
    } else {
      copyChatItems(GEMINI_APP_DIR, targetDataDir);
    }
  } else {
    // Shared mode: chats are continuously available across all accounts!
    // Make sure target profile also has a copy of chats
    copyChatItems(GEMINI_APP_DIR, targetDataDir);
  }

  // 3. Restore target profile token to Windows Credential Manager
  const targetTokenFile = path.join(targetFolder, 'token.json');
  if (fs.existsSync(targetTokenFile)) {
    const tokenSecret = fs.readFileSync(targetTokenFile, 'utf8');
    writeCredential('gemini:antigravity', 'antigravity', tokenSecret);
  } else {
    deleteCredential('gemini:antigravity');
  }

  // 4. Restore app_storage.json, update username & permanently suppress onboarding/TOS popups
  let storage = {};
  const targetStorageFile = path.join(targetFolder, 'app_storage.json');
  if (fs.existsSync(targetStorageFile)) {
    try { storage = JSON.parse(fs.readFileSync(targetStorageFile, 'utf8')); } catch (e) {}
  } else if (fs.existsSync(APP_STORAGE_FILE)) {
    try { storage = JSON.parse(fs.readFileSync(APP_STORAGE_FILE, 'utf8')); } catch (e) {}
  }
  storage['jetski.onboarding.lastLoginUsername'] = target.email;
  storage = ensureOnboardingAccepted(storage);
  try {
    fs.writeFileSync(APP_STORAGE_FILE, JSON.stringify(storage, null, 2), 'utf8');
    fs.writeFileSync(path.join(targetFolder, 'app_storage.json'), JSON.stringify(storage, null, 2), 'utf8');
  } catch (e) {}

  // 5. Restore Cookies
  const targetCookiesFile = path.join(targetFolder, 'Cookies');
  if (fs.existsSync(targetCookiesFile)) {
    try {
      fs.copyFileSync(targetCookiesFile, COOKIES_FILE);
    } catch (e) {}
  } else if (fs.existsSync(COOKIES_FILE)) {
    try {
      fs.unlinkSync(COOKIES_FILE);
    } catch (e) {}
  }

  // 6. Update meta
  meta.activeProfileId = targetId;
  target.lastUsed = Date.now();
  meta.pendingNewAccount = false;
  saveMeta(meta);

  return { success: true, relaunch: true };
}

function addNewAccount() {
  const meta = loadMeta();

  // Automatic backup before adding account
  createBackup('Автосохранение перед добавлением аккаунта');

  // 1. Save active profile state
  saveActiveProfile();

  // 2. Clear active chats so new account starts fresh
  clearActiveChatItems();

  // 3. Delete active token from Windows Credential Manager so Google prompts login
  deleteCredential('gemini:antigravity');

  // 4. Clear lastLoginUsername in app_storage.json
  if (fs.existsSync(APP_STORAGE_FILE)) {
    try {
      let storage = JSON.parse(fs.readFileSync(APP_STORAGE_FILE, 'utf8'));
      storage['jetski.onboarding.lastLoginUsername'] = '';
      storage = ensureOnboardingAccepted(storage);
      fs.writeFileSync(APP_STORAGE_FILE, JSON.stringify(storage, null, 2), 'utf8');
    } catch (e) {}
  }

  // 5. Delete Cookies so browser OAuth prompt starts fresh
  if (fs.existsSync(COOKIES_FILE)) {
    try {
      fs.unlinkSync(COOKIES_FILE);
    } catch (e) {}
  }

  // 6. Mark pending
  meta.pendingNewAccount = true;
  saveMeta(meta);

  return { success: true, relaunch: true };
}

function deleteAccount(profileId) {
  const meta = loadMeta();
  if (profileId === meta.activeProfileId) {
    throw new Error('Cannot delete currently active profile');
  }

  meta.profiles = meta.profiles.filter(p => p.id !== profileId);
  const pFolder = path.join(PROFILES_DIR, profileId);
  if (fs.existsSync(pFolder)) {
    try {
      fs.rmSync(pFolder, { recursive: true, force: true });
    } catch (e) {}
  }

  saveMeta(meta);
  return { success: true };
}

function renameAccount(profileId, newName) {
  if (!newName || !newName.trim()) return { success: false };
  const meta = loadMeta();
  const p = meta.profiles.find(x => x.id === profileId);
  if (!p) throw new Error('Profile not found');
  p.name = newName.trim();
  saveMeta(meta);
  return { success: true };
}

function setIsolateChats(isolate) {
  const meta = loadMeta();
  meta.isolateChats = Boolean(isolate);
  saveMeta(meta);
  return { success: true, isolateChats: meta.isolateChats };
}

// --- IPC Registration for Electron Main Process ---
function registerAccountIpc(ipcMain) {
  if (!ipcMain) return;

  // Auto-save active profile on app exit
  try {
    const { app } = require('electron');
    if (app) {
      app.on('before-quit', () => {
        try { saveActiveProfile(); } catch (e) {}
      });
      app.on('will-quit', () => {
        try { saveActiveProfile(); } catch (e) {}
      });
    }
  } catch (e) {}

  ipcMain.handle('agmod:get-accounts', async () => {
    return getAccountsList();
  });

  ipcMain.handle('agmod:save-account', async (_event, customName) => {
    return saveActiveProfile(customName);
  });

  ipcMain.handle('agmod:switch-account', async (_event, targetId) => {
    const res = switchAccount(targetId);
    if (res.success && res.relaunch) {
      setTimeout(() => {
        try {
          const { app } = require('electron');
          app.relaunch();
          app.exit(0);
        } catch (e) {}
      }, 300);
    }
    return res;
  });

  ipcMain.handle('agmod:add-account', async () => {
    const res = addNewAccount();
    if (res.success && res.relaunch) {
      setTimeout(() => {
        try {
          const { app } = require('electron');
          app.relaunch();
          app.exit(0);
        } catch (e) {}
      }, 300);
    }
    return res;
  });

  ipcMain.handle('agmod:delete-account', async (_event, profileId) => {
    return deleteAccount(profileId);
  });

  ipcMain.handle('agmod:rename-account', async (_event, profileId, newName) => {
    return renameAccount(profileId, newName);
  });

  ipcMain.handle('agmod:set-isolate-chats', async (_event, isolate) => {
    return setIsolateChats(isolate);
  });

  ipcMain.handle('agmod:create-backup', async (_event, label) => {
    return createBackup(label);
  });

  ipcMain.handle('agmod:list-backups', async () => {
    return listBackups();
  });

  ipcMain.handle('agmod:restore-backup', async (_event, backupId) => {
    const res = restoreBackup(backupId);
    if (res.success && res.relaunch) {
      setTimeout(() => {
        try {
          const { app } = require('electron');
          app.relaunch();
          app.exit(0);
        } catch (e) {}
      }, 300);
    }
    return res;
  });
}

module.exports = {
  initAccountManager,
  getAccountsList,
  saveActiveProfile,
  switchAccount,
  addNewAccount,
  deleteAccount,
  renameAccount,
  setIsolateChats,
  createBackup,
  listBackups,
  restoreBackup,
  registerAccountIpc,
  readCredential,
  writeCredential,
  deleteCredential,
  extractEmailFromToken,
  PROFILES_ROOT,
  PROFILES_DIR,
  BACKUPS_DIR,
  META_FILE
};
