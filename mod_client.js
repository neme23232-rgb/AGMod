/**
 * AGMod client runtime for Google Antigravity.
 * https://github.com/neme23232-rgb/AGMod
 */
(function() {
  if (window.__AG_MOD_INITIALIZED__) return;
  window.__AG_MOD_INITIALIZED__ = true;

  const LOCALES = __ALL_LOCALES__;

  const REVERSE_DICT = new Map();
  function initReverseDict() {
    REVERSE_DICT.clear();
    for (const lang of Object.keys(LOCALES)) {
      const dict = LOCALES[lang];
      if (!dict || typeof dict !== 'object') continue;
      for (const [enKey, transVal] of Object.entries(dict)) {
        if (transVal && typeof transVal === 'string' && transVal !== enKey) {
          if (!REVERSE_DICT.has(transVal)) {
            REVERSE_DICT.set(transVal, enKey);
          }
        }
      }
    }
  }
  initReverseDict();

  const BUILTIN_THEMES = __ALL_THEMES__;

  const LANG_CONFIG = {
    'ru': { name: 'Русский', short: 'RU' },
    'uk': { name: 'Українська', short: 'UK' },
    'en': { name: 'English', short: 'EN' },
    'de': { name: 'Deutsch', short: 'DE' },
    'fr': { name: 'Français', short: 'FR' },
    'es': { name: 'Español', short: 'ES' },
    'zh': { name: '中文', short: 'ZH' }
  };

  const MOD_I18N = {
    ru: {
      googleAccount: 'Аккаунт Google',
      googleAccountDesc: 'Управление несколькими аккаунтами и изолированными чатами',
      activeAccount: 'Активен',
      currentAccountBadge: 'Текущий',
      switchAccountBtn: 'Выбрать',
      addAccountBtn: 'Добавить аккаунт',
      chatsCountLabel: 'диалогов',
      deleteAccountBtn: 'Удалить',
      clickToExpand: 'Нажмите для выбора или добавления аккаунтов',
      confirmAddAccount: 'Текущие диалоги и сессия будут сохранены в текущем профиле. Приложение перезапустится для входа в новый аккаунт Google. Продолжить?',
      confirmDeleteAccount: 'Удалить этот профиль из списка сохранённых аккаунтов?',
      dialogsBackup: 'Сохранение диалогов',
      dialogsBackupDesc: 'Резервные копии всех чатов с защитой от сбоев и потери данных',
      createBackupBtn: 'Создать копию',
      backupCreatedToast: 'Резервная копия диалогов успешно сохранена!',
      restoreBackupBtn: 'Восстановить',
      confirmRestoreBackup: 'Восстановить диалоги из этой резервной копии? Приложение перезапустится.',
      restoringBackupToast: 'Восстановление диалогов... Antigravity перезапускается',
      noBackupsYet: 'Резервных копий пока нет',
      autoBackupNotice: 'Автоматическое сохранение выполняется перед каждой сменой аккаунта',
      syncChatsTitle: 'Общая история диалогов',
      syncChatsDesc: 'Автосохранение и доступность чатов при переключении любого аккаунта',


      switchingAccountToast: 'Переключение аккаунта... Antigravity перезапускается',
      addingAccountToast: 'Подготовка к входу в новый аккаунт... Antigravity перезапускается',
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: 'Оформление, темы, системные шрифты и полная локализация Antigravity',
      themesTitle: 'Темы оформления',
      themesSubtitle: 'Цветовая палитра и стили пользовательского интерфейса',
      presetTitle: 'Готовый стиль',
      presetDesc: 'Выберите одну из 14 дизайнерских тем или настройте свою.',
      quickAccents: 'Быстрые акценты',
      quickAccentsDesc: 'Смена главного акцентного цвета в один клик',
      active: 'Активна',
      customStudio: 'Кастомная студия цветов',
      customStudioDesc: 'Тонкая настройка палитры интерфейса — изменения применяются на лету',
      applyCustom: 'Применить тему',
      accent: 'Акцент',
      secondaryAccent: 'Второй акцент',
      bg: 'Фон',
      sidebar: 'Боковая панель',
      cards: 'Карточки',
      borders: 'Границы',
      text: 'Текст',
      syntaxPreview: 'Живой пример синтаксиса текущей темы',
      langTitle: 'Язык интерфейса',
      langSubtitle: 'Мгновенный перевод всей среды Antigravity на лету',
      langPackage: 'Языковой пакет',
      quickSwitch: 'Быстрое переключение',
      quickSwitchDesc: 'Смена языка в один клик без перезапуска приложения.',
      phrases: 'фраз',
      original: 'Оригинал',
      typographyTitle: 'Шрифты и плотность',
      typographySubtitle: 'Системные шрифты с вашего ПК, свои файлы и компактный вид',
      fontFamily: 'Основной шрифт',
      fontFamilyDesc: 'Выберите рекомендуемый шрифт или используйте шрифты с компьютера',
      scanPC: 'Найти на ПК',
      scanning: 'Ищем шрифты...',
      foundFonts: 'Найдено на ПК',
      uploadFont: 'Загрузить файл шрифта',
      uploadFontDesc: 'Поддерживаются форматы .woff2, .woff, .ttf, .otf',
      browseFile: 'Обзор...',
      loaded: 'Загружен',
      compactMode: 'Компактный режим',
      compactModeDesc: 'Узкая боковая панель (220px) и аккуратные отступы для максимума рабочей области',
      settingsManage: 'Действия и сброс',
      copyTheme: 'Экспорт темы',
      copyThemeDesc: 'Скопировать текущую цветовую палитру в формате JSON для отправки или бэкапа',
      copyThemeBtn: 'Скопировать JSON',
      copied: 'Скопировано!',
      resetDefaults: 'Сбросить всё',
      reloadWindow: 'Перезагрузить окно',
      reloadDesc: 'Быстро перезагружает веб-интерфейс без закрытия программы.',
      confirmReset: 'Вернуть оформление, шрифты и язык к исходным настройкам?',
      recommendedGroup: 'Рекомендуемые шрифты',
      systemFontsGroup: 'Шрифты на вашем ПК'
    },
    uk: {
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: 'Оформлення, колірні палітри, системні шрифти та локалізація Antigravity',
      themesTitle: 'Теми оформлення',
      themesSubtitle: 'Колірна палітра та стилі інтерфейсу',
      presetTitle: 'Готовий стиль',
      presetDesc: 'Оберіть одну з 14 дизайнерських тем або налаштуйте свою.',
      quickAccents: 'Швидкі акценти',
      quickAccentsDesc: 'Зміна головного акцентного кольору в один клік',
      active: 'Активна',
      customStudio: 'Студія власних кольорів',
      customStudioDesc: 'Тонке налаштування палітри інтерфейсу — зміни застосовуються на льоту',
      applyCustom: 'Застосувати тему',
      accent: 'Акцент',
      secondaryAccent: 'Другий акцент',
      bg: 'Фон',
      sidebar: 'Бічна панель',
      cards: 'Картки',
      borders: 'Межі',
      text: 'Текст',
      syntaxPreview: 'Живий приклад синтаксису поточної теми',
      langTitle: 'Мова інтерфейсу',
      langSubtitle: 'Миттєвий переклад усього середовища Antigravity на льоту',
      langPackage: 'Мовний пакет',
      quickSwitch: 'Швидке перемикання',
      quickSwitchDesc: 'Зміна мови в один клік без перезапуску програми.',
      phrases: 'фраз',
      original: 'Оригінал',
      typographyTitle: 'Шрифти та щільність',
      typographySubtitle: 'Системні шрифти з вашого ПК, власні файли та компактний вигляд',
      fontFamily: 'Основний шрифт',
      fontFamilyDesc: 'Оберіть рекомендований шрифт або використовуйте системні шрифти',
      scanPC: 'Знайти на ПК',
      scanning: 'Шукаємо шрифти...',
      foundFonts: 'Знайдено на ПК',
      uploadFont: 'Завантажити файл шрифту',
      uploadFontDesc: 'Підтримуються формати .woff2, .woff, .ttf, .otf',
      browseFile: 'Огляд...',
      loaded: 'Завантажено',
      compactMode: 'Компактний режим',
      compactModeDesc: 'Вузька бічна панель (220px) та акуратні відступи для максимального простору',
      settingsManage: 'Дії та скидання',
      copyTheme: 'Експорт теми',
      copyThemeDesc: 'Скопіювати поточну колірну палітру у форматі JSON',
      copyThemeBtn: 'Скопіювати JSON',
      copied: 'Скопійовано!',
      resetDefaults: 'Скинути все',
      reloadWindow: 'Перезавантажити вікно',
      reloadDesc: 'Швидко перезавантажує веб-інтерфейс без закриття програми.',
      confirmReset: 'Повернути оформлення, шрифти та мову до початкових налаштувань?',
      recommendedGroup: 'Рекомендовані шрифти',
      systemFontsGroup: 'Шрифти на вашому ПК'
    },
    en: {
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: 'Appearance themes, color palettes, system fonts, and localization',
      themesTitle: 'Appearance Themes',
      themesSubtitle: 'Interface color scheme and visual styling',
      presetTitle: 'Preset',
      presetDesc: 'Select a pre-configured color theme or customize your own.',
      quickAccents: 'Quick Accents',
      quickAccentsDesc: 'Instant one-click accent styling for the entire interface',
      active: 'Active',
      customStudio: 'Custom Theme Studio',
      customStudioDesc: 'Fine-tune interface colors with instant real-time preview',
      applyCustom: 'Apply Theme',
      accent: 'Accent',
      secondaryAccent: 'Secondary Accent',
      bg: 'Background',
      sidebar: 'Sidebar',
      cards: 'Cards',
      borders: 'Borders',
      text: 'Text',
      syntaxPreview: 'Active theme syntax preview',
      langTitle: 'Interface Language',
      langSubtitle: 'Instant translation across the entire Antigravity workspace',
      langPackage: 'Language Package',
      quickSwitch: 'Quick Switch',
      quickSwitchDesc: 'Instant single-click switching.',
      phrases: 'phrases',
      original: 'Original',
      typographyTitle: 'Typography & Density',
      typographySubtitle: 'PC system font discovery, custom font files, and high-density mode',
      fontFamily: 'Font Family',
      fontFamilyDesc: 'Select a curated font or discover fonts installed on your PC',
      scanPC: 'Scan PC',
      scanning: 'Scanning...',
      foundFonts: 'Found',
      uploadFont: 'Upload Font File',
      uploadFontDesc: 'Supports .woff2, .woff, .ttf, and .otf font files',
      browseFile: 'Browse file...',
      loaded: 'Loaded',
      compactMode: 'Ultra-Compact Mode',
      compactModeDesc: 'Slim sidebar (220px), tight padding, and maximized workspace view',
      settingsManage: 'Settings Management',
      copyTheme: 'Export Theme',
      copyThemeDesc: 'Copy active color palette configuration in JSON format',
      copyThemeBtn: 'Copy JSON',
      copied: 'Copied!',
      resetDefaults: 'Reset Defaults',
      reloadWindow: 'Reload Window',
      reloadDesc: 'Reloads the web interface window without closing the application.',
      confirmReset: 'Reset all appearance, font, and language settings to defaults?',
      recommendedGroup: 'Curated Fonts',
      systemFontsGroup: 'Fonts from your PC'
    },
    de: {
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: 'Design-Themes, Farbschemata, Systemschriften und Lokalisierung',
      themesTitle: 'Design-Themes',
      themesSubtitle: 'Farbschema der Antigravity-Benutzeroberfläche',
      presetTitle: 'Voreinstellung',
      presetDesc: 'Wählen Sie ein vorgefertigtes Farbschema oder passen Sie Ihr eigenes an.',
      quickAccents: 'Schnell-Akzente',
      quickAccentsDesc: 'Sofortige Akzentfarben-Anpassung mit einem Klick',
      active: 'Aktiv',
      customStudio: 'Benutzerdefiniertes Theme-Studio',
      customStudioDesc: 'Passen Sie die Hauptfarben mit sofortiger Live-Vorschau an',
      applyCustom: 'Theme anwenden',
      accent: 'Akzent',
      secondaryAccent: 'Sekundärer Akzent',
      bg: 'Hintergrund',
      sidebar: 'Seitenleiste',
      cards: 'Karten',
      borders: 'Rahmen',
      text: 'Text',
      syntaxPreview: 'Syntax-Vorschau des aktiven Themes',
      langTitle: 'Sprache der Benutzeroberfläche',
      langSubtitle: 'Sofortige Übersetzung der gesamten Arbeitsumgebung',
      langPackage: 'Sprachpaket',
      quickSwitch: 'Schnellumschaltung',
      quickSwitchDesc: 'Sofortiger Wechsel mit einem Klick.',
      phrases: 'Phrasen',
      original: 'Original',
      typographyTitle: 'Typografie & Dichte',
      typographySubtitle: 'Systemschriftarten, Schrift-Upload und Ultra-Kompaktmodus',
      fontFamily: 'Schriftfamilie',
      fontFamilyDesc: 'Wählen Sie vordefinierte oder auf dem PC installierte Schriften',
      scanPC: 'PC durchsuchen',
      scanning: 'Suche...',
      foundFonts: 'Gefunden',
      uploadFont: 'Schriftdatei laden',
      uploadFontDesc: 'Unterstützt die Formate .woff2, .woff, .ttf und .otf',
      browseFile: 'Datei auswählen...',
      loaded: 'Geladen',
      compactMode: 'Ultra-Kompaktmodus',
      compactModeDesc: 'Schmale Seitenleiste (220px), minimale Abstände und mehr Übersicht',
      settingsManage: 'Parameterverwaltung',
      copyTheme: 'Theme exportieren',
      copyThemeDesc: 'Aktuelle Theme-Konfiguration als JSON kopieren',
      copyThemeBtn: 'JSON kopieren',
      copied: 'Kopiert!',
      resetDefaults: 'Standard wiederherstellen',
      reloadWindow: 'Neu laden',
      reloadDesc: 'Lädt das Webinterface-Fenster neu, ohne das Programm zu beenden.',
      confirmReset: 'Alle Design- und Spracheinstellungen auf Standard zurücksetzen?',
      recommendedGroup: 'Empfohlene Schriften',
      systemFontsGroup: 'Schriften auf dem PC'
    },
    fr: {
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: 'Thèmes d\'apparence, palettes de couleurs, polices système et localisation',
      themesTitle: 'Thèmes d\'apparence',
      themesSubtitle: 'Schéma de couleurs de l\'interface utilisateur',
      presetTitle: 'Préréglage',
      presetDesc: 'Choisissez un thème prédéfini ou personnalisez le vôtre.',
      quickAccents: 'Accents rapides',
      quickAccentsDesc: 'Personnalisation instantanée de l\'accent en un clic',
      active: 'Actif',
      customStudio: 'Studio de thème personnalisé',
      customStudioDesc: 'Ajustez les couleurs de l\'interface avec prévisualisation en direct',
      applyCustom: 'Appliquer le thème',
      accent: 'Accent',
      secondaryAccent: 'Accent secondaire',
      bg: 'Arrière-plan',
      sidebar: 'Barre latérale',
      cards: 'Cartes',
      borders: 'Bordures',
      text: 'Texte',
      syntaxPreview: 'Aperçu de la syntaxe du thème actif',
      langTitle: 'Langue de l\'interface',
      langSubtitle: 'Traduction instantanée de tout l\'espace de travail Antigravity',
      langPackage: 'Pack de langue',
      quickSwitch: 'Changement rapide',
      quickSwitchDesc: 'Basculement instantané en un clic.',
      phrases: 'phrases',
      original: 'Original',
      typographyTitle: 'Typographie et densité',
      typographySubtitle: 'Polices système du PC, fichiers personnalisés et mode ultra-compact',
      fontFamily: 'Famille de polices',
      fontFamilyDesc: 'Choisissez une police intégrée ou détectez les polices de votre PC',
      scanPC: 'Scanner le PC',
      scanning: 'Recherche...',
      foundFonts: 'Trouvé',
      uploadFont: 'Téléverser une police',
      uploadFontDesc: 'Prend en charge les fichiers .woff2, .woff, .ttf et .otf',
      browseFile: 'Choisir un fichier...',
      loaded: 'Chargé',
      compactMode: 'Mode ultra-compact',
      compactModeDesc: 'Barre latérale fine (220px), marges réduites et espace de travail maximal',
      settingsManage: 'Gestion des параметров',
      copyTheme: 'Exporter le thème',
      copyThemeDesc: 'Copier la configuration du thème actif au format JSON',
      copyThemeBtn: 'Copier JSON',
      copied: 'Copié !',
      resetDefaults: 'Réinitialiser',
      reloadWindow: 'Recharger',
      reloadDesc: 'Recharge la fenêtre de l\'interface web sans fermer l\'application.',
      confirmReset: 'Réinitialiser tous les paramètres d\'apparence et de langue ?',
      recommendedGroup: 'Polices recommandées',
      systemFontsGroup: 'Polices du PC'
    },
    es: {
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: 'Temas de apariencia, paletas de colores, fuentes del sistema y localización',
      themesTitle: 'Temas de apariencia',
      themesSubtitle: 'Esquema de colores de la interfaz de usuario',
      presetTitle: 'Preajuste',
      presetDesc: 'Elige un esquema predefinido o personaliza el tuyo.',
      quickAccents: 'Acentos rápidos',
      quickAccentsDesc: 'Personalización instantánea del color de acento con un clic',
      active: 'Activo',
      customStudio: 'Estudio de temas personalizados',
      customStudioDesc: 'Ajusta los colores principales con vista previa en tiempo real',
      applyCustom: 'Aplicar tema',
      accent: 'Acento',
      secondaryAccent: 'Acento secundario',
      bg: 'Fondo',
      sidebar: 'Barra lateral',
      cards: 'Tarjetas',
      borders: 'Bordes',
      text: 'Texto',
      syntaxPreview: 'Vista previa de sintaxis del tema activo',
      langTitle: 'Idioma de la interfaz',
      langSubtitle: 'Traducción instantánea de todo el espacio de trabajo Antigravity',
      langPackage: 'Paquete de idioma',
      quickSwitch: 'Cambio rápido',
      quickSwitchDesc: 'Cambio instantáneo en un clic.',
      phrases: 'frases',
      original: 'Original',
      typographyTitle: 'Tipografía y densidad',
      typographySubtitle: 'Detección de fuentes del PC, archivos externos y modo ultra compacto',
      fontFamily: 'Familia de fuentes',
      fontFamilyDesc: 'Elige una fuente integrada o explora las fuentes de tu ordenador',
      scanPC: 'Buscar en PC',
      scanning: 'Buscando...',
      foundFonts: 'Encontrado',
      uploadFont: 'Subir archivo de fuente',
      uploadFontDesc: 'Admite archivos en formato .woff2, .woff, .ttf y .otf',
      browseFile: 'Elegir archivo...',
      loaded: 'Cargado',
      compactMode: 'Modo ultra compacto',
      compactModeDesc: 'Barra lateral delgada (220px), márgenes mínimos y máxima área de trabajo',
      settingsManage: 'Gestión de parámetros',
      copyTheme: 'Exportar tema',
      copyThemeDesc: 'Copiar configuración del tema activo en formato JSON',
      copyThemeBtn: 'Copiar JSON',
      copied: '¡Copiado!',
      resetDefaults: 'Restablecer',
      reloadWindow: 'Recargar',
      reloadDesc: 'Recarga la ventana de la interfaz web sin cerrar la aplicación.',
      confirmReset: '¿Restablecer todas las configuraciones de apariencia e idioma?',
      recommendedGroup: 'Fuentes recomendadas',
      systemFontsGroup: 'Fuentes del PC'
    },
    zh: {
      tabTitle: 'AGMod',
      tabBadge: 'MOD',
      headerTitle: 'AGMod',
      headerSubtitle: '外观主题、配色方案、本机系统字体与 Antigravity 全面本地化',
      themesTitle: '外观主题',
      themesSubtitle: '用户界面的核心配色与视觉风格',
      presetTitle: '预设',
      presetDesc: '选择现成的配色方案或自定义您的专属主题。',
      quickAccents: '快捷强调色',
      quickAccentsDesc: '一键即时切换界面核心强调色',
      active: '当前启用',
      customStudio: '自定义主题工作室',
      customStudioDesc: '微调界面关键色彩，即时生效预览',
      applyCustom: '应用主题',
      accent: '强调色',
      secondaryAccent: '次要强调色',
      bg: '背景色',
      sidebar: '侧边栏',
      cards: '卡片',
      borders: '边框',
      text: '文字',
      syntaxPreview: '当前主题语法高亮预览',
      langTitle: '界面语言',
      langSubtitle: '瞬间本地化 Antigravity 的整个工作区',
      langPackage: '语言包',
      quickSwitch: '快捷切换',
      quickSwitchDesc: '一键即时切换。',
      phrases: '短语',
      original: '原始语言',
      typographyTitle: '字体与排版密度',
      typographySubtitle: '发现电脑本机安装的字体、上传字体文件及高密度紧凑模式',
      fontFamily: '字体族',
      fontFamilyDesc: '选择精选字体或扫描当前电脑中已安装的所有字体',
      scanPC: '扫描本机字体',
      scanning: '正在搜索...',
      foundFonts: '已找到',
      uploadFont: '上传字体文件',
      uploadFontDesc: '支持 .woff2, .woff, .ttf, .otf 等字体文件',
      browseFile: '选择文件...',
      loaded: '已加载',
      compactMode: '超级紧凑模式',
      compactModeDesc: '极致压缩侧边栏（220px）、缩小间距，释放最大视野区域',
      settingsManage: '配置管理',
      copyTheme: '导出主题',
      copyThemeDesc: '以 JSON 格式复制当前主题的配色方案配置',
      copyThemeBtn: '复制 JSON',
      copied: '已复制！',
      resetDefaults: '恢复默认设置',
      reloadWindow: '重新加载窗口',
      reloadDesc: '在不关闭应用程序的情况下重新加载界面。',
      confirmReset: '确定要将所有外观、字体和语言设置恢复为默认值吗？',
      recommendedGroup: '精选推荐',
      systemFontsGroup: '本机系统字体'
    }
  };

  const TG_ICONS = {
    // Google Official 4-Color Logo
    google: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/></svg>`,

    // Apple SF Symbols (Telegram iOS Icons pack) - Pixel-perfect vector icons
    globe: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    keyboard: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
    wand: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.49 2 2 6.49 2 12c0 4.41 3.59 8 8 8 .55 0 1-.45 1-1 0-.25-.09-.48-.24-.65-.16-.18-.26-.41-.26-.65 0-.55.45-1 1-1h1.5c4.14 0 7.5-3.36 7.5-7.5C20.5 5.82 16.68 2 12 2z"/><circle cx="7.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="12" cy="6.5" r="1.5" fill="currentColor"/><circle cx="16.5" cy="8.5" r="1.5" fill="currentColor"/><circle cx="8.5" cy="13.5" r="1.5" fill="currentColor"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    sliders: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
    logout: `<svg viewBox="0 0 24 24" width="15" height="15" style="width:15px;height:15px;min-width:15px;min-height:15px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" width="13" height="13" style="width:13px;height:13px;min-width:13px;min-height:13px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    folder: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
    profile: `<svg viewBox="0 0 24 24" width="16" height="16" style="width:16px;height:16px;min-width:16px;min-height:16px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    check: `<svg viewBox="0 0 24 24" width="14" height="14" style="width:14px;height:14px;min-width:14px;min-height:14px;flex-shrink:0;" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
  };

  const DEFAULT_FONTS = [
    { id: 'default', name: 'Default System Font', family: '' },
    { id: 'jetbrains', name: 'JetBrains Mono', family: '"JetBrains Mono", monospace' },
    { id: 'fira-code', name: 'Fira Code', family: '"Fira Code", monospace' },
    { id: 'cascadia', name: 'Cascadia Code', family: '"Cascadia Code", "Cascadia Mono", monospace' },
    { id: 'inter', name: 'Inter', family: '"Inter", sans-serif' }
  ];

  // -------------------------------------------------------------
  // State and storage persistence
  // -------------------------------------------------------------
  let currentLang = 'ru';
  let currentThemeId = 'catppuccin-mocha';
  let isCompact = false;
  let currentFontId = 'default';
  let customFontFamily = '';
  let customFontCSS = '';
  let discoveredSystemFonts = [];
  let isCustomStudioExpanded = false;

  // Custom User Theme state
  let customThemeConfig = {
    id: 'custom-theme',
    name: 'Custom Theme',
    author: 'User',
    accent: '#00f0ff',
    preview: { bg: '#0d1117', sidebar: '#090d13', accent: '#00f0ff', text: '#f0f6fc' },
    variables: {
      '--background': '#0d1117',
      '--foreground': '#f0f6fc',
      '--sidebar': '#090d13',
      '--sidebar-secondary': '#161b22',
      '--sidebar-muted': '#30363d',
      '--card': '#161b22',
      '--card-border': '#30363d',
      '--border': '#30363d',
      '--primary': '#00f0ff',
      '--primary-foreground': '#000000',
      '--secondary': '#21262d',
      '--secondary-foreground': '#f0f6fc',
      '--muted': '#161b22',
      '--muted-foreground': '#8b949e',
      '--scrollbar-color': '#30363d'
    }
  };

  // Initial state
  try {
    if (window.agModBridge && typeof window.agModBridge.readSettings === 'function') {
      const disk = window.agModBridge.readSettings();
      if (disk && typeof disk === 'object') {
        if (disk.lang && (LOCALES[disk.lang] || disk.lang === 'en')) currentLang = disk.lang;
        if (disk.themeId) currentThemeId = disk.themeId;
        if (disk.isCompact !== undefined) isCompact = !!disk.isCompact;
        if (disk.fontId) currentFontId = disk.fontId;
        if (disk.customFontFamily) customFontFamily = disk.customFontFamily;
        if (disk.customFontCSS) customFontCSS = disk.customFontCSS;
        if (disk.customThemeConfig && disk.customThemeConfig.variables) customThemeConfig = disk.customThemeConfig;
      }
    }
  } catch (e) {
    console.warn('[AGMod] Could not read disk settings bridge:', e);
  }

  try {
    const sLang = localStorage.getItem('ag_user_lang');
    if (sLang && (LOCALES[sLang] || sLang === 'en')) currentLang = sLang;
    const sTheme = localStorage.getItem('ag_active_theme');
    if (sTheme) currentThemeId = sTheme;
    const sCompact = localStorage.getItem('ag_compact_mode');
    if (sCompact !== null) isCompact = sCompact === 'true';
    const sFont = localStorage.getItem('ag_active_font');
    if (sFont) currentFontId = sFont;
    const sCustomFont = localStorage.getItem('ag_custom_font_family');
    if (sCustomFont) customFontFamily = sCustomFont;
    const sCustomCSS = localStorage.getItem('ag_custom_font_css');
    if (sCustomCSS) customFontCSS = sCustomCSS;
    const sSystemFonts = localStorage.getItem('ag_system_fonts');
    if (sSystemFonts) {
      try {
        const parsed = JSON.parse(sSystemFonts);
        if (Array.isArray(parsed) && parsed.length > 0) discoveredSystemFonts = parsed;
      } catch (e) {}
    }
    if (currentFontId && currentFontId.startsWith('sys-')) {
      const activeSysName = currentFontId.replace('sys-', '');
      if (activeSysName && !discoveredSystemFonts.includes(activeSysName)) {
        discoveredSystemFonts.unshift(activeSysName);
      }
    }
    const sCustomTheme = localStorage.getItem('ag_custom_user_theme');
    if (sCustomTheme) {
      try {
        const parsed = JSON.parse(sCustomTheme);
        if (parsed && parsed.variables) customThemeConfig = parsed;
      } catch (e) {}
    }
  } catch (e) {}

  // Sync nativeStorage
  if (window.nativeStorage && typeof window.nativeStorage.getItems === 'function') {
    window.nativeStorage.getItems().then(items => {
      if (!items) return;
      let changed = false;
      if (items.ag_user_lang && items.ag_user_lang !== currentLang && (LOCALES[items.ag_user_lang] || items.ag_user_lang === 'en')) {
        currentLang = items.ag_user_lang;
        changed = true;
      }
      if (items.ag_active_theme && items.ag_active_theme !== currentThemeId) {
        currentThemeId = items.ag_active_theme;
        changed = true;
      }
      if (items.ag_compact_mode !== undefined && (items.ag_compact_mode === 'true') !== isCompact) {
        isCompact = items.ag_compact_mode === 'true';
        changed = true;
      }
      if (items.ag_active_font && items.ag_active_font !== currentFontId) {
        currentFontId = items.ag_active_font;
        changed = true;
      }
      if (items.ag_custom_user_theme) {
        try {
          const parsed = JSON.parse(items.ag_custom_user_theme);
          if (parsed && parsed.variables) {
            customThemeConfig = parsed;
            changed = true;
          }
        } catch (e) {}
      }
      if (changed) {
        updateActiveDict();
        applyThemeStyles();
        translateNode(document.body);
        updateTabLabel();
        updateSettingsPaneUI();
      }
    }).catch(() => {});
  }

  // State persistence
  async function persistSettings() {
    const bundle = {
      lang: currentLang,
      themeId: currentThemeId,
      isCompact: isCompact,
      fontId: currentFontId,
      customFontFamily: customFontFamily,
      customFontCSS: customFontCSS,
      customThemeConfig: customThemeConfig
    };

    try {
      if (window.agModBridge && typeof window.agModBridge.saveSettings === 'function') {
        window.agModBridge.saveSettings(bundle);
      }
    } catch (e) {}

    try {
      if (window.nativeStorage && typeof window.nativeStorage.updateItems === 'function') {
        await window.nativeStorage.updateItems({
          'ag_user_lang': currentLang,
          'ag_active_theme': currentThemeId,
          'ag_compact_mode': String(isCompact),
          'ag_active_font': currentFontId,
          'ag_custom_font_family': customFontFamily,
          'ag_custom_font_css': customFontCSS,
          'ag_custom_user_theme': JSON.stringify(customThemeConfig)
        });
      }
    } catch (e) {}

    const safeSet = (key, val) => {
      try {
        if (val !== undefined && val !== null) {
          localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
        }
      } catch (e) {
        console.warn(`[AGMod] Failed to save ${key} to localStorage:`, e.message);
      }
    };

    safeSet('ag_user_lang', currentLang);
    safeSet('ag_active_theme', currentThemeId);
    safeSet('ag_compact_mode', String(isCompact));
    safeSet('ag_active_font', currentFontId);
    safeSet('ag_custom_font_family', customFontFamily);
    safeSet('ag_custom_font_css', customFontCSS);
    safeSet('ag_custom_user_theme', customThemeConfig);
  }

  function getAllThemes() {
    const all = { ...BUILTIN_THEMES };
    all['custom-theme'] = customThemeConfig;
    return all;
  }

  // -------------------------------------------------------------
  // Theme and styling engine
  // -------------------------------------------------------------
  function applyThemeStyles() {
    const target = document.head || document.documentElement;
    if (!target) return;

    let styleEl = document.getElementById('ag-mod-theme-style');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'ag-mod-theme-style';
      target.appendChild(styleEl);
    }

    const allThemes = getAllThemes();
    const theme = allThemes[currentThemeId] || allThemes['catppuccin-mocha'] || allThemes['default'] || {};
    const bg = (theme.variables && theme.variables['--background']) || '#1e1e2e';
    let isLightMode = false;
    if (typeof bg === 'string' && bg.startsWith('#') && bg.length >= 7) {
      const r = parseInt(bg.substring(1, 3), 16) || 0;
      const g = parseInt(bg.substring(3, 5), 16) || 0;
      const b = parseInt(bg.substring(5, 7), 16) || 0;
      isLightMode = (0.299 * r + 0.587 * g + 0.114 * b) > 130;
    }
    const hoverBg = isLightMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.07)';
    const activeBg = isLightMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)';

    let css = `
      #ag-custom-test-pane, #ag-custom-test-pane * {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        letter-spacing: normal !important;
      }
      #ag-custom-test-pane code, #ag-custom-test-pane pre {
        font-family: "JetBrains Mono", monospace !important;
      }
      
            .ag-account-ring {
        border-radius: 50%;
        padding: 2.5px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-sizing: border-box;
      }
      .ag-ring-pro {
        background: linear-gradient(135deg, #1a73e8 0%, #4285f4 35%, #9b72cb 70%, #d946ef 100%);
      }
      .ag-ring-ultra {
        background: linear-gradient(135deg, #7c3aed 0%, #c026d3 50%, #06b6d4 100%);
      }
      .ag-ring-one {
        background: conic-gradient(from 45deg, #4285f4 0% 25%, #34a853 25% 50%, #fbbc05 50% 75%, #ea4335 75% 100%);
      }
      .ag-ring-plus {
        background: linear-gradient(135deg, #0ea5e9, #06b6d4, #10b981);
      }
      .ag-ring-none {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 0;
      }
/* AGMod Transitions & Global Overrides */
      body, .bg-card, .bg-background, aside, header, nav, div[role="dialog"] {
        transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease !important;
      }
      .hover\\:bg-sidebar-muted:hover {
        background-color: ${hoverBg} !important;
      }
      .bg-sidebar-secondary {
        background-color: ${activeBg} !important;
      }
    `;

    if (theme && theme.variables && Object.keys(theme.variables).length > 0) {
      const vars = Object.entries(theme.variables)
        .map(([k, v]) => `  ${k}: ${v} !important;`)
        .join('\n');

      css += `
:root, html, body {
${vars}
}

/* Tailwind utility bindings */
.bg-background { background-color: var(--background) !important; }
.bg-card { background-color: var(--card) !important; }
.border-border { border-color: var(--border) !important; }
.text-foreground { color: var(--foreground) !important; }
.text-muted-foreground { color: var(--muted-foreground) !important; }
.bg-sidebar { background-color: var(--sidebar, var(--card)) !important; }
.bg-sidebar-secondary { background-color: var(--sidebar-secondary, var(--secondary)) !important; }

/* Custom scrollbars */
::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color, #45475a) !important;
  border-radius: 9999px !important;
}
`;
    }

    if (isCompact) {
      css += `
/* Deep High-Density Compact Mode */
:root {
  --ag-compact-density: 0.82;
}

.p-4 { padding: 0.5rem !important; }
.p-6 { padding: 0.75rem !important; }
.p-5 { padding: 0.65rem !important; }
.p-3 { padding: 0.4rem !important; }
.gap-6 { gap: 0.65rem !important; }
.gap-4 { gap: 0.5rem !important; }
.gap-3 { gap: 0.35rem !important; }
.gap-2 { gap: 0.25rem !important; }
.py-3 { padding-top: 0.35rem !important; padding-bottom: 0.35rem !important; }
.py-4 { padding-top: 0.45rem !important; padding-bottom: 0.45rem !important; }
.px-4 { padding-left: 0.65rem !important; padding-right: 0.65rem !important; }

aside {
  width: 220px !important;
}
aside button, aside a {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
  min-height: 28px !important;
  height: 28px !important;
  font-size: 13px !important;
}
aside [class*="gap-"] {
  gap: 0.25rem !important;
}

header, .group\\/section-header {
  height: 32px !important;
  min-height: 32px !important;
}

button.h-8, a.h-8 {
  height: 28px !important;
  min-height: 28px !important;
  font-size: 13px !important;
}
button.h-7 {
  height: 24px !important;
  min-height: 24px !important;
  font-size: 12px !important;
}

.space-y-4 > * + * { margin-top: 0.5rem !important; }
.space-y-6 > * + * { margin-top: 0.75rem !important; }
.space-y-3 > * + * { margin-top: 0.35rem !important; }
div[role="dialog"] {
  max-height: 88vh !important;
}
`;
    }

    if (customFontCSS) {
      css += `\n/* Custom Uploaded Font @font-face */\n${customFontCSS}\n`;
    }

    let activeFontFamily = '';
    if (currentFontId === 'custom' && customFontFamily) {
      const safeCustom = String(customFontFamily).replace(/["\\\r\n;{}]/g, '');
      activeFontFamily = `"${safeCustom}", sans-serif`;
    } else if (currentFontId.startsWith('sys-')) {
      const sysName = String(currentFontId.replace('sys-', '')).replace(/["\\\r\n;{}]/g, '');
      activeFontFamily = `"${sysName}", sans-serif`;
    } else {
      const selectedFont = DEFAULT_FONTS.find(f => f.id === currentFontId);
      if (selectedFont && selectedFont.family) {
        activeFontFamily = selectedFont.family;
      }
    }

    if (activeFontFamily) {
      css += `
:root, html, body, button, input, textarea, select {
  font-family: ${activeFontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
}
code, pre, .font-mono {
  font-family: ${activeFontFamily} !important;
}
`;
    }

    styleEl.textContent = css;
  }

  function setTheme(themeId) {
    currentThemeId = themeId;
    persistSettings();
    applyThemeStyles();
    updateSettingsPaneUI();
  }

  function saveCustomTheme(updatedConfig) {
    customThemeConfig = updatedConfig;
    currentThemeId = 'custom-theme';
    persistSettings();
    applyThemeStyles();
    updateSettingsPaneUI();
  }

  function setCompactMode(enabled) {
    isCompact = enabled;
    persistSettings();
    applyThemeStyles();
    updateSettingsPaneUI();
  }

  function setFont(fontId, familyName = '') {
    currentFontId = fontId;
    if (fontId === 'custom' && familyName) customFontFamily = familyName;
    persistSettings();
    applyThemeStyles();
  }

  // -------------------------------------------------------------
  // Localization engine
  // -------------------------------------------------------------
  let activeDict = LOCALES[currentLang] || {};
  let sortedKeys = Object.keys(activeDict).sort((a, b) => b.length - a.length);

  function updateActiveDict() {
    activeDict = LOCALES[currentLang] || {};
    sortedKeys = Object.keys(activeDict).sort((a, b) => b.length - a.length);
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  const REGEX_CACHE = new Map();
  function getSafeRegex(k) {
    let reg = REGEX_CACHE.get(k);
    if (!reg) {
      const startsWithWord = /^\w/.test(k);
      const endsWithWord = /\w$/.test(k);
      const prefix = startsWithWord ? '(?<![a-zA-Z0-9_])' : '';
      const suffix = endsWithWord ? '(?![a-zA-Z0-9_])' : '';
      reg = new RegExp(prefix + escapeRegExp(k) + suffix, 'g');
      REGEX_CACHE.set(k, reg);
    }
    return reg;
  }

  function getTranslation(str) {
    if (!str || currentLang === 'en') return null;
    const trimmed = str.trim();
    if (!trimmed) return null;

    if (activeDict[trimmed]) {
      return str.replace(trimmed, () => activeDict[trimmed]);
    }

    let result = str;
    let modified = false;

    for (let i = 0; i < sortedKeys.length; i++) {
      const k = sortedKeys[i];
      if (k.length >= 2 && result.includes(k)) {
        const regex = getSafeRegex(k);
        const replaced = result.replace(regex, () => activeDict[k]);
        if (replaced !== result) {
          result = replaced;
          modified = true;
        }
      }
    }

    return modified ? result : null;
  }

  const originalTextMap = new WeakMap();
  const lastAppliedTextMap = new WeakMap();
  const originalAttrMap = new WeakMap();
  const lastAppliedAttrMap = new WeakMap();

  function translateNode(node) {
    if (!node) return;

    if (node.nodeType === 3) {
      const parent = node.parentElement;
      if (!parent) return;
      const tag = parent.tagName;
      if (tag === 'CODE' || tag === 'PRE' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA' || tag === 'INPUT') return;
      if (parent.closest('pre') || parent.closest('code') || parent.closest('.prose') || parent.closest('#ag-custom-test-pane')) return;

      const currentVal = node.nodeValue;
      if (!currentVal || !currentVal.trim()) return;

      let orig = originalTextMap.get(node);
      const lastApplied = lastAppliedTextMap.get(node);

      if (orig === undefined || (lastApplied !== undefined && currentVal !== lastApplied)) {
        const trimmed = currentVal.trim();
        const reverseEn = REVERSE_DICT.get(trimmed);
        if (reverseEn) {
          orig = currentVal.replace(trimmed, reverseEn);
        } else {
          orig = currentVal;
        }
        originalTextMap.set(node, orig);
      }

      let targetVal = orig;
      if (currentLang !== 'en') {
        const trans = getTranslation(orig);
        if (trans) {
          targetVal = trans;
        }
      }

      if (node.nodeValue !== targetVal) {
        node.nodeValue = targetVal;
      }
      lastAppliedTextMap.set(node, targetVal);
    } else if (node.nodeType === 1) {
      const tag = node.tagName;
      if (tag === 'CODE' || tag === 'PRE' || tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return;
      if (node.closest('#ag-custom-test-pane') || node.closest('pre') || node.closest('code') || node.closest('.prose')) return;

      let attrMap = originalAttrMap.get(node);
      if (!attrMap) {
        attrMap = {};
        originalAttrMap.set(node, attrMap);
      }
      let appliedAttrMap = lastAppliedAttrMap.get(node);
      if (!appliedAttrMap) {
        appliedAttrMap = {};
        lastAppliedAttrMap.set(node, appliedAttrMap);
      }

      const attrs = ['title', 'aria-label', 'placeholder', 'alt'];
      for (let i = 0; i < attrs.length; i++) {
        const a = attrs[i];
        if (node.hasAttribute(a)) {
          const currentAttrVal = node.getAttribute(a);
          if (currentAttrVal && currentAttrVal.trim()) {
            let origAttr = attrMap[a];
            const lastAppliedAttr = appliedAttrMap[a];

            if (origAttr === undefined || (lastAppliedAttr !== undefined && currentAttrVal !== lastAppliedAttr)) {
              const trimmed = currentAttrVal.trim();
              const reverseEn = REVERSE_DICT.get(trimmed);
              if (reverseEn) {
                origAttr = currentAttrVal.replace(trimmed, reverseEn);
              } else {
                origAttr = currentAttrVal;
              }
              attrMap[a] = origAttr;
            }

            let targetAttr = origAttr;
            if (currentLang !== 'en') {
              const trans = getTranslation(origAttr);
              if (trans) {
                targetAttr = trans;
              }
            }

            if (node.getAttribute(a) !== targetAttr) {
              node.setAttribute(a, targetAttr);
            }
            appliedAttrMap[a] = targetAttr;
          }
        }
      }

      const children = node.childNodes;
      for (let i = 0; i < children.length; i++) {
        translateNode(children[i]);
      }
    }
  }

  function setLanguage(lang) {
    if (!LOCALES[lang] && lang !== 'en') return;
    currentLang = lang;
    persistSettings();

    updateActiveDict();
    translateNode(document.body);
    const dialog = document.querySelector('[role="dialog"]');
    if (dialog) {
      const flexRoot = dialog.querySelector('.flex-1.min-h-0.w-full.relative > div');
      if (flexRoot && flexRoot.children[0]) {
        translateSidebarButtons(flexRoot.children[0]);
      }
    }
    updateTabLabel();
    updateSettingsPaneUI();
  }

  // -------------------------------------------------------------
  // Settings tab injection
  // -------------------------------------------------------------
  let isTestTabActive = false;

  async function discoverLocalFonts(force = false) {
    if (!force && discoveredSystemFonts.length > 0) return discoveredSystemFonts;
    if (typeof window.queryLocalFonts === 'function') {
      try {
        const fonts = await window.queryLocalFonts();
        const familySet = new Set();
        fonts.forEach(f => {
          if (f.family) familySet.add(f.family);
        });
        discoveredSystemFonts = Array.from(familySet).sort();
        try {
          localStorage.setItem('ag_system_fonts', JSON.stringify(discoveredSystemFonts));
        } catch (e) {}
        return discoveredSystemFonts;
      } catch (e) {
        console.warn('[AGMod] queryLocalFonts permission or error:', e);
      }
    }
    // Popular fallback fonts
    discoveredSystemFonts = [
      'Arial', 'Calibri', 'Cascadia Code', 'Cascadia Mono', 'Consolas', 'Courier New',
      'Fira Code', 'Georgia', 'Inter', 'JetBrains Mono', 'Lucida Console', 'Microsoft YaHei',
      'Segoe UI', 'Segoe UI Variable', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana'
    ];
    try {
      localStorage.setItem('ag_system_fonts', JSON.stringify(discoveredSystemFonts));
    } catch (e) {}
    return discoveredSystemFonts;
  }

  function updateTabLabel() {
    const tabBtn = document.getElementById('ag-nav-test-btn');
    if (!tabBtn) return;
    const i18n = MOD_I18N[currentLang] || MOD_I18N['ru'];
    const labelSpan = tabBtn.querySelector('#ag-nav-test-label');
    if (labelSpan) {
      labelSpan.textContent = i18n.tabTitle;
      labelSpan.style.background = 'linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)';
      labelSpan.style.webkitBackgroundClip = 'text';
      labelSpan.style.webkitTextFillColor = 'transparent';
    }
    const badgeSpan = tabBtn.querySelector('#ag-nav-test-badge');
    if (badgeSpan) badgeSpan.textContent = i18n.tabBadge;
  }

  function renderTestSettingsPane(container) {
    container.innerHTML = '';

    const i18n = MOD_I18N[currentLang] || MOD_I18N['ru'];
    const allThemes = getAllThemes();
    const currentTheme = allThemes[currentThemeId] || allThemes['catppuccin-mocha'] || allThemes['default'] || { name: 'Default', accent: '#1a73e8' };
    const langInfo = LANG_CONFIG[currentLang] || { name: 'Русский', short: 'RU' };

    function escapeHtml(s) {
      if (typeof s !== 'string') return '';
      return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

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

    const curBg = (currentTheme.variables && currentTheme.variables['--background']) || (currentTheme.preview && currentTheme.preview.bg) || '#1e1e2e';
    const curPrimary = (currentTheme.variables && currentTheme.variables['--primary']) || (currentTheme.preview && currentTheme.preview.accent) || currentTheme.accent || '#cba6f7';
    const curAccent = (currentTheme.variables && currentTheme.variables['--accent']) || curPrimary;
    const curSidebar = (currentTheme.variables && currentTheme.variables['--sidebar']) || (currentTheme.preview && currentTheme.preview.sidebar) || '#181825';

    function buildFontOptionsHTML() {
      let optHtml = `<optgroup label="${escapeHtml(i18n.recommendedGroup)}">`;
      DEFAULT_FONTS.forEach(f => {
        optHtml += `<option value="${escapeHtml(f.id)}" ${f.id === currentFontId ? 'selected' : ''}>${escapeHtml(f.name)}</option>`;
      });
      optHtml += `</optgroup>`;

      if (customFontFamily) {
        const safeCustom = escapeHtml(customFontFamily);
        optHtml += `<option value="custom" ${currentFontId === 'custom' ? 'selected' : ''}>${safeCustom} (${escapeHtml(i18n.loaded)})</option>`;
      }

      if (discoveredSystemFonts && discoveredSystemFonts.length > 0) {
        optHtml += `<optgroup label="${escapeHtml(i18n.systemFontsGroup)} (${discoveredSystemFonts.length})">`;
        discoveredSystemFonts.forEach(fontName => {
          const safeName = escapeHtml(fontName);
          optHtml += `<option value="sys-${safeName}" ${currentFontId === 'sys-' + fontName ? 'selected' : ''}>${safeName}</option>`;
        });
        optHtml += `</optgroup>`;
      } else if (currentFontId.startsWith('sys-')) {
        const fontName = currentFontId.replace('sys-', '');
        const safeName = escapeHtml(fontName);
        optHtml += `<optgroup label="${escapeHtml(i18n.systemFontsGroup)}">`;
        optHtml += `<option value="${escapeHtml(currentFontId)}" selected>${safeName}</option>`;
        optHtml += `</optgroup>`;
      }
      return optHtml;
    }

    // Root wrapper matching Antigravity native max-width and layout
    const content = document.createElement('div');
    content.className = 'w-full bg-transparent h-full overflow-y-auto';

    content.innerHTML = `
      <div class="p-6 pb-24 flex flex-col gap-4 w-full max-w-2xl mx-auto">
        <!-- Page Header -->
        <div class="flex flex-col gap-2 w-full mb-2 bg-transparent">
          <div class="flex justify-between items-start gap-4 w-full bg-transparent pr-8 lg:pr-0">
            <div class="flex-1 flex flex-col gap-1 min-w-0 bg-transparent">
              <div class="flex items-center gap-2">
                <h2 class="text-xl m-0 font-bold truncate" style="background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${i18n.headerTitle}</h2>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 tracking-wider">${i18n.tabBadge}</span>
              </div>
              <div class="text-sm text-muted-foreground bg-transparent">${i18n.headerSubtitle}</div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-8 w-full">
          <!-- Section 0: Google Account (Antigravity 2.0 Native Style) -->
          <div class="space-y-2" id="ag-section-google-account">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${TG_ICONS.google}
                  <h3 class="m-0 text-sm font-medium text-foreground">${i18n.googleAccount}</h3>
                </div>
              </div>
            </div>

            <div class="bg-card rounded-xl border border-border overflow-hidden">
              <!-- Active Account Plate (Photo 1 Style) -->
              <div id="ag-account-header-plate" class="py-2.5 px-3.5 w-full bg-secondary/30 hover:bg-secondary/60 transition-colors flex justify-between gap-3 items-center cursor-pointer select-none">
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <!-- Avatar with Authentic Google Subscription Ring (Static, No Shimmer) -->
                  <div id="ag-account-active-ring" class="ag-account-ring ag-ring-pro" style="width: 42px; height: 42px;">
                    <div id="ag-account-active-avatar" class="w-full h-full rounded-full bg-secondary border-2 border-card flex items-center justify-center text-foreground font-semibold text-sm">
                      G
                    </div>
                  </div>
                  <!-- User Info & Subscription Plan -->
                  <div class="flex flex-col min-w-0">
                    <div class="flex items-center gap-2">
                      <span id="ag-account-active-name" class="text-sm font-semibold truncate" style="background: linear-gradient(135deg, #ffffff 20%, #93c5fd 65%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Загрузка...</span>
                      <span id="ag-account-plan-badge" class="text-[10px] font-semibold px-2 py-0.5 rounded-full" style="background: rgba(26, 115, 232, 0.18); border: 1px solid rgba(66, 133, 244, 0.45); color: #a8c7fa;">Pro</span>
                    </div>
                    <span id="ag-account-active-email" class="text-xs text-muted-foreground truncate">...</span>
                  </div>
                </div>

                <!-- Chevron toggle button -->
                <div class="shrink-0">
                  <div id="ag-account-chevron-btn" class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-all">
                    <div id="ag-account-chevron" class="flex items-center justify-center transition-transform duration-200">
                      ${TG_ICONS.chevronDown}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drawer (Other accounts + Actions, Photo 2 Style) -->
              <div id="ag-accounts-drawer" class="divide-y divide-border border-t border-border bg-transparent" style="display: block;">
                <!-- Accounts List -->
                <div id="ag-accounts-list" class="divide-y divide-border/60">
                  <div class="p-3 text-xs text-muted-foreground text-center">Загрузка аккаунтов...</div>
                </div>

                <!-- Add Account Row -->
                <div id="ag-btn-add-account-quick" class="py-2.5 px-3.5 w-full flex items-center gap-3 hover:bg-secondary/50 transition-colors cursor-pointer select-none text-foreground">
                  <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0">
                    ${TG_ICONS.plus}
                  </div>
                  <span class="text-xs font-medium">${i18n.addAccountBtn || "Добавить аккаунт"}</span>
                </div>

                <!-- Sign out / Switch Row -->
                <div id="ag-btn-add-account-full" class="py-2.5 px-3.5 w-full flex items-center gap-3 hover:bg-secondary/50 transition-colors cursor-pointer select-none text-muted-foreground hover:text-foreground">
                  <div class="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                    ${TG_ICONS.logout}
                  </div>
                  <span class="text-xs font-medium">${i18n.allAccountsLogout || "Выйти из всех аккаунтов"}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 1: Themes & Colors -->
          <div class="space-y-2">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${TG_ICONS.wand}
                  <h3 class="m-0 text-sm font-medium text-foreground">${i18n.themesTitle}</h3>
                </div>
              </div>
            </div>
            <div>
              <div class="bg-transparent rounded-xl border border-border overflow-hidden divide-y divide-border">
                <!-- Row: Theme Preset -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.presetTitle}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.presetDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end gap-1.5">
                    <button id="ag-btn-theme-reset" class="text-muted-foreground hover:text-foreground transition-colors cursor-pointer outline-none bg-transparent border-none p-1 rounded-md hover:bg-secondary flex items-center justify-center" style="height: 28px; width: 28px;" title="${i18n.resetDefaults}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 -960 960 960" fill="currentColor"><path d="M288.08-220v-60H575.15q62.62,0 107.77-41.35t45.15-102.12T682.92-525.39T575.15-566.54H294.31L405.61-455.23l-42.15,42.15L180-596.54L363.46-780l42.15,42.15L294.31-626.54H575.15q87.77,0 150.34,58.58t62.58,144.5T725.5-278.77T575.15-220H288.08Z"></path></svg>
                    </button>
                    <div style="position: relative; display: inline-flex; align-items: center;">
                      <select id="ag-theme-select" style="height: 28px; width: 180px; padding-left: 10px; padding-right: 28px; -webkit-appearance: none; appearance: none; font-size: 13px;" class="bg-secondary text-secondary-foreground hover:text-foreground rounded-md border-none cursor-pointer font-medium outline-none">
                        ${Object.keys(allThemes).map(id => {
                          const t = allThemes[id];
                          return `<option value="${escapeHtml(id)}" ${id === currentThemeId ? 'selected' : ''}>${escapeHtml(t.name)}</option>`;
                        }).join('')}
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 -960 960 960" fill="currentColor" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.7; width: 14px; height: 14px;"><path d="M480-357.85L253.85-584L296-626.15l184,184l184-184L706.15-584L480-357.85Z"></path></svg>
                    </div>
                  </div>
                </div>

                <!-- Row: Quick Accent Swatches (Telegram iOS Icons Style) -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.quickAccents}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.quickAccentsDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center gap-1.5">
                    ${[
                      { color: '#00f0ff', name: 'Cyan' },
                      { color: '#cba6f7', name: 'Purple' },
                      { color: '#ff79c6', name: 'Pink' },
                      { color: '#a6e3a1', name: 'Emerald' },
                      { color: '#fab387', name: 'Amber' },
                      { color: '#89b4fa', name: 'Blue' }
                    ].map(a => {
                      const isSel = (curPrimary.toLowerCase() === a.color.toLowerCase());
                      return `
                        <button type="button" data-ag-quick-accent="${a.color}" title="${a.name} (${a.color})" class="w-6 h-6 rounded-full border border-border/80 transition-transform hover:scale-110 active:scale-95 cursor-pointer outline-none relative flex items-center justify-center p-0" style="background-color: ${a.color};">
                          ${isSel ? '<span class="w-2 h-2 rounded-full bg-black"></span>' : ''}
                        </button>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Row: Background Color -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.bg}</span>
                    </div>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <div style="position: relative; width: 120px; height: 28px; display: flex; align-items: center;" class="rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                      <div style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.25); background-color: #${cleanHex(curBg, '1E1E2E')}; cursor: pointer; z-index: 5;" id="ag-swatch-bg">
                        <input type="color" id="ag-picker-bg" style="opacity: 0; width: 100%; height: 100%; cursor: pointer; position: absolute; inset: 0;" value="#${cleanHex(curBg, '1E1E2E')}" />
                      </div>
                      <span style="position: absolute; left: 26px; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 11px; opacity: 0.55; user-select: none; pointer-events: none; z-index: 2;">#</span>
                      <input type="text" id="ag-hex-bg" maxlength="6" value="${cleanHex(curBg, '1E1E2E')}" style="position: absolute; inset: 0; width: 100%; height: 100%; padding-left: 36px; padding-right: 6px; background: transparent; border: none; outline: none; font-family: monospace; font-size: 12px; font-weight: 500; text-transform: uppercase; color: inherit; box-sizing: border-box; z-index: 1;">
                    </div>
                  </div>
                </div>

                <!-- Row: Primary / Accent Color -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.accent}</span>
                    </div>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <div style="position: relative; width: 120px; height: 28px; display: flex; align-items: center;" class="rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                      <div style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.25); background-color: #${cleanHex(curPrimary, 'CBA6F7')}; cursor: pointer; z-index: 5;" id="ag-swatch-primary">
                        <input type="color" id="ag-picker-primary" style="opacity: 0; width: 100%; height: 100%; cursor: pointer; position: absolute; inset: 0;" value="#${cleanHex(curPrimary, 'CBA6F7')}" />
                      </div>
                      <span style="position: absolute; left: 26px; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 11px; opacity: 0.55; user-select: none; pointer-events: none; z-index: 2;">#</span>
                      <input type="text" id="ag-hex-primary" maxlength="6" value="${cleanHex(curPrimary, 'CBA6F7')}" style="position: absolute; inset: 0; width: 100%; height: 100%; padding-left: 36px; padding-right: 6px; background: transparent; border: none; outline: none; font-family: monospace; font-size: 12px; font-weight: 500; text-transform: uppercase; color: inherit; box-sizing: border-box; z-index: 1;">
                    </div>
                  </div>
                </div>

                <!-- Row: Secondary Accent -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.secondaryAccent}</span>
                    </div>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <div style="position: relative; width: 120px; height: 28px; display: flex; align-items: center;" class="rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                      <div style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.25); background-color: #${cleanHex(curAccent, 'CBA6F7')}; cursor: pointer; z-index: 5;" id="ag-swatch-accent">
                        <input type="color" id="ag-picker-accent" style="opacity: 0; width: 100%; height: 100%; cursor: pointer; position: absolute; inset: 0;" value="#${cleanHex(curAccent, 'CBA6F7')}" />
                      </div>
                      <span style="position: absolute; left: 26px; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 11px; opacity: 0.55; user-select: none; pointer-events: none; z-index: 2;">#</span>
                      <input type="text" id="ag-hex-accent" maxlength="6" value="${cleanHex(curAccent, 'CBA6F7')}" style="position: absolute; inset: 0; width: 100%; height: 100%; padding-left: 36px; padding-right: 6px; background: transparent; border: none; outline: none; font-family: monospace; font-size: 12px; font-weight: 500; text-transform: uppercase; color: inherit; box-sizing: border-box; z-index: 1;">
                    </div>
                  </div>
                </div>

                <!-- Row: Sidebar Color -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.sidebar}</span>
                    </div>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <div style="position: relative; width: 120px; height: 28px; display: flex; align-items: center;" class="rounded-md bg-secondary hover:bg-secondary/80 transition-colors">
                      <div style="position: absolute; left: 6px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.25); background-color: #${cleanHex(curSidebar, '181825')}; cursor: pointer; z-index: 5;" id="ag-swatch-sidebar">
                        <input type="color" id="ag-picker-sidebar" style="opacity: 0; width: 100%; height: 100%; cursor: pointer; position: absolute; inset: 0;" value="#${cleanHex(curSidebar, '181825')}" />
                      </div>
                      <span style="position: absolute; left: 26px; top: 50%; transform: translateY(-50%); font-family: monospace; font-size: 11px; opacity: 0.55; user-select: none; pointer-events: none; z-index: 2;">#</span>
                      <input type="text" id="ag-hex-sidebar" maxlength="6" value="${cleanHex(curSidebar, '181825')}" style="position: absolute; inset: 0; width: 100%; height: 100%; padding-left: 36px; padding-right: 6px; background: transparent; border: none; outline: none; font-family: monospace; font-size: 12px; font-weight: 500; text-transform: uppercase; color: inherit; box-sizing: border-box; z-index: 1;">
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Live Code Syntax Preview (Antigravity Native Standard) -->
          <div class="space-y-1.5">
            <div class="rounded-xl border border-border overflow-hidden bg-background shadow-xs">
              <div class="flex items-center justify-between px-3.5 py-1.5 border-b border-border bg-sidebar/50 text-[11px] text-muted-foreground select-none" style="height: 28px; box-sizing: border-box;">
                <div class="flex items-center gap-1.5">
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #ff5f56; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #ffbd2e; display: inline-block;"></span>
                  <span style="width: 10px; height: 10px; border-radius: 50%; background-color: #27c93f; display: inline-block;"></span>
                  <span class="ml-1.5 font-mono text-xs text-foreground/80 font-medium">preview.ts</span>
                </div>
                <span class="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-mono">TypeScript</span>
              </div>
              <div class="p-3.5 font-mono text-xs leading-5 overflow-x-auto text-foreground" style="background-color: var(--background);">
                <div style="opacity: 0.5;">// ${i18n.syntaxPreview}</div>
                <div><span style="color: var(--primary, #cba6f7); font-weight: 600;">function</span> <span style="color: #89b4fa; font-weight: 500;">calculateMetric</span>(<span style="color: var(--foreground);">value</span>: <span style="color: #fab387;">number</span>): <span style="color: #a6e3a1;">string</span> {</div>
                <div style="padding-left: 16px;"><span style="color: var(--primary, #cba6f7); font-weight: 600;">const</span> <span style="color: var(--foreground);">score</span> = <span style="color: #89b4fa;">Math</span>.<span style="color: #f9e2af;">round</span>(<span style="color: var(--foreground);">value</span> * <span style="color: #cba6f7;">100</span>);</div>
                <div style="padding-left: 16px;"><span style="color: var(--primary, #cba6f7); font-weight: 600;">return</span> <span style="color: #a6e3a1;">\`Score: \${score}%\`</span>;</div>
                <div>}</div>
              </div>
            </div>
          </div>

          <!-- Section 2: Interface Language -->
          <div class="space-y-2">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${TG_ICONS.globe}
                  <h3 class="m-0 text-sm font-medium text-foreground">${i18n.langTitle}</h3>
                </div>
              </div>
            </div>
            <div>
              <div class="bg-transparent rounded-xl border border-border overflow-hidden divide-y divide-border">
                <!-- Row: Full Language Selector -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.langPackage}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.langSubtitle}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <div style="position: relative; display: inline-flex; align-items: center;">
                      <select id="ag-lang-select" style="height: 28px; width: 238px; padding-left: 10px; padding-right: 28px; -webkit-appearance: none; appearance: none; font-size: 13px;" class="bg-secondary text-secondary-foreground hover:text-foreground rounded-md border-none cursor-pointer font-medium outline-none">
                        <option value="ru" ${currentLang === 'ru' ? 'selected' : ''}>Русский (${Object.keys(LOCALES.ru || {}).length || 1703} ${i18n.phrases})</option>
                        <option value="uk" ${currentLang === 'uk' ? 'selected' : ''}>Українська (${Object.keys(LOCALES.uk || {}).length || 1703} ${i18n.phrases})</option>
                        <option value="en" ${currentLang === 'en' ? 'selected' : ''}>English (${i18n.original})</option>
                        <option value="de" ${currentLang === 'de' ? 'selected' : ''}>Deutsch (358 ${i18n.phrases})</option>
                        <option value="fr" ${currentLang === 'fr' ? 'selected' : ''}>Français (348 ${i18n.phrases})</option>
                        <option value="es" ${currentLang === 'es' ? 'selected' : ''}>Español (365 ${i18n.phrases})</option>
                        <option value="zh" ${currentLang === 'zh' ? 'selected' : ''}>中文 (358 ${i18n.phrases})</option>
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 -960 960 960" fill="currentColor" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.7; width: 14px; height: 14px;"><path d="M480-357.85L253.85-584L296-626.15l184,184l184-184L706.15-584L480-357.85Z"></path></svg>
                    </div>
                  </div>
                </div>

                <!-- Row: Segmented Quick Switcher -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.quickSwitch}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.quickSwitchDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <div data-orientation="horizontal" role="group" class="rounded-lg border border-border/60 bg-secondary/30 select-none" style="height: 28px; width: 238px; display: inline-flex; align-items: center; padding: 2px; box-sizing: border-box; gap: 2px;">
                      ${['ru','uk','en','de','fr','es','zh'].map(code => {
                        const isAct = currentLang === code;
                        return `<button type="button" data-ag-lang="${code}" style="flex: 1; height: 100%; display: inline-flex; align-items: center; justify-content: center; font-size: 11px; font-weight: ${isAct ? '600' : '500'}; border-radius: 4px; cursor: pointer; border: none; background-color: ${isAct ? 'var(--secondary, #313244)' : 'transparent'}; color: ${isAct ? 'var(--foreground, #cdd6f4)' : 'var(--muted-foreground, #a6adc8)'}; padding: 0; outline: none;" class="transition-colors hover:text-foreground">${code.toUpperCase()}</button>`;
                      }).join('')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 3: Typography & UI Density -->
          <div class="space-y-2">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${TG_ICONS.keyboard}
                  <h3 class="m-0 text-sm font-medium text-foreground">${i18n.typographyTitle}</h3>
                </div>
              </div>
            </div>
            <div>
              <div class="bg-transparent rounded-xl border border-border overflow-hidden divide-y divide-border">
                <!-- Row: Font Family -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.fontFamily}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.fontFamilyDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end gap-2">
                    <div style="position: relative; display: inline-flex; align-items: center;">
                      <select id="ag-font-select" style="height: 28px; width: 165px; padding-left: 10px; padding-right: 28px; -webkit-appearance: none; appearance: none; font-size: 12px;" class="bg-secondary text-secondary-foreground hover:text-foreground rounded-md border-none cursor-pointer font-medium outline-none">
                        ${buildFontOptionsHTML()}
                      </select>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 -960 960 960" fill="currentColor" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); pointer-events: none; opacity: 0.7; width: 14px; height: 14px;"><path d="M480-357.85L253.85-584L296-626.15l184,184l184-184L706.15-584L480-357.85Z"></path></svg>
                    </div>
                    <button id="ag-btn-scan-fonts" style="height: 28px; padding: 0 10px; font-size: 12px;" class="inline-flex items-center gap-1.5 font-medium transition-colors select-none outline-none cursor-pointer justify-center bg-secondary text-secondary-foreground hover:text-foreground border-none rounded-md">
                      ${TG_ICONS.search}
                      <span id="ag-scan-fonts-label">${(discoveredSystemFonts && discoveredSystemFonts.length > 0) ? `${i18n.foundFonts} (${discoveredSystemFonts.length})` : i18n.scanPC}</span>
                    </button>
                  </div>
                </div>

                <!-- Row: Upload Font -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.uploadFont}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.uploadFontDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end gap-2">
                    <input type="file" id="ag-font-file-input" accept=".woff2,.woff,.ttf,.otf" class="hidden" />
                    ${customFontFamily ? `<span class="inline-flex items-center gap-1 text-xs font-mono text-primary font-medium truncate max-w-[130px]">${TG_ICONS.check} ${escapeHtml(customFontFamily)}</span>` : ''}
                    <button id="ag-btn-upload-font" style="height: 28px; padding: 0 12px; font-size: 12px;" class="inline-flex items-center gap-1.5 font-medium transition-colors select-none outline-none cursor-pointer justify-center bg-secondary text-secondary-foreground hover:text-foreground border-none rounded-md">
                      ${TG_ICONS.folder}
                      <span>${i18n.browseFile}</span>
                    </button>
                  </div>
                </div>

                <!-- Row: Ultra-Compact Mode -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.compactMode}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.compactModeDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <button type="button" role="switch" id="ag-compact-toggle" aria-checked="${isCompact}" class="relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out shrink-0 h-6 w-11 ${isCompact ? 'bg-primary' : 'bg-secondary'} cursor-pointer">
                      <span class="inline-block rounded-full bg-white transition-transform duration-200 ease-in-out shadow-xs h-4 w-4" style="transform: translateX(${isCompact ? '24px' : '4px'});"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 4: Actions & Settings -->
          <div class="space-y-2">
            <div class="flex flex-col gap-1">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  ${TG_ICONS.sliders}
                  <h3 class="m-0 text-sm font-medium text-foreground">${i18n.settingsManage}</h3>
                </div>
              </div>
            </div>
            <div>
              <div class="bg-transparent rounded-xl border border-border overflow-hidden divide-y divide-border">
                <!-- Row: Copy Theme JSON -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.copyTheme}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.copyThemeDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <button id="ag-btn-copy-theme" style="height: 28px; padding: 0 12px; font-size: 12px;" class="inline-flex items-center gap-1.5 font-medium transition-colors select-none outline-none cursor-pointer justify-center bg-secondary text-secondary-foreground hover:text-foreground border-none rounded-md">
                      ${TG_ICONS.copy}
                      <span id="ag-copy-theme-text">${i18n.copyThemeBtn}</span>
                    </button>
                  </div>
                </div>

                <!-- Row: Reset Defaults -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.resetDefaults}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.confirmReset}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <button id="ag-btn-reset-defaults" style="height: 28px; padding: 0 12px; font-size: 12px;" class="inline-flex items-center gap-1.5 font-medium transition-colors select-none outline-none cursor-pointer justify-center bg-secondary text-secondary-foreground hover:text-foreground border-none rounded-md">
                      ${TG_ICONS.repeat}
                      <span>${i18n.resetDefaults}</span>
                    </button>
                  </div>
                </div>

                <!-- Row: Reload Window -->
                <div class="py-2 px-3.5 w-full bg-transparent flex justify-between gap-4 items-center">
                  <div class="flex-1 flex flex-col gap-0.5">
                    <div class="flex items-center gap-1.5">
                      <span class="text-sm font-medium text-foreground">${i18n.reloadWindow}</span>
                    </div>
                    <span class="text-xs text-muted-foreground whitespace-pre-wrap">${i18n.reloadDesc}</span>
                  </div>
                  <div class="shrink-0 flex items-center justify-end">
                    <button id="ag-btn-reload-window" style="height: 28px; padding: 0 12px; font-size: 12px;" class="inline-flex items-center gap-1.5 font-medium transition-colors select-none outline-none cursor-pointer justify-center bg-secondary text-secondary-foreground hover:text-foreground border-none rounded-md">
                      ${TG_ICONS.lightning}
                      <span>${i18n.reloadWindow}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="text-xs text-muted-foreground mt-auto pt-3 pb-6 flex items-center justify-between border-t border-border/40">
            <span>AGMod • Google Antigravity 2.0</span>
            <a id="ag-footer-github-link" href="https://github.com/neme23232-rgb" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-xs no-underline font-medium hover:underline">
              <svg class="w-3.5 h-3.5 shrink-0 fill-current" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    `;

    const themeSelect = content.querySelector('#ag-theme-select');
    if (themeSelect) {
      themeSelect.onchange = (e) => setTheme(e.target.value);
    }

    const themeResetBtn = content.querySelector('#ag-btn-theme-reset');
    if (themeResetBtn) {
      themeResetBtn.onclick = () => setTheme('catppuccin-mocha');
    }

    // Color picker live sync
    let colorDebounceTimer = null;
    const debouncedSaveTheme = () => {
      if (colorDebounceTimer) clearTimeout(colorDebounceTimer);
      colorDebounceTimer = setTimeout(() => {
        persistSettings();
        applyThemeStyles();
      }, 250);
    };

    function setupColorSync(prefix, varName, previewKey) {
      const picker = content.querySelector(`#ag-picker-${prefix}`);
      const swatch = content.querySelector(`#ag-swatch-${prefix}`);
      const hexInput = content.querySelector(`#ag-hex-${prefix}`);
      if (!picker || !hexInput || !swatch) return;

      const applyColor = (hexValue, immediate = false) => {
        let clean = hexValue.replace(/^#/, '').toUpperCase();
        if (clean.length === 3) {
          clean = clean.split('').map(c => c + c).join('');
        }
        if (/^[0-9A-F]{6}$/i.test(clean)) {
          const formatted = '#' + clean;
          picker.value = formatted;
          swatch.style.backgroundColor = formatted;
          hexInput.value = clean;

          customThemeConfig.variables[varName] = formatted;
          if (previewKey) customThemeConfig.preview[previewKey] = formatted;
          if (varName === '--primary') customThemeConfig.accent = formatted;

          if (varName === '--background') {
            const r = parseInt(clean.substring(0, 2), 16) || 0;
            const g = parseInt(clean.substring(2, 4), 16) || 0;
            const b = parseInt(clean.substring(4, 6), 16) || 0;
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            const isLightBg = lum > 130;

            if (isLightBg) {
              customThemeConfig.variables['--foreground'] = '#1f2328';
              customThemeConfig.variables['--muted-foreground'] = '#656d76';
              customThemeConfig.variables['--secondary-foreground'] = '#1f2328';
              customThemeConfig.variables['--card-border'] = '#d0d7de';
              customThemeConfig.variables['--border'] = '#d0d7de';
              customThemeConfig.variables['--card'] = formatted;
              customThemeConfig.variables['--sidebar-muted'] = 'rgba(0, 0, 0, 0.06)';
              customThemeConfig.variables['--sidebar-secondary'] = 'rgba(0, 0, 0, 0.04)';
              customThemeConfig.variables['--scrollbar-color'] = '#cbd5e1';
              if (customThemeConfig.preview) customThemeConfig.preview.text = '#1f2328';
            } else {
              customThemeConfig.variables['--foreground'] = '#f0f6fc';
              customThemeConfig.variables['--muted-foreground'] = '#8b949e';
              customThemeConfig.variables['--secondary-foreground'] = '#f0f6fc';
              customThemeConfig.variables['--card-border'] = '#30363d';
              customThemeConfig.variables['--border'] = '#30363d';
              customThemeConfig.variables['--card'] = '#161b22';
              customThemeConfig.variables['--sidebar-muted'] = 'rgba(255, 255, 255, 0.08)';
              customThemeConfig.variables['--sidebar-secondary'] = 'rgba(255, 255, 255, 0.05)';
              customThemeConfig.variables['--scrollbar-color'] = '#45475a';
              if (customThemeConfig.preview) customThemeConfig.preview.text = '#f0f6fc';
            }
          }

          currentThemeId = 'custom-theme';
          if (themeSelect) themeSelect.value = 'custom-theme';

          // Live visual update on document root for immediate feedback
          document.documentElement.style.setProperty(varName, formatted);

          if (immediate) {
            if (colorDebounceTimer) clearTimeout(colorDebounceTimer);
            persistSettings();
            applyThemeStyles();
          } else {
            debouncedSaveTheme();
          }
        }
      };

      picker.oninput = (e) => applyColor(e.target.value, false);
      picker.onchange = (e) => applyColor(e.target.value, true);
      hexInput.oninput = (e) => applyColor(e.target.value, false);
      hexInput.onblur = () => {
        const cur = (customThemeConfig.variables && customThemeConfig.variables[varName]) || picker.value;
        hexInput.value = cleanHex(cur, 'FFFFFF');
        applyColor(hexInput.value, true);
      };
    }

    setupColorSync('bg', '--background', 'bg');
    setupColorSync('primary', '--primary', 'accent');
    setupColorSync('accent', '--accent', null);
    setupColorSync('sidebar', '--sidebar', 'sidebar');

    const langSelect = content.querySelector('#ag-lang-select');
    if (langSelect) {
      langSelect.onchange = (e) => setLanguage(e.target.value);
    }
    content.querySelectorAll('button[data-ag-lang]').forEach(btn => {
      btn.onclick = () => {
        const lang = btn.getAttribute('data-ag-lang');
        if (lang) setLanguage(lang);
      };
    });

    content.querySelectorAll('button[data-ag-quick-accent]').forEach(btn => {
      btn.onclick = () => {
        const color = btn.getAttribute('data-ag-quick-accent');
        if (!color) return;
        customThemeConfig.variables['--primary'] = color;
        customThemeConfig.accent = color;
        currentThemeId = 'custom-theme';
        persistSettings();
        applyThemeStyles();
        updateSettingsPaneUI();
      };
    });

    const fontSelect = content.querySelector('#ag-font-select');
    if (fontSelect) {
      fontSelect.onchange = (e) => {
        const val = e.target.value;
        if (val.startsWith('sys-')) {
          const fontName = val.replace('sys-', '');
          setFont(val, fontName);
        } else if (val === 'custom') {
          setFont('custom', customFontFamily);
        } else {
          setFont(val);
        }
      };
    }

    const scanFontsBtn = content.querySelector('#ag-btn-scan-fonts');
    if (scanFontsBtn && fontSelect) {
      scanFontsBtn.onclick = async () => {
        const scanLabel = content.querySelector('#ag-scan-fonts-label');
        if (scanLabel) scanLabel.textContent = i18n.scanning;
        else scanFontsBtn.innerText = i18n.scanning;

        const fonts = await discoverLocalFonts(true);
        try {
          localStorage.setItem('ag_system_fonts', JSON.stringify(fonts));
        } catch (e) {}

        if (scanLabel) scanLabel.textContent = `${i18n.foundFonts} (${fonts.length})`;
        else scanFontsBtn.innerText = `${i18n.foundFonts} (${fonts.length})`;

        fontSelect.innerHTML = buildFontOptionsHTML();
      };
    }

    const uploadFontBtn = content.querySelector('#ag-btn-upload-font');
    const fontFileInput = content.querySelector('#ag-font-file-input');
    if (uploadFontBtn && fontFileInput) {
      uploadFontBtn.onclick = () => fontFileInput.click();
      fontFileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Ensure font does not exceed 2MB to prevent localStorage QuotaExceededError
        if (file.size > 2 * 1024 * 1024) {
          alert('AGMod: Selected font exceeds 2MB limit. Please choose a smaller font file.');
          fontFileInput.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onerror = () => {
          console.error('[AGMod] Failed to read font file:', reader.error);
          alert('AGMod: Could not read selected font file.');
        };
        reader.onload = (event) => {
          const dataUrl = event.target.result;
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\-]/g, '_');
          const ext = file.name.split('.').pop().toLowerCase();
          const format = ext === 'woff2' ? 'woff2' : (ext === 'woff' ? 'woff' : 'truetype');

          customFontFamily = cleanName;
          customFontCSS = `
            @font-face {
              font-family: "${cleanName}";
              src: url("${dataUrl}") format("${format}");
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `;

          setFont('custom', cleanName);
        };
        reader.readAsDataURL(file);
      };
    }

    const compactToggle = content.querySelector('#ag-compact-toggle');
    if (compactToggle) {
      compactToggle.onclick = () => {
        setCompactMode(!isCompact);
      };
    }

    const copyThemeBtn = content.querySelector('#ag-btn-copy-theme');
    if (copyThemeBtn) {
      copyThemeBtn.onclick = () => {
        const allThemes = getAllThemes();
        const activeTheme = allThemes[currentThemeId] || customThemeConfig;
        const themeJson = JSON.stringify(activeTheme, null, 2);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(themeJson).then(() => {
            const label = content.querySelector('#ag-copy-theme-text');
            if (label) {
              const orig = label.textContent;
              label.textContent = (i18n.copied || 'Скопировано');
              setTimeout(() => { if (label) label.textContent = orig; }, 2000);
            }
          }).catch(() => {});
        }
      };
    }

    const resetBtn = content.querySelector('#ag-btn-reset-defaults');
    if (resetBtn) {
      resetBtn.onclick = () => {
        if (confirm(i18n.confirmReset)) {
          setTheme('default');
          setLanguage('ru');
          setFont('default');
          setCompactMode(false);
        }
      };
    }

    const reloadBtn = content.querySelector('#ag-btn-reload-window');
    if (reloadBtn) {
      reloadBtn.onclick = () => window.location.reload();
    }

    const ghLink = content.querySelector('#ag-footer-github-link');
    if (ghLink) {
      ghLink.onclick = (e) => {
        e.preventDefault();
        try {
          if (window.electron && window.electron.shell && window.electron.shell.openExternal) {
            window.electron.shell.openExternal('https://github.com/neme23232-rgb');
            return;
          } else if (typeof require === 'function') {
            const electron = require('electron');
            if (electron && electron.shell && electron.shell.openExternal) {
              electron.shell.openExternal('https://github.com/neme23232-rgb');
              return;
            }
          }
        } catch (err) {}
        window.open('https://github.com/neme23232-rgb', '_blank');
      };
    }

    
    // --- Google Account Drawer Handlers ---
    (function setupAccountManagerUI() {
      const headerPlate = content.querySelector('#ag-account-header-plate');
      const drawer = content.querySelector('#ag-accounts-drawer');
      const chevron = content.querySelector('#ag-account-chevron');
      const emailElem = content.querySelector('#ag-account-active-email');
      const descElem = content.querySelector('#ag-account-plate-desc');
      const btnAddQuick = content.querySelector('#ag-btn-add-account-quick');
      const btnAddFull = content.querySelector('#ag-btn-add-account-full');
      let isDrawerOpen = false;

      function showActionBanner(msg) {
        let banner = document.getElementById('ag-account-action-banner');
        if (!banner) {
          banner = document.createElement('div');
          banner.id = 'ag-account-action-banner';
          banner.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);z-index:999999;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(3px);';
          document.body.appendChild(banner);
        }
        banner.innerHTML = `
          <div style="background:var(--card,#1e1e2e);color:var(--foreground,#f0f6fc);border:1px solid var(--border,#30363d);border-radius:12px;padding:24px 32px;display:flex;flex-direction:column;align-items:center;gap:12px;box-shadow:0 8px 32px rgba(0,0,0,0.5);font-size:14px;font-weight:500;">
            <svg class="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/></svg>
            <span>${msg}</span>
          </div>
        `;
      }

      function getPlanConfig(planName) {
        const plan = (planName || '').toLowerCase();
        if (plan.includes('ultra')) {
          return {
            name: 'Ultra',
            ringClass: 'ag-ring-ultra',
            badgeStyle: 'background: linear-gradient(135deg, #7c3aed, #db2777); color: #ffffff; border: none; font-weight: 600;'
          };
        }
        if (plan.includes('one')) {
          return {
            name: 'One',
            ringClass: 'ag-ring-one',
            badgeStyle: 'background: rgba(66, 133, 244, 0.15); border: 1px solid rgba(66, 133, 244, 0.35); color: #8ab4f8; font-weight: 600;'
          };
        }
        if (plan.includes('plus')) {
          return {
            name: 'Plus',
            ringClass: 'ag-ring-plus',
            badgeStyle: 'background: rgba(6, 182, 212, 0.15); border: 1px solid rgba(6, 182, 212, 0.35); color: #67e8f9; font-weight: 600;'
          };
        }
        if (plan.includes('free') || plan.includes('нет') || plan.includes('бесплатн')) {
          return {
            name: 'Нет подписки',
            ringClass: 'ag-ring-none',
            badgeStyle: 'background: rgba(255, 255, 255, 0.08); color: #9aa0a6; border: 1px solid rgba(255, 255, 255, 0.1); font-weight: 500;'
          };
        }
        // Default is Pro (Google AI Pro / Gemini Advanced as in photos 1 & 2)
        return {
          name: 'Pro',
          ringClass: 'ag-ring-pro',
          badgeStyle: 'background: rgba(26, 115, 232, 0.18); border: 1px solid rgba(66, 133, 244, 0.45); color: #a8c7fa; font-weight: 600;'
        };
      }

      function detectSubscriptionPlan() {
        try {
          const raw = (document.body && document.body.innerText) || '';
          if (/Google AI Ultra|тариф Ultra|\bultra\b/i.test(raw)) return 'Ultra';
          if (/Google AI Plus|тариф Plus|\bplus\b/i.test(raw)) return 'Plus';
          if (/Google One/i.test(raw)) return 'One';
          if (/бесплатный тариф|free plan|no subscription/i.test(raw)) return 'Нет подписки';
          if (/Google AI Pro|тариф Pro|\bpro\b/i.test(raw)) return 'Pro';

          const allBadges = document.querySelectorAll('[class*="badge"], [role="status"], span');
          for (const b of allBadges) {
            if (b.children.length === 0) {
              const txt = (b.textContent || '').trim();
              if (txt === 'Pro') return 'Pro';
              if (txt === 'Ultra') return 'Ultra';
              if (txt === 'Plus') return 'Plus';
              if (txt === 'One') return 'One';
            }
          }
        } catch (e) {}
        return 'Pro';
      }

      function getGoogleAvatarColor(str) {
        const colors = ['#1a73e8', '#ea4335', '#fbbc04', '#34a853', '#9c27b0', '#009688', '#e91e63', '#ff6d00'];
        let hash = 0;
        for (let i = 0; i < (str || '').length; i++) hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
        return colors[Math.abs(hash) % colors.length];
      }

      async function refreshAccountsList() {
        if (!window.agModAccounts || typeof window.agModAccounts.getAccounts !== 'function') return;
        try {
          const res = await window.agModAccounts.getAccounts();
          if (!res) return;

          let activeProfile = res.profiles ? res.profiles.find(p => p.isActive) : null;
          if (!activeProfile && res.profiles && res.profiles.length > 0) {
            activeProfile = res.profiles[0];
          }

          const activeEmail = (activeProfile && activeProfile.email) || 'Аккаунт Google';
          let activeName = (activeProfile && activeProfile.name) || '';
          if (!activeName || activeName === activeEmail) {
            activeName = activeEmail.includes('@') ? activeEmail.split('@')[0] : activeEmail;
          }
          const activeInitial = (activeName || activeEmail).charAt(0).toUpperCase();

          const nameElem = content.querySelector('#ag-account-active-name');
          if (nameElem) nameElem.textContent = activeName;
          const emailElem = content.querySelector('#ag-account-active-email');
          if (emailElem) emailElem.textContent = activeEmail;
          const avatarElem = content.querySelector('#ag-account-active-avatar');
          if (avatarElem) avatarElem.textContent = activeInitial;

          // Subscription detection and styling (Ultra, Pro, One, Plus, Нет подписки)
          const detectedPlan = detectSubscriptionPlan();
          const activePlanConfig = getPlanConfig(detectedPlan);

          const activeRing = content.querySelector('#ag-account-active-ring');
          if (activeRing) {
            activeRing.className = `ag-account-ring ${activePlanConfig.ringClass}`;
          }

          const planBadge = content.querySelector('#ag-account-plan-badge');
          if (planBadge) {
            planBadge.textContent = activePlanConfig.name;
            planBadge.style.cssText = activePlanConfig.badgeStyle;
          }

          const listContainer = content.querySelector('#ag-accounts-list');
          if (!listContainer) return;
          listContainer.innerHTML = '';

          const otherProfiles = res.profiles ? res.profiles.filter(p => !p.isActive) : [];
          if (otherProfiles.length === 0) {
            listContainer.innerHTML = `<div class="p-3 text-xs text-muted-foreground text-center">Нет других подключённых аккаунтов</div>`;
          } else {
            otherProfiles.forEach((p) => {
              const row = document.createElement('div');
              row.className = 'py-2 px-3.5 w-full flex items-center justify-between gap-3 hover:bg-secondary/40 transition-colors cursor-pointer select-none';

              const initial = (p.name || p.email || 'G').charAt(0).toUpperCase();
              let displayName = p.name;
              if (!displayName || displayName === p.email) {
                displayName = p.email ? p.email.split('@')[0] : 'Аккаунт';
              }
              displayName = escapeHtml(displayName);
              const email = escapeHtml(p.email);
              const chatsCount = p.chatCount || 0;
              const chatsLabel = `${chatsCount} ${i18n.chatsCountLabel || 'диалогов'}`;

              const pPlan = getPlanConfig(p.subscription || p.plan || (p.email && p.email.includes('quiet') ? 'Pro' : 'Free'));
              const avatarBg = p.isExpired ? '#5f6368' : getGoogleAvatarColor(p.email || p.name);

              const expiredBadge = p.isExpired 
                ? `<span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary text-muted-foreground border border-border">Время сеанса истекло</span>` 
                : `<span class="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">${chatsLabel}</span>`;

              row.innerHTML = `
                <div class="flex items-center gap-3 min-w-0 flex-1">
                  <div class="ag-account-ring ${pPlan.ringClass}" style="width: 36px; height: 36px;">
                    <div class="w-full h-full rounded-full border border-card flex items-center justify-center text-white font-semibold text-xs" style="background: ${avatarBg};">
                      ${initial}
                    </div>
                  </div>
                  <div class="flex flex-col min-w-0">
                    <span class="text-xs font-medium text-foreground truncate">${displayName}</span>
                    <span class="text-[11px] text-muted-foreground truncate">${email}</span>
                  </div>
                </div>
                <div class="shrink-0 flex items-center gap-2">
                  ${expiredBadge}
                  <button class="ag-btn-delete-account p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors" data-id="${escapeHtml(p.id)}" title="${i18n.deleteAccountBtn || 'Удалить'}">
                    ${TG_ICONS.trash}
                  </button>
                </div>
              `;

              row.onclick = async (ev) => {
                if (ev.target.closest('.ag-btn-delete-account')) return;
                showActionBanner(i18n.switchingAccountToast || 'Переключение аккаунта... Antigravity перезапускается');
                try {
                  await window.agModAccounts.switchAccount(p.id);
                } catch (err) {
                  console.error('[AGMod] Switch error:', err);
                }
              };

              const delBtn = row.querySelector('.ag-btn-delete-account');
              if (delBtn) {
                delBtn.onclick = async (ev) => {
                  ev.stopPropagation();
                  if (confirm(i18n.confirmDeleteAccount || 'Удалить этот профиль и все сохранённые в нём диалоги?')) {
                    try {
                      await window.agModAccounts.deleteAccount(p.id);
                      refreshAccountsList();
                    } catch (err) {
                      console.error('[AGMod] Delete error:', err);
                    }
                  }
                };
              }

              listContainer.appendChild(row);
            });
          }
        } catch (e) {
          console.error('[AGMod] Failed to get accounts:', e);
        }
      }

      function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
        if (drawer) drawer.style.display = isDrawerOpen ? 'block' : 'none';
        if (chevron) chevron.style.transform = isDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)';
        if (isDrawerOpen) refreshAccountsList();
      }


      if (headerPlate) {
        headerPlate.onmouseenter = () => { headerPlate.style.background = '#2c2e32'; };
        headerPlate.onmouseleave = () => { headerPlate.style.background = '#25272a'; };
      }
      const addQuick = content.querySelector('#ag-btn-add-account-quick');
      if (addQuick) {
        addQuick.onmouseenter = () => { addQuick.style.background = 'rgba(255, 255, 255, 0.06)'; };
        addQuick.onmouseleave = () => { addQuick.style.background = 'transparent'; };
      }
      const addFull = content.querySelector('#ag-btn-add-account-full');
      if (addFull) {
        addFull.onmouseenter = () => { addFull.style.background = 'rgba(255, 255, 255, 0.06)'; };
        addFull.onmouseleave = () => { addFull.style.background = 'transparent'; };
      }
      if (headerPlate) {
        headerPlate.onclick = () => toggleDrawer();
      }

      async function triggerAddAccount(ev) {
        if (ev) ev.stopPropagation();
        const ok = confirm(i18n.confirmAddAccount || 'Текущие диалоги и сессия будут сохранены в текущем профиле. Приложение перезапустится для входа в новый аккаунт Google. Продолжить?');
        if (!ok) return;

        showActionBanner(i18n.addingAccountToast || 'Подготовка к входу в новый аккаунт... Antigravity перезапускается');
        try {
          await window.agModAccounts.addNewAccount();
        } catch (err) {
          console.error('[AGMod] Add account error:', err);
        }
      }

            const toggleSync = content.querySelector('#ag-toggle-sync-chats');
      if (toggleSync) {
        toggleSync.onchange = async () => {
          if (window.agModAccounts && typeof window.agModAccounts.setIsolateChats === 'function') {
            await window.agModAccounts.setIsolateChats(!toggleSync.checked);
            refreshAccountsList();
          }
        };
      }

      if (btnAddQuick) btnAddQuick.onclick = triggerAddAccount;
      if (btnAddFull) btnAddFull.onclick = triggerAddAccount;

            async function refreshBackupsList() {
        const listContainer = content.querySelector('#ag-backups-list');
        if (!listContainer || !window.agModAccounts || typeof window.agModAccounts.listBackups !== 'function') return;

        try {
          const backups = await window.agModAccounts.listBackups();
          if (!backups || backups.length === 0) {
            listContainer.innerHTML = `<div class="p-3 text-xs text-muted-foreground text-center">${i18n.noBackupsYet || 'Резервных копий пока нет'}</div>`;
            return;
          }

          listContainer.innerHTML = '';
          backups.forEach(b => {
            const row = document.createElement('div');
            row.className = 'py-2 px-3.5 flex items-center justify-between gap-3 hover:bg-secondary/20 transition-colors';
            const sizeMb = (b.sizeBytes ? (b.sizeBytes / (1024 * 1024)).toFixed(1) + ' MB' : '');
            row.innerHTML = `
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                  ${TG_ICONS.shield}
                </div>
                <div class="flex flex-col min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-medium text-foreground truncate">${escapeHtml(b.label || 'Резервная копия')}</span>
                    <span class="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">${b.chatCount || 0} ${i18n.chatsCountLabel || 'диалогов'}</span>
                  </div>
                  <span class="text-[11px] text-muted-foreground truncate">${escapeHtml(b.date || '')} ${sizeMb ? '· ' + sizeMb : ''}</span>
                </div>
              </div>
              <div class="shrink-0 flex items-center gap-1.5">
                <button class="ag-btn-restore-backup text-xs font-medium px-2.5 py-1 rounded bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer border border-border" data-id="${escapeHtml(b.id)}">
                  ${i18n.restoreBackupBtn || 'Восстановить'}
                </button>
              </div>
            `;

            const rBtn = row.querySelector('.ag-btn-restore-backup');
            if (rBtn) {
              rBtn.onclick = async (ev) => {
                ev.stopPropagation();
                if (confirm(i18n.confirmRestoreBackup || 'Восстановить диалоги из этой резервной копии? Приложение перезапустится.')) {
                  showActionBanner(i18n.restoringBackupToast || 'Восстановление диалогов... Antigravity перезапускается');
                  try {
                    await window.agModAccounts.restoreBackup(b.id);
                  } catch (err) {
                    console.error('[AGMod] Restore backup error:', err);
                  }
                }
              };
            }

            listContainer.appendChild(row);
          });
        } catch (e) {
          console.error('[AGMod] Failed to list backups:', e);
        }
      }

      const btnCreateBackup = content.querySelector('#ag-btn-create-backup');
      if (btnCreateBackup) {
        btnCreateBackup.onclick = async () => {
          btnCreateBackup.disabled = true;
          try {
            const res = await window.agModAccounts.createBackup('Ручное сохранение');
            if (res && res.success) {
              refreshBackupsList();
            }
          } catch (e) {
            console.error('[AGMod] Create backup error:', e);
          } finally {
            btnCreateBackup.disabled = false;
          }
        };
      }

      // Initial check
      refreshAccountsList();
      refreshBackupsList();
    })();

    container.appendChild(content);
  }

  function updateSettingsPaneUI() {
    const pane = document.getElementById('ag-custom-test-pane');
    if (pane && pane.style.display !== 'none') {
      renderTestSettingsPane(pane);
    }
  }

  function handleTestTabClick(testBtn, leftSidebar, rightPane) {
    isTestTabActive = true;

    Array.from(leftSidebar.querySelectorAll('button')).forEach(b => {
      b.classList.remove('bg-sidebar-secondary');
      b.classList.add('hover:bg-sidebar-muted');
    });

    testBtn.classList.remove('hover:bg-sidebar-muted');
    testBtn.classList.add('bg-sidebar-secondary');

    Array.from(rightPane.children).forEach(c => {
      if (c.id !== 'ag-custom-test-pane') {
        c.style.display = 'none';
      }
    });

    let customPane = document.getElementById('ag-custom-test-pane');
    if (!customPane) {
      customPane = document.createElement('div');
      customPane.id = 'ag-custom-test-pane';
      customPane.className = 'h-full w-full overflow-y-auto';
      rightPane.appendChild(customPane);
    }
    customPane.style.display = 'block';
    renderTestSettingsPane(customPane);
  }

  function restoreNativeSettingsTab(testBtn, rightPane) {
    isTestTabActive = false;
    if (testBtn) {
      testBtn.classList.remove('bg-sidebar-secondary');
      testBtn.classList.add('hover:bg-sidebar-muted');
    }
    const customPane = document.getElementById('ag-custom-test-pane');
    if (customPane) {
      customPane.style.display = 'none';
    }
    Array.from(rightPane.children).forEach(c => {
      if (c.id !== 'ag-custom-test-pane') {
        c.style.display = '';
      }
    });
  }

  function translateSidebarButtons(sidebar) {
    if (!sidebar) return;
    const dict = LOCALES[currentLang] || {};
    sidebar.querySelectorAll('button').forEach(btn => {
      if (btn.id === 'ag-nav-test-btn') return;
      const span = btn.querySelector('span');
      if (span) {
        const txt = span.textContent.trim();
        if (!txt) return;
        const enKey = REVERSE_DICT.get(txt) || txt;
        if (currentLang === 'en') {
          if (span.textContent !== enKey) span.textContent = enKey;
        } else {
          const trans = dict[enKey];
          if (trans && span.textContent !== trans) {
            span.textContent = trans;
          }
        }
      } else {
        const txt = btn.textContent.trim();
        if (txt === 'Show All' || txt === 'Показать все' || REVERSE_DICT.get(txt) === 'Show All') {
          const enKey = 'Show All';
          const trans = currentLang === 'en' ? enKey : (dict[enKey] || 'Показать все');
          if (btn.textContent !== trans) btn.textContent = trans;
        }
      }
    });
  }

  function checkAndInjectSettingsTab() {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) {
      isTestTabActive = false;
      return;
    }

    const flexRoot = dialog.querySelector('.flex-1.min-h-0.w-full.relative > div');
    if (!flexRoot || flexRoot.children.length < 2) return;

    const leftSidebar = flexRoot.children[0];
    const rightPane = flexRoot.children[1];

    translateSidebarButtons(leftSidebar);

    const feedbackBtn = leftSidebar.querySelector('[data-testid="settings-nav-item-Provide Feedback"]') ||
      Array.from(leftSidebar.querySelectorAll('button')).find(b => {
        const t = b.innerText.trim();
        return t === 'Provide Feedback' || t === 'Оставить отзыв' || t === 'Feedback';
      });

    const shortcutsBtn = leftSidebar.querySelector('[data-testid="settings-nav-item-Shortcuts"]') ||
      Array.from(leftSidebar.querySelectorAll('button')).find(b => {
        const t = b.innerText.trim();
        return t === 'Shortcuts' || t === 'Горячие клавиши';
      });

    let targetContainer = null;
    let insertReference = null;

    if (feedbackBtn && feedbackBtn.parentElement) {
      targetContainer = feedbackBtn.parentElement;
      insertReference = feedbackBtn.nextSibling;
    } else if (shortcutsBtn && shortcutsBtn.parentElement) {
      targetContainer = shortcutsBtn.parentElement;
      insertReference = shortcutsBtn.nextSibling;
    } else {
      const allButtons = Array.from(leftSidebar.querySelectorAll('button')).filter(b => b.id !== 'ag-nav-test-btn');
      const lastBtn = allButtons[allButtons.length - 1];
      if (lastBtn && lastBtn.parentElement) {
        targetContainer = lastBtn.parentElement;
        insertReference = lastBtn.nextSibling;
      }
    }

    if (!targetContainer) return;

    const i18n = MOD_I18N[currentLang] || MOD_I18N['ru'];
    let testBtn = document.getElementById('ag-nav-test-btn');
    if (!testBtn) {
      testBtn = document.createElement('button');
      testBtn.id = 'ag-nav-test-btn';
      testBtn.setAttribute('data-testid', 'settings-nav-item-AGMod');
      testBtn.setAttribute('type', 'button');
      testBtn.className = 'flex items-center justify-start gap-2 group mx-2 px-2 py-1 rounded-lg cursor-pointer border-none text-left transition-all outline-none hover:bg-sidebar-muted';
      testBtn.innerHTML = `
            <span id="ag-nav-test-label" class="text-sm select-none truncate font-semibold" style="background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${i18n.tabTitle}</span>
            <span id="ag-nav-test-badge" class="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full" style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(129, 140, 248, 0.4); color: #38bdf8; letter-spacing: 0.5px;">${i18n.tabBadge}</span>
          `;

      testBtn.onclick = (e) => {
        e.stopPropagation();
        handleTestTabClick(testBtn, leftSidebar, rightPane);
      };

      if (insertReference) {
        targetContainer.insertBefore(testBtn, insertReference);
      } else {
        targetContainer.appendChild(testBtn);
      }

      Array.from(leftSidebar.querySelectorAll('button')).forEach(otherBtn => {
        if (otherBtn !== testBtn && !otherBtn.__ag_mod_listener) {
          otherBtn.__ag_mod_listener = true;
          otherBtn.addEventListener('click', () => {
            if (isTestTabActive) {
              restoreNativeSettingsTab(testBtn, rightPane);
            }
          });
        }
      });
    } else {
      // Keep dynamic translation updated
      updateTabLabel();
      if (!testBtn.classList.contains('justify-start')) {
        testBtn.classList.remove('justify-between');
        testBtn.classList.add('justify-start', 'gap-2');
      }
      if (testBtn.parentElement !== targetContainer || (insertReference && testBtn.nextSibling !== insertReference) || (!insertReference && targetContainer.lastElementChild !== testBtn)) {
        if (insertReference) {
          targetContainer.insertBefore(testBtn, insertReference);
        } else {
          targetContainer.appendChild(testBtn);
        }
      }
    }
  }

  // -------------------------------------------------------------
  // Sidebar buttons cleanup
  // -------------------------------------------------------------
  function cleanupSidebarButtons() {
    const oldLang = document.getElementById('ag-sidebar-lang-btn');
    if (oldLang) oldLang.remove();
    const oldTheme = document.getElementById('ag-sidebar-theme-btn');
    if (oldTheme) oldTheme.remove();
    const oldLangPopup = document.getElementById('ag-lang-popup');
    if (oldLangPopup) oldLangPopup.remove();
    const oldThemePopup = document.getElementById('ag-theme-popup');
    if (oldThemePopup) oldThemePopup.remove();
  }

  // -------------------------------------------------------------
  // Initialization and observer
  // -------------------------------------------------------------
  applyThemeStyles();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }

  let isUpdating = false;
  let isSelfMutating = false;
  let updateTimer = null;
  const pendingAddedNodes = new Set();

  function scheduleBatchUpdate(forceFull = false) {
    if (isUpdating || isSelfMutating) return;
    if (updateTimer) clearTimeout(updateTimer);

    updateTimer = setTimeout(() => {
      updateTimer = null;
      if (isUpdating || isSelfMutating) return;
      isUpdating = true;
      isSelfMutating = true;
      try {
        cleanupSidebarButtons();
        checkAndInjectSettingsTab();

        if (forceFull) {
          translateNode(document.body);
        } else if (pendingAddedNodes.size > 0 && currentLang !== 'en') {
          for (const node of pendingAddedNodes) {
            if (node && node.isConnected) {
              translateNode(node);
            }
          }
        }
      } catch (e) {
        console.error('[AGMod] Update error:', e);
      } finally {
        pendingAddedNodes.clear();
        isUpdating = false;
        setTimeout(() => { isSelfMutating = false; }, 30);
      }
    }, 100);
  }

  function onReady() {
    applyThemeStyles();
    translateNode(document.body);
    cleanupSidebarButtons();
    checkAndInjectSettingsTab();

    if (window.__AG_MOD_OBSERVER__) {
      try { window.__AG_MOD_OBSERVER__.disconnect(); } catch (e) {}
    }

    const observer = new MutationObserver((mutations) => {
      if (isSelfMutating) return;

      let newDialogNode = null;

      for (let i = 0; i < mutations.length; i++) {
        const m = mutations[i];
        for (let j = 0; j < m.addedNodes.length; j++) {
          const n = m.addedNodes[j];
          if ((n.nodeType === 1 || n.nodeType === 3) && currentLang !== 'en') {
            pendingAddedNodes.add(n);
          }
          if (n.nodeType === 1) {
            if (n.getAttribute && (n.getAttribute('role') === 'dialog' || n.getAttribute('role') === 'menu')) {
              newDialogNode = n;
            } else if (n.querySelector) {
              const d = n.querySelector('[role="dialog"], [role="menu"]');
              if (d) newDialogNode = d;
            }
          }
        }
      }

      if (newDialogNode) {
        isSelfMutating = true;
        try {
          checkAndInjectSettingsTab();
          if (currentLang !== 'en') {
            translateNode(newDialogNode);
            const flexRoot = newDialogNode.querySelector('.flex-1.min-h-0.w-full.relative > div');
            if (flexRoot && flexRoot.children[0]) {
              translateSidebarButtons(flexRoot.children[0]);
            }
          }
        } catch (e) {
          console.error('[AGMod] Fast translation error:', e);
        } finally {
          setTimeout(() => { isSelfMutating = false; }, 30);
        }
      }

      scheduleBatchUpdate(false);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: false
    });

    window.__AG_MOD_OBSERVER__ = observer;
  }
})();


