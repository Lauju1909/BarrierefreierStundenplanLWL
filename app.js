/**
 * Barrierefreier Stundenplan & Prüfungsmanager
 * Speziell für das LWL-Berufskolleg Soest (Förderschwerpunkt Sehen)
 * 100% NVDA / JAWS optimiert, WCAG 2.2 AAA
 * Reine WebUntis-API-Anbindung ohne manuelle Bearbeitung
 */

// =============================================================================
// 1. STANDARD-DATEN & VORKONFIGURATION (LWL-BERUFSKOLLEG SOEST)
// =============================================================================
const DEFAULT_CONFIG = {
  schoolName: 'LWL-Berufskolleg Soest',
  schoolShort: 'lwl-bk-soest',
  server: 'lwl-bk-soest.webuntis.com',
  tenantId: '5238400',
  username: '',
  password: '',
  rememberLogin: true,
  theme: 'theme-light',
  fontSize: 'font-normal',
  ttsEnabled: true,
  ttsRate: 1.0,
  textOnlyMode: false
};



const DEFAULT_PERIODS = [
  { period: 1, start: '07:45', end: '08:30' },
  { period: 2, start: '08:30', end: '09:15' },
  { period: 3, start: '09:35', end: '10:20' },
  { period: 4, start: '10:20', end: '11:05' },
  { period: 5, start: '11:25', end: '12:10' },
  { period: 6, start: '12:10', end: '12:55' },
  { period: 7, start: '13:40', end: '14:25' },
  { period: 8, start: '14:25', end: '15:10' }
];

const DEFAULT_NRW_HOLIDAYS_2026_2027 = [
  { id: 'hol-schulstart-26', name: 'Schuljahresbeginn 2026/2027', longName: 'Erster Schultag nach den Sommerferien (LWL-Berufskolleg Soest)', startDate: '2026-09-02', endDate: '2026-09-02', startDateNum: 20260902, endDateNum: 20260902, type: 'appointment' },
  { id: 'hol-einheit-26', name: 'Tag der Deutschen Einheit', longName: 'Tag der Deutschen Einheit (Feiertag)', startDate: '2026-10-03', endDate: '2026-10-03', startDateNum: 20261003, endDateNum: 20261003, type: 'holiday' },
  { id: 'hol-herbst-26', name: 'Herbstferien', longName: 'Herbstferien 2026 (NRW)', startDate: '2026-10-17', endDate: '2026-10-31', startDateNum: 20261017, endDateNum: 20261031, type: 'holiday' },
  { id: 'hol-allerheiligen-26', name: 'Allerheiligen', longName: 'Allerheiligen (Feiertag)', startDate: '2026-11-01', endDate: '2026-11-01', startDateNum: 20261101, endDateNum: 20261101, type: 'holiday' },
  { id: 'hol-weihnachten-26', name: 'Weihnachtsferien', longName: 'Weihnachtsferien 2026/2027 (NRW)', startDate: '2026-12-23', endDate: '2027-01-06', startDateNum: 20261223, endDateNum: 20270106, type: 'holiday' },
  { id: 'hol-halbjahr-27', name: 'Zeugnisausgabe 1. Halbjahr', longName: 'Zeugnisausgabe zum 1. Schulhalbjahr', startDate: '2027-01-29', endDate: '2027-01-29', startDateNum: 20270129, endDateNum: 20270129, type: 'appointment' },
  { id: 'hol-karneval-27', name: 'Rosenmontag', longName: 'Rosenmontag (beweglicher Ferientag)', startDate: '2027-02-08', endDate: '2027-02-08', startDateNum: 20270208, endDateNum: 20270208, type: 'holiday' },
  { id: 'hol-ostern-27', name: 'Osterferien', longName: 'Osterferien 2027 (NRW)', startDate: '2027-03-22', endDate: '2027-04-03', startDateNum: 20270322, endDateNum: 20270403, type: 'holiday' },
  { id: 'hol-karfreitag-27', name: 'Karfreitag', longName: 'Karfreitag (Feiertag)', startDate: '2027-03-26', endDate: '2027-03-26', startDateNum: 20270326, endDateNum: 20270326, type: 'holiday' },
  { id: 'hol-ostermontag-27', name: 'Ostermontag', longName: 'Ostermontag (Feiertag)', startDate: '2027-03-29', endDate: '2027-03-29', startDateNum: 20270329, endDateNum: 20270329, type: 'holiday' },
  { id: 'hol-arbeit-27', name: 'Tag der Arbeit', longName: 'Tag der Arbeit (Feiertag)', startDate: '2027-05-01', endDate: '2027-05-01', startDateNum: 20270501, endDateNum: 20270501, type: 'holiday' },
  { id: 'hol-himmelfahrt-27', name: 'Christi Himmelfahrt', longName: 'Christi Himmelfahrt (Feiertag)', startDate: '2027-05-06', endDate: '2027-05-06', startDateNum: 20270506, endDateNum: 20270506, type: 'holiday' },
  { id: 'hol-pfingstmontag-27', name: 'Pfingstmontag', longName: 'Pfingstmontag (Feiertag)', startDate: '2027-05-17', endDate: '2027-05-17', startDateNum: 20270517, endDateNum: 20270517, type: 'holiday' },
  { id: 'hol-pfingsten-27', name: 'Pfingstdienstag', longName: 'Pfingstdienstag (Ferientag NRW)', startDate: '2027-05-18', endDate: '2027-05-18', startDateNum: 20270518, endDateNum: 20270518, type: 'holiday' },
  { id: 'hol-fronleichnam-27', name: 'Fronleichnam', longName: 'Fronleichnam (Feiertag)', startDate: '2027-05-27', endDate: '2027-05-27', startDateNum: 20270527, endDateNum: 20270527, type: 'holiday' },
  { id: 'hol-zeugnis-27', name: 'Zeugnisausgabe Schuljahresende', longName: 'Zeugnisausgabe Schuljahresende (Letzter Schultag)', startDate: '2027-07-16', endDate: '2027-07-16', startDateNum: 20270716, endDateNum: 20270716, type: 'appointment' },
  { id: 'hol-sommer-27', name: 'Sommerferien', longName: 'Sommerferien 2027 (NRW)', startDate: '2027-07-19', endDate: '2027-08-31', startDateNum: 20270719, endDateNum: 20270831, type: 'holiday' }
];

// Hinweis: Es werden KEINE synthetischen Standardprüfungen verwendet.
// Es werden AUSSCHLIESSLICH echte Prüfungen aus der WebUntis-API dargestellt!

let appData = {
  config: { ...DEFAULT_CONFIG },
  periods: [...DEFAULT_PERIODS],
  timetable: [],
  exams: [],
  homework: [],
  absences: [],
  classbook: [],
  holidays: [...DEFAULT_NRW_HOLIDAYS_2026_2027],
  schoolYear: null,
  examFilter: 'all',
  homeworkFilter: 'pending'
};

let currentTab = 'overview';
let selectedDay = 'today'; // 'today', 'tomorrow', 1..5, 'all'
let speechSynth = window.speechSynthesis || null;
let webuntisSessionId = null;
let lastSyncTimestamp = null;
let autoSyncIntervalTimer = null;
let isSyncInProgress = false;

// =============================================================================
// 2. SPEICHERUNG & KONFIGURATION (LOCALSTORAGE)
// =============================================================================
function loadAppData() {
  try {
    const saved = localStorage.getItem('lwl_stundenplan_data_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      appData = {
        config: { ...DEFAULT_CONFIG, ...(parsed.config || {}) },
        periods: parsed.periods || [...DEFAULT_PERIODS],
        timetable: parsed.timetable || [],
        exams: [],
        homework: parsed.homework || [],
        absences: parsed.absences || [],
        classbook: parsed.classbook || [],
        holidays: (parsed.holidays && parsed.holidays.length > 0) ? parsed.holidays : [...DEFAULT_NRW_HOLIDAYS_2026_2027],
        schoolYear: parsed.schoolYear || null,
        examFilter: 'all',
        homeworkFilter: parsed.homeworkFilter || 'pending'
      };

      // Gecachte synthetische Fake-Prüfungen aus früheren Versionen restlos entfernen
      if (parsed.exams && Array.isArray(parsed.exams)) {
        appData.exams = parsed.exams.filter(ex => {
          if (!ex || !ex.id) return false;
          if (String(ex.id).startsWith('def-exam-')) return false;
          if (ex.subject && /klausurphase|zentrale prüfung|mündliche prüfung/i.test(ex.subject)) return false;
          return true;
        });
      }

      // Historische Alt-Ferien (2020-2025) aus Cache bereinigen
      if (appData.holidays && Array.isArray(appData.holidays)) {
        const sy = appData.schoolYear || getSchoolYearRange();
        appData.holidays = appData.holidays.filter(h => {
          const sNum = h.startDateNum || (h.startDate ? parseInt(h.startDate.replace(/-/g, '')) : 0);
          const eNum = h.endDateNum || (h.endDate ? parseInt(h.endDate.replace(/-/g, '')) : sNum);
          return eNum >= sy.startDateNum && sNum <= sy.endDateNum;
        });
        if (appData.holidays.length === 0 || appData.holidays.length > 30) {
          appData.holidays = [...DEFAULT_NRW_HOLIDAYS_2026_2027];
        }
      }

      // Falsch gecachte Räume bereinigen
      if (appData.timetable && Array.isArray(appData.timetable)) {
        appData.timetable.forEach(l => {
          if (l.room) {
            const rNorm = l.room.toLowerCase().replace(/^raum\s+/i, '').trim();
            const tNorm = (l.teacher || '').toLowerCase().trim();
            if (rNorm === 'hanauer' || (tNorm && (rNorm === tNorm || tNorm.includes(rNorm)))) {
              l.room = 'Raum wird bekanntgegeben';
            }
          }
        });
      }
    }
  } catch (e) {
    console.error('Fehler beim Laden der Daten aus dem LocalStorage:', e);
  }
  applyConfig();
}

function saveAppData() {
  try {
    localStorage.setItem('lwl_stundenplan_data_v2', JSON.stringify(appData));
  } catch (e) {
    console.error('Fehler beim Speichern:', e);
  }
}

function applyConfig() {
  const body = document.body;
  body.className = `${appData.config.theme} ${appData.config.fontSize}`;
  if (appData.config.textOnlyMode) {
    body.classList.add('text-only-mode');
  } else {
    body.classList.remove('text-only-mode');
  }

  // Header School Name
  const schoolEl = document.getElementById('header-school-name');
  if (schoolEl) schoolEl.textContent = `${appData.config.schoolName} • Live aus WebUntis`;

  // Settings Felder aktualisieren
  const cfgTheme = document.getElementById('cfg-theme');
  if (cfgTheme) cfgTheme.value = appData.config.theme;
  const cfgFont = document.getElementById('cfg-font-size');
  if (cfgFont) cfgFont.value = appData.config.fontSize;
  const cfgTextOnly = document.getElementById('cfg-text-only');
  if (cfgTextOnly) cfgTextOnly.checked = !!appData.config.textOnlyMode;
  const cfgTts = document.getElementById('cfg-tts');
  if (cfgTts) cfgTts.checked = !!appData.config.ttsEnabled;
  const cfgTtsRate = document.getElementById('cfg-tts-rate');
  if (cfgTtsRate) cfgTtsRate.value = appData.config.ttsRate || 1.0;

  // Account Display
  const uDisp = document.getElementById('settings-username-display');
  if (uDisp) uDisp.textContent = appData.config.username || 'Nicht angemeldet';
}

function saveSettings(e) {
  if (e && e.preventDefault) e.preventDefault();

  const cfgTheme = document.getElementById('cfg-theme');
  if (cfgTheme) appData.config.theme = cfgTheme.value;

  const cfgFont = document.getElementById('cfg-font-size');
  if (cfgFont) appData.config.fontSize = cfgFont.value;

  const cfgTts = document.getElementById('cfg-tts');
  if (cfgTts) appData.config.ttsEnabled = cfgTts.checked;

  const cfgTtsRate = document.getElementById('cfg-tts-rate');
  if (cfgTtsRate) appData.config.ttsRate = parseFloat(cfgTtsRate.value) || 1.0;

  const cfgTextOnly = document.getElementById('cfg-text-only');
  if (cfgTextOnly) appData.config.textOnlyMode = cfgTextOnly.checked;

  saveAppData();
  applyConfig();
  announceSR('Einstellungen gespeichert.', 'polite');
}

function setThemeDirect(themeName) {
  appData.config.theme = themeName;
  saveAppData();
  applyConfig();
  announceSR(`Farbschema geändert auf: ${themeName === 'theme-high-contrast' ? 'Gelb auf Schwarz' : themeName === 'theme-dark' ? 'Dunkelmodus' : 'Standard Hell'}`, 'polite');
}

// =============================================================================
// 3. BARRIEREFREIE SPRACHAUSGABE & SCREENREADER (NVDA/JAWS)
// =============================================================================
function announceSR(message, priority = 'polite') {
  const targetId = priority === 'assertive' ? 'sr-live-assertive' : 'sr-live';
  const liveEl = document.getElementById(targetId);
  if (!liveEl) return;
  liveEl.textContent = '';
  setTimeout(() => {
    liveEl.textContent = message;
  }, 50);
}

function speak(text, force = false) {
  if (!speechSynth) return;
  if (!appData.config.ttsEnabled && !force) return;

  try {
    speechSynth.cancel();
    const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    const utter = new SpeechSynthesisUtterance(cleanText);
    utter.lang = 'de-DE';
    utter.rate = appData.config.ttsRate || 1.0;
    speechSynth.speak(utter);
  } catch (e) {
    console.warn('TTS Fehler:', e);
  }
}

// Hilfsfunktion: HTML-Zeichen sicher maskieren
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


// =============================================================================
// 4. NAVIGATION & REITER-WECHSEL (TASTEN 1 BIS 5)
// =============================================================================
function switchTab(tabId) {
  currentTab = tabId;

  const tabs = [
    { id: 'overview', btn: 'tab-overview', view: 'view-overview' },
    { id: 'exams', btn: 'tab-exams', view: 'view-exams' },
    { id: 'homework', btn: 'tab-homework', view: 'view-homework' },
    { id: 'absences', btn: 'tab-absences', view: 'view-absences' },
    { id: 'settings', btn: 'tab-settings', view: 'view-settings' }
  ];

  tabs.forEach(t => {
    const isTarget = t.id === tabId;
    const btn = document.getElementById(t.btn);
    const view = document.getElementById(t.view);

    if (btn) {
      btn.classList.toggle('active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      btn.setAttribute('tabindex', isTarget ? '0' : '-1');
      if (isTarget) btn.focus();
    }

    if (view) {
      view.classList.toggle('active', isTarget);
    }
  });

  if (tabId === 'overview') {
    renderTimetable();
    announceSR('Reiter 1: Stundenplan und Vertretungsplan ausgewählt.', 'polite');
  } else if (tabId === 'exams') {
    renderExams();
    announceSR('Reiter 2: Prüfungen und Termine für das gesamte Schuljahr ausgewählt.', 'polite');
  } else if (tabId === 'homework') {
    renderHomework();
    announceSR('Reiter 3: Hausaufgaben und Klassenbuch ausgewählt.', 'polite');
  } else if (tabId === 'absences') {
    renderAbsences();
    announceSR('Reiter 4: Fehlzeiten und Entschuldigungen ausgewählt.', 'polite');
  } else if (tabId === 'settings') {
    loadFeedbackArchive();
    announceSR('Reiter 5: Konto und Einstellungen ausgewählt.', 'polite');
  }
}

// =============================================================================
// 5. ANMELDUNG & SITZUNGS-MANAGEMENT
// =============================================================================
function showLoginView() {
  const loginView = document.getElementById('view-login');
  const navTabs = document.getElementById('main-nav-tabs');
  const contentArea = document.getElementById('view-content-area');
  const logoutBtn = document.getElementById('btn-header-logout');

  if (loginView) loginView.style.display = 'flex';
  if (navTabs) navTabs.style.display = 'none';
  if (contentArea) contentArea.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';

  const userInp = document.getElementById('login-username');
  if (userInp) {
    userInp.value = appData.config.username || '';
    userInp.focus();
  }

  const passInp = document.getElementById('login-password');
  if (passInp) {
    passInp.value = appData.config.password || '';
  }

  const statusEl = document.getElementById('sync-status-text');
  if (statusEl) statusEl.textContent = 'Bitte anmelden';

  announceSR('Willkommen beim barrierefreien Stundenplan des LWL-Berufskollegs Soest. Bitte melde dich mit deinen WebUntis-Zugangsdaten an.', 'assertive');
}

function hideLoginView() {
  const loginView = document.getElementById('view-login');
  const navTabs = document.getElementById('main-nav-tabs');
  const contentArea = document.getElementById('view-content-area');
  const logoutBtn = document.getElementById('btn-header-logout');

  if (loginView) loginView.style.display = 'none';
  if (navTabs) navTabs.style.display = 'block';
  if (contentArea) contentArea.style.display = 'block';
  if (logoutBtn) logoutBtn.style.display = 'inline-flex';
}

async function handleLoginSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();

  const userVal = document.getElementById('login-username').value.trim();
  const passVal = document.getElementById('login-password').value;
  const remVal = document.getElementById('login-remember').checked;
  const statusBox = document.getElementById('login-status-box');
  const submitBtn = document.getElementById('btn-login-submit');

  if (!userVal || !passVal) {
    announceSR('Bitte gib sowohl deinen Benutzernamen als auch dein Passwort ein.', 'assertive');
    return;
  }

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="emoji-icon">⏳</span> <strong>Verbinde mit WebUntis...</strong>';
  }

  if (statusBox) {
    statusBox.style.display = 'block';
    statusBox.innerHTML = `
      <div style="background: rgba(2, 132, 199, 0.1); border: 2px solid var(--accent-info); padding: 14px; border-radius: 8px;">
        <strong style="color: var(--accent-info);">🔄 Melde an WebUntis des LWL-Berufskollegs Soest an...</strong>
      </div>
    `;
  }
  announceSR('Melde an WebUntis an...', 'polite');

  try {
    const success = await performWebUntisSync(userVal, passVal);
    if (success) {
      appData.config.username = userVal;
      if (remVal) {
        appData.config.password = passVal;
        appData.config.rememberLogin = true;
      } else {
        appData.config.password = '';
        appData.config.rememberLogin = false;
      }
      saveAppData();
      applyConfig();
      hideLoginView();
      switchTab('overview');
      speak('Erfolgreich angemeldet. Dein Stundenplan wurde geladen.', true);
    } else {
      if (statusBox) {
        statusBox.style.display = 'block';
        statusBox.innerHTML = `
          <div style="background: rgba(185, 28, 28, 0.1); border: 2px solid var(--accent-danger); padding: 14px; border-radius: 8px;">
            <strong style="color: var(--accent-danger);">❌ Anmeldung fehlgeschlagen</strong>
            <p style="margin-top: 4px; font-size: 14px;">Benutzername oder Passwort ist ungültig. Bitte überprüfe deine Eingabe.</p>
          </div>
        `;
      }
      announceSR('Anmeldung fehlgeschlagen: Der Benutzername oder das Passwort ist ungültig.', 'assertive');
      document.getElementById('login-password').focus();
    }
  } catch (err) {
    if (statusBox) {
      statusBox.style.display = 'block';
      statusBox.innerHTML = `
        <div style="background: rgba(185, 28, 28, 0.1); border: 2px solid var(--accent-danger); padding: 14px; border-radius: 8px;">
          <strong style="color: var(--accent-danger);">⚠️ Verbindung nicht möglich</strong>
          <p style="margin-top: 4px; font-size: 14px;">Die lokale WebUntis-Brücke ist nicht erreichbar. Bitte starte Stundenplan_LWL.exe neu.</p>
        </div>
      `;
    }
    announceSR('Verbindungsfehler zur WebUntis-Brücke.', 'assertive');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="emoji-icon">🚀</span> <strong>Anmelden &amp; Stundenplan laden</strong>';
    }
  }
}

function logoutUser() {
  if (confirm('Möchtest du dich wirklich von WebUntis abmelden?')) {
    appData.config.password = '';
    saveAppData();
    webuntisSessionId = null;
    showLoginView();
    announceSR('Du wurdest abgemeldet.', 'polite');
  }
}

function exitApp() {
  if (confirm('Möchtest du die Stundenplan-Anwendung und den Server wirklich beenden?')) {
    announceSR('Stundenplan-App wird beendet. Auf Wiedersehen.', 'assertive');
    fetch('/api/shutdown').catch(() => {}).finally(() => {
      document.body.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1 style="font-size: 28px; margin-bottom: 16px;">✅ Stundenplan-App beendet</h1>
          <p style="font-size: 18px; color: #4b5563;">Der lokale Dienst wurde ordnungsgemäß gestoppt.</p>
          <p style="font-size: 16px; margin-top: 10px;">Du kannst diesen Browser-Tab nun schließen.</p>
        </div>
      `;
      setTimeout(() => { window.close(); }, 800);
    });
  }
}

// =============================================================================
// 6. WEBUNTIS JSON-RPC API CLIENT & SYNCHRONISATION
// =============================================================================
async function callWebUntisApi(method, params = {}) {
  const payload = {
    id: 'req-' + Date.now(),
    method: method,
    params: params,
    jsonrpc: '2.0'
  };

  const endpoints = [];
  if (window.location.origin && window.location.origin.startsWith('http')) {
    endpoints.push(window.location.origin + '/api/webuntis');
  }
  endpoints.push('http://127.0.0.1:48250/api/webuntis');
  endpoints.push('http://localhost:48250/api/webuntis');

  let lastError = null;
  for (const ep of endpoints) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-School': appData.config.schoolShort || 'lwl-bk-soest',
        'X-Server': appData.config.server || 'lwl-bk-soest.webuntis.com'
      };
      if (webuntisSessionId) {
        headers['X-JSESSIONID'] = webuntisSessionId;
      }

      const res = await fetch(ep, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      const setCookie = res.headers.get('X-Set-Cookie');
      if (setCookie && setCookie.includes('JSESSIONID=')) {
        const m = setCookie.match(/JSESSIONID=([^;]+)/);
        if (m) webuntisSessionId = m[1];
      }

      const data = await res.json();
      return data;
    } catch (e) {
      lastError = e;
    }
  }

  throw lastError || new Error('Keine Verbindung zum WebUntis-Server möglich.');
}

async function callWebUntisRest(endpoint) {
  const endpoints = [];
  if (window.location.origin && window.location.origin.startsWith('http')) {
    endpoints.push(window.location.origin + '/api/webuntis');
  }
  endpoints.push('http://127.0.0.1:48250/api/webuntis');
  endpoints.push('http://localhost:48250/api/webuntis');

  for (const ep of endpoints) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-School': appData.config.schoolShort || 'lwl-bk-soest',
        'X-Server': appData.config.server || 'lwl-bk-soest.webuntis.com',
        'X-Endpoint': endpoint
      };
      if (webuntisSessionId) {
        headers['X-JSESSIONID'] = webuntisSessionId;
      }

      const res = await fetch(ep, {
        method: 'GET',
        headers: headers
      });

      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {}
  }
  return null;
}

function formatDateToUntis(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return parseInt(`${y}${m}${day}`);
}

function formatUntisTimeToStr(val) {
  const s = String(val).padStart(4, '0');
  return `${s.slice(0, 2)}:${s.slice(2, 4)}`;
}

function getSchoolYearRange() {
  const now = new Date();
  const curYear = now.getFullYear();
  const curMonth = now.getMonth() + 1; // 1..12

  let startYear = curYear;
  let endYear = curYear + 1;

  // In Deutschland beginnt das Schuljahr am 1. August
  if (curMonth < 8) {
    startYear = curYear - 1;
    endYear = curYear;
  }

  const startDateNum = parseInt(`${startYear}0801`);
  const endDateNum = parseInt(`${endYear}0731`);
  const name = `${startYear}/${endYear}`;

  return {
    name,
    startYear,
    endYear,
    startDateNum,
    endDateNum,
    startDate: new Date(startYear, 7, 1),
    endDate: new Date(endYear, 6, 31)
  };
}

async function performWebUntisSync(userOverride, passOverride) {
  if (isSyncInProgress) return false;
  isSyncInProgress = true;

  const username = userOverride || appData.config.username;
  const password = passOverride || appData.config.password;

  if (!username || !password) {
    isSyncInProgress = false;
    showLoginView();
    return false;
  }

  const syncStatusText = document.getElementById('sync-status-text');
  const refreshBtn = document.getElementById('btn-refresh');

  if (syncStatusText) syncStatusText.textContent = 'Synchronisiere...';
  if (refreshBtn) refreshBtn.classList.add('loading');

  try {
    // 1. Authenticate
    const authRes = await callWebUntisApi('authenticate', {
      user: username,
      password: password,
      client: 'BarrierefreierStundenplanLWL'
    });

    if (!authRes || authRes.error) {
      console.warn('WebUntis Login Error:', authRes ? authRes.error : 'Unbekannt');
      isSyncInProgress = false;
      if (syncStatusText) syncStatusText.textContent = 'Fehler beim Login';
      if (refreshBtn) refreshBtn.classList.remove('loading');
      return false;
    }

    const { sessionId, personId, personType } = authRes.result;
    webuntisSessionId = sessionId;

    // 2. Metadaten parallel abrufen (Fächer, Lehrer, Räume, Klassen, Prüfungsarten, Klassenbuch-Kategorien)
    const [subRes, teaRes, rooRes, klaRes, examTypesRes, classregCatsRes] = await Promise.all([
      callWebUntisApi('getSubjects').catch(() => ({})),
      callWebUntisApi('getTeachers').catch(() => ({})),
      callWebUntisApi('getRooms').catch(() => ({})),
      callWebUntisApi('getKlassen').catch(() => ({})),
      callWebUntisApi('getExamTypes').catch(() => ({})),
      callWebUntisApi('getClassregCategories').catch(() => ({}))
    ]);

    const examTypesMap = {};
    if (examTypesRes && examTypesRes.result && Array.isArray(examTypesRes.result)) {
      examTypesRes.result.forEach(et => {
        const lbl = et.longName || et.name;
        examTypesMap[et.id] = lbl;
        if (et.name) examTypesMap[et.name] = lbl;
      });
    }

    const classregCatsMap = {};
    if (classregCatsRes && classregCatsRes.result && Array.isArray(classregCatsRes.result)) {
      classregCatsRes.result.forEach(c => {
        const lbl = c.longname || c.name || c.text;
        if (lbl) {
          classregCatsMap[c.id] = lbl;
          if (c.name) classregCatsMap[c.name] = lbl;
        }
      });
    }

    const subjectsMap = {};
    if (subRes && subRes.result && Array.isArray(subRes.result)) {
      subRes.result.forEach(s => {
        subjectsMap[s.id] = s.longName || s.name;
        if (s.name) subjectsMap[s.name] = s.longName || s.name;
      });
    }

    const teachersMap = {};
    if (teaRes && teaRes.result && Array.isArray(teaRes.result)) {
      teaRes.result.forEach(t => {
        const tName = `${t.foreName ? t.foreName + ' ' : ''}${t.longName || t.name}`;
        teachersMap[t.id] = tName;
        if (t.name) teachersMap[t.name] = tName;
      });
    }

    const roomsMap = {};
    if (rooRes && rooRes.result && Array.isArray(rooRes.result)) {
      rooRes.result.forEach(r => {
        let label = r.name || '';
        if (r.longName && r.longName !== r.name) {
          label = r.name ? `${r.name} (${r.longName})` : r.longName;
        }
        if (!label) label = r.name || r.longName || ('Raum ' + r.id);
        roomsMap[r.id] = label;
        if (r.name) roomsMap[r.name] = label;
      });
    }

    const klassenMap = {};
    if (klaRes && klaRes.result && Array.isArray(klaRes.result)) {
      klaRes.result.forEach(k => {
        const kName = k.longName || k.name || ('Klasse ' + k.id);
        klassenMap[k.id] = kName;
        if (k.name) klassenMap[k.name] = kName;
      });
    }

    // 3. Datumsbereich: Aktuelle Schulwoche Mo-Fr (am Wochenende Folgewoche)
    const now = new Date();
    const curDay = now.getDay();
    let diffToMonday = 1 - curDay;
    if (curDay === 0) diffToMonday = 1; // Sonntag -> Montag
    else if (curDay === 6) diffToMonday = 2; // Samstag -> Montag

    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    const startNum = formatDateToUntis(monday);
    const endNum = formatDateToUntis(friday);

    // 4. Stundenplan für aktuelle Schulwoche abrufen
    const ttRes = await callWebUntisApi('getTimetable', {
      options: {
        element: { id: personId, type: personType },
        startDate: startNum,
        endDate: endNum,
        showLsText: true,
        showStudentgroup: true,
        showInfo: true,
        showSubstText: true,
        showLsNumber: true,
        showBooking: true,
        klasseFields: ['id', 'name', 'longname'],
        roomFields: ['id', 'name', 'longname'],
        subjectFields: ['id', 'name', 'longname'],
        teacherFields: ['id', 'name', 'longname']
      }
    }).catch(() => ({}));

    // Schülerklasse ermitteln (für klassenspezifische Prüfungen & Termine)
    let detectedKlasseId = null;
    if (ttRes && ttRes.result && Array.isArray(ttRes.result)) {
      for (const item of ttRes.result) {
        if (item.kl && Array.isArray(item.kl) && item.kl[0] && item.kl[0].id) {
          detectedKlasseId = item.kl[0].id;
          break;
        }
      }
    }
    if (!detectedKlasseId && personType === 1) {
      detectedKlasseId = personId;
    }

    // 5. Schuljahr ermitteln (WebUntis getSchoolyears oder dynamische Berechnung)
    let syRange = getSchoolYearRange();
    try {
      const syRes = await callWebUntisApi('getSchoolyears', {});
      if (syRes && syRes.result && Array.isArray(syRes.result) && syRes.result.length > 0) {
        const todayNum = formatDateToUntis(now);
        // Sicherstellen, dass das aktive oder neueste zutreffende Schuljahr gewählt wird
        const activeSy = syRes.result.find(s => todayNum >= s.startDate && todayNum <= s.endDate)
          || syRes.result.find(s => s.endDate >= todayNum)
          || syRes.result[syRes.result.length - 1];
        if (activeSy && activeSy.endDate >= 20260801) {
          const sStr = String(activeSy.startDate);
          const eStr = String(activeSy.endDate);
          syRange = {
            name: activeSy.name || `${sStr.slice(0, 4)}/${eStr.slice(0, 4)}`,
            startYear: parseInt(sStr.slice(0, 4)),
            endYear: parseInt(eStr.slice(0, 4)),
            startDateNum: activeSy.startDate,
            endDateNum: activeSy.endDate,
            startDate: new Date(parseInt(sStr.slice(0, 4)), parseInt(sStr.slice(4, 6)) - 1, parseInt(sStr.slice(6, 8))),
            endDate: new Date(parseInt(eStr.slice(0, 4)), parseInt(eStr.slice(4, 6)) - 1, parseInt(eStr.slice(6, 8)))
          };
        }
      }
    } catch (e) { }
    appData.schoolYear = syRange;

    // 6. 28-Tage-Sliding-Windows für den gesamten Schuljahres-Stundenplan (verhindert Überschreiten von WebUntis-Zeitraum-Limits)
    const dateWindows = [];
    let winCur = new Date(syRange.startDate);
    while (winCur < syRange.endDate) {
      let winNext = new Date(winCur);
      winNext.setDate(winNext.getDate() + 27);
      if (winNext > syRange.endDate) winNext = new Date(syRange.endDate);
      dateWindows.push({
        start: formatDateToUntis(winCur),
        end: formatDateToUntis(winNext)
      });
      winCur = new Date(winNext);
      winCur.setDate(winCur.getDate() + 1);
    }

    // Stundenplan-Abfragen über das gesamte Schuljahr (getTimetable und getTimetable2017 für Schüler & Klasse)
    const futureTtCalls = [];
    dateWindows.forEach(win => {
      // Standard getTimetable
      futureTtCalls.push(callWebUntisApi('getTimetable', {
        options: {
          element: { id: personId, type: personType },
          startDate: win.start,
          endDate: win.end,
          showLsText: true,
          showStudentgroup: true,
          showInfo: true,
          showSubstText: true,
          showLsNumber: true,
          showBooking: true,
          klasseFields: ['id', 'name', 'longname'],
          roomFields: ['id', 'name', 'longname'],
          subjectFields: ['id', 'name', 'longname'],
          teacherFields: ['id', 'name', 'longname']
        }
      }).catch(() => ({})));

      // getTimetable2017 (wird von WebUntis Mobile für erweiterte Aktivitäts- & Prüfungsdetails genutzt)
      futureTtCalls.push(callWebUntisApi('getTimetable2017', {
        id: personId,
        type: personType,
        startDate: win.start,
        endDate: win.end
      }).catch(() => ({})));

      if (detectedKlasseId) {
        futureTtCalls.push(callWebUntisApi('getTimetable', {
          options: {
            element: { id: detectedKlasseId, type: 1 },
            startDate: win.start,
            endDate: win.end,
            showLsText: true,
            showStudentgroup: true,
            showInfo: true,
            showSubstText: true,
            showLsNumber: true,
            showBooking: true,
            klasseFields: ['id', 'name', 'longname'],
            roomFields: ['id', 'name', 'longname'],
            subjectFields: ['id', 'name', 'longname'],
            teacherFields: ['id', 'name', 'longname']
          }
        }).catch(() => ({})));

        futureTtCalls.push(callWebUntisApi('getTimetable2017', {
          id: detectedKlasseId,
          type: 1,
          startDate: win.start,
          endDate: win.end
        }).catch(() => ({})));
      }
    });

    // Prüfungs-IDs aus getExamTypes sammeln (inklusive Fallback 0 für alle Prüfungsarten)
    const examTypeIds = [0];
    if (examTypesRes && examTypesRes.result && Array.isArray(examTypesRes.result)) {
      examTypesRes.result.forEach(et => {
        if (et.id !== undefined && !examTypeIds.includes(et.id)) examTypeIds.push(et.id);
      });
    }

    const examCalls = [];
    examTypeIds.forEach(etId => {
      examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));
      examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: personId, type: personType }).catch(() => ({})));
      examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum, studentId: personId }).catch(() => ({})));
      if (detectedKlasseId) {
        examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: detectedKlasseId, type: 1 }).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum, klasseId: detectedKlasseId }).catch(() => ({})));
      }
    });

    // Spezifische Schülerprüfungs-Methoden & generelle Prüfungsabfragen
    examCalls.push(callWebUntisApi('getStudentExams', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getStudentExams', { startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getStudentExamList', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getExams', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getExams', { startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})));

    // Klassenbuch-Termine & Ereignisse
    const classregCalls = [
      callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: personId, type: personType }).catch(() => ({})),
      callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, element: { id: personId, type: personType } }).catch(() => ({})),
      callWebUntisApi('getClassregEventEntries', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getClassregEventEntries', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: personId, type: personType }).catch(() => ({})),
      callWebUntisApi('getClassregEventEntries', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, element: { id: personId, type: personType } }).catch(() => ({}))
    ];

    if (detectedKlasseId) {
      classregCalls.push(
        callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: detectedKlasseId, type: 1 }).catch(() => ({})),
        callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, element: { id: detectedKlasseId, type: 1 } }).catch(() => ({})),
        callWebUntisApi('getClassregEventEntries', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: detectedKlasseId, type: 1 }).catch(() => ({})),
        callWebUntisApi('getClassregEventEntries', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, element: { id: detectedKlasseId, type: 1 } }).catch(() => ({}))
      );
    }

    // 6b. Hausaufgaben-Abfragen (getHomeWork2017 für Schüler & Klasse + getHomeWorks) - Alle WebUntis Varianten
    const homeworkCalls = [
      // Standard JSON-RPC mit Integer-Daten
      callWebUntisApi('getHomeWork2017', { id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getHomeWork2017', { id: personId, type: 5, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getHomeWork2017', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      // WebUntis Mobile API mit ISO-String-Daten (YYYY-MM-DD) & String-Types ("STUDENT")
      callWebUntisApi('getHomeWork2017', { id: personId, type: 'STUDENT', startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})),
      callWebUntisApi('getHomeWork2017', { id: personId, type: 5, startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})),
      callWebUntisApi('getHomeWork2017', { startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})),
      // Array-Parameter (wird von manchen WebUntis-Servern vorausgesetzt)
      callWebUntisApi('getHomeWork2017', [{ id: personId, type: 'STUDENT', startDate: sIsoStr, endDate: eIsoStr }]).catch(() => ({})),
      callWebUntisApi('getHomeWork2017', [{ id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }]).catch(() => ({})),
      // getHomeWorks Methode
      callWebUntisApi('getHomeWorks', { id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getHomeWorks', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getHomeWorks', { startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({}))
    ];
    if (detectedKlasseId) {
      homeworkCalls.push(
        callWebUntisApi('getHomeWork2017', { id: detectedKlasseId, type: 1, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
        callWebUntisApi('getHomeWork2017', { id: detectedKlasseId, type: 'CLASS', startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})),
        callWebUntisApi('getHomeWork2017', [{ id: detectedKlasseId, type: 'CLASS', startDate: sIsoStr, endDate: eIsoStr }]).catch(() => ({}))
      );
    }

    // 6c. Fehlzeiten-Abfragen (getStudentAbsences2017, getTimetableWithAbsences & Gründe)
    const absenceCalls = [
      callWebUntisApi('getStudentAbsences2017', { id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getStudentAbsences2017', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getStudentAbsences2017', { startDate: sIsoStr, endDate: eIsoStr, includeExcused: true, includeUnExcused: true }).catch(() => ({})),
      callWebUntisApi('getTimetableWithAbsences', { id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getAbsenceReasons', {}).catch(() => ({}))
    ];

    // REST-Endpunkte für Prüfungen, Hausaufgaben, Fehlzeiten & App-Daten (Untis Mobile Backend)
    const restExamsPromise = callWebUntisRest(`/api/exams?startDate=${sIsoStr}&endDate=${eIsoStr}`).catch(() => null);
    const restAppDataPromise = callWebUntisRest('/api/rest/view/v1/app/data').catch(() => null);
    const restHomeworkPromise1 = callWebUntisRest(`/api/homeworks/lessons?startDate=${sIsoStr}&endDate=${eIsoStr}`).catch(() => null);
    const restHomeworkPromise2 = callWebUntisRest(`/api/homeworks?startDate=${sIsoStr}&endDate=${eIsoStr}`).catch(() => null);
    const restHomeworkPromise3 = callWebUntisRest(`/api/rest/view/v1/homeworks?startDate=${sIsoStr}&endDate=${eIsoStr}`).catch(() => null);
    const restAbsencesPromise = callWebUntisRest(`/api/classreg/absences/students?startDate=${sIsoStr}&endDate=${eIsoStr}`).catch(() => null);

    // 7. Schulferien, News, Prüfungen, Klassenbuch, Hausaufgaben, Fehlzeiten & REST-Daten parallel abrufen
    const [
      examResponses,
      classregResponses,
      futureTtResults,
      homeworkResponses,
      absenceResponses,
      holidaysRes,
      newsRes,
      restExamsRes,
      restAppDataRes,
      restHomeworkRes1,
      restHomeworkRes2,
      restHomeworkRes3,
      restAbsencesRes
    ] = await Promise.all([
      Promise.all(examCalls),
      Promise.all(classregCalls),
      Promise.all(futureTtCalls),
      Promise.all(homeworkCalls),
      Promise.all(absenceCalls),
      callWebUntisApi('getHolidays', {}).catch(() => ({})),
      callWebUntisApi('getNewsWidgetData', {}).catch(() => callWebUntisApi('getNewsWidget', {}).catch(() => ({}))),
      restExamsPromise,
      restAppDataPromise,
      restHomeworkPromise1,
      restHomeworkPromise2,
      restHomeworkPromise3,
      restAbsencesPromise
    ]);


    // 8. Logout
    try { await callWebUntisApi('logout', {}); } catch (e) { }
    webuntisSessionId = null;

    // -------------------------------------------------------------
    // Hilfsfunktionen für Raum- und Prüfungsvalidierung
    // -------------------------------------------------------------
    function isValidRoomCandidate(candidate) {
      if (!candidate || typeof candidate !== 'string') return false;
      const clean = candidate.trim().toLowerCase();
      if (!clean || clean === 'raum' || clean === 'null' || clean === 'undefined') return false;
      if (clean === 'unterricht' || clean === 'lehrkraft') return false;
      if (clean === 'hanauer' || clean === 'raum hanauer') return false;
      return true;
    }

    function extractRoomFromObj(r) {
      if (!r) return '';
      if (typeof r === 'string' && isValidRoomCandidate(r)) return r.trim();
      if (typeof r === 'number') {
        if (roomsMap[r] && isValidRoomCandidate(roomsMap[r])) return roomsMap[r];
        return '';
      }
      let candidate = r.name || r.longname || r.longName;
      if (candidate && isValidRoomCandidate(candidate)) return candidate.trim();
      if (r.id && roomsMap[r.id] && isValidRoomCandidate(roomsMap[r.id])) return roomsMap[r.id];
      return '';
    }

    // 9. Stundenplan der aktuellen Schulwoche & des gesamten Schuljahres parsen
    const timetableExams = [];
    const timetableHomeworks = [];

    // Erweiterte Erkennung von Klassenarbeiten, Klausuren, Arbeiten und Tests
    function scanItemForExam(item, idx) {
      if (!item) return;
      const subjName = (item.su && item.su[0]) ? (subjectsMap[item.su[0].id] || item.su[0].name || item.su[0].longname || '') : '';
      const codeVal = String(item.code || '').toLowerCase();
      const actVal = String(item.activityType || '').toLowerCase();
      const typeVal = String(item.type || '').toLowerCase();
      const cellVal = String(item.cellType || '').toLowerCase();

      const notes = [
        item.substText,
        item.lstext,
        item.info,
        item.bkText,
        item.text,
        item.sg,
        item.lessonText,
        item.activityType,
        item.code,
        subjName
      ].filter(Boolean).join(' ');

      const isExamCode = codeVal === 'exam' || codeVal === 'klausur' || codeVal === 'examination' ||
                         actVal === 'exam' || actVal === 'klausur' || actVal === 'examination' ||
                         typeVal === 'exam' || cellVal === 'exam' ||
                         item.examId !== undefined || item.exam !== undefined || item.exams !== undefined || item.isExam === true;

      const isExamText = /\b(klausur|klausuren|klausurblock|klassenarbeit|klassenarbeiten|prüfung|pruefung|prüfungen|pruefungen|arbeit|arbeiten|test|tests|leistungsnachweis|nachschreib|nachschreiber|nachhol|abschlussprüfung|abschlusspruefung|zentrale\s+prüfung|zentrale\s+pruefung|zk|zap|zp\s*10|facharbeit|kolloquium|präsentationsprüfung)\b|\b(ka\b|ka-|\(ka\)|1\.\s*ka|2\.\s*ka|3\.\s*ka|4\.\s*ka|klaus\.|kl\.)/i.test(notes) ||
                         /\b(klassenarbeit|klausur|arbeit|test|prüfung|ka\b)/i.test(subjName);

      if (isExamCode || isExamText) {
        const dStr = String(item.date);
        if (dStr.length === 8) {
          const dateNum = parseInt(dStr);
          if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

          const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
          let subj = subjName || 'Klausur';
          if (/klassenarbeit/i.test(notes) && !/klassenarbeit/i.test(subj)) {
            subj = subj ? `${subj} (Klassenarbeit)` : 'Klassenarbeit';
          } else if (/^klausur/i.test(subj) && notes && notes !== subj) {
            subj = notes.slice(0, 35);
          }
          const teach = (item.te && item.te[0]) ? (teachersMap[item.te[0].id] || item.te[0].name || 'Fachlehrkraft') : 'Fachlehrkraft';

          let rm = 'Raum laut Plan';
          if (item.ro && Array.isArray(item.ro) && item.ro[0]) {
            rm = extractRoomFromObj(item.ro[0]);
          }
          if (!isValidRoomCandidate(rm)) rm = 'Raum laut Plan';
          else rm = formatRoomDisplay(rm, teach);

          const topicText = [item.substText, item.info, item.lstext, item.lessonText, item.text, subjName].filter(Boolean).join(' - ') || 'Klassenarbeit / Klausur laut WebUntis';

          timetableExams.push({
            id: `tt-exam-${item.id || dStr + '-' + (item.startTime || idx)}`,
            subject: subj,
            date: isoDate,
            startTime: formatUntisTimeToStr(item.startTime || 745),
            endTime: formatUntisTimeToStr(item.endTime || 915),
            room: rm,
            teacher: teach,
            topic: topicText,
            type: 'exam',
            completed: false
          });
        }
      }
    }

    // Automatische Erkennung von Hausaufgaben aus dem Stundenplan & Klassenbuch
    function scanItemForHomework(item, idx) {
      if (!item) return;
      const subjName = (item.su && item.su[0]) ? (subjectsMap[item.su[0].id] || item.su[0].name || item.su[0].longname || '') : '';
      const dStr = String(item.date);
      if (dStr.length !== 8) return;
      const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
      const teach = (item.te && item.te[0]) ? (teachersMap[item.te[0].id] || item.te[0].name || 'Fachlehrkraft') : 'Fachlehrkraft';

      const fullText = [item.homework, item.lstext, item.lessonText, item.info, item.substText, item.text].filter(Boolean).join(' ');
      if (!fullText) return;

      const isExam = /\b(klausur|klassenarbeit|prüfung|arbeit)\b/i.test(fullText);
      const hwMatch = fullText.match(/\b(?:ha:|h\.a\.:|hausaufgabe:|hausaufgaben:|hausaufgabe|hausaufgaben|aufgabe:|aufgaben:|übung:|bis\s+nächste\s+woche|zu\s+erledigen:|erledigen\s+bis)\s*[:\-]?\s*(.+)/i);

      if ((hwMatch || item.homework) && !isExam) {
        const textContent = hwMatch ? hwMatch[1].trim() : String(item.homework || fullText).trim();
        if (textContent.length > 2) {
          timetableHomeworks.push({
            id: `tt-hw-${item.id || idx}-${isoDate}`,
            subject: subjName || 'Hausaufgabe',
            teacher: teach,
            dueDate: isoDate,
            text: textContent,
            completed: false
          });
        }
      }
    }

    // Alle Stundenplanquellen für das gesamte Schuljahr sammeln
    const allTtSource = [];
    if (ttRes && ttRes.result && Array.isArray(ttRes.result)) allTtSource.push(...ttRes.result);
    if (futureTtResults && Array.isArray(futureTtResults)) {
      futureTtResults.forEach(f => {
        if (f && f.result && Array.isArray(f.result)) allTtSource.push(...f.result);
      });
    }

    // Alle Stunden des gesamten Schuljahres nach Klassenarbeiten & Hausaufgaben scannen
    allTtSource.forEach((item, idx) => {
      scanItemForExam(item, idx);
      scanItemForHomework(item, idx);
    });

    // Stundenplan der aktuellen Schulwoche in appData.timetable überführen
    if (ttRes && ttRes.result && Array.isArray(ttRes.result)) {
      const newTimetable = [];
      ttRes.result.forEach((item, idx) => {
        const dStr = String(item.date);
        const itemDate = new Date(parseInt(dStr.slice(0, 4)), parseInt(dStr.slice(4, 6)) - 1, parseInt(dStr.slice(6, 8)));
        const dayOfWeek = itemDate.getDay();
        if (dayOfWeek < 1 || dayOfWeek > 5) return;

        const startStr = formatUntisTimeToStr(item.startTime);
        const endStr = formatUntisTimeToStr(item.endTime);

        let periodNum = 1;
        const matchedPeriod = appData.periods.find(p => p.start === startStr);
        if (matchedPeriod) {
          periodNum = matchedPeriod.period;
        } else {
          periodNum = idx + 1;
        }

        const subj = (item.su && item.su[0]) ? (subjectsMap[item.su[0].id] || item.su[0].name || item.su[0].longname || 'Unterricht') : 'Unterricht';
        const teach = (item.te && item.te[0]) ? (teachersMap[item.te[0].id] || item.te[0].name || item.te[0].longname || 'Lehrkraft') : 'Lehrkraft';
        const klasse = (item.kl && item.kl[0]) ? (klassenMap[item.kl[0].id] || item.kl[0].name || item.kl[0].longname || '') : '';

        let rm = '';
        if (item.ro && Array.isArray(item.ro) && item.ro.length > 0) {
          const roomParts = item.ro.map(extractRoomFromObj).filter(Boolean);
          if (roomParts.length > 0) rm = roomParts.join(', ');
        }
        if (!rm && item.orgro && Array.isArray(item.orgro) && item.orgro.length > 0) {
          const orgParts = item.orgro.map(extractRoomFromObj).filter(Boolean);
          if (orgParts.length > 0) rm = orgParts.join(', ');
        }
        if (!rm && item.room) {
          rm = extractRoomFromObj(item.room);
        }
        if (!rm) {
          const combinedText = [item.substText, item.lstext, item.info, item.bkText].filter(Boolean).join(' ');
          const matchRoom = combinedText.match(/\b(?:in\s+Raum|nach\s+Raum|Raum|Rm\.)\s+([A-Z0-9][A-Z0-9\.\-_/]*)/i);
          if (matchRoom && isValidRoomCandidate(matchRoom[1])) {
            rm = matchRoom[1];
          }
        }

        if (!isValidRoomCandidate(rm)) {
          rm = 'Raum wird bekanntgegeben';
        } else {
          let cleanRm = rm.trim();
          if (!/^raum\b/i.test(cleanRm)) {
            cleanRm = 'Raum ' + cleanRm;
          }
          rm = cleanRm;
        }

        let st = 'normal';
        if (item.code === 'cancelled') st = 'cancelled';
        else if (item.code === 'irregular') st = 'substitute';

        const dateIso = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
        const lessonTopic = (item.lstext || item.lessonText || '').trim();

        newTimetable.push({
          id: `untis-${item.id || idx}`,
          untisId: item.id,
          day: dayOfWeek,
          dateStr: dateIso,
          period: periodNum,
          startTime: startStr,
          endTime: endStr,
          subject: subj,
          teacher: teach,
          klasse: klasse,
          room: rm,
          status: st,
          notes: item.substText || item.info || '',
          lstext: lessonTopic,
          homework: item.homework || ''
        });
      });

      if (newTimetable.length > 0) {
        appData.timetable = newTimetable;
      }
    }



    // 10. Prüfungen zusammenführen & deduplizieren
    const examKeySet = new Set();
    const newExams = [];

    function addUniqueExam(exItem) {
      if (!exItem || !exItem.date || !exItem.subject) return;
      const key = `${exItem.date}_${exItem.startTime}_${exItem.subject.toLowerCase().trim()}`;
      if (!examKeySet.has(key)) {
        examKeySet.add(key);
        newExams.push(exItem);
      }
    }

    // A. WebUntis getExams parsen
    const rawExamsList = [];
    examResponses.forEach(res => {
      if (res && res.result && Array.isArray(res.result)) {
        rawExamsList.push(...res.result);
      }
    });

    rawExamsList.forEach((ex, idx) => {
      // WICHTIG: WebUntis liefert ex.date ODER ex.examDate ODER ex.startDate
      const rawDate = ex.date || ex.examDate || ex.startDate;
      if (!rawDate) return;
      const dStr = String(rawDate).trim();
      if (dStr.length !== 8) return;

      const dateNum = parseInt(dStr);
      if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

      const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
      let subj = 'Klausur';
      if (ex.subject && subjectsMap[ex.subject]) subj = subjectsMap[ex.subject];
      else if (ex.subjectId && subjectsMap[ex.subjectId]) subj = subjectsMap[ex.subjectId];
      else if (typeof ex.subject === 'string' && ex.subject.trim()) subj = ex.subject.trim();
      else if (ex.name && !/^klausur/i.test(ex.name)) subj = ex.name;

      let exTeacher = 'Fachlehrkraft';
      const tId = (ex.teachers && Array.isArray(ex.teachers) && ex.teachers[0]) || ex.teacher || ex.teacherId;
      if (tId && teachersMap[tId]) {
        exTeacher = teachersMap[tId];
      } else if (typeof ex.teacher === 'string' && ex.teacher.trim()) {
        exTeacher = ex.teacher.trim();
      }

      let exRoom = 'Raum laut Plan';
      const rId = (ex.rooms && Array.isArray(ex.rooms) && ex.rooms[0]) || ex.room || ex.roomId;
      if (rId) {
        const rCandidate = extractRoomFromObj(rId);
        if (isValidRoomCandidate(rCandidate)) {
          exRoom = formatRoomDisplay(rCandidate, exTeacher);
        }
      }

      const topicParts = [];
      if (ex.examType && examTypesMap[ex.examType]) topicParts.push(examTypesMap[ex.examType]);
      else if (ex.examTypeId && examTypesMap[ex.examTypeId]) topicParts.push(examTypesMap[ex.examTypeId]);
      if (ex.name) topicParts.push(ex.name);
      if (ex.text && ex.text !== ex.name) topicParts.push(ex.text);
      if (ex.description && ex.description !== ex.name) topicParts.push(ex.description);

      const topicName = topicParts.filter(Boolean).join(' - ') || 'Klausur laut WebUntis';
      const sTime = ex.startTime !== undefined ? ex.startTime : (ex.start || 745);
      const eTime = ex.endTime !== undefined ? ex.endTime : (ex.end || 915);

      addUniqueExam({
        id: `untis-exam-${ex.id || idx}`,
        subject: subj,
        date: isoDate,
        startTime: formatUntisTimeToStr(sTime),
        endTime: formatUntisTimeToStr(eTime),
        room: exRoom,
        teacher: exTeacher,
        topic: topicName,
        type: 'exam',
        completed: false
      });
    });

    // B. Klassenbuch-Ereignisse (getClassregEvents) parsen (Prüfungen + Termine)
    const newHolidays = [];
    const holidayKeySet = new Set();

    const rawClassregList = [];
    classregResponses.forEach(res => {
      if (res && res.result && Array.isArray(res.result)) {
        rawClassregList.push(...res.result);
      }
    });

    rawClassregList.forEach((evt, idx) => {
      const rawDate = evt.date || evt.startDate;
      if (!rawDate) return;
      const dStr = String(rawDate).trim();
      if (dStr.length !== 8) return;

      const dateNum = parseInt(dStr);
      if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

      const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
      const catName = (evt.categoryId && classregCatsMap[evt.categoryId]) || evt.category || '';
      const reason = evt.reason || evt.text || evt.description || evt.name || '';
      const sTime = evt.starttime !== undefined ? evt.starttime : (evt.startTime || 745);
      const eTime = evt.endtime !== undefined ? evt.endtime : (evt.endTime || 915);

      let subj = 'Schultermin';
      if (evt.subjectId && subjectsMap[evt.subjectId]) subj = subjectsMap[evt.subjectId];
      else if (evt.subject && subjectsMap[evt.subject]) subj = subjectsMap[evt.subject];

      let teach = 'Fachlehrkraft';
      const tId = evt.teacherId || (evt.teachers && evt.teachers[0]) || evt.teacher;
      if (tId && teachersMap[tId]) teach = teachersMap[tId];

      const fullText = `${catName} ${reason} ${evt.text || ''}`.toLowerCase();
      const isExam = /\b(klausur|klassenarbeit|prüfung|pruefung|arbeit|test|leistungsnachweis|nachschreib|zk|abschlussprüfung|facharbeit)\b/i.test(fullText);

      if (isExam) {
        addUniqueExam({
          id: `classreg-exam-${evt.id || dStr + '-' + sTime + '-' + idx}`,
          subject: (subj !== 'Schultermin' ? subj : (reason || 'Klausur')),
          date: isoDate,
          startTime: formatUntisTimeToStr(sTime),
          endTime: formatUntisTimeToStr(eTime),
          room: 'Raum laut Plan',
          teacher: teach,
          topic: [catName, reason, evt.text].filter(Boolean).join(' - ') || 'Prüfung laut WebUntis',
          type: 'exam',
          completed: false
        });
      } else {
        const title = reason || catName || 'Schultermin';
        const key = `classreg_${isoDate}_${title.toLowerCase().trim()}`;
        if (!holidayKeySet.has(key)) {
          holidayKeySet.add(key);
          newHolidays.push({
            id: `classreg-evt-${evt.id || dStr + '-' + sTime + '-' + idx}`,
            name: title,
            shortName: catName || title,
            longName: [catName, reason, evt.text].filter(Boolean).join(' - '),
            startDate: isoDate,
            endDate: isoDate,
            startDateNum: dateNum,
            endDateNum: dateNum,
            timeStr: `${formatUntisTimeToStr(sTime)} - ${formatUntisTimeToStr(eTime)} Uhr`,
            type: 'appointment'
          });
        }
      }
    });

    // C. Stundenplan-Prüfungen hinzufügen
    timetableExams.forEach(addUniqueExam);

    // D. Prüfungen aus WebUntis REST-Endpunkten (/api/exams & /api/rest/view/v1/app/data)
    if (restExamsRes) {
      const restList = Array.isArray(restExamsRes) ? restExamsRes : (restExamsRes.data || restExamsRes.exams || []);
      if (Array.isArray(restList)) {
        restList.forEach((ex, idx) => {
          const rawDate = ex.date || ex.examDate || ex.startDate;
          if (!rawDate) return;
          let dStr = String(rawDate).replace(/-/g, '').trim();
          if (dStr.length < 8) return;
          dStr = dStr.slice(0, 8);
          const dateNum = parseInt(dStr);
          if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

          const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
          let subj = ex.subject || ex.name || 'Klausur';
          if (typeof subj === 'object' && subj) subj = subj.name || subj.longName || 'Klausur';
          let teach = ex.teacher || 'Fachlehrkraft';
          if (typeof teach === 'object' && teach) teach = teach.name || teach.longName || 'Fachlehrkraft';
          let rm = ex.room || 'Raum laut Plan';
          if (typeof rm === 'object' && rm) rm = rm.name || rm.longName || 'Raum laut Plan';

          addUniqueExam({
            id: `untis-rest-exam-${ex.id || idx}`,
            subject: String(subj),
            date: isoDate,
            startTime: ex.startTime ? (typeof ex.startTime === 'number' ? formatUntisTimeToStr(ex.startTime) : String(ex.startTime).slice(0, 5)) : '07:45',
            endTime: ex.endTime ? (typeof ex.endTime === 'number' ? formatUntisTimeToStr(ex.endTime) : String(ex.endTime).slice(0, 5)) : '09:15',
            room: isValidRoomCandidate(rm) ? formatRoomDisplay(rm, teach) : 'Raum laut Plan',
            teacher: String(teach),
            topic: ex.text || ex.description || ex.topic || 'Klausur laut WebUntis',
            type: 'exam',
            completed: false
          });
        });
      }
    }

    if (restAppDataRes && restAppDataRes.data) {
      const appExams = restAppDataRes.data.exams || restAppDataRes.data.calendarEvents || [];
      if (Array.isArray(appExams)) {
        appExams.forEach((ex, idx) => {
          const rawDate = ex.date || ex.examDate || ex.startDate;
          if (!rawDate) return;
          let dStr = String(rawDate).replace(/-/g, '').trim();
          if (dStr.length < 8) return;
          dStr = dStr.slice(0, 8);
          const dateNum = parseInt(dStr);
          if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

          const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
          let subj = ex.subject || ex.name || 'Klausur';
          if (typeof subj === 'object' && subj) subj = subj.name || subj.longName || 'Klausur';

          addUniqueExam({
            id: `untis-app-exam-${ex.id || idx}`,
            subject: String(subj),
            date: isoDate,
            startTime: ex.startTime ? (typeof ex.startTime === 'number' ? formatUntisTimeToStr(ex.startTime) : String(ex.startTime).slice(0, 5)) : '07:45',
            endTime: ex.endTime ? (typeof ex.endTime === 'number' ? formatUntisTimeToStr(ex.endTime) : String(ex.endTime).slice(0, 5)) : '09:15',
            room: 'Raum laut Plan',
            teacher: 'Fachlehrkraft',
            topic: ex.text || ex.description || 'Klausur laut WebUntis',
            type: 'exam',
            completed: false
          });
        });
      }
    }

    // Es werden AUSSCHLIESSLICH echte WebUntis-Prüfungen gespeichert (keine synthetischen Standarddaten!)
    appData.exams = newExams;

    // 11. Schulferien und Termine parsen (STRIKT NUR AKTUELLES SCHULJAHR 2026/2027!)
    if (holidaysRes && holidaysRes.result && Array.isArray(holidaysRes.result)) {
      holidaysRes.result.forEach(h => {
        // FILTER: Nur Ferien im aktuellen Schuljahr einbeziehen (Historische Jahre wie 2020-2025 ignorieren!)
        if (h.endDate < syRange.startDateNum || h.startDate > syRange.endDateNum) return;

        const sStr = String(h.startDate);
        const eStr = String(h.endDate);
        if (sStr.length !== 8 || eStr.length !== 8) return;
        const sIso = `${sStr.slice(0, 4)}-${sStr.slice(4, 6)}-${sStr.slice(6, 8)}`;
        const eIso = `${eStr.slice(0, 4)}-${eStr.slice(4, 6)}-${eStr.slice(6, 8)}`;

        const hText = `${h.name || ''} ${h.longName || ''}`.toLowerCase();
        const isExamHoliday = /\b(klausur|klausuren|prüfung|pruefung|prüfungen|pruefungen|arbeit|test|abschlussprüfung|abschlusspruefung|zentrale\s+prüfung|zk|zp|zap)\b/i.test(hText);
        const isAppointHoliday = /\b(tag|konferenz|zeugnis|sprechtag|beratung|anmeldung|information|feier|sportfest|wandertag|lehrkräfte|schilf|fortbildung)\b/i.test(hText);

        if (isExamHoliday) {
          addUniqueExam({
            id: `untis-exam-hol-${h.id || Math.random()}`,
            subject: h.name || 'Prüfung',
            date: sIso,
            startTime: '08:00',
            endTime: '13:00',
            room: 'Laut Schulaushang',
            teacher: 'Prüfungskommission',
            topic: h.longName || h.name || 'Prüfung / Klausurtag',
            type: 'exam',
            completed: false
          });
        }

        const holidayType = isExamHoliday ? 'exam' : (isAppointHoliday ? 'appointment' : 'holiday');
        const key = `${sIso}_${eIso}_${(h.name || '').toLowerCase()}`;
        if (!holidayKeySet.has(key)) {
          holidayKeySet.add(key);
          newHolidays.push({
            id: `untis-holiday-${h.id || Math.random()}`,
            name: h.longName || h.name || 'Schulferien',
            shortName: h.name || '',
            startDate: sIso,
            endDate: eIso,
            startDateNum: h.startDate,
            endDateNum: h.endDate,
            type: holidayType
          });
        }
      });
    }

    // Termine aus WebUntis NewsWidget / Schwarzes Brett hinzufügen
    if (newsRes && newsRes.result) {
      const articles = newsRes.result.articles || newsRes.result.newsOfTheDay || (Array.isArray(newsRes.result) ? newsRes.result : []);
      articles.forEach((art, idx) => {
        const title = art.topic || art.subject || art.name || '';
        const text = art.text || '';
        if (!title && !text) return;
        let dStr = String(art.date || art.publishDate || art.startDate || '');
        if (dStr.length === 8) {
          const dateNum = parseInt(dStr);
          if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

          const sIso = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
          let eStr = String(art.expireDate || art.endDate || dStr);
          let eIso = (eStr.length === 8) ? `${eStr.slice(0, 4)}-${eStr.slice(4, 6)}-${eStr.slice(6, 8)}` : sIso;
          const key = `news_${sIso}_${title.toLowerCase()}`;
          if (!holidayKeySet.has(key)) {
            holidayKeySet.add(key);
            newHolidays.push({
              id: `untis-news-${art.id || idx}`,
              name: title || 'Schultermin',
              shortName: title || '',
              longName: text ? `${title}: ${text}` : title,
              startDate: sIso,
              endDate: eIso,
              startDateNum: dateNum,
              endDateNum: parseInt(eStr.length === 8 ? eStr : dStr),
              type: 'appointment'
            });
          }
        }
      });
    }

    // Standard NRW Termine & Zeugnistage als Fallback/Ergänzung einbinden, damit kein Termin fehlt
    DEFAULT_NRW_HOLIDAYS_2026_2027.forEach(defH => {
      const key = `${defH.startDate}_${defH.endDate}_${(defH.name || '').toLowerCase()}`;
      const nameKey = (defH.name || '').toLowerCase();
      const alreadyExists = newHolidays.some(h => (h.name || '').toLowerCase().includes(nameKey) || nameKey.includes((h.name || '').toLowerCase()));
      if (!alreadyExists && !holidayKeySet.has(key)) {
        holidayKeySet.add(key);
        newHolidays.push(defH);
      }
    });

    appData.holidays = newHolidays;

    // 12. Hausaufgaben parsen & zusammenführen
    const preservedCompletedMap = {};
    if (appData.homework && Array.isArray(appData.homework)) {
      appData.homework.forEach(hw => {
        if (hw.completed) preservedCompletedMap[hw.id] = true;
      });
    }

    const newHomework = [];
    const homeworkKeySet = new Set();

    function addUniqueHomework(hwItem) {
      if (!hwItem || !hwItem.text) return;
      const key = `${hwItem.dueDate}_${(hwItem.subject || '').toLowerCase()}_${hwItem.text.toLowerCase().trim()}`;
      if (!homeworkKeySet.has(key)) {
        homeworkKeySet.add(key);
        newHomework.push(hwItem);
      }
    }

    // A. JSON-RPC Hausaufgaben (getHomeWork2017 / getHomeWorks)
    if (homeworkResponses && Array.isArray(homeworkResponses)) {
      homeworkResponses.forEach(res => {
        if (!res || !res.result) return;
        const rawList = Array.isArray(res.result) ? res.result : (res.result.homeworks || res.result.records || []);
        rawList.forEach((hw, idx) => {
          const rawDate = hw.dueDate || hw.endDate || hw.date;
          let dueStr = '';
          if (rawDate) {
            const dStr = String(rawDate).replace(/-/g, '').trim();
            if (dStr.length >= 8) dueStr = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
          }
          let subj = 'Hausaufgabe';
          if (hw.subject && subjectsMap[hw.subject]) subj = subjectsMap[hw.subject];
          else if (hw.subjectId && subjectsMap[hw.subjectId]) subj = subjectsMap[hw.subjectId];
          else if (typeof hw.subject === 'string' && hw.subject.trim()) subj = hw.subject.trim();
          else if (hw.lesson && hw.lesson.subject) subj = hw.lesson.subject;

          let teach = 'Fachlehrkraft';
          const tId = hw.teacher || hw.teacherId || (hw.lesson && hw.lesson.teacher);
          if (tId && teachersMap[tId]) teach = teachersMap[tId];
          else if (typeof tId === 'string' && tId.trim()) teach = tId.trim();

          const hwId = String(hw.id || `hw-${idx}-${dueStr}`);
          const isComp = !!(preservedCompletedMap[hwId] || hw.completed === true);

          addUniqueHomework({
            id: hwId,
            subject: subj,
            teacher: teach,
            dueDate: dueStr || 'Ohne Frist',
            text: hw.text || hw.remark || hw.description || 'Hausaufgabe laut WebUntis',
            completed: isComp
          });
        });
      });
    }

    // B. REST Hausaufgaben aus allen Endpunkten auswerten
    const allRestHwLists = [
      restHomeworkRes1,
      restHomeworkRes2,
      restHomeworkRes3,
      restAppDataRes && restAppDataRes.data ? restAppDataRes.data.homeworks : null,
      restAppDataRes && restAppDataRes.data ? restAppDataRes.data.tasks : null
    ];

    allRestHwLists.forEach(restRes => {
      if (!restRes) return;
      const rawList = Array.isArray(restRes) ? restRes : (restRes.data || restRes.homeworks || restRes.records || []);
      if (Array.isArray(rawList)) {
        rawList.forEach((hw, idx) => {
          const rawDate = hw.dueDate || hw.endDate || hw.date || hw.lessonDate;
          let dueStr = '';
          if (rawDate) {
            const dStr = String(rawDate).replace(/-/g, '').trim();
            if (dStr.length >= 8) dueStr = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
          }
          let subj = hw.subject || (hw.lesson && hw.lesson.subject) || 'Hausaufgabe';
          let teach = hw.teacher || (hw.lesson && hw.lesson.teacher) || 'Fachlehrkraft';
          const hwId = String(hw.id || `rest-hw-${idx}-${dueStr}`);
          const isComp = !!(preservedCompletedMap[hwId] || hw.completed === true);
          const hwText = hw.text || hw.remark || hw.description || hw.content || hw.title || hw.note || 'Hausaufgabe laut WebUntis';

          addUniqueHomework({
            id: hwId,
            subject: typeof subj === 'object' ? (subj.name || subj.longName || 'Hausaufgabe') : String(subj),
            teacher: typeof teach === 'object' ? (teach.name || teach.longName || 'Fachlehrkraft') : String(teach),
            dueDate: dueStr || 'Ohne Frist',
            text: hwText,
            description: hwText,
            completed: isComp
          });
        });
      }
    });

    // C. Hausaufgaben aus dem Stundenplan & Klassenbuch hinzufügen
    timetableHomeworks.forEach(addUniqueHomework);

    appData.homework = newHomework;

    // 13. Fehlzeiten parsen & aggregieren
    const newAbsences = [];
    const absenceKeySet = new Set();

    function addUniqueAbsence(absItem) {
      if (!absItem || !absItem.startDate) return;
      const key = `${absItem.startDate}_${absItem.startTime}_${(absItem.reason || '').toLowerCase().trim()}`;
      if (!absenceKeySet.has(key)) {
        absenceKeySet.add(key);
        newAbsences.push(absItem);
      }
    }

    if (absenceResponses && Array.isArray(absenceResponses)) {
      absenceResponses.forEach(res => {
        if (!res || !res.result) return;
        const rawList = Array.isArray(res.result) ? res.result : (res.result.absences || []);
        rawList.forEach((ab, idx) => {
          const sRaw = ab.startDate || ab.date;
          if (!sRaw) return;
          const sStr = String(sRaw).replace(/-/g, '').trim();
          if (sStr.length < 8) return;
          const sIso = `${sStr.slice(0, 4)}-${sStr.slice(4, 6)}-${sStr.slice(6, 8)}`;

          const eRaw = ab.endDate || ab.startDate || ab.date;
          const eStr = String(eRaw).replace(/-/g, '').trim();
          const eIso = (eStr.length >= 8) ? `${eStr.slice(0, 4)}-${eStr.slice(4, 6)}-${eStr.slice(6, 8)}` : sIso;

          const isExc = !!(ab.isExcused || ab.excused || (ab.excuseStatus && String(ab.excuseStatus).toLowerCase() === 'excused'));
          const reason = ab.reason || ab.text || ab.excuse || (isExc ? 'Entschuldigte Fehlzeit' : 'Unentschuldigt / Offen');
          const startT = ab.startTime ? formatUntisTimeToStr(ab.startTime) : '07:45';
          const endT = ab.endTime ? formatUntisTimeToStr(ab.endTime) : '15:10';

          addUniqueAbsence({
            id: String(ab.id || `abs-${idx}-${sIso}`),
            startDate: sIso,
            endDate: eIso,
            startTime: startT,
            endTime: endT,
            reason: reason,
            isExcused: isExc,
            hours: ab.hours || ab.absentHours || 1
          });
        });
      });
    }

    if (restAbsencesRes) {
      const restAbsList = Array.isArray(restAbsencesRes) ? restAbsencesRes : (restAbsencesRes.data || restAbsencesRes.absences || []);
      if (Array.isArray(restAbsList)) {
        restAbsList.forEach((ab, idx) => {
          const sRaw = ab.startDate || ab.date;
          if (!sRaw) return;
          const sStr = String(sRaw).replace(/-/g, '').trim();
          if (sStr.length < 8) return;
          const sIso = `${sStr.slice(0, 4)}-${sStr.slice(4, 6)}-${sStr.slice(6, 8)}`;
          const isExc = !!(ab.isExcused || ab.excused || (ab.excuseStatus && String(ab.excuseStatus).toLowerCase() === 'excused'));
          const reason = ab.reason || ab.text || (isExc ? 'Entschuldigt' : 'Offen');

          addUniqueAbsence({
            id: String(ab.id || `rest-abs-${idx}`),
            startDate: sIso,
            endDate: sIso,
            startTime: ab.startTime ? String(ab.startTime).slice(0, 5) : '07:45',
            endTime: ab.endTime ? String(ab.endTime).slice(0, 5) : '15:10',
            reason: reason,
            isExcused: isExc,
            hours: ab.hours || 1
          });
        });
      }
    }

    // Chronologisch absteigend sortieren (neueste zuerst)
    newAbsences.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    appData.absences = newAbsences;

    // 14. Klassenbuch & Lehrstoff sammeln
    const newClassbook = [];
    const classbookKeySet = new Set();

    function addUniqueClassbook(cbItem) {
      if (!cbItem || !cbItem.topic) return;
      const key = `${cbItem.date}_${cbItem.period}_${(cbItem.subject || '').toLowerCase()}`;
      if (!classbookKeySet.has(key)) {
        classbookKeySet.add(key);
        newClassbook.push(cbItem);
      }
    }

    allTtSource.forEach((item, idx) => {
      const topicText = (item.lstext || item.lessonText || '').trim();
      if (!topicText) return;
      const dStr = String(item.date);
      if (dStr.length !== 8) return;
      const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
      const subj = (item.su && item.su[0]) ? (subjectsMap[item.su[0].id] || item.su[0].name || 'Unterricht') : 'Unterricht';
      const teach = (item.te && item.te[0]) ? (teachersMap[item.te[0].id] || item.te[0].name || 'Fachlehrkraft') : 'Fachlehrkraft';

      addUniqueClassbook({
        id: `cb-${item.id || idx}-${isoDate}`,
        date: isoDate,
        period: item.startTime ? formatUntisTimeToStr(item.startTime) + ' Uhr' : '1. Std.',
        subject: subj,
        teacher: teach,
        topic: topicText,
        text: topicText
      });
    });

    newClassbook.sort((a, b) => new Date(b.date) - new Date(a.date));
    appData.classbook = newClassbook;


    // 15. Hausaufgaben mit Stunden im aktuellen Stundenplan verknüpfen
    if (appData.timetable && appData.timetable.length > 0 && appData.homework.length > 0) {
      appData.timetable.forEach(l => {
        const matchingHw = appData.homework.find(h => {
          if (!h.subject || !l.subject) return false;
          const s1 = h.subject.toLowerCase().trim();
          const s2 = l.subject.toLowerCase().trim();
          return s1.includes(s2) || s2.includes(s1);
        });
        if (matchingHw) {
          l.homework = matchingHw.text;
        }
      });
    }

    lastSyncTimestamp = new Date();
    saveAppData();
    renderTimetable();
    renderExams();
    renderHomework();
    renderAbsences();
    updateSyncDisplay();

    announceSR(`Stundenplan aktualisiert. ${appData.timetable.length} Stunden geladen.`, 'polite');
    return true;
  } catch (err) {
    console.error('Fehler bei WebUntis Synchronisation:', err);
    if (syncStatusText) syncStatusText.textContent = 'Sync fehlgeschlagen';
    return false;
  } finally {
    isSyncInProgress = false;
    if (refreshBtn) refreshBtn.classList.remove('loading');
  }
}

function updateSyncDisplay() {
  const syncStatusText = document.getElementById('sync-status-text');
  const timerBadge = document.getElementById('auto-refresh-timer-badge');
  const settingsTime = document.getElementById('settings-sync-time-display');

  if (!lastSyncTimestamp) return;

  const timeStr = lastSyncTimestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (syncStatusText) syncStatusText.textContent = `Live: ${timeStr} Uhr`;
  if (timerBadge) timerBadge.textContent = `Zuletzt aktualisiert: ${timeStr} Uhr (automatische Aktualisierung alle 5 Min)`;
  if (settingsTime) settingsTime.textContent = `Status: Zuletzt erfolgreich aktualisiert um ${timeStr} Uhr`;
}

function triggerManualSync() {
  announceSR('Synchronisiere Stundenplan mit WebUntis...', 'polite');
  performWebUntisSync().then(ok => {
    if (ok) {
      speak('Stundenplan erfolgreich aktualisiert.');
    }
  });
}

function openOfficialWebUntis() {
  const url = `https://${appData.config.server}/WebUntis/?school=${appData.config.schoolShort}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  announceSR('Offizielles WebUntis des LWL-Berufskollegs Soest wird geöffnet.', 'polite');
}

// =============================================================================
// 7. HILFSFUNKTIONEN & FORMATIERUNG
// =============================================================================
function getEffectiveDayIndex(dayChoice) {
  if (dayChoice === 'today') {
    const jsDay = new Date().getDay();
    return (jsDay >= 1 && jsDay <= 5) ? jsDay : 1;
  }
  if (dayChoice === 'tomorrow') {
    const jsDay = new Date().getDay();
    const nextDay = jsDay + 1;
    return (nextDay >= 1 && nextDay <= 5) ? nextDay : 1;
  }
  const num = parseInt(dayChoice);
  if (!isNaN(num) && num >= 1 && num <= 5) {
    return num;
  }
  return 1;
}

function getDayName(dayIndex) {
  const names = ['', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  return names[dayIndex] || 'Unbekannt';
}

function updateTodayBadge() {
  const now = new Date();
  const options = { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' };
  const str = now.toLocaleDateString('de-DE', options);
  const badge = document.getElementById('today-date-text');
  if (badge) badge.textContent = str;
}

function formatRoomDisplay(roomStr, teacherStr) {
  if (!roomStr || typeof roomStr !== 'string') return 'Raum wird bekanntgegeben';
  let clean = roomStr.trim();
  const lower = clean.toLowerCase();
  if (!clean || lower === 'raum' || lower === 'null' || lower === 'undefined' || lower === 'unterricht' || lower === 'lehrkraft') {
    return 'Raum wird bekanntgegeben';
  }
  if (lower === 'hanauer' || lower === 'raum hanauer') {
    return 'Raum wird bekanntgegeben';
  }
  if (teacherStr && typeof teacherStr === 'string') {
    const tLower = teacherStr.trim().toLowerCase();
    const cleanNoRaum = lower.replace(/^raum\s+/i, '').trim();
    if (tLower && (cleanNoRaum === tLower || tLower.includes(cleanNoRaum) || cleanNoRaum.includes(tLower))) {
      return 'Raum wird bekanntgegeben';
    }
  }
  if (/^[0-9]+[a-zA-Z]?$/.test(clean)) return 'Raum ' + clean;
  clean = clean.replace(/^raum\s+raum\s+/i, 'Raum ');
  return clean;
}

// =============================================================================
// 8. REITER 1: STUNDENPLAN & VERTRETUNGSPLAN
// =============================================================================
function setDayFilter(dayChoice) {
  selectedDay = dayChoice;
  document.querySelectorAll('.day-btn').forEach(btn => {
    const isTarget = btn.getAttribute('data-day') === String(dayChoice);
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
  });
  renderTimetable();
  announceSR(`Ansicht gewechselt auf: ${dayChoice === 'all' ? 'Ganze Schulwoche' : getDayName(getEffectiveDayIndex(dayChoice))}`, 'polite');
}

function renderTimetable() {
  updateCurrentAndNextLesson();

  const container = document.getElementById('timetable-container');
  if (!container) return;

  const dayIndex = getEffectiveDayIndex(selectedDay);
  const isWeekView = selectedDay === 'all';

  let lessons = [];
  if (isWeekView) {
    lessons = [...appData.timetable].sort((a, b) => a.day - b.day || a.period - b.period);
  } else {
    lessons = appData.timetable.filter(l => l.day === dayIndex).sort((a, b) => a.period - b.period);
  }

  const titleEl = document.getElementById('timetable-view-title');
  if (titleEl) {
    if (isWeekView) {
      titleEl.textContent = 'Stundenplan für die gesamte Schulwoche (Montag bis Freitag)';
    } else {
      titleEl.textContent = `Stundenplan für ${getDayName(dayIndex)} (${selectedDay === 'today' ? 'Heute' : selectedDay === 'tomorrow' ? 'Morgen' : 'Wochentag'})`;
    }
  }

  if (lessons.length === 0) {
    container.innerHTML = `
      <div class="status-box" style="padding: 28px; text-align: center;">
        <span class="emoji-icon" style="font-size: 36px;" aria-hidden="true">🎉</span>
        <p style="font-size: var(--font-size-lg); font-weight: bold; margin-top: 10px;">Kein Unterricht eingetragen!</p>
        <p class="field-hint">Für diesen Tag liegen in WebUntis aktuell keine Stunden vor.</p>
      </div>
    `;
    return;
  }

  let html = '<div class="timetable-list" role="list">';
  lessons.forEach(l => {
    const periodData = appData.periods.find(p => p.period === l.period) || { start: '--:--', end: '--:--' };
    let statusClass = 'status-normal';
    let badgeText = 'Regulär';
    let badgeClass = 'badge-normal';
    let srStatus = 'Regulärer Unterricht';

    if (l.status === 'cancelled') {
      statusClass = 'status-cancelled';
      badgeText = 'Entfall';
      badgeClass = 'badge-cancelled';
      srStatus = 'Achtung: Stunde entfällt!';
    } else if (l.status === 'substitute') {
      statusClass = 'status-substitute';
      badgeText = 'Vertretung';
      badgeClass = 'badge-substitute';
      srStatus = 'Hinweis: Vertretungsunterricht.';
    } else if (l.status === 'roomchange') {
      statusClass = 'status-roomchange';
      badgeText = 'Raumwechsel';
      badgeClass = 'badge-roomchange';
      srStatus = 'Hinweis: Geänderter Raum.';
    }

    const dayPrefix = isWeekView ? `<strong>${getDayName(l.day)}:</strong> ` : '';
    const roomDisplay = formatRoomDisplay(l.room, l.teacher);

    html += `
      <article class="lesson-card interactive-lesson ${statusClass}" role="listitem" tabindex="0" onclick="openLessonDetails('${l.id}')" onkeydown="handleLessonKeydown(event, '${l.id}')" title="Klicken oder Enter drücken für Lehrstoff, Hausaufgaben &amp; Details" aria-label="${dayPrefix}${l.period}. Stunde: ${l.subject}, ${roomDisplay}, Lehrkraft ${l.teacher}${l.klasse ? ', Klasse ' + l.klasse : ''}, Zeit: ${periodData.start} bis ${periodData.end} Uhr. Status: ${srStatus}. Klicken für Details, Lehrstoff und Hausaufgaben.">
        <div class="lesson-time-box">
          <div class="lesson-period">${l.period}. Std.</div>
          <div class="lesson-clock">${periodData.start} - ${periodData.end}</div>
          ${isWeekView ? `<div style="font-size: 13px; font-weight: bold; color: var(--accent-info); margin-top: 2px;">${getDayName(l.day)}</div>` : ''}
        </div>
        <div class="lesson-main">
          <div class="lesson-subject-title">${l.subject}</div>
          <div class="lesson-details-row">
            <span>🚪 <strong>Raum:</strong> ${roomDisplay}</span>
            <span>👨‍🏫 <strong>Lehrer:</strong> ${l.teacher}</span>
            ${l.klasse ? `<span>🏫 <strong>Klasse:</strong> ${l.klasse}</span>` : ''}
          </div>
          ${l.lstext ? `<div style="font-size: 13px; color: var(--accent-info); font-weight: 600; margin-top: 4px;">📖 <strong>Lehrstoff:</strong> ${escapeHTML(l.lstext)}</div>` : ''}
          ${l.homework ? `<div style="font-size: 13px; color: var(--accent-warn); font-weight: bold; margin-top: 2px;">📝 <strong>Hausaufgabe:</strong> ${escapeHTML(l.homework)}</div>` : ''}
          ${l.notes && l.notes !== l.lstext ? `<div style="font-size: 13px; font-weight: bold; color: var(--accent-warn); margin-top: 2px;">ℹ️ ${escapeHTML(l.notes)}</div>` : ''}
        </div>
        <div class="lesson-badge-wrap">
          <span class="status-badge ${badgeClass}">${badgeText}</span>
          <span style="font-size: 12px; color: var(--text-muted); font-weight: bold; margin-top: 4px; display: inline-block;">Details ↗</span>
        </div>
      </article>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

function updateCurrentAndNextLesson() {
  const boxNow = document.getElementById('box-now-lesson');
  const boxNext = document.getElementById('box-next-lesson');
  if (!boxNow || !boxNext) return;

  const now = new Date();
  const currentJsDay = now.getDay();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (currentJsDay < 1 || currentJsDay > 5) {
    boxNow.innerHTML = `
      <div class="status-label">Aktuell (Wochenende)</div>
      <div class="status-content-title">Schönes Wochenende!</div>
      <div class="status-meta">Am Montag geht die Schule wieder um 07:45 Uhr los.</div>
    `;
    const mondayFirst = appData.timetable.find(t => t.day === 1 && t.period === 1);
    boxNext.innerHTML = `
      <div class="status-label">Nächste Stunde (Montag 1. Std.)</div>
      <div class="status-content-title">${mondayFirst ? mondayFirst.subject : 'Unterrichtsbeginn'}</div>
      <div class="status-meta">${mondayFirst ? `Raum: ${formatRoomDisplay(mondayFirst.room, mondayFirst.teacher)} bei ${mondayFirst.teacher}` : '07:45 Uhr'}</div>
    `;
    return;
  }

  const todayLessons = appData.timetable.filter(l => l.day === currentJsDay).sort((a, b) => a.period - b.period);
  let currentLesson = null;
  let nextLesson = null;

  for (let i = 0; i < todayLessons.length; i++) {
    const l = todayLessons[i];
    const p = appData.periods.find(per => per.period === l.period);
    if (!p) continue;

    if (currentTime >= p.start && currentTime <= p.end) {
      currentLesson = { ...l, periodData: p };
      nextLesson = todayLessons[i + 1] ? { ...todayLessons[i + 1], periodData: appData.periods.find(per => per.period === todayLessons[i + 1].period) } : null;
      break;
    } else if (currentTime < p.start && !nextLesson) {
      nextLesson = { ...l, periodData: p };
      break;
    }
  }

  if (currentLesson) {
    boxNow.classList.add('active-now');
    boxNow.innerHTML = `
      <div class="status-label">🔴 Aktuell läuft (${currentLesson.periodData.start} - ${currentLesson.periodData.end})</div>
      <div class="status-content-title">${currentLesson.subject}</div>
      <div class="status-meta">🚪 ${formatRoomDisplay(currentLesson.room, currentLesson.teacher)} | 👨‍🏫 ${currentLesson.teacher}${currentLesson.klasse ? ' | 🏫 ' + currentLesson.klasse : ''} ${currentLesson.status === 'cancelled' ? '<strong style="color: var(--accent-danger);">[ENTFALL]</strong>' : ''}</div>
    `;
  } else {
    boxNow.classList.remove('active-now');
    boxNow.innerHTML = `
      <div class="status-label">Aktuell</div>
      <div class="status-content-title">Kein laufender Unterricht</div>
      <div class="status-meta">Aktuell ist Pause oder unterrichtsfreie Zeit.</div>
    `;
  }

  if (nextLesson) {
    boxNext.innerHTML = `
      <div class="status-label">🔜 Nächste Stunde (${nextLesson.period}. Std. ab ${nextLesson.periodData.start} Uhr)</div>
      <div class="status-content-title">${nextLesson.subject}</div>
      <div class="status-meta">🚪 ${formatRoomDisplay(nextLesson.room, nextLesson.teacher)} | 👨‍🏫 ${nextLesson.teacher}${nextLesson.klasse ? ' | 🏫 ' + nextLesson.klasse : ''}</div>
    `;
  } else {
    boxNext.innerHTML = `
      <div class="status-label">Schultag beendet</div>
      <div class="status-content-title">Schulschluss!</div>
      <div class="status-meta">Für heute sind alle Stunden absolviert.</div>
    `;
  }
}

function readTodayTimetable() {
  const dayIndex = getEffectiveDayIndex(selectedDay);
  const dayName = getDayName(dayIndex);
  const lessons = appData.timetable.filter(l => l.day === dayIndex).sort((a, b) => a.period - b.period);

  if (lessons.length === 0) {
    speak(`Für ${dayName} ist kein Unterricht eingetragen.`);
    return;
  }

  let text = `Stundenplan für ${dayName}. Du hast ${lessons.length} Stunden. `;
  lessons.forEach(l => {
    const p = appData.periods.find(per => per.period === l.period);
    const timeStr = p ? `von ${p.start} bis ${p.end} Uhr` : '';
    let statusText = '';
    if (l.status === 'cancelled') statusText = 'Diese Stunde entfällt!';
    else if (l.status === 'substitute') statusText = `Vertretungsunterricht: ${l.notes || ''}`;
    else if (l.status === 'roomchange') statusText = `Raumwechsel: ${l.notes || ''}`;

    const rDisp = formatRoomDisplay(l.room, l.teacher);
    text += `${l.period}. Stunde ${timeStr}: ${l.subject} in ${rDisp}, Lehrkraft ${l.teacher}${l.klasse ? ', Klasse ' + l.klasse : ''}. ${statusText}. `;
  });

  speak(text, true);
}

// =============================================================================
// 9. REITER 2: PRÜFUNGEN, KLAUSUREN & TERMINE (GANZES SCHULJAHR)
// =============================================================================
function setExamFilter(filterType) {
  appData.examFilter = filterType || 'all';

  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.classList.toggle('active', btn.id === `filter-${appData.examFilter}`);
  });

  renderExams();

  const labels = {
    all: 'Alle Termine und Prüfungen des Schuljahres',
    exams: 'Nur Prüfungen und Klausuren',
    holidays: 'Nur Ferien und Feiertage',
    upcoming: 'Nur anstehende Termine'
  };
  announceSR(`Filter aktiviert: ${labels[appData.examFilter] || appData.examFilter}`, 'polite');
}

function renderExams() {
  const container = document.getElementById('exams-list-container');
  if (!container) return;

  const schoolYearName = appData.schoolYear ? appData.schoolYear.name : '2026/2027';
  const syBadge = document.getElementById('exams-schoolyear-badge');
  if (syBadge) syBadge.textContent = `Schuljahr ${schoolYearName}`;

  const subtitle = document.getElementById('exams-schoolyear-subtitle');
  if (subtitle) subtitle.textContent = `Vollständige Jahresübersicht aller Klausuren, Arbeiten und Ferientermine für das Schuljahr ${schoolYearName} am LWL-Berufskolleg Soest.`;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // 1. Alle Termine & Klausuren zusammenführen
  const allEvents = [];

  // A. Prüfungen
  if (appData.exams && Array.isArray(appData.exams)) {
    appData.exams.forEach(ex => {
      const dParts = ex.date.split('-');
      const dObj = new Date(parseInt(dParts[0]), parseInt(dParts[1]) - 1, parseInt(dParts[2]));
      let endObj = dObj;
      let timeDisplay = `${ex.startTime} - ${ex.endTime} Uhr`;
      if (ex.endDate && ex.endDate !== ex.date) {
        const eParts = ex.endDate.split('-');
        endObj = new Date(parseInt(eParts[0]), parseInt(eParts[1]) - 1, parseInt(eParts[2]));
        timeDisplay = `Klausurzeitraum: Vom ${formatGermanDate(dObj)} bis ${formatGermanDate(endObj)}`;
      }
      allEvents.push({
        id: ex.id,
        type: 'exam',
        title: ex.subject,
        subTitle: ex.topic || 'Klausur laut WebUntis',
        dateStr: ex.date,
        endDateStr: ex.endDate || ex.date,
        dateObj: dObj,
        endDateObj: endObj,
        timeStr: timeDisplay,
        room: ex.room || 'Raum laut Plan',
        teacher: ex.teacher || 'Fachlehrkraft',
        isHoliday: false
      });
    });
  }

  // B. Schulferien & Termine
  if (appData.holidays && Array.isArray(appData.holidays)) {
    appData.holidays.forEach(h => {
      const sParts = h.startDate.split('-');
      const eParts = h.endDate.split('-');
      const sObj = new Date(parseInt(sParts[0]), parseInt(sParts[1]) - 1, parseInt(sParts[2]));
      const eObj = new Date(parseInt(eParts[0]), parseInt(eParts[1]) - 1, parseInt(eParts[2]));
      allEvents.push({
        id: h.id,
        type: h.type || 'holiday',
        title: h.name,
        subTitle: h.longName || h.name,
        dateStr: h.startDate,
        endDateStr: h.endDate,
        dateObj: sObj,
        endDateObj: eObj,
        timeStr: (h.startDate === h.endDate) ? 'Ganztägig (Schulfrei)' : `Vom ${formatGermanDate(sObj)} bis ${formatGermanDate(eObj)}`,
        room: 'Schulfrei',
        teacher: 'LWL-Berufskolleg Soest',
        isHoliday: true
      });
    });
  }

  // Zähler für Filter-Buttons aktualisieren
  const totalAll = allEvents.length;
  const totalExams = allEvents.filter(e => e.type === 'exam').length;
  const totalHolidays = allEvents.filter(e => e.type === 'holiday' || e.type === 'appointment').length;
  const totalUpcoming = allEvents.filter(e => e.endDateObj >= todayStart).length;

  const countAllEl = document.getElementById('count-all');
  if (countAllEl) countAllEl.textContent = totalAll;
  const countExamsEl = document.getElementById('count-exams');
  if (countExamsEl) countExamsEl.textContent = totalExams;
  const countHolidaysEl = document.getElementById('count-holidays');
  if (countHolidaysEl) countHolidaysEl.textContent = totalHolidays;
  const countUpcomingEl = document.getElementById('count-upcoming');
  if (countUpcomingEl) countUpcomingEl.textContent = totalUpcoming;

  // 2. Filter anwenden
  const filter = appData.examFilter || 'all';
  let filtered = allEvents;
  if (filter === 'exams') {
    filtered = allEvents.filter(e => e.type === 'exam');
  } else if (filter === 'holidays') {
    filtered = allEvents.filter(e => e.type === 'holiday' || e.type === 'appointment');
  } else if (filter === 'upcoming') {
    filtered = allEvents.filter(e => e.endDateObj >= todayStart);
  }

  if (filtered.length === 0) {
    if (filter === 'exams') {
      container.innerHTML = `
        <div class="status-box" style="padding: 32px; text-align: center;">
          <span class="emoji-icon" style="font-size: 40px;" aria-hidden="true">📝</span>
          <p style="font-size: var(--font-size-lg); font-weight: bold; margin-top: 12px;">Keine Prüfungen in WebUntis eingetragen</p>
          <p class="field-hint" style="max-width: 520px; margin: 8px auto 0;">In deinem WebUntis-Konto am LWL-Berufskolleg Soest sind aktuell keine Klausuren oder Prüfungen hinterlegt. Sobald deine Lehrkräfte oder das Schulbüro Arbeiten ansetzen, werden diese hier automatisch synchronisiert.</p>
          <button type="button" class="btn btn-secondary" style="margin-top: 16px;" onclick="setExamFilter('all')">
            Alle Termine & Ferien anzeigen
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="status-box" style="padding: 32px; text-align: center;">
        <span class="emoji-icon" style="font-size: 40px;" aria-hidden="true">📅</span>
        <p style="font-size: var(--font-size-lg); font-weight: bold; margin-top: 12px;">Keine Einträge für diesen Filter</p>
        <p class="field-hint">Für den gewählten Filter liegen im Schuljahr ${schoolYearName} derzeit keine Termine vor.</p>
        <button type="button" class="btn btn-secondary" style="margin-top: 16px;" onclick="setExamFilter('all')">
          Alle Termine des Schuljahres anzeigen
        </button>
      </div>
    `;
    return;
  }

  // 3. Chronologisch sortieren
  filtered.sort((a, b) => a.dateObj - b.dateObj);

  // 4. Nach Monat gruppieren
  const monthGroups = {};
  filtered.forEach(item => {
    const mKey = `${item.dateObj.getFullYear()}-${String(item.dateObj.getMonth() + 1).padStart(2, '0')}`;
    if (!monthGroups[mKey]) {
      const monthName = item.dateObj.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
      monthGroups[mKey] = {
        name: monthName,
        items: []
      };
    }
    monthGroups[mKey].items.push(item);
  });

  let html = '';
  for (const mKey in monthGroups) {
    const group = monthGroups[mKey];
    const groupId = `month-${mKey}`;
    html += `
      <section class="month-section" aria-labelledby="${groupId}">
        <h3 id="${groupId}" class="month-heading">
          <span>📅 ${group.name}</span>
          <span style="font-size: 14px; opacity: 0.85;">${group.items.length} ${group.items.length === 1 ? 'Eintrag' : 'Einträge'}</span>
        </h3>
        <div role="list">
    `;

    group.items.forEach(ev => {
      const isPast = ev.endDateObj < todayStart;
      const isToday = todayStart >= ev.dateObj && todayStart <= ev.endDateObj;
      const daysDiff = Math.ceil((ev.dateObj.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

      let countdownText = '';
      let countdownClass = '';

      if (isPast) {
        countdownText = 'Bereits vergangen';
        countdownClass = 'countdown-past';
      } else if (isToday) {
        countdownText = '🔴 HEUTE!';
        countdownClass = 'countdown-urgent';
      } else if (daysDiff === 1) {
        countdownText = 'Morgen!';
        countdownClass = 'countdown-urgent';
      } else if (daysDiff <= 7) {
        countdownText = `Noch ${daysDiff} Tage`;
        countdownClass = 'countdown-soon';
      } else if (daysDiff <= 30) {
        const weeks = Math.floor(daysDiff / 7);
        countdownText = `In ca. ${weeks} ${weeks === 1 ? 'Woche' : 'Wochen'}`;
        countdownClass = 'countdown-normal';
      } else {
        countdownText = `In ${daysDiff} Tagen`;
        countdownClass = 'countdown-normal';
      }

      let typeBadge = '';
      let itemClass = '';
      if (ev.type === 'exam') {
        typeBadge = '<span class="event-type-badge type-exam">📝 Prüfung / Klausur</span>';
        itemClass = 'exam-item';
      } else if (ev.type === 'holiday') {
        typeBadge = '<span class="event-type-badge type-holiday">🏖️ Schulferien / Frei</span>';
        itemClass = 'holiday-item';
      } else {
        typeBadge = '<span class="event-type-badge type-appointment">📌 Schultermin</span>';
        itemClass = 'appointment-item';
      }

      if (isPast) itemClass += ' past-event';

      const dateLabel = (ev.endDateStr && ev.dateStr !== ev.endDateStr)
        ? `${formatGermanDate(ev.dateObj)} bis ${formatGermanDate(ev.endDateObj)}`
        : ev.dateObj.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

      const ariaLabelText = `${ev.type === 'exam' ? 'Prüfung' : 'Termin'}: ${ev.title}. Datum: ${dateLabel}. Zeit: ${ev.timeStr}. ${ev.type === 'exam' ? 'Raum: ' + ev.room + ', Lehrkraft: ' + ev.teacher : ''}. Status: ${countdownText}.`;

      html += `
        <article class="event-card ${itemClass}" role="listitem" tabindex="0" aria-label="${ariaLabelText}">
          <div class="event-info">
            <div class="event-header-row">
              ${typeBadge}
              <span class="exam-badge">WebUntis</span>
            </div>
            <h4 class="event-title">${ev.title}</h4>
            <div class="event-meta-row">
              <span class="event-meta-item">📅 <strong>${dateLabel}</strong></span>
              <span class="event-meta-item">⏰ <strong>${ev.timeStr}</strong></span>
              ${ev.type === 'exam' ? `<span class="event-meta-item">🚪 <strong>${ev.room}</strong></span>` : ''}
              ${ev.type === 'exam' ? `<span class="event-meta-item">👨‍🏫 <strong>${ev.teacher}</strong></span>` : ''}
            </div>
            ${ev.subTitle && ev.subTitle !== ev.title ? `<div style="margin-top: 6px; font-size: 14px; color: var(--text-muted);">📋 ${ev.subTitle}</div>` : ''}
          </div>
          <div class="event-side-box">
            <span class="countdown-pill ${countdownClass}" aria-hidden="true">${countdownText}</span>
          </div>
        </article>
      `;
    });

    html += `
        </div>
      </section>
    `;
  }

  container.innerHTML = html;
}

function formatGermanDate(d) {
  if (!d) return '';
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function readAllExamsAndEvents() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const upcomingExams = (appData.exams || []).filter(e => {
    const parts = e.date.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d >= todayStart;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const upcomingHolidays = (appData.holidays || []).filter(h => {
    const parts = h.endDate.split('-');
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d >= todayStart;
  }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  const syName = appData.schoolYear ? appData.schoolYear.name : '2026/2027';

  let text = `Jahresübersicht für das Schuljahr ${syName} am LWL-Berufskolleg Soest. `;
  text += `Du hast insgesamt ${upcomingExams.length} anstehende Prüfungen und ${upcomingHolidays.length} anstehende Ferien- und Feiertage. `;

  if (upcomingExams.length > 0) {
    text += `Die nächste Prüfung ist ${upcomingExams[0].subject} am ${formatGermanDate(new Date(upcomingExams[0].date))} in ${upcomingExams[0].room}. `;
  } else {
    text += 'Es sind derzeit keine anstehenden Prüfungen eingetragen. ';
  }

  if (upcomingHolidays.length > 0) {
    text += `Der nächste schulfreie Zeitraum ist ${upcomingHolidays[0].name} ab dem ${formatGermanDate(new Date(upcomingHolidays[0].startDate))}. `;
  }

  speak(text, true);
}

// =============================================================================
// 9b. STUNDEN-DETAILS MODAL
// =============================================================================
function openLessonDetails(lessonId) {
  const lesson = (appData.timetable || []).find(l => String(l.id) === String(lessonId));
  if (!lesson) return;

  const modal = document.getElementById('modal-lesson-details');
  if (!modal) return;

  const fmtTime = t => {
    if (!t) return '–';
    const s = String(t).padStart(4, '0');
    return s.slice(0, 2) + ':' + s.slice(2);
  };

  const hwText = lesson.homework
    ? (Array.isArray(lesson.homework)
        ? lesson.homework.map(h => `${escHtml(h.subject || '')}: ${escHtml(h.description || '')}`).join('<br>')
        : escHtml(String(lesson.homework)))
    : 'Keine Hausaufgaben eingetragen.';

  const lstextText = lesson.lstext
    ? escHtml(lesson.lstext)
    : 'Kein Lehrstoff eingetragen.';

  // Titel setzen
  const titleEl = modal.querySelector('.modal-title');
  if (titleEl) titleEl.textContent = lesson.subject || 'Stunde';

  // Modal-Body dynamisch befüllen
  const body = document.getElementById('modal-lesson-body');
  if (body) {
    body.innerHTML = `
      <dl class="modal-detail-list">
        <div class="modal-detail-row">
          <dt class="modal-detail-label">📘 Fach</dt>
          <dd class="modal-detail-content" data-key="subject">${escHtml(lesson.subject || '–')}</dd>
        </div>
        <div class="modal-detail-row">
          <dt class="modal-detail-label">📅 Datum</dt>
          <dd class="modal-detail-content" data-key="date">${escHtml(lesson.dateStr || '–')}</dd>
        </div>
        <div class="modal-detail-row">
          <dt class="modal-detail-label">⏰ Zeit</dt>
          <dd class="modal-detail-content" data-key="time">${fmtTime(lesson.startTime)} – ${fmtTime(lesson.endTime)}</dd>
        </div>
        <div class="modal-detail-row">
          <dt class="modal-detail-label">🏫 Raum</dt>
          <dd class="modal-detail-content" data-key="room">${escHtml(lesson.room || '–')}</dd>
        </div>
        <div class="modal-detail-row">
          <dt class="modal-detail-label">👤 Lehrer</dt>
          <dd class="modal-detail-content" data-key="teacher">${escHtml(lesson.teacher || '–')}</dd>
        </div>
        <div class="modal-detail-row">
          <dt class="modal-detail-label">📝 Lehrstoff</dt>
          <dd class="modal-detail-content" data-key="lstext">${lstextText}</dd>
        </div>
        <div class="modal-detail-row">
          <dt class="modal-detail-label">📚 Hausaufgaben</dt>
          <dd class="modal-detail-content" data-key="homework">${hwText}</dd>
        </div>
      </dl>`;
  }

  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');

  // Fokus auf Schließen-Button setzen
  const closeBtn = modal.querySelector('.modal-close-btn');
  if (closeBtn) closeBtn.focus();
  else modal.setAttribute('tabindex', '-1'), modal.focus();
}

function closeLessonDetails() {
  const modal = document.getElementById('modal-lesson-details');
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
}

function handleLessonKeydown(event, lessonId) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    openLessonDetails(lessonId);
  }
}

function handleModalBackdropClick(event) {
  const modal = document.getElementById('modal-lesson-details');
  if (!modal) return;
  if (event.target === modal) {
    closeLessonDetails();
  }
}

function speakCurrentLessonDetails() {
  const modal = document.getElementById('modal-lesson-details');
  if (!modal || modal.style.display === 'none') return;

  const getVal = key => {
    const el = modal.querySelector(`[data-key="${key}"]`);
    return el ? el.textContent.trim() : '';
  };

  const subject  = getVal('subject');
  const date     = getVal('date');
  const time     = getVal('time');
  const room     = getVal('room');
  const teacher  = getVal('teacher');
  const lstext   = getVal('lstext');
  const homework = getVal('homework');

  let text = `Stunden-Details: ${subject}. `;
  if (date)     text += `Datum: ${date}. `;
  if (time)     text += `Zeit: ${time}. `;
  if (room)     text += `Raum: ${room}. `;
  if (teacher)  text += `Lehrer: ${teacher}. `;
  if (lstext)   text += `Lehrstoff: ${lstext}. `;
  if (homework) text += `Hausaufgaben: ${homework}. `;

  speak(text, true);
}

// =============================================================================
// 9c. HAUSAUFGABEN RENDERN
// =============================================================================
function renderHomework() {
  const container = document.getElementById('homework-list-container');
  if (!container) return;

  const filter = appData.homeworkFilter || 'all';
  let items = appData.homework || [];
  const today = new Date(); today.setHours(0,0,0,0);

  if (filter === 'pending') {
    items = items.filter(h => !h.completed);
  } else if (filter === 'completed') {
    items = items.filter(h => h.completed);
  } else if (filter === 'overdue') {
    items = items.filter(h => {
      if (h.completed) return false;
      if (!h.dueDate) return false;
      return new Date(h.dueDate) < today;
    });
  }
  // 'all' und 'classbook' → alles (classbook zeigt Klassenbuch separat)

  // Klassenbuch-Einträge
  const classbook = appData.classbook || [];

  // Zählbadges aktualisieren
  const allHw = appData.homework || [];
  const pendingCount   = allHw.filter(h => !h.completed).length;
  const completedCount = allHw.filter(h => h.completed).length;
  const classbookCount = classbook.length;
  const countAllEl  = document.getElementById('hw-count-all');
  const countPendEl = document.getElementById('hw-count-pending');
  const countCompEl = document.getElementById('hw-count-completed');
  const countCbEl   = document.getElementById('hw-count-classbook');
  if (countAllEl)  countAllEl.textContent  = String(allHw.length);
  if (countPendEl) countPendEl.textContent = String(pendingCount);
  if (countCompEl) countCompEl.textContent = String(completedCount);
  if (countCbEl)   countCbEl.textContent   = String(classbookCount);

  // Filter-Button aktiv-Zustand über Button-IDs setzen
  const filterMap = {
    'pending':   'hw-filter-pending',
    'all':       'hw-filter-all',
    'completed': 'hw-filter-completed',
    'classbook': 'hw-filter-classbook'
  };
  Object.entries(filterMap).forEach(([f, id]) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.classList.toggle('active', f === filter);
      btn.setAttribute('aria-pressed', String(f === filter));
    }
  });

  if (items.length === 0 && classbook.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status" aria-live="polite">
        <span aria-hidden="true">📚</span>
        <p>Keine Hausaufgaben vorhanden.</p>
        <p class="empty-hint">Hausaufgaben werden automatisch aus WebUntis geladen.</p>
      </div>`;
    return;
  }

  let html = '';

  // Hausaufgaben
  if (items.length > 0) {
    html += `<h3 class="section-subheading">Hausaufgaben (${items.length})</h3>`;
    items.forEach(hw => {
      const rawDue = hw.dueDate;
      const hasDate = rawDue && rawDue !== 'Ohne Frist' && !isNaN(new Date(rawDue));
      const dueStr = hasDate ? formatGermanDate(new Date(rawDue)) : (rawDue || 'Kein Datum');
      const rawDate = hw.date;
      const hasAssigned = rawDate && !isNaN(new Date(rawDate));
      const assignedStr = hasAssigned ? formatGermanDate(new Date(rawDate)) : '';
      const isOverdue = !hw.completed && hasDate && new Date(rawDue) < today;
      const checkId = `hw-check-${hw.id}`;
      // hw.text ist das Feld aus dem Parser (nicht hw.description!)
      const displayText = hw.text || hw.description || hw.remark || 'Hausaufgabe laut WebUntis';
      html += `
        <article class="homework-card${hw.completed ? ' completed' : ''}${isOverdue ? ' overdue' : ''}"
                 role="article" aria-label="Hausaufgabe: ${escHtml(hw.subject || 'Unbekannt')}">
          <div class="homework-header">
            <span class="homework-date-badge${isOverdue ? ' overdue' : ''}" aria-label="Fällig am ${dueStr}">
              📅 ${dueStr}${isOverdue ? ' – Überfällig!' : ''}
            </span>
            <span class="homework-subject">${escHtml(hw.subject || 'Allgemein')}</span>
            ${hw.teacher ? `<span class="homework-assigned">👤 ${escHtml(hw.teacher)}</span>` : ''}
            ${assignedStr ? `<span class="homework-assigned">Aufgegeben: ${assignedStr}</span>` : ''}
          </div>
          <p class="homework-desc">${escHtml(displayText)}</p>
          ${hw.details ? `<p class="homework-details">${escHtml(hw.details)}</p>` : ''}
          <label class="homework-toggle-label" for="${checkId}">
            <input type="checkbox" id="${checkId}" class="homework-checkbox"
                   ${hw.completed ? 'checked' : ''}
                   aria-label="Als erledigt markieren: ${escHtml(hw.subject || '')}"
                   onchange="toggleHomeworkCompleted('${hw.id}')">
            ${hw.completed ? 'Erledigt ✓' : 'Als erledigt markieren'}
          </label>
        </article>`;

    });
  }

  // Klassenbuch (Lehrstoff der Stunden)
  if (classbook.length > 0 && (filter === 'all' || filter === 'classbook')) {
    html += `<h3 class="section-subheading" style="margin-top:1.5rem;">Klassenbuch / Lehrstoff (${classbook.length})</h3>`;
    classbook.slice(0, 50).forEach(entry => {
      let dObj = null;
      if (entry.date) {
        const dRaw = String(entry.date).replace(/-/g, '');
        if (dRaw.length === 8) {
          dObj = new Date(parseInt(dRaw.slice(0,4)), parseInt(dRaw.slice(4,6)) - 1, parseInt(dRaw.slice(6,8)));
        } else {
          dObj = new Date(entry.date);
        }
      }
      const dateStr = (dObj && !isNaN(dObj)) ? formatGermanDate(dObj) : (entry.date || '');
      const displayText = entry.topic || entry.text || 'Kein Lehrstoff eingetragen';
      html += `
        <article class="homework-card classbook-entry" role="article" aria-label="Lehrstoff: ${escHtml(entry.subject || 'Unbekannt')}">
          <div class="homework-header">
            ${dateStr ? `<span class="homework-date-badge">📅 ${dateStr}</span>` : ''}
            <span class="homework-subject">${escHtml(entry.subject || 'Allgemein')}</span>
            ${entry.period ? `<span class="homework-assigned">${escHtml(entry.period)}</span>` : ''}
            ${entry.teacher ? `<span class="homework-assigned">👤 ${escHtml(entry.teacher)}</span>` : ''}
          </div>
          <p class="homework-desc">${escHtml(displayText)}</p>
        </article>`;
    });
  }

  container.innerHTML = html;
}

function setHomeworkFilter(filterType) {
  appData.homeworkFilter = filterType;
  saveAppData();
  renderHomework();
}

function toggleHomeworkCompleted(hwId) {
  const hw = (appData.homework || []).find(h => String(h.id) === String(hwId));
  if (!hw) return;
  hw.completed = !hw.completed;
  saveAppData();
  renderHomework();
  speak(hw.completed ? 'Als erledigt markiert.' : 'Als nicht erledigt markiert.', false);
}

function readHomeworkSummary() {
  const all    = appData.homework || [];
  const pending = all.filter(h => !h.completed);
  const today   = new Date(); today.setHours(0,0,0,0);
  const overdue = pending.filter(h => h.dueDate && new Date(h.dueDate) < today);

  let text = `Hausaufgaben-Übersicht: Du hast insgesamt ${all.length} Hausaufgabe${all.length !== 1 ? 'n' : ''}`;
  text += `, davon ${pending.length} ausstehend`;
  if (overdue.length > 0) text += ` und ${overdue.length} überfällig`;
  text += '. ';

  if (pending.length > 0) {
    const next = pending.sort((a, b) => new Date(a.dueDate || 0) - new Date(b.dueDate || 0))[0];
    if (next) {
      const dueStr = next.dueDate ? formatGermanDate(new Date(next.dueDate)) : 'ohne Datum';
      text += `Die nächste Hausaufgabe ist ${next.subject || 'Unbekannt'}: ${next.description || ''}, fällig am ${dueStr}. `;
    }
  }

  const cbCount = (appData.classbook || []).length;
  if (cbCount > 0) text += `Es gibt außerdem ${cbCount} Klassenbuch-Einträge.`;

  speak(text, true);
}

// =============================================================================
// 9d. FEHLZEITEN RENDERN
// =============================================================================
function renderAbsences() {
  const container = document.getElementById('absences-list-container');
  if (!container) return;

  const absences = appData.absences || [];

  // Statistik-Karten aktualisieren (IDs aus index.html)
  const totalEl    = document.getElementById('stat-absence-days');
  const hoursEl    = document.getElementById('stat-absence-hours');
  const excusedEl  = document.getElementById('stat-absence-excused');
  const openEl     = document.getElementById('stat-absence-unexcused');

  const total    = absences.length;
  const excused  = absences.filter(a => a.isExcused).length;
  const open     = total - excused;
  const minutes  = absences.reduce((sum, a) => {
    if (a.startTime && a.endTime) {
      const [sh, sm] = String(a.startTime).padStart(4,'0').match(/../g).map(Number);
      const [eh, em] = String(a.endTime).padStart(4,'0').match(/../g).map(Number);
      return sum + ((eh * 60 + em) - (sh * 60 + sm));
    }
    return sum + 45; // Annahme: 1 Stunde = 45 min
  }, 0);
  const hours = Math.round(minutes / 45); // Fehlstunden (à 45 min)

  if (totalEl)    totalEl.textContent    = String(total);
  if (hoursEl)    hoursEl.textContent    = String(hours);

  if (excusedEl)  excusedEl.textContent  = String(excused);
  if (openEl)     openEl.textContent     = String(open);


  if (absences.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status" aria-live="polite">
        <span aria-hidden="true">✅</span>
        <p>Keine Fehlzeiten vorhanden.</p>
        <p class="empty-hint">Fehlzeiten werden automatisch aus WebUntis geladen.</p>
      </div>`;
    return;
  }

  const fmtTime = t => {
    if (!t) return '–';
    const s = String(t).padStart(4,'0');
    return s.slice(0,2) + ':' + s.slice(2);
  };

  let html = '';
  absences.forEach(abs => {
    const dateStr = abs.date
      ? formatGermanDate(new Date(
          String(abs.date).slice(0,4) + '-' +
          String(abs.date).slice(4,6) + '-' +
          String(abs.date).slice(6,8)))
      : (abs.startDate ? formatGermanDate(new Date(abs.startDate)) : '–');

    const timeStr = (abs.startTime || abs.endTime)
      ? `${fmtTime(abs.startTime)} – ${fmtTime(abs.endTime)}`
      : 'Ganztägig';

    const statusLabel = abs.isExcused ? '✅ Entschuldigt' : '⚠️ Unentschuldigt';
    const statusClass = abs.isExcused ? 'excused' : 'unexcused';

    html += `
      <article class="absence-item ${statusClass}" role="article"
               aria-label="Fehlzeit am ${dateStr}, ${statusLabel}">
        <div class="absence-header">
          <span class="absence-date">📅 ${dateStr}</span>
          <span class="absence-time">⏰ ${timeStr}</span>
          <span class="absence-status ${statusClass}">${statusLabel}</span>
        </div>
        ${abs.subject ? `<span class="absence-subject">📘 ${escHtml(abs.subject)}</span>` : ''}
        ${abs.reason  ? `<span class="absence-reason">Grund: ${escHtml(abs.reason)}</span>`  : ''}
      </article>`;
  });

  container.innerHTML = html;
}

function readAbsencesSummary() {
  const absences = appData.absences || [];
  const total   = absences.length;
  const excused = absences.filter(a => a.isExcused).length;
  const open    = total - excused;

  let text = `Fehlzeiten-Übersicht: Du hast insgesamt ${total} Fehlzeit${total !== 1 ? 'en' : ''}`;
  if (total > 0) {
    text += `, davon ${excused} entschuldigt und ${open} unentschuldigt`;
  }
  text += '. ';

  if (open > 0) {
    text += `Du hast noch ${open} unentschuldigte Fehlzeit${open !== 1 ? 'en' : ''}. `;
  } else if (total > 0) {
    text += 'Alle Fehlzeiten sind entschuldigt. ';
  }

  speak(text, true);
}


// =============================================================================
// 10. INITIALISIERUNG & TASTEN-STEUERUNG
// =============================================================================
function initApp() {
  loadAppData();
  updateTodayBadge();

  // 1. Alt+F4 Sofort-Beenden Erkennung (Capture-Phase, gilt überall)
  window.addEventListener('keydown', e => {
    if (e.altKey && (e.key === 'F4' || e.code === 'F4' || e.keyCode === 115)) {
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/shutdown');
        } else {
          fetch('/api/shutdown', { method: 'POST', keepalive: true }).catch(() => {});
        }
      } catch (_) {}
    }
  }, true);

  // 2. Fenster schließen Signal (Alt+F4, Schließen-Kreuz, Tab-Schließen)
  function sendWindowClosingSignal() {
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/window_closing');
      } else {
        fetch('/api/window_closing', { method: 'POST', keepalive: true }).catch(() => {});
      }
    } catch (_) {}
  }
  window.addEventListener('pagehide', sendWindowClosingSignal);
  window.addEventListener('beforeunload', sendWindowClosingSignal);

  // 3. Kontinuierlicher Heartbeat alle 2.5 Sekunden mit Sichtbarkeitsstatus
  function sendHeartbeat() {
    const vis = document.visibilityState || 'visible';
    fetch('/api/ping?v=' + encodeURIComponent(vis)).catch(() => {});
  }
  setInterval(sendHeartbeat, 2500);
  document.addEventListener('visibilitychange', sendHeartbeat);
  sendHeartbeat();

  // Tastaturnavigation
  window.addEventListener('keydown', e => {
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;

    if (e.key === '1') {
      e.preventDefault();
      switchTab('overview');
    } else if (e.key === '2') {
      e.preventDefault();
      switchTab('exams');
    } else if (e.key === '3') {
      e.preventDefault();
      switchTab('homework');
    } else if (e.key === '4') {
      e.preventDefault();
      switchTab('absences');
    } else if (e.key === '5') {
      e.preventDefault();
      switchTab('settings');
    } else if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      setDayFilter('today');
    } else if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      // Vorlesen kontextabhängig je nach aktivem Tab und Modal
      const modal = document.getElementById('modal-lesson-details');
      if (modal && modal.style.display !== 'none') {
        speakCurrentLessonDetails();
      } else if (currentTab === 'overview') {
        readTodayTimetable();
      } else if (currentTab === 'exams') {
        readAllExamsAndEvents();
      } else if (currentTab === 'homework') {
        readHomeworkSummary();
      } else if (currentTab === 'absences') {
        readAbsencesSummary();
      }
    } else if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      triggerManualSync();
    } else if (e.key === 'Escape') {
      closeLessonDetails();
    }
  });


  // Automatische Anmeldung & Synchronisation beim Start
  if (appData.config.username && appData.config.password) {
    hideLoginView();
    renderTimetable();
    renderExams();
    renderHomework();
    renderAbsences();
    performWebUntisSync();
  } else {
    showLoginView();
  }

  // Automatischer Hintergrund-Refresh alle 5 Minuten
  if (autoSyncIntervalTimer) clearInterval(autoSyncIntervalTimer);
  autoSyncIntervalTimer = setInterval(() => {
    if (appData.config.username && appData.config.password) {
      performWebUntisSync();
    }
  }, 5 * 60 * 1000);

  // Wenn der Benutzer zum Fenster zurückkehrt (Fokus), prüfen ob Refresh nötig
  window.addEventListener('focus', () => {
    if (lastSyncTimestamp && (Date.now() - lastSyncTimestamp.getTime() > 3 * 60 * 1000)) {
      if (appData.config.username && appData.config.password) {
        performWebUntisSync();
      }
    }
  });

  // Version von lokalem Server abfragen
  fetchInstalledVersion();

  // Feedback-Archiv initial laden
  loadFeedbackArchive();
}

async function fetchInstalledVersion() {
  try {
    const res = await fetch('/api/version');
    const data = await res.json();
    const verEl = document.getElementById('app-version-display');
    if (verEl && data.version) {
      verEl.textContent = `v${data.version}`;
    }
  } catch (e) { }
}

async function checkSoftwareUpdate() {
  const btn = document.getElementById('btn-check-update');
  const box = document.getElementById('update-result-box');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span class="emoji-icon">⏳</span> <strong>Prüfe auf GitHub...</strong>';
  }
  announceSR('Prüfe auf GitHub nach neuen Updates...', 'polite');

  try {
    const res = await fetch('/api/update/check');
    const data = await res.json();
    if (box) {
      box.style.display = 'block';
      if (data.updated) {
        box.innerHTML = `
          <div style="background: rgba(21, 128, 61, 0.15); border: 2px solid var(--accent-ok); border-radius: 8px; padding: 14px;">
            <strong style="color: var(--accent-ok);">🎉 Neues Update erfolgreich heruntergeladen!</strong>
            <p style="margin-top: 6px; font-size: 14px;">Version ${data.currentVersion} wurde installiert. Die Seite wird jetzt neu geladen...</p>
          </div>
        `;
        announceSR(`Ein neues Update auf Version ${data.currentVersion} wurde installiert. Seite lädt neu.`, 'assertive');
        setTimeout(() => { window.location.reload(); }, 2000);
      } else {
        box.innerHTML = `
          <div style="background: rgba(2, 132, 199, 0.1); border: 2px solid var(--accent-info); border-radius: 8px; padding: 14px;">
            <strong style="color: var(--accent-info);">✅ Alles auf dem neuesten Stand!</strong>
            <p style="margin-top: 6px; font-size: 14px;">Du nutzt bereits die aktuellste Version ${data.currentVersion}.</p>
          </div>
        `;
        announceSR(`Du nutzt bereits die aktuellste Version ${data.currentVersion}. Keine Updates verfügbar.`, 'polite');
      }
    }
  } catch (e) {
    if (box) {
      box.style.display = 'block';
      box.innerHTML = `
        <div style="background: rgba(185, 28, 28, 0.1); border: 2px solid var(--accent-danger); border-radius: 8px; padding: 14px;">
          <strong style="color: var(--accent-danger);">⚠️ Update-Prüfung fehlgeschlagen</strong>
          <p style="margin-top: 6px; font-size: 14px;">GitHub konnte nicht erreicht werden. Bitte prüfe deine Internetverbindung.</p>
        </div>
      `;
    }
    announceSR('Update-Prüfung fehlgeschlagen. Keine Verbindung zu GitHub.', 'assertive');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<span class="emoji-icon">🔍</span> <strong>Jetzt auf Updates prüfen</strong>';
    }
  }
}

// =============================================================================
// 11. FEEDBACK-SYSTEM & IN-APP ARCHIV
// =============================================================================
function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function sendUserFeedback(e) {
  if (e && e.preventDefault) e.preventDefault();

  const catEl = document.getElementById('feedback-category');
  const authorEl = document.getElementById('feedback-author');
  const emailEl = document.getElementById('feedback-email');
  const textEl = document.getElementById('feedback-text');
  const statusBox = document.getElementById('feedback-status-box');
  const submitBtn = document.getElementById('btn-submit-feedback');

  if (!textEl || !textEl.value.trim()) {
    announceSR('Bitte gib eine Nachricht für dein Feedback ein.', 'assertive');
    return;
  }

  const category = catEl ? catEl.value : '💡 Vorschlag / Feedback';
  const rawAuthor = (authorEl && authorEl.value.trim()) ? authorEl.value.trim() : '';
  // NUR wenn der Nutzer ausdrücklich einen Namen eingegeben hat, wird dieser übertragen.
  // Sonst anonym - der WebUntis-Benutzername wird NICHT übertragen!
  const author = rawAuthor || 'Anonym';
  const email = (emailEl && emailEl.value.trim()) ? emailEl.value.trim() : 'Keine E-Mail angegeben';
  const message = textEl.value.trim();
  const now = new Date().toLocaleString('de-DE');
  const appVer = document.getElementById('app-version-display') ? document.getElementById('app-version-display').textContent : 'v1.3.2';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="emoji-icon">⏳</span> <strong>Wird gesendet...</strong>';
  }

  const payload = {
    _subject: `Stundenplan LWL: ${category} von ${author}`,
    _template: 'table',
    _captcha: 'false',
    Absender: author,
    Kategorie: category,
    Email: email,
    Nachricht: message,
    Datum: now,
    AppVersion: appVer,
    Schule: appData.config.schoolName || 'LWL-Berufskolleg Soest'
  };

  try {
    // 1. Lokaler Server (speichert in Feedback_Archiv.txt & versendet an lauju1909@gmail.com)
    await fetch('/api/send_feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn('Fehler beim lokalen Speichern:', err);
  }

  // 2. Ntfy Push-Benachrichtigung an den Entwickler
  const nl = '\n';
  const ntfyBody = `Absender: ${author}${nl}Kategorie: ${category}${nl}E-Mail: ${email}${nl}Datum: ${now}${nl}${nl}Nachricht:${nl}${message}`;
  try {
    await fetch('https://ntfy.sh/lauju_stundenplan_feedback', {
      method: 'POST',
      headers: {
        'Title': 'Stundenplan LWL Feedback',
        'Priority': 'default',
        'Tags': 'school,bulb,speech_balloon'
      },
      body: ntfyBody
    });
  } catch (err) {
    try {
      await fetch('https://ntfy.sh/lauju_stundenplan_feedback', {
        method: 'POST',
        mode: 'no-cors',
        body: ntfyBody
      });
    } catch (err2) { }
  }

  if (textEl) textEl.value = '';

  if (statusBox) {
    statusBox.style.display = 'block';
    statusBox.innerHTML = `
      <div style="background: rgba(21, 128, 61, 0.15); border: 2px solid var(--accent-ok); border-radius: var(--radius-md); padding: 16px;">
        <strong style="color: var(--accent-ok); font-size: 16px;">✅ Vielen Dank für deine Rückmeldung!</strong>
        <p style="margin-top: 6px; font-size: 14px;">Dein Feedback wurde erfolgreich an den Entwickler übermittelt und direkt hier im Archiv gespeichert.</p>
      </div>
    `;
  }

  announceSR('Vielen Dank! Dein Feedback wurde erfolgreich übertragen und im Archiv gespeichert.', 'polite');

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="emoji-icon">📤</span> <strong>Feedback &amp; Nachricht absenden</strong>';
  }

  // Archiv in der App sofort aktualisieren
  loadFeedbackArchive();
}

async function loadFeedbackArchive() {
  const container = document.getElementById('feedback-archive-list');
  if (!container) return;

  try {
    const res = await fetch('/api/feedback_archive');
    const data = await res.json();
    const raw = data.content || '';

    if (!raw.trim()) {
      container.innerHTML = `
        <div style="background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: var(--radius-md); padding: 22px; text-align: center;">
          <p style="color: var(--text-muted); font-size: 15px;">📭 Noch keine gesendeten Feedback-Nachrichten im Archiv vorhanden.</p>
        </div>
      `;
      return;
    }

    const chunks = raw.split('----------------------------------').map(c => c.trim()).filter(Boolean);
    if (chunks.length === 0) {
      container.innerHTML = `
        <div style="background: var(--bg-surface); border: 2px dashed var(--border-subtle); border-radius: var(--radius-md); padding: 22px; text-align: center;">
          <p style="color: var(--text-muted); font-size: 15px;">📭 Noch keine gesendeten Feedback-Nachrichten im Archiv vorhanden.</p>
        </div>
      `;
      return;
    }

    let html = '<div role="list" aria-label="Liste aller bisher gesendeten Rückmeldungen">';
    // Neueste Nachrichten zuerst anzeigen
    chunks.reverse().forEach(chunk => {
      const matchTime = chunk.match(/^\[(.*?)\]\s*([\s\S]*)$/);
      let timeStr = 'Datum unbekannt';
      let bodyStr = chunk;

      if (matchTime) {
        timeStr = matchTime[1];
        bodyStr = matchTime[2].trim();
      }

      let parsed = null;
      try {
        parsed = JSON.parse(bodyStr);
      } catch (e) { }

      let category = '💬 Feedback / Nachricht';
      let author = 'App-Nutzer';
      let email = '';
      let msg = bodyStr;

      if (parsed) {
        category = parsed.Kategorie || parsed._subject || category;
        author = parsed.Absender || parsed.WebUntisBenutzer || author;
        email = (parsed.Email && parsed.Email !== 'Keine E-Mail angegeben') ? parsed.Email : '';
        msg = parsed.Nachricht || bodyStr;
      }

      html += `
        <article class="feedback-card" role="listitem" tabindex="0" aria-label="Feedback vom ${escapeHTML(timeStr)}: ${escapeHTML(category)} von ${escapeHTML(author)}">
          <div class="feedback-header">
            <span class="feedback-type-badge">${escapeHTML(category)}</span>
            <span class="feedback-timestamp">🕒 ${escapeHTML(timeStr)}</span>
          </div>
          <div class="feedback-sender">
            👤 <strong>Absender:</strong> ${escapeHTML(author)} ${email ? `| ✉️ ${escapeHTML(email)}` : ''}
          </div>
          <div class="feedback-message">${escapeHTML(msg)}</div>
        </article>
      `;
    });
    html += '</div>';

    container.innerHTML = html;
  } catch (err) {
    container.innerHTML = `
      <div style="background: rgba(185, 28, 28, 0.1); border: 2px solid var(--accent-danger); border-radius: var(--radius-md); padding: 14px;">
        <span style="color: var(--accent-danger);">⚠️ Archiv konnte nicht geladen werden.</span>
      </div>
    `;
  }
}

async function clearFeedbackArchive() {
  if (!confirm('Möchtest du das Feedback-Archiv auf diesem Rechner wirklich leeren?')) return;

  try {
    await fetch('/api/feedback_archive/clear', { method: 'POST' });
    announceSR('Das Feedback-Archiv wurde geleert.', 'polite');
    loadFeedbackArchive();
  } catch (e) {
    alert('Fehler beim Leeren des Feedback-Archivs.');
  }
}

async function openFeedbackZentraleApp() {
  announceSR('Öffne Feedback-Zentrale...', 'polite');
  try {
    const res = await fetch('/api/open_feedback_zentrale');
    if (res.ok) {
      announceSR('Feedback-Zentrale wurde erfolgreich gestartet.', 'polite');
      return;
    }
  } catch (e) { }

  // Fallback: Im Browser öffnen
  window.open('/Feedback_Inbox.html', '_blank');
}

document.addEventListener('DOMContentLoaded', initApp);
