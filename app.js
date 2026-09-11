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
  homeworkFilter: 'all'
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
        homeworkFilter: parsed.homeworkFilter || 'all'
      };

      // Gecachte synthetische Fake-Prüfungen def-exam- aus früheren Versionen entfernen, aber ALLE echten Prüfungen beibehalten
      if (parsed.exams && Array.isArray(parsed.exams)) {
        appData.exams = parsed.exams.filter(ex => {
          if (!ex || !ex.id) return false;
          if (String(ex.id).startsWith('def-exam-')) return false;
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
// 6. WEBUNTIS TOTP GENERATOR & JSON-RPC API CLIENT
// =============================================================================
function base32Decode(str) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = String(str || '').toUpperCase().replace(/[\s=]/g, '');
  let bits = '';
  for (let i = 0; i < clean.length; i++) {
    const val = alphabet.indexOf(clean[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, '0');
  }
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substr(i, 8), 2));
  }
  return new Uint8Array(bytes);
}

function sha1(msgBytes) {
  function rotl(n, s) { return (n << s) | (n >>> (32 - s)); }
  const len = msgBytes.length;
  const bitLen = len * 8;
  const withPad = [];
  for (let i = 0; i < len; i++) withPad.push(msgBytes[i]);
  withPad.push(0x80);
  while ((withPad.length % 64) !== 56) withPad.push(0);
  withPad.push(0, 0, 0, 0);
  withPad.push((bitLen >>> 24) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 8) & 0xff, bitLen & 0xff);

  let H0 = 0x67452301, H1 = 0xEFCDAB89, H2 = 0x98BADCFE, H3 = 0x10325476, H4 = 0xC3D2E1F0;
  const W = new Uint32Array(80);

  for (let chunk = 0; chunk < withPad.length; chunk += 64) {
    for (let i = 0; i < 16; i++) {
      W[i] = (withPad[chunk + i * 4] << 24) |
             (withPad[chunk + i * 4 + 1] << 16) |
             (withPad[chunk + i * 4 + 2] << 8) |
             (withPad[chunk + i * 4 + 3]);
    }
    for (let i = 16; i < 80; i++) {
      W[i] = rotl(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    }
    let A = H0, B = H1, C = H2, D = H3, E = H4;
    for (let i = 0; i < 80; i++) {
      let f, k;
      if (i < 20) { f = (B & C) | ((~B) & D); k = 0x5A827999; }
      else if (i < 40) { f = B ^ C ^ D; k = 0x6ED9EBA1; }
      else if (i < 60) { f = (B & C) | (B & D) | (C & D); k = 0x8F1BBCDC; }
      else { f = B ^ C ^ D; k = 0xCA62C1D6; }
      const temp = (rotl(A, 5) + f + E + k + W[i]) >>> 0;
      E = D; D = C; C = rotl(B, 30) >>> 0; B = A; A = temp;
    }
    H0 = (H0 + A) >>> 0;
    H1 = (H1 + B) >>> 0;
    H2 = (H2 + C) >>> 0;
    H3 = (H3 + D) >>> 0;
    H4 = (H4 + E) >>> 0;
  }
  const res = new Uint8Array(20);
  const words = [H0, H1, H2, H3, H4];
  for (let i = 0; i < 5; i++) {
    res[i * 4] = (words[i] >>> 24) & 0xff;
    res[i * 4 + 1] = (words[i] >>> 16) & 0xff;
    res[i * 4 + 2] = (words[i] >>> 8) & 0xff;
    res[i * 4 + 3] = words[i] & 0xff;
  }
  return res;
}

function hmacSha1(keyBytes, msgBytes) {
  let key = keyBytes;
  if (key.length > 64) key = sha1(key);
  const kPadInner = new Uint8Array(64);
  const kPadOuter = new Uint8Array(64);
  for (let i = 0; i < 64; i++) {
    const k = i < key.length ? key[i] : 0;
    kPadInner[i] = k ^ 0x36;
    kPadOuter[i] = k ^ 0x5c;
  }
  const inner = new Uint8Array(kPadInner.length + msgBytes.length);
  inner.set(kPadInner);
  inner.set(msgBytes, kPadInner.length);
  const innerHash = sha1(inner);

  const outer = new Uint8Array(kPadOuter.length + innerHash.length);
  outer.set(kPadOuter);
  outer.set(innerHash, kPadOuter.length);
  return sha1(outer);
}

function generateTotpCode(secretBase32, timestampMs) {
  try {
    if (!secretBase32) return 0;
    const key = base32Decode(secretBase32);
    if (!key || key.length === 0) return 0;
    const step = Math.floor((timestampMs / 1000) / 30);
    const msg = new Uint8Array(8);
    let s = step;
    for (let i = 7; i >= 0; i--) {
      msg[i] = s & 0xff;
      s = Math.floor(s / 256);
    }
    const hash = hmacSha1(key, msg);
    const offset = hash[hash.length - 1] & 0x0f;
    const binary = ((hash[offset] & 0x7f) << 24) |
                   ((hash[offset + 1] & 0xff) << 16) |
                   ((hash[offset + 2] & 0xff) << 8) |
                   (hash[offset + 3] & 0xff);
    return binary % 1000000;
  } catch (e) {
    return 0;
  }
}

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
      if (appData.config.appSharedSecret) {
        headers['X-Untis-Secret'] = appData.config.appSharedSecret;
        headers['X-Untis-User'] = appData.config.username;
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

async function callWebUntisRest(endpoint, token = null, method = 'GET', body = null) {
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
      if (appData.config.appSharedSecret) {
        headers['X-Untis-Secret'] = appData.config.appSharedSecret;
        headers['X-Untis-User'] = appData.config.username;
      }
      if (token && typeof token === 'string' && token.startsWith('eyJ')) {
        headers['Authorization'] = `Bearer ${token.trim()}`;
      }

      const fetchOpts = {
        method: method || 'GET',
        headers: headers
      };
      if (body && (method === 'POST' || method === 'PUT')) {
        fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      const res = await fetch(ep, fetchOpts);

      if (res.ok) {
        const textData = await res.text();
        try {
          return JSON.parse(textData);
        } catch (e) {
          return textData;
        }
      }
    } catch (e) {}
  }
  return null;
}

function normalizeToIsoDate(d) {
  if (!d) return '';
  const s = String(d).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const clean = s.replace(/\D/g, '');
  if (clean.length >= 8) {
    return `${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}`;
  }
  return '';
}

function formatDateToUntis(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return parseInt(`${y}${m}${day}`);
}

function formatUntisTimeToStr(val) {
  if (val === undefined || val === null) return '07:45';
  const str = String(val).trim();
  if (str.includes(':')) {
    const parts = str.split(':');
    return `${parts[0].padStart(2, '0')}:${(parts[1] || '00').padStart(2, '0')}`;
  }
  const num = parseInt(str.replace(/\D/g, '')) || 0;
  const s = String(num).padStart(4, '0');
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

    // 1b. Untis Mobile App-Shared-Secret & OTP Authentifizierung (getAppSharedSecret + getAuthToken)
    let appSharedSecret = appData.config.appSharedSecret || null;
    if (!appSharedSecret) {
      try {
        const secRes = await callWebUntisRest('/jsonrpc_intern.do?m=getAppSharedSecret', null, 'POST', {
          id: 'sec-' + Date.now(),
          jsonrpc: '2.0',
          method: 'getAppSharedSecret',
          params: [{ userName: username, password: password, token: '' }]
        });
        if (secRes && secRes.result && typeof secRes.result === 'string') {
          appSharedSecret = secRes.result.trim();
          appData.config.appSharedSecret = appSharedSecret;
          saveAppData();
        }
      } catch (e) { }
    }

    let nowClientTime = Date.now();
    let curOtp = appSharedSecret ? generateTotpCode(appSharedSecret, nowClientTime) : 0;

    // JWT Bearer Token für WebUntis REST- & App-APIs abrufen (getAuthToken mit TOTP)
    let jwtToken = null;
    if (appSharedSecret && curOtp) {
      try {
        const tokRes = await callWebUntisRest('/jsonrpc_intern.do?m=getAuthToken', null, 'POST', {
          id: 'tok-' + Date.now(),
          jsonrpc: '2.0',
          method: 'getAuthToken',
          params: [{
            auth: {
              clientTime: nowClientTime,
              otp: curOtp,
              user: username
            }
          }]
        });
        if (tokRes && tokRes.result && tokRes.result.token) {
          jwtToken = tokRes.result.token.trim();
        }
      } catch (e) { }
    }

    // Fallback 1: Mobile Auth v2 Endpoint
    if (!jwtToken) {
      try {
        const schoolShort = appData.config.schoolShort || 'lwl-bk-soest';
        const authMobileRes = await callWebUntisRest(
          `/api/mobile/v2/${schoolShort}/authentication`,
          null,
          'POST',
          { username: username, password: password }
        );
        if (authMobileRes && authMobileRes.jwt) {
          jwtToken = String(authMobileRes.jwt).trim();
        }
      } catch (e) { }
    }

    // Fallback 2: /api/token/new
    if (!jwtToken) {
      try {
        const tokenRes = await callWebUntisRest('/api/token/new');
        if (tokenRes) {
          if (typeof tokenRes === 'string' && tokenRes.length > 20 && tokenRes.startsWith('eyJ')) {
            jwtToken = tokenRes.trim();
          } else if (tokenRes.token && typeof tokenRes.token === 'string' && tokenRes.token.startsWith('eyJ')) {
            jwtToken = tokenRes.token.trim();
          } else if (tokenRes.jwt && typeof tokenRes.jwt === 'string' && tokenRes.jwt.startsWith('eyJ')) {
            jwtToken = tokenRes.jwt.trim();
          }
        }
      } catch (e) { }
    }

    // 2. Metadaten & getUserData2017 parallel abrufen
    const [subRes, teaRes, rooRes, klaRes, examTypesRes, classregCatsRes, userDataRes] = await Promise.all([
      callWebUntisApi('getSubjects').catch(() => ({})),
      callWebUntisApi('getTeachers').catch(() => ({})),
      callWebUntisApi('getRooms').catch(() => ({})),
      callWebUntisApi('getKlassen').catch(() => ({})),
      callWebUntisApi('getExamTypes').catch(() => ({})),
      callWebUntisApi('getClassregCategories').catch(() => ({})),
      callWebUntisApi('getUserData2017', [{ elementId: 0 }]).catch(() => callWebUntisApi('getUserData2017', { elementId: 0 }).catch(() => ({})))
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

    // 4b. Schüler- und Klassen-IDs vollständig erfassen (für personenbezogene UND klassenweite Abfragen)
    const detectedKlasseIds = new Set();
    const detectedStudentIds = new Set();

    if (personId) {
      if (personType === 1) detectedKlasseIds.add(personId);
      else detectedStudentIds.add(personId);
    }
    if (authRes.result) {
      if (authRes.result.klasseId) detectedKlasseIds.add(authRes.result.klasseId);
      if (authRes.result.classId) detectedKlasseIds.add(authRes.result.classId);
    }
    if (userDataRes && userDataRes.result && userDataRes.result.userData) {
      const ud = userDataRes.result.userData;
      if (ud.elemType === 'STUDENT' && ud.elemId) detectedStudentIds.add(ud.elemId);
      if (ud.elemType === 'CLASS' && ud.elemId) detectedKlasseIds.add(ud.elemId);
      if (ud.klassenIds && Array.isArray(ud.klassenIds)) {
        ud.klassenIds.forEach(kId => { if (kId) detectedKlasseIds.add(kId); });
      }
      if (ud.children && Array.isArray(ud.children)) {
        ud.children.forEach(ch => { if (ch && ch.id) detectedStudentIds.add(ch.id); });
      }
    }
    if (ttRes && ttRes.result && Array.isArray(ttRes.result)) {
      ttRes.result.forEach(item => {
        if (item.kl && Array.isArray(item.kl)) {
          item.kl.forEach(k => { if (k && k.id) detectedKlasseIds.add(k.id); });
        }
      });
    }
    let detectedKlasseId = detectedKlasseIds.size > 0 ? Array.from(detectedKlasseIds)[0] : (personType === 1 ? personId : null);

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
        if (activeSy && activeSy.startDate && activeSy.endDate) {
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

    // ISO-Datumsstrings für WebUntis REST- & Mobile-Abfragen (YYYY-MM-DD)
    const sIsoStr = `${String(syRange.startDateNum).slice(0, 4)}-${String(syRange.startDateNum).slice(4, 6)}-${String(syRange.startDateNum).slice(6, 8)}`;
    const eIsoStr = `${String(syRange.endDateNum).slice(0, 4)}-${String(syRange.endDateNum).slice(4, 6)}-${String(syRange.endDateNum).slice(6, 8)}`;

    // 6. Sliding-Windows für Stundenplan, Prüfungen, Klassenbuch & Hausaufgaben
    const dateWindows = [];

    // Prioritätsfenster: 14 Tage rückwärts bis 60 Tage vorwärts (deckt aktuelle Aufgaben & Arbeiten vor den Herbstferien optimal ab)
    const pStart = new Date(now);
    pStart.setDate(pStart.getDate() - 14);
    const pEnd = new Date(now);
    pEnd.setDate(pEnd.getDate() + 60);
    dateWindows.push({
      startNum: formatDateToUntis(pStart),
      endNum: formatDateToUntis(pEnd),
      startIso: normalizeToIsoDate(formatDateToUntis(pStart)),
      endIso: normalizeToIsoDate(formatDateToUntis(pEnd))
    });

    // 30-Tage-Fenster für das gesamte Schuljahr
    let winCur = new Date(syRange.startDate);
    while (winCur < syRange.endDate) {
      let winNext = new Date(winCur);
      winNext.setDate(winNext.getDate() + 29);
      if (winNext > syRange.endDate) winNext = new Date(syRange.endDate);
      dateWindows.push({
        startNum: formatDateToUntis(winCur),
        endNum: formatDateToUntis(winNext),
        startIso: normalizeToIsoDate(formatDateToUntis(winCur)),
        endIso: normalizeToIsoDate(formatDateToUntis(winNext))
      });
      winCur = new Date(winNext);
      winCur.setDate(winCur.getDate() + 1);
    }

    // Stundenplan-Abfragen (getTimetable und getTimetable2017 für Schüler & Klassen)
    const futureTtCalls = [];
    dateWindows.forEach(win => {
      // Standard getTimetable für Schüler
      futureTtCalls.push(callWebUntisApi('getTimetable', {
        options: {
          element: { id: personId, type: personType },
          startDate: win.startNum,
          endDate: win.endNum,
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

      // getTimetable2017 (WebUntis Mobile Format)
      futureTtCalls.push(callWebUntisApi('getTimetable2017', {
        id: personId,
        type: personType,
        startDate: win.startNum,
        endDate: win.endNum
      }).catch(() => ({})));

      // Für jede erkannte Klasse
      detectedKlasseIds.forEach(kId => {
        futureTtCalls.push(callWebUntisApi('getTimetable', {
          options: {
            element: { id: kId, type: 1 },
            startDate: win.startNum,
            endDate: win.endNum,
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
          id: kId,
          type: 1,
          startDate: win.startNum,
          endDate: win.endNum
        }).catch(() => ({})));
      });
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
      detectedKlasseIds.forEach(kId => {
        examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: kId, type: 1 }).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams', { examTypeId: etId, startDate: syRange.startDateNum, endDate: syRange.endDateNum, klasseId: kId }).catch(() => ({})));
      });
    });

    // Spezifische Schülerprüfungs-Methoden & generelle Prüfungsabfragen (alle Formate)
    examCalls.push(callWebUntisApi('getExams', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getExams', { startDate: sIsoStr, endDate: eIsoStr }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getStudentExams', { id: personId, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));
    examCalls.push(callWebUntisApi('getStudentExamList', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));

    // getExams2017 in Intervallen für alle erkannten Schüler & Klassen (Untis Mobile Format mit OTP)
    dateWindows.forEach(win => {
      const authObj = appSharedSecret ? {
        clientTime: Date.now(),
        otp: generateTotpCode(appSharedSecret, Date.now()),
        user: username
      } : null;

      detectedStudentIds.forEach(sId => {
        examCalls.push(callWebUntisApi('getExams2017', [{ id: sId, type: 'STUDENT', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams2017', [{ id: sId, type: 5, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams2017', { id: sId, type: 'STUDENT', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams2017', { id: sId, type: 5, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        examCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getExams2017', jwtToken, 'POST', {
          id: 'ex-' + Date.now(),
          jsonrpc: '2.0',
          method: 'getExams2017',
          params: [{ id: sId, type: 'STUDENT', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]
        }).catch(() => ({})));
      });

      detectedKlasseIds.forEach(kId => {
        examCalls.push(callWebUntisApi('getExams2017', [{ id: kId, type: 'CLASS', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams2017', [{ id: kId, type: 1, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams2017', { id: kId, type: 'CLASS', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        examCalls.push(callWebUntisApi('getExams2017', { id: kId, type: 1, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        examCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getExams2017', jwtToken, 'POST', {
          id: 'ex-' + Date.now(),
          jsonrpc: '2.0',
          method: 'getExams2017',
          params: [{ id: kId, type: 'CLASS', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]
        }).catch(() => ({})));
      });

      examCalls.push(callWebUntisApi('getExams2017', [{ startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
      examCalls.push(callWebUntisApi('getExams2017', { startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
    });

    // 6b. Klassenbuch-Termine & Ereignisse in 30-Tage-Fenstern
    const classregCalls = [];
    dateWindows.forEach(cw => {
      classregCalls.push(callWebUntisApi('getClassregEvents', { startDate: cw.startNum, endDate: cw.endNum }).catch(() => ({})));
      classregCalls.push(callWebUntisApi('getClassregEvents', { startDate: cw.startNum, endDate: cw.endNum, id: personId, type: personType }).catch(() => ({})));
      classregCalls.push(callWebUntisApi('getClassregEvents', { startDate: cw.startIso, endDate: cw.endIso }).catch(() => ({})));
      classregCalls.push(callWebUntisApi('getClassregEventEntries', { startDate: cw.startNum, endDate: cw.endNum }).catch(() => ({})));
      detectedKlasseIds.forEach(kId => {
        classregCalls.push(callWebUntisApi('getClassregEvents', { startDate: cw.startNum, endDate: cw.endNum, id: kId, type: 1 }).catch(() => ({})));
        classregCalls.push(callWebUntisApi('getClassregEventEntries', { startDate: cw.startNum, endDate: cw.endNum, id: kId, type: 1 }).catch(() => ({})));
      });
    });

    // 6c. Hausaufgaben-Abfragen (getHomeWork2017 für alle Schüler & Klassen mit OTP)
    const homeworkCalls = [];
    dateWindows.forEach(win => {
      const authObj = appSharedSecret ? {
        clientTime: Date.now(),
        otp: generateTotpCode(appSharedSecret, Date.now()),
        user: username
      } : null;

      detectedStudentIds.forEach(sId => {
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', [{ id: sId, type: 'STUDENT', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', [{ id: sId, type: 5, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', { id: sId, type: 'STUDENT', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', { id: sId, type: 5, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        homeworkCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getHomeWork2017', jwtToken, 'POST', {
          id: 'hw-' + Date.now(),
          jsonrpc: '2.0',
          method: 'getHomeWork2017',
          params: [{ id: sId, type: 'STUDENT', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]
        }).catch(() => ({})));
      });

      detectedKlasseIds.forEach(kId => {
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', [{ id: kId, type: 'CLASS', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', [{ id: kId, type: 1, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', { id: kId, type: 'CLASS', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        homeworkCalls.push(callWebUntisApi('getHomeWork2017', { id: kId, type: 1, startDate: win.startNum, endDate: win.endNum, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
        homeworkCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getHomeWork2017', jwtToken, 'POST', {
          id: 'hw-' + Date.now(),
          jsonrpc: '2.0',
          method: 'getHomeWork2017',
          params: [{ id: kId, type: 'CLASS', startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]
        }).catch(() => ({})));
      });

      homeworkCalls.push(callWebUntisApi('getHomeWork2017', [{ startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }]).catch(() => ({})));
      homeworkCalls.push(callWebUntisApi('getHomeWork2017', { startDate: win.startIso, endDate: win.endIso, ...(authObj ? { auth: authObj } : {}) }).catch(() => ({})));
      homeworkCalls.push(callWebUntisApi('getHomeWorks', { startDate: win.startNum, endDate: win.endNum }).catch(() => ({})));
      homeworkCalls.push(callWebUntisApi('getHomeWorks', { startDate: win.startIso, endDate: win.endIso }).catch(() => ({})));
    });

    // 6d. Fehlzeiten-Abfragen
    const absenceCalls = [
      callWebUntisApi('getStudentAbsences2017', { id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getStudentAbsences2017', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getStudentAbsences2017', { startDate: sIsoStr, endDate: eIsoStr, includeExcused: true, includeUnExcused: true }).catch(() => ({})),
      callWebUntisApi('getTimetableWithAbsences', { id: personId, type: personType, startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getAbsenceReasons', {}).catch(() => ({}))
    ];

    // 6e. Untis Mobile REST-Aufrufe (timetable/entries & calendar-entry/detail)
    const restTtCalls = [];
    const restCalDetailCalls = [];
    const pTypes = 'NORMAL_TEACHING_PERIOD,ADDITIONAL_PERIOD,STAND_BY_PERIOD,OFFICE_HOUR,EXAM,BREAK_SUPERVISION,EVENT,MEETING,PLATFORM_CALENDAR_EVENT,PERSONAL_CALENDAR_EVENT';

    if (jwtToken) {
      dateWindows.forEach(win => {
        detectedStudentIds.forEach(sId => {
          restTtCalls.push(callWebUntisRest(
            `/api/rest/view/v1/timetable/entries?start=${win.startIso}&end=${win.endIso}&format=1&resourceType=STUDENT&resources=${sId}&periodTypes=${pTypes}&layout=PRIORITY`,
            jwtToken
          ).catch(() => null));

          restCalDetailCalls.push(callWebUntisRest(
            `/api/rest/view/v2/calendar-entry/detail?elementType=5&elementId=${sId}&startDateTime=${win.startIso}T00:00:00&endDateTime=${win.endIso}T23:59:59`,
            jwtToken
          ).catch(() => null));
        });

        detectedKlasseIds.forEach(kId => {
          restTtCalls.push(callWebUntisRest(
            `/api/rest/view/v1/timetable/entries?start=${win.startIso}&end=${win.endIso}&format=1&resourceType=CLASS&resources=${kId}&periodTypes=${pTypes}&layout=PRIORITY`,
            jwtToken
          ).catch(() => null));
        });
      });
    }

    // REST-Endpunkte für Prüfungen, Kalender-Events, Hausaufgaben, Fehlzeiten & App-Daten (Untis Mobile Backend)
    const restAppDataPromise = callWebUntisRest('/api/rest/view/v1/app/data', jwtToken).catch(() => null);
    const restCalEventsPromise1 = callWebUntisRest(`/api/rest/view/v1/calendar/events?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restCalEventsPromise2 = callWebUntisRest(`/api/calendar/events?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restExamsPromise1 = callWebUntisRest(`/api/exams?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restExamsPromise2 = callWebUntisRest(`/api/rest/view/v1/exams?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restHomeworkPromise1 = callWebUntisRest(`/api/homeworks/lessons?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restHomeworkPromise2 = callWebUntisRest(`/api/homeworks?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restHomeworkPromise3 = callWebUntisRest(`/api/rest/view/v1/homeworks?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);
    const restAbsencesPromise = callWebUntisRest(`/api/classreg/absences/students?startDate=${sIsoStr}&endDate=${eIsoStr}`, jwtToken).catch(() => null);

    // 7. Schulferien, News, Prüfungen, Klassenbuch, Hausaufgaben, Fehlzeiten & REST-Daten parallel abrufen
    const [
      examResponses,
      classregResponses,
      futureTtResults,
      homeworkResponses,
      absenceResponses,
      holidaysRes,
      newsRes,
      restExamsRes1,
      restExamsRes2,
      restAppDataRes,
      restCalEventsRes1,
      restCalEventsRes2,
      restHomeworkRes1,
      restHomeworkRes2,
      restHomeworkRes3,
      restAbsencesRes,
      restCalDetailResults,
      restTtResults
    ] = await Promise.all([
      Promise.all(examCalls),
      Promise.all(classregCalls),
      Promise.all(futureTtCalls),
      Promise.all(homeworkCalls),
      Promise.all(absenceCalls),
      callWebUntisApi('getHolidays', {}).catch(() => ({})),
      callWebUntisApi('getNewsWidgetData', {}).catch(() => callWebUntisApi('getNewsWidget', {}).catch(() => ({}))),
      restExamsPromise1,
      restExamsPromise2,
      restAppDataPromise,
      restCalEventsPromise1,
      restCalEventsPromise2,
      restHomeworkPromise1,
      restHomeworkPromise2,
      restHomeworkPromise3,
      restAbsencesPromise,
      Promise.all(restCalDetailCalls),
      Promise.all(restTtCalls)
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

      // 1. Eingebettete Prüfungen in item.exams oder item.exam direkt auspacken!
      if (item.exams && Array.isArray(item.exams) && item.exams.length > 0) {
        item.exams.forEach((exObj, eIdx) => {
          const rawD = exObj.date || exObj.examDate || exObj.startDate || item.date;
          const dStrEx = String(rawD || '').replace(/[-T:\s].*$/, '').replace(/-/g, '').trim().slice(0, 8);
          if (dStrEx.length === 8) {
            const isoDateEx = `${dStrEx.slice(0, 4)}-${dStrEx.slice(4, 6)}-${dStrEx.slice(6, 8)}`;
            let sEx = exObj.subject || subjName || 'Klausur';
            if (typeof sEx === 'object') sEx = sEx.name || sEx.longName || 'Klausur';
            let tEx = (exObj.teachers && exObj.teachers[0]) || exObj.teacher || (item.te && item.te[0] && (teachersMap[item.te[0].id] || item.te[0].name)) || 'Fachlehrkraft';
            if (typeof tEx === 'object') tEx = tEx.name || tEx.longName || 'Fachlehrkraft';
            let rEx = (exObj.rooms && exObj.rooms[0]) || exObj.room || (item.ro && item.ro[0] && extractRoomFromObj(item.ro[0])) || 'Raum laut Plan';
            if (typeof rEx === 'object') rEx = rEx.name || rEx.longName || 'Raum laut Plan';
            timetableExams.push({
              id: `tt-emb-exam-${exObj.id || item.id || idx}-${eIdx}-${isoDateEx}`,
              subject: String(sEx),
              date: isoDateEx,
              startTime: formatUntisTimeToStr(exObj.startTime || item.startTime || 745),
              endTime: formatUntisTimeToStr(exObj.endTime || item.endTime || 915),
              room: isValidRoomCandidate(rEx) ? formatRoomDisplay(rEx, tEx) : 'Raum laut Plan',
              teacher: String(tEx),
              topic: exObj.text || exObj.name || exObj.description || 'Klassenarbeit / Klausur laut WebUntis',
              type: 'exam',
              completed: false
            });
          }
        });
      }

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
      ].filter(t => typeof t === 'string' && t.trim()).join(' ');

      const isExamCode = codeVal === 'exam' || codeVal === 'klausur' || codeVal === 'examination' ||
                         actVal === 'exam' || actVal === 'klausur' || actVal === 'examination' ||
                         typeVal === 'exam' || cellVal === 'exam' ||
                         item.examId !== undefined || item.exam !== undefined || item.isExam === true;

      const isExamText = /\b(klausur|klausuren|klausurblock|klausurtag|klausurtage|klassenarbeit|klassenarbeiten|prüfung|pruefung|prüfungen|pruefungen|arbeit|arbeiten|test|tests|leistungsnachweis|nachschreib|nachschreiber|nachhol|abschlussprüfung|abschlusspruefung|zentrale\s+prüfung|zentrale\s+pruefung|zk|zap|zp\s*10|facharbeit|kolloquium|präsentationsprüfung|kursarbeit|schulaufgabe|kurzarbeit)\b|\b(ka\b|ka-|\(ka\)|1\.\s*ka|2\.\s*ka|3\.\s*ka|4\.\s*ka|klaus\.|kl\.)/i.test(notes) ||
                         /\b(klassenarbeit|klausur|arbeit|test|prüfung|ka\b)/i.test(subjName);

      if (isExamCode || isExamText) {
        const dStr = String(item.date || '').replace(/[-T:\s].*$/, '').replace(/-/g, '').trim().slice(0, 8);
        if (dStr.length === 8) {
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

          const topicText = [item.substText, item.info, item.lstext, item.lessonText, item.text, subjName].filter(t => typeof t === 'string' && t.trim()).join(' - ') || 'Klassenarbeit / Klausur laut WebUntis';

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
      const dStr = String(item.date || '').replace(/[-T:\s].*$/, '').replace(/-/g, '').trim().slice(0, 8);
      if (dStr.length !== 8) return;
      const isoDate = `${dStr.slice(0, 4)}-${dStr.slice(4, 6)}-${dStr.slice(6, 8)}`;
      const teach = (item.te && item.te[0]) ? (teachersMap[item.te[0].id] || item.te[0].name || 'Fachlehrkraft') : 'Fachlehrkraft';

      // 1. item.homework direkt auswerten (String, Objekt oder Array)
      if (item.homework) {
        if (typeof item.homework === 'string' && item.homework.trim()) {
          timetableHomeworks.push({
            id: `tt-hw-${item.id || idx}-${isoDate}`,
            subject: subjName || 'Hausaufgabe',
            teacher: teach,
            dueDate: isoDate,
            text: item.homework.trim(),
            completed: false
          });
        } else if (Array.isArray(item.homework)) {
          item.homework.forEach((hwObj, hIdx) => {
            if (typeof hwObj === 'string' && hwObj.trim()) {
              timetableHomeworks.push({
                id: `tt-hw-${item.id || idx}-${hIdx}-${isoDate}`,
                subject: subjName || 'Hausaufgabe',
                teacher: teach,
                dueDate: isoDate,
                text: hwObj.trim(),
                completed: false
              });
            } else if (hwObj && typeof hwObj === 'object') {
              const t = hwObj.text || hwObj.remark || hwObj.description || hwObj.title || '';
              let d = hwObj.dueDate || hwObj.date || isoDate;
              let dClean = String(d).replace(/[-T:\s].*$/, '').replace(/-/g, '').slice(0, 8);
              let dIso = (dClean.length === 8) ? `${dClean.slice(0, 4)}-${dClean.slice(4, 6)}-${dClean.slice(6, 8)}` : isoDate;
              if (t) {
                timetableHomeworks.push({
                  id: String(hwObj.id || `tt-hw-${item.id || idx}-${hIdx}-${dIso}`),
                  subject: subjName || 'Hausaufgabe',
                  teacher: teach,
                  dueDate: dIso,
                  text: String(t).trim(),
                  completed: !!hwObj.completed
                });
              }
            }
          });
        } else if (typeof item.homework === 'object') {
          const t = item.homework.text || item.homework.remark || item.homework.description || item.homework.title || '';
          let d = item.homework.dueDate || item.homework.date || isoDate;
          let dClean = String(d).replace(/[-T:\s].*$/, '').replace(/-/g, '').slice(0, 8);
          let dIso = (dClean.length === 8) ? `${dClean.slice(0, 4)}-${dClean.slice(4, 6)}-${dClean.slice(6, 8)}` : isoDate;
          if (t) {
            timetableHomeworks.push({
              id: String(item.homework.id || `tt-hw-${item.id || idx}-${dIso}`),
              subject: subjName || 'Hausaufgabe',
              teacher: teach,
              dueDate: dIso,
              text: String(t).trim(),
              completed: !!item.homework.completed
            });
          }
        }
      }

      // 2. Texte in lstext, lessonText, substText, info scannen nach Hausaufgaben
      const candidateTexts = [item.lstext, item.lessonText, item.info, item.substText, item.text].filter(t => typeof t === 'string' && t.trim());
      candidateTexts.forEach((cText, cIdx) => {
        // Nicht als Hausaufgabe einstufen, wenn es eine reine Klausurankündigung ist
        if (/\b(klausur|klassenarbeit|klausuren|klassenarbeiten|nachschreibklausur)\b/i.test(cText)) return;

        const hwMatch = cText.match(/\b(?:ha:|h\.a\.:|hausaufgabe:|hausaufgaben:|hausaufgabe|hausaufgaben|aufgabe:|aufgaben:|übung:|übungen:|zu\s+erledigen:|erledigen\s+bis|bearbeiten:|buch\s+s\.|s\.\s*\d+|ab\s+\d+|arbeitsblatt|vokabeln\s+lernen|lernen:|vorbereitung:)\s*[:\-]?\s*(.+)/i);
        if (hwMatch) {
          const hwContent = hwMatch[1] ? hwMatch[1].trim() : cText.trim();
          if (hwContent.length > 2) {
            timetableHomeworks.push({
              id: `tt-text-hw-${item.id || idx}-${cIdx}-${isoDate}`,
              subject: subjName || 'Hausaufgabe',
              teacher: teach,
              dueDate: isoDate,
              text: hwContent,
              completed: false
            });
          }
        }
      });
    }

    // Alle Stundenplanquellen für das gesamte Schuljahr sammeln
    const allTtSource = [];
    if (ttRes && ttRes.result && Array.isArray(ttRes.result)) allTtSource.push(...ttRes.result);
    if (futureTtResults && Array.isArray(futureTtResults)) {
      futureTtResults.forEach(f => {
        if (!f) return;
        const resObj = f.result || f;
        if (!resObj) return;
        if (Array.isArray(resObj)) {
          allTtSource.push(...resObj);
        } else if (resObj.timetable && Array.isArray(resObj.timetable.periods)) {
          allTtSource.push(...resObj.timetable.periods);
        } else if (Array.isArray(resObj.periods)) {
          allTtSource.push(...resObj.periods);
        } else if (Array.isArray(resObj.data)) {
          allTtSource.push(...resObj.data);
        }
      });
    }

    // Alle Stunden des gesamten Schuljahres nach Klassenarbeiten & Hausaufgaben scannen
    allTtSource.forEach((item, idx) => {
      scanItemForExam(item, idx);
      scanItemForHomework(item, idx);
      if (item.kl && Array.isArray(item.kl)) {
        item.kl.forEach(k => { if (k && k.id) detectedKlasseIds.add(k.id); });
      }
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

    // A. WebUntis getExams & getExams2017 parsen
    const rawExamsList = [];
    examResponses.forEach(res => {
      if (!res) return;
      const resObj = res.result || res;
      if (!resObj) return;
      if (Array.isArray(resObj)) {
        rawExamsList.push(...resObj);
      } else if (resObj.exams && Array.isArray(resObj.exams)) {
        rawExamsList.push(...resObj.exams);
      } else if (resObj.records && Array.isArray(resObj.records)) {
        rawExamsList.push(...resObj.records);
      } else if (resObj.data && Array.isArray(resObj.data)) {
        rawExamsList.push(...resObj.data);
      }
    });

    [restExamsRes1, restExamsRes2].forEach(rRes => {
      if (!rRes) return;
      const rObj = rRes.data || rRes;
      if (Array.isArray(rObj)) rawExamsList.push(...rObj);
      else if (rObj.exams && Array.isArray(rObj.exams)) rawExamsList.push(...rObj.exams);
      else if (rObj.records && Array.isArray(rObj.records)) rawExamsList.push(...rObj.records);
    });

    rawExamsList.forEach((ex, idx) => {
      if (!ex) return;
      let isoDate = '';
      let sTimeStr = '';
      let eTimeStr = '';

      if (ex.startDateTime) {
        isoDate = normalizeToIsoDate(ex.startDateTime);
        const sMatch = String(ex.startDateTime).match(/T(\d{2}:\d{2})/);
        if (sMatch) sTimeStr = sMatch[1];
      }
      if (ex.endDateTime) {
        const eMatch = String(ex.endDateTime).match(/T(\d{2}:\d{2})/);
        if (eMatch) eTimeStr = eMatch[1];
      }

      const rawDate = ex.date || ex.examDate || ex.startDate;
      if (!isoDate && rawDate) {
        isoDate = normalizeToIsoDate(rawDate);
      }
      if (!isoDate) return;

      if (!sTimeStr) {
        const sTime = ex.startTime !== undefined ? ex.startTime : (ex.start || 745);
        sTimeStr = formatUntisTimeToStr(sTime);
      }
      if (!eTimeStr) {
        const eTime = ex.endTime !== undefined ? ex.endTime : (ex.end || 915);
        eTimeStr = formatUntisTimeToStr(eTime);
      }

      let subj = 'Klausur';
      const sId = ex.subjectId || ex.subject;
      if (sId && subjectsMap[sId]) subj = subjectsMap[sId];
      else if (typeof sId === 'string' && sId.trim()) subj = sId.trim();
      else if (sId && typeof sId === 'object') subj = sId.name || sId.longName || 'Klausur';
      else if (ex.name && !/^klausur/i.test(ex.name)) subj = ex.name;

      let exTeacher = 'Fachlehrkraft';
      const tIds = ex.teacherIds || (ex.teachers && Array.isArray(ex.teachers) ? ex.teachers : null);
      const tId = (tIds && tIds[0]) || ex.teacher || ex.teacherId;
      if (tId && teachersMap[tId]) {
        exTeacher = teachersMap[tId];
      } else if (typeof tId === 'string' && tId.trim()) {
        exTeacher = tId.trim();
      } else if (tId && typeof tId === 'object') {
        exTeacher = tId.name || tId.longName || 'Fachlehrkraft';
      }

      let exRoom = 'Raum laut Plan';
      const rIds = ex.roomIds || (ex.rooms && Array.isArray(ex.rooms) ? ex.rooms : null);
      const rId = (rIds && rIds[0]) || ex.room || ex.roomId;
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

      addUniqueExam({
        id: `untis-exam-${ex.id || idx}-${isoDate}`,
        subject: subj,
        date: isoDate,
        startTime: sTimeStr,
        endTime: eTimeStr,
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
      if (!evt) return;
      const rawDate = evt.date || evt.startDate;
      if (!rawDate) return;
      const dStr = String(rawDate).replace(/[-T:\s].*$/, '').replace(/-/g, '').trim().slice(0, 8);
      if (dStr.length !== 8) return;

      const dateNum = parseInt(dStr);
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

    // D. Prüfungen aus Untis Mobile calendar-entry/detail und timetable/entries
    if (restCalDetailResults && Array.isArray(restCalDetailResults)) {
      restCalDetailResults.forEach(r => {
        if (!r || !r.calendarEntries || !Array.isArray(r.calendarEntries)) return;
        r.calendarEntries.forEach((entry, eIdx) => {
          const sRaw = entry.startDateTime || '';
          const eRaw = entry.endDateTime || '';
          const isoDate = normalizeToIsoDate(sRaw) || normalizeToIsoDate(eRaw);
          if (!isoDate) return;

          let sTimeStr = '07:45';
          let eTimeStr = '09:15';
          const sMatch = String(sRaw).match(/T(\d{2}:\d{2})/);
          if (sMatch) sTimeStr = sMatch[1];
          const eMatch = String(eRaw).match(/T(\d{2}:\d{2})/);
          if (eMatch) eTimeStr = eMatch[1];

          let subj = (entry.subject && (entry.subject.displayName || entry.subject.longName || entry.subject.name)) || 'Unterricht';
          let teach = (entry.teachers && entry.teachers[0] && (entry.teachers[0].displayName || entry.teachers[0].longName || entry.teachers[0].name)) || 'Fachlehrkraft';
          let rm = (entry.rooms && entry.rooms[0] && (entry.rooms[0].displayName || entry.rooms[0].name || entry.rooms[0].longName)) || 'Raum laut Plan';
          if (isValidRoomCandidate(rm)) rm = formatRoomDisplay(rm, teach);

          if (entry.exam || entry.type === 'EXAM') {
            const exObj = entry.exam || {};
            const exTitle = exObj.name || exObj.text || exObj.description || (entry.type === 'EXAM' ? `${subj} (Klausur)` : 'Klausur');
            addUniqueExam({
              id: `cal-detail-exam-${entry.id || eIdx}-${isoDate}`,
              subject: String(subj),
              date: isoDate,
              startTime: sTimeStr,
              endTime: eTimeStr,
              room: rm,
              teacher: String(teach),
              topic: String(exTitle),
              type: 'exam',
              completed: false
            });
          }
        });
      });
    }

    if (restTtResults && Array.isArray(restTtResults)) {
      restTtResults.forEach(tt => {
        if (!tt || !tt.days || !Array.isArray(tt.days)) return;
        tt.days.forEach(day => {
          const dIso = normalizeToIsoDate(day.date);
          if (!dIso || !day.gridEntries || !Array.isArray(day.gridEntries)) return;
          day.gridEntries.forEach((ge, gIdx) => {
            const isGeExam = ge.type === 'EXAM' ||
                             (ge.name && /\b(klausur|klassenarbeit|arbeit|test|prüfung)\b/i.test(ge.name));
            if (isGeExam) {
              let sTimeStr = '07:45';
              let eTimeStr = '09:15';
              if (ge.duration) {
                const sm = String(ge.duration.start || '').match(/T(\d{2}:\d{2})/);
                if (sm) sTimeStr = sm[1];
                const em = String(ge.duration.end || '').match(/T(\d{2}:\d{2})/);
                if (em) eTimeStr = em[1];
              }
              addUniqueExam({
                id: `rest-tt-exam-${(ge.ids && ge.ids[0]) || gIdx}-${dIso}`,
                subject: ge.name || 'Klassenarbeit / Klausur',
                date: dIso,
                startTime: sTimeStr,
                endTime: eTimeStr,
                room: 'Raum laut Plan',
                teacher: 'Fachlehrkraft',
                topic: ge.name || 'Prüfung laut Untis Mobile',
                type: 'exam',
                completed: false
              });
            }
          });
        });
      });
    }

    // E. Termine & Prüfungen aus allen weiteren WebUntis REST-Endpunkten
    const allRestSources = [
      restAppDataRes,
      restExamsRes1,
      restExamsRes2,
      restCalEventsRes1,
      restCalEventsRes2
    ];

    allRestSources.forEach(resObj => {
      if (!resObj) return;
      const payload = resObj.data || resObj;
      const candidates = [];
      if (Array.isArray(payload)) candidates.push(...payload);
      if (Array.isArray(payload.exams)) candidates.push(...payload.exams);
      if (Array.isArray(payload.calendarEvents)) candidates.push(...payload.calendarEvents);
      if (Array.isArray(payload.events)) candidates.push(...payload.events);
      if (Array.isArray(payload.classregEvents)) candidates.push(...payload.classregEvents);
      if (Array.isArray(payload.items)) candidates.push(...payload.items);

      candidates.forEach((ev, idx) => {
        if (!ev) return;
        const rawDate = ev.date || ev.examDate || ev.startDate || ev.start;
        if (!rawDate) return;
        const isoDate = normalizeToIsoDate(rawDate);
        if (!isoDate) return;

        const dateNum = parseInt(isoDate.replace(/-/g, ''));
        if (dateNum < syRange.startDateNum || dateNum > syRange.endDateNum) return;

        let title = ev.name || ev.subject || ev.title || ev.reason || ev.text || ev.topic || 'Termin';
        if (typeof title === 'object' && title) title = title.name || title.longName || 'Termin';

        let desc = [ev.description, ev.text, ev.reason, ev.name, ev.topic].filter(t => typeof t === 'string' && t.trim() && t !== title).join(' - ');

        let teach = ev.teacher || 'Fachlehrkraft';
        if (typeof teach === 'object' && teach) teach = teach.name || teach.longName || 'Fachlehrkraft';
        let rm = ev.room || 'Raum laut Plan';
        if (typeof rm === 'object' && rm) rm = rm.name || rm.longName || 'Raum laut Plan';
        if (isValidRoomCandidate(rm)) rm = formatRoomDisplay(rm, teach);

        const fullEvText = `${title} ${desc} ${ev.type || ''} ${ev.category || ''}`.toLowerCase();
        const isExam = ev.type === 'exam' || ev.isExam === true ||
          /\b(klausur|klausuren|klausurblock|klausurtag|klausurtage|klassenarbeit|klassenarbeiten|prüfung|pruefung|prüfungen|pruefungen|arbeit|arbeiten|test|tests|leistungsnachweis|nachschreib|nachschreiber|abschlussprüfung|abschlusspruefung|zentrale\s+prüfung|zentrale\s+pruefung|zk|zap|zp\s*10|facharbeit|ka\b)/i.test(fullEvText);

        if (isExam) {
          let cleanSubj = String(title);
          if (!/\b(klausur|klassenarbeit|arbeit|test|prüfung)\b/i.test(cleanSubj)) {
            cleanSubj = `${cleanSubj} (Klassenarbeit)`;
          }
          addUniqueExam({
            id: `untis-rest-${ev.id || isoDate + '-' + idx}`,
            subject: cleanSubj,
            date: isoDate,
            startTime: formatUntisTimeToStr(ev.startTime || ev.start || 745),
            endTime: formatUntisTimeToStr(ev.endTime || ev.end || 915),
            room: rm,
            teacher: String(teach),
            topic: desc || title || 'Klassenarbeit / Klausur laut WebUntis',
            type: 'exam',
            completed: false
          });
        } else {
          const key = `app_event_${isoDate}_${title.toLowerCase().trim()}`;
          if (!holidayKeySet.has(key)) {
            holidayKeySet.add(key);
            newHolidays.push({
              id: `untis-rest-evt-${ev.id || isoDate + '-' + idx}`,
              name: title,
              shortName: title,
              longName: desc ? `${title}: ${desc}` : title,
              startDate: isoDate,
              endDate: isoDate,
              startDateNum: dateNum,
              endDateNum: dateNum,
              timeStr: `${formatUntisTimeToStr(ev.startTime || 745)} - ${formatUntisTimeToStr(ev.endTime || 915)} Uhr`,
              type: 'appointment'
            });
          }
        }
      });
    });

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

    // Prüfungen aus Terminen & Feiertagen ergänzen
    newHolidays.forEach(h => {
      if (h.type === 'exam') {
        addUniqueExam({
          id: `untis-exam-hol-${h.id}`,
          subject: h.name || 'Prüfung',
          date: h.startDate,
          startTime: '08:00',
          endTime: '13:00',
          room: 'Laut Schulaushang',
          teacher: 'Prüfungskommission',
          topic: h.longName || h.name || 'Prüfung / Klausurtag',
          type: 'exam',
          completed: false
        });
      }
    });

    // Es werden AUSSCHLIESSLICH echte WebUntis-Prüfungen gespeichert (keine synthetischen Standarddaten!)
    if (newExams.length > 0 || !appData.exams || appData.exams.length === 0) {
      appData.exams = newExams;
    } else {
      newExams.forEach(ne => {
        if (!appData.exams.some(ex => ex.id === ne.id || (ex.date === ne.date && ex.startTime === ne.startTime && ex.subject === ne.subject))) {
          appData.exams.push(ne);
        }
      });
    }

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
        if (!res) return;
        const resObj = res.result || res;
        if (!resObj) return;

        // Lessons-Lookup Map aufbauen
        const lessonsMap = {};
        if (resObj.lessonsById && typeof resObj.lessonsById === 'object') {
          Object.keys(resObj.lessonsById).forEach(lId => {
            lessonsMap[lId] = resObj.lessonsById[lId];
          });
        }
        if (resObj.lessons && Array.isArray(resObj.lessons)) {
          resObj.lessons.forEach(l => {
            if (l && l.id !== undefined) lessonsMap[l.id] = l;
          });
        }

        // homeWorks (Großes W!), homeworks, records, data, oder direkt Array
        const rawList = Array.isArray(resObj)
          ? resObj
          : (resObj.homeWorks || resObj.homeworks || resObj.records || resObj.data || []);

        if (!Array.isArray(rawList)) return;

        rawList.forEach((hw, idx) => {
          if (!hw) return;
          // In WebUntis Mobile ist endDate das Fälligkeitsdatum!
          const rawDate = hw.endDate || hw.dueDate || hw.date || hw.lessonDate || hw.startDate;
          let dueStr = '';
          if (rawDate) {
            dueStr = normalizeToIsoDate(rawDate);
          }

          const lInfo = hw.lessonId ? lessonsMap[hw.lessonId] : null;
          let subj = '';
          if (lInfo) {
            const sId = lInfo.subjectId || lInfo.subject;
            if (sId && subjectsMap[sId]) subj = subjectsMap[sId];
            else if (typeof sId === 'string') subj = sId;
            else if (sId && typeof sId === 'object') subj = sId.name || sId.longName || '';
          }
          if (!subj && hw.subject) {
            if (subjectsMap[hw.subject]) subj = subjectsMap[hw.subject];
            else if (typeof hw.subject === 'string') subj = hw.subject;
            else if (typeof hw.subject === 'object') subj = hw.subject.name || hw.subject.longName || '';
          }
          if (!subj && hw.subjectId && subjectsMap[hw.subjectId]) {
            subj = subjectsMap[hw.subjectId];
          }
          if (!subj && hw.lesson && hw.lesson.subject) {
            subj = typeof hw.lesson.subject === 'object' ? (hw.lesson.subject.name || hw.lesson.subject.longName || '') : hw.lesson.subject;
          }
          if (!subj) subj = 'Hausaufgabe';

          let teach = '';
          if (lInfo) {
            const tIds = lInfo.teacherIds || (lInfo.teacherId ? [lInfo.teacherId] : null) || (lInfo.teacher ? [lInfo.teacher] : null);
            if (Array.isArray(tIds) && tIds.length > 0) {
              const firstT = tIds[0];
              if (teachersMap[firstT]) teach = teachersMap[firstT];
              else if (typeof firstT === 'string') teach = firstT;
            }
          }
          if (!teach && hw.teacher) {
            if (teachersMap[hw.teacher]) teach = teachersMap[hw.teacher];
            else if (typeof hw.teacher === 'string') teach = hw.teacher;
            else if (typeof hw.teacher === 'object') teach = hw.teacher.name || hw.teacher.longName || '';
          }
          if (!teach && hw.teacherId && teachersMap[hw.teacherId]) {
            teach = teachersMap[hw.teacherId];
          }
          if (!teach && hw.lesson && hw.lesson.teacher) {
            teach = typeof hw.lesson.teacher === 'object' ? (hw.lesson.teacher.name || hw.lesson.teacher.longName || '') : hw.lesson.teacher;
          }
          if (!teach) teach = 'Fachlehrkraft';

          const textContent = hw.text || hw.remark || hw.description || hw.content || hw.title || hw.note || '';
          if (!textContent) return;

          const hwId = String(hw.id || `hw-${idx}-${dueStr}`);
          const isComp = !!(preservedCompletedMap[hwId] || hw.completed === true);

          addUniqueHomework({
            id: hwId,
            subject: String(subj),
            teacher: String(teach),
            dueDate: dueStr || 'Ohne Frist',
            text: String(textContent).trim(),
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
      restAppDataRes && restAppDataRes.data ? restAppDataRes.data.homeWorks : null,
      restAppDataRes && restAppDataRes.data ? restAppDataRes.data.tasks : null
    ];

    allRestHwLists.forEach(restRes => {
      if (!restRes) return;
      const rawList = Array.isArray(restRes) ? restRes : (restRes.data || restRes.homeWorks || restRes.homeworks || restRes.records || []);
      if (Array.isArray(rawList)) {
        rawList.forEach((hw, idx) => {
          if (!hw) return;
          const rawDate = hw.endDate || hw.dueDate || hw.date || hw.lessonDate || hw.startDate;
          let dueStr = '';
          if (rawDate) {
            dueStr = normalizeToIsoDate(rawDate);
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
            text: String(hwText).trim(),
            description: String(hwText).trim(),
            completed: isComp
          });
        });
      }
    });

    // C. Untis Mobile REST calendar-entry/detail Hausaufgaben
    if (restCalDetailResults && Array.isArray(restCalDetailResults)) {
      restCalDetailResults.forEach((r, rIdx) => {
        if (!r || !r.calendarEntries || !Array.isArray(r.calendarEntries)) return;
        r.calendarEntries.forEach((entry, eIdx) => {
          if (!entry) return;
          const sRaw = entry.startDateTime || '';
          const eRaw = entry.endDateTime || '';
          const isoDate = normalizeToIsoDate(sRaw) || normalizeToIsoDate(eRaw);
          let subj = (entry.subject && (entry.subject.displayName || entry.subject.longName || entry.subject.name)) || 'Hausaufgabe';
          let teach = (entry.teachers && entry.teachers[0] && (entry.teachers[0].displayName || entry.teachers[0].longName || entry.teachers[0].name)) || 'Fachlehrkraft';

          if (entry.homeworks && Array.isArray(entry.homeworks)) {
            entry.homeworks.forEach((hw, hIdx) => {
              if (!hw) return;
              const hwText = hw.text || hw.remark || hw.description || hw.title || '';
              if (hwText) {
                const dueRaw = hw.dueDate || hw.endDate || hw.date || isoDate;
                const dueIso = normalizeToIsoDate(dueRaw) || isoDate || 'Ohne Frist';
                const hwId = String(hw.id || `cal-hw-${entry.id || eIdx}-${hIdx}-${dueIso}`);
                const isComp = !!(preservedCompletedMap[hwId] || hw.completed === true);
                addUniqueHomework({
                  id: hwId,
                  subject: String(subj),
                  teacher: String(teach),
                  dueDate: dueIso,
                  text: String(hwText).trim(),
                  completed: isComp
                });
              }
            });
          }
        });
      });
    }

    // D. Hausaufgaben aus dem Stundenplan & Klassenbuch hinzufügen
    timetableHomeworks.forEach(addUniqueHomework);

    if (newHomework.length > 0 || !appData.homework || appData.homework.length === 0) {
      appData.homework = newHomework;
    } else {
      newHomework.forEach(nh => {
        if (!appData.homework.some(h => h.id === nh.id || (h.dueDate === nh.dueDate && h.text === nh.text))) {
          appData.homework.push(nh);
        }
      });
    }

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

    // Untis Mobile REST calendar-entry/detail Lehrstoff hinzufügen
    if (restCalDetailResults && Array.isArray(restCalDetailResults)) {
      restCalDetailResults.forEach((r, rIdx) => {
        if (!r || !r.calendarEntries || !Array.isArray(r.calendarEntries)) return;
        r.calendarEntries.forEach((entry, eIdx) => {
          if (!entry || !entry.teachingContent) return;
          const sRaw = entry.startDateTime || '';
          const isoDate = normalizeToIsoDate(sRaw);
          if (!isoDate) return;
          const sMatch = String(sRaw).match(/T(\d{2}:\d{2})/);
          const sTimeStr = sMatch ? (sMatch[1] + ' Uhr') : '1. Std.';
          let subj = (entry.subject && (entry.subject.displayName || entry.subject.longName || entry.subject.name)) || 'Unterricht';
          let teach = (entry.teachers && entry.teachers[0] && (entry.teachers[0].displayName || entry.teachers[0].longName || entry.teachers[0].name)) || 'Fachlehrkraft';

          addUniqueClassbook({
            id: `cal-detail-cb-${entry.id || eIdx}-${isoDate}`,
            date: isoDate,
            period: sTimeStr,
            subject: String(subj),
            teacher: String(teach),
            topic: String(entry.teachingContent).trim(),
            text: String(entry.teachingContent).trim()
          });
        });
      });
    }

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
      const iso = normalizeToIsoDate(ex.date);
      if (!iso) return;
      const dParts = iso.split('-');
      const dObj = new Date(parseInt(dParts[0]), parseInt(dParts[1]) - 1, parseInt(dParts[2]));
      let endObj = dObj;
      let timeDisplay = `${formatUntisTimeToStr(ex.startTime)} - ${formatUntisTimeToStr(ex.endTime)} Uhr`;
      if (ex.endDate && ex.endDate !== ex.date) {
        const eIso = normalizeToIsoDate(ex.endDate);
        if (eIso) {
          const eParts = eIso.split('-');
          endObj = new Date(parseInt(eParts[0]), parseInt(eParts[1]) - 1, parseInt(eParts[2]));
          timeDisplay = `Klausurzeitraum: Vom ${formatGermanDate(dObj)} bis ${formatGermanDate(endObj)}`;
        }
      }
      allEvents.push({
        id: ex.id,
        type: 'exam',
        title: ex.subject,
        subTitle: ex.topic || 'Klausur laut WebUntis',
        dateStr: iso,
        endDateStr: ex.endDate || iso,
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
      const sIso = normalizeToIsoDate(h.startDate);
      const eIso = normalizeToIsoDate(h.endDate) || sIso;
      if (!sIso) return;
      const sParts = sIso.split('-');
      const eParts = eIso.split('-');
      const sObj = new Date(parseInt(sParts[0]), parseInt(sParts[1]) - 1, parseInt(sParts[2]));
      const eObj = new Date(parseInt(eParts[0]), parseInt(eParts[1]) - 1, parseInt(eParts[2]));
      allEvents.push({
        id: h.id,
        type: h.type || 'holiday',
        title: h.name,
        subTitle: h.longName || h.name,
        dateStr: sIso,
        endDateStr: eIso,
        dateObj: sObj,
        endDateObj: eObj,
        timeStr: (sIso === eIso) ? (h.timeStr || 'Ganztägig (Schulfrei)') : `Vom ${formatGermanDate(sObj)} bis ${formatGermanDate(eObj)}`,
        room: h.type === 'appointment' ? (h.room || 'LWL-Berufskolleg Soest') : 'Schulfrei',
        teacher: 'LWL-Berufskolleg Soest',
        isHoliday: (h.type !== 'exam')
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

  // Wenn keine offenen Aufgaben vorliegen, aber bereits erledigte existieren
  if (items.length === 0 && filter === 'pending' && allHw.length > 0) {
    html += `
      <div class="status-box" style="padding: 24px; text-align: center; margin-bottom: 20px;">
        <span class="emoji-icon" style="font-size: 36px;" aria-hidden="true">🎉</span>
        <p style="font-size: var(--font-size-lg); font-weight: bold; margin-top: 8px;">Keine offenen Hausaufgaben</p>
        <p class="field-hint">Alle anstehenden Hausaufgaben sind als erledigt markiert! Du hast insgesamt ${allHw.length} Aufgabe(n) in WebUntis.</p>
        <button type="button" class="btn btn-secondary" style="margin-top: 12px;" onclick="setHomeworkFilter('all')">
          Alle Hausaufgaben anzeigen (${allHw.length})
        </button>
      </div>`;
  }

  // Hausaufgaben
  if (items.length > 0) {
    // Offene Aufgaben vor erledigte Aufgaben sortieren
    items.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (a.dueDate && b.dueDate && a.dueDate !== 'Ohne Frist' && b.dueDate !== 'Ohne Frist') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

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
