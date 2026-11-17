const copy = {
  en: {
    home: 'Home', settings: 'Settings', hub: 'LiveHub', backToHub: 'Back to LiveHub',
    preview: 'Early preview', headline: 'A place for code is taking shape.',
    description: 'LiveCode is being prepared. Coding tools are not available yet.',
    statusTitle: 'What works today',
    statusText: 'You can explore this home, change the appearance, and return to LiveHub. More will appear here when it is ready.',
    openSettings: 'Open settings', settingsIntro: 'Only preferences for this preview are available.',
    appearance: 'Appearance', appearanceHint: 'Choose how this page looks.',
    system: 'System', light: 'Light', dark: 'Dark',
    language: 'Language', languageHint: 'Choose the language for this page.',
    privacy: 'This preview does not accept code, accounts, or API keys.',
  },
  ru: {
    home: 'Домой', settings: 'Настройки', hub: 'LiveHub', backToHub: 'Вернуться в LiveHub',
    preview: 'Ранний просмотр', headline: 'Пространство для кода обретает форму.',
    description: 'LiveCode готовится к запуску. Инструменты для кода пока недоступны.',
    statusTitle: 'Что работает сейчас',
    statusText: 'Можно открыть эту страницу, настроить её вид и вернуться в LiveHub. Новые возможности появятся, когда будут готовы.',
    openSettings: 'Открыть настройки', settingsIntro: 'Здесь пока доступны только настройки этой страницы.',
    appearance: 'Оформление', appearanceHint: 'Выберите вид этой страницы.',
    system: 'Системная', light: 'Светлая', dark: 'Тёмная',
    language: 'Язык', languageHint: 'Выберите язык этой страницы.',
    privacy: 'Эта версия не принимает код, аккаунты или API-ключи.',
  },
}

const preferenceKey = 'livecode.demo.preferences.v1'
const choices = { theme: 'system', language: 'en' }
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
try {
  const saved = JSON.parse(localStorage.getItem(preferenceKey) || '{}')
  if (['system', 'light', 'dark'].includes(saved.theme)) choices.theme = saved.theme
  if (['en', 'ru'].includes(saved.language)) choices.language = saved.language
} catch { /* The page remains usable when preferences cannot be read. */ }

function save() {
  try { localStorage.setItem(preferenceKey, JSON.stringify(choices)) }
  catch { /* Preferences can still be used during this visit. */ }
}

function render() {
  document.documentElement.lang = choices.language
  document.documentElement.dataset.theme = choices.theme
  document.documentElement.dataset.effectiveTheme = choices.theme === 'system' ? (prefersDark.matches ? 'dark' : 'light') : choices.theme
  document.querySelector('.mobile-hub-link').setAttribute('aria-label', copy[choices.language].backToHub)
  for (const element of document.querySelectorAll('[data-i18n]')) {
    element.textContent = copy[choices.language][element.dataset.i18n]
  }
  for (const button of document.querySelectorAll('[data-theme-option]')) {
    button.setAttribute('aria-pressed', String(button.dataset.themeOption === choices.theme))
  }
  for (const button of document.querySelectorAll('[data-language-option]')) {
    button.setAttribute('aria-pressed', String(button.dataset.languageOption === choices.language))
  }
}

function showView(view) {
  const next = view === 'settings' ? 'settings' : 'home'
  document.getElementById('home-view').hidden = next !== 'home'
  document.getElementById('settings-view').hidden = next !== 'settings'
  for (const button of document.querySelectorAll('[data-view-button]')) {
    if (button.dataset.viewButton === next) button.setAttribute('aria-current', 'page')
    else button.removeAttribute('aria-current')
  }
  document.getElementById(`${next}-view`).focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: 'auto' })
}

for (const button of document.querySelectorAll('[data-view-button]')) {
  button.addEventListener('click', () => showView(button.dataset.viewButton))
}
for (const button of document.querySelectorAll('[data-theme-option]')) {
  button.addEventListener('click', () => { choices.theme = button.dataset.themeOption; save(); render() })
}
for (const button of document.querySelectorAll('[data-language-option]')) {
  button.addEventListener('click', () => { choices.language = button.dataset.languageOption; save(); render() })
}

render()
prefersDark.addEventListener('change', render)
