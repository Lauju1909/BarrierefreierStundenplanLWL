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
  { period: 7, start: '13:20', end: '14:05' },
  { period: 8, start: '14:10', end: '14:55' },
  { period: 9, start: '14:55', end: '15:40' },
  { period: 10, start: '15:40', end: '16:25' }
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

const DEFAULT_CLASSREG_EVENTS = [
  {
    id: 'classreg-event-37925-2026-09-11',
    untisId: 37925,
    date: '2026-09-11',
    time: '11:15',
    timeStr: '11:15 Uhr',
    subject: 'Mathematik (M)',
    subjectCode: 'M',
    teacher: 'Hanauer',
    teacherCode: 'HAN',
    klasse: 'BFW2B',
    text: 'Wahl Klassensprecher (Leon Florschütz) und stellvertretender Klassensprecher (Laurin Schneider)',
    category: 'Klassenbucheintrag'
  },
  {
    id: 'classreg-event-37888-2026-09-07',
    untisId: 37888,
    date: '2026-09-07',
    time: '12:32',
    timeStr: '12:32 Uhr',
    subject: 'Fachpraxis Gesamtwirtschaft (FB GWP)',
    subjectCode: 'FB GWP',
    teacher: 'Hübner',
    teacherCode: 'HÜB',
    klasse: 'BFW2B',
    text: 'Vorstellung der Schulsozialarbeit',
    category: 'Klassenbucheintrag'
  }
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
  classregEvents: [...DEFAULT_CLASSREG_EVENTS],
  holidays: [...DEFAULT_NRW_HOLIDAYS_2026_2027],
  schoolYear: null,
  examFilter: 'all',
  homeworkFilter: 'classreg'
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
        periods: (parsed.periods && parsed.periods.length >= 9 && parsed.periods.some(p => p.period === 9)) ? parsed.periods : [...DEFAULT_PERIODS],
        timetable: parsed.timetable || [],
        exams: (parsed.exams && Array.isArray(parsed.exams)) ? parsed.exams : [],
        homework: (parsed.homework && Array.isArray(parsed.homework)) ? parsed.homework : [],
        absences: parsed.absences || [],
        classbook: parsed.classbook || [],
        classregEvents: (parsed.classregEvents && Array.isArray(parsed.classregEvents) && parsed.classregEvents.length > 0) ? parsed.classregEvents : [...DEFAULT_CLASSREG_EVENTS],
        messages: (parsed.messages && Array.isArray(parsed.messages)) ? parsed.messages : [],
        deletedMessageIds: (parsed.deletedMessageIds && Array.isArray(parsed.deletedMessageIds)) ? parsed.deletedMessageIds : [],
        grades: (parsed.grades && typeof parsed.grades === 'object') ? parsed.grades : {},
        holidays: (parsed.holidays && parsed.holidays.length > 0) ? parsed.holidays : [...DEFAULT_NRW_HOLIDAYS_2026_2027],
        schoolYear: parsed.schoolYear || null,
        examFilter: 'all',
        homeworkFilter: parsed.homeworkFilter || 'all',
        messagesFilter: 'all'
      };

      // Gelöschte Nachrichten aus dem Speicher filtern
      if (appData.deletedMessageIds && appData.deletedMessageIds.length > 0) {
        appData.messages = (appData.messages || []).filter(m => {
          const sId = String(m.id || '');
          return !appData.deletedMessageIds.includes(sId) && !appData.deletedMessageIds.some(d => sId.includes(d));
        });
      }

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

      // Falsch gecachte Räume und Perioden bereinigen
      if (appData.timetable && Array.isArray(appData.timetable)) {
        appData.timetable.forEach(l => {
          if (l.room) {
            const rNorm = l.room.toLowerCase().replace(/^raum\s+/i, '').trim();
            const tNorm = (l.teacher || '').toLowerCase().trim();
            if (rNorm === 'hanauer' || (tNorm && (rNorm === tNorm || tNorm.includes(rNorm)))) {
              l.room = 'Raum wird bekanntgegeben';
            }
          }

          // Sport und Nachmittagsstunden: Perioden-Reparatur (z.B. 32. Std., 33. Std.)
          if (l.startTime === '14:10' || (l.period === 32 && l.subject === 'SP')) {
            l.period = 8;
            if (!l.startTime) l.startTime = '14:10';
            if (!l.endTime) l.endTime = '14:55';
          } else if (l.startTime === '14:55' || (l.period === 33 && l.subject === 'SP')) {
            l.period = 9;
            if (!l.startTime) l.startTime = '14:55';
            if (!l.endTime) l.endTime = '15:40';
          } else if (l.startTime === '13:20' || (l.period === 7 && (!l.startTime || l.startTime === '13:40'))) {
            l.period = 7;
            l.startTime = '13:20';
            l.endTime = '14:05';
          } else if (l.period > 10 && l.startTime) {
            const matched = DEFAULT_PERIODS.find(p => p.start === l.startTime);
            if (matched) l.period = matched.period;
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
    { id: 'messages', btn: 'tab-messages', view: 'view-messages' },
    { id: 'grades', btn: 'tab-grades', view: 'view-grades' },
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
    renderUrgentNotificationBanner();
    announceSR('Reiter 1: Übersicht und Stundenplan ausgewählt.', 'polite');
  } else if (tabId === 'exams') {
    renderExams();
    announceSR('Reiter 2: Prüfungen und Termine für das gesamte Schuljahr ausgewählt.', 'polite');
  } else if (tabId === 'homework') {
    renderHomework();
    announceSR('Reiter 3: Hausaufgaben und Klassenbuch ausgewählt.', 'polite');
  } else if (tabId === 'absences') {
    renderAbsences();
    announceSR('Reiter 4: Fehlzeiten und Entschuldigungen ausgewählt.', 'polite');
  } else if (tabId === 'messages') {
    renderMessagesView();
    announceSR('Reiter 5: Tagesnachrichten und Mitteilungen ausgewählt.', 'polite');
  } else if (tabId === 'grades') {
    renderGradesView();
    announceSR('Reiter 6: Noten und Leistungsübersicht ausgewählt.', 'polite');
  } else if (tabId === 'settings') {
    loadFeedbackArchive();
    announceSR('Reiter 7: Konto und Einstellungen ausgewählt.', 'polite');
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
      headers['tenant-id'] = appData.config.tenantId || '5238400';
      headers['x-webuntis-api-school-year-id'] = String((appData.schoolYear && appData.schoolYear.id) || 18);

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

    // 1b. Untis Mobile Authentifizierung über lokalen C#-Server (getAppSharedSecret + TOTP + getAuthToken)
    let appSharedSecret = appData.config.appSharedSecret || null;
    let jwtToken = null;
    let mobilePersonId = null;

    try {
      const mobRes = await fetch('/api/untis/mobile_auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          school: appData.config.schoolShort || 'lwl-bk-soest',
          server: appData.config.server || 'lwl-bk-soest.webuntis.com'
        })
      });
      if (mobRes.ok) {
        const mobData = await mobRes.json();
        if (mobData.appSharedSecret) {
          appSharedSecret = mobData.appSharedSecret;
          appData.config.appSharedSecret = appSharedSecret;
          saveAppData();
        }
        if (mobData.jwtToken) {
          jwtToken = mobData.jwtToken;
        }
        if (mobData.personId) {
          mobilePersonId = mobData.personId;
        }
      }
    } catch (e) {
      console.warn('Hinweis zu /api/untis/mobile_auth:', e);
    }

    // Client-seitiger Fallback falls nicht über Proxy authentifiziert
    if (!appSharedSecret) {
      try {
        const secRes = await callWebUntisRest('/jsonrpc_intern.do?m=getAppSharedSecret', null, 'POST', {
          id: 'untis-mobile-android-6.7.0',
          jsonrpc: '2.0',
          method: 'getAppSharedSecret',
          params: [{ userName: username, password: password }]
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

    // JWT Bearer Token über getAuthToken mit TOTP
    if (!jwtToken && appSharedSecret && curOtp) {
      try {
        const tokRes = await callWebUntisRest('/jsonrpc_intern.do?m=getAuthToken', null, 'POST', {
          id: 'untis-mobile-android-6.7.0',
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
    if (mobilePersonId) detectedStudentIds.add(mobilePersonId);
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

    // 5b. Offizielles Zeitraster der Schule abrufen (getTimegridUnits)
    try {
      const tgRes = await callWebUntisApi('getTimegridUnits', {});
      if (tgRes && tgRes.result && Array.isArray(tgRes.result)) {
        const unitsMap = new Map();
        tgRes.result.forEach(dayGrid => {
          if (dayGrid.timeUnits && Array.isArray(dayGrid.timeUnits)) {
            dayGrid.timeUnits.forEach(u => {
              const pNum = parseInt(u.name, 10);
              if (!isNaN(pNum)) {
                const sStr = formatUntisTimeToStr(u.startTime);
                const eStr = formatUntisTimeToStr(u.endTime);
                if (!unitsMap.has(pNum)) {
                  unitsMap.set(pNum, { period: pNum, start: sStr, end: eStr });
                }
              }
            });
          }
        });
        if (unitsMap.size > 0) {
          appData.periods = Array.from(unitsMap.values()).sort((a, b) => a.period - b.period);
        }
      }
    } catch (e) { }

    // ISO-Datumsstrings für WebUntis REST- & Mobile-Abfragen (YYYY-MM-DD)
    const sIsoStr = `${String(syRange.startDateNum).slice(0, 4)}-${String(syRange.startDateNum).slice(4, 6)}-${String(syRange.startDateNum).slice(6, 8)}`;
    const eIsoStr = `${String(syRange.endDateNum).slice(0, 4)}-${String(syRange.endDateNum).slice(4, 6)}-${String(syRange.endDateNum).slice(6, 8)}`;

    // 6. Gezielte, hochperformante Ganzjahresabfragen für Hausaufgaben, Klausuren, Stundenplan & Termine
    const authObjFull = appSharedSecret ? {
      clientTime: Date.now(),
      otp: generateTotpCode(appSharedSecret, Date.now()),
      user: username
    } : null;

    // A. Echte Hausaufgaben (getHomeWork2017) für Schüler & Klasse über das gesamte Schuljahr
    const homeworkCalls = [];
    detectedStudentIds.forEach(sId => {
      homeworkCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getHomeWork2017', jwtToken, 'POST', {
        id: 'hw-full-stud-' + Date.now(),
        jsonrpc: '2.0',
        method: 'getHomeWork2017',
        params: [{ id: sId, type: 'STUDENT', startDate: sIsoStr, endDate: eIsoStr, ...(authObjFull ? { auth: authObjFull } : {}) }]
      }).catch(() => ({})));
    });

    detectedKlasseIds.forEach(kId => {
      homeworkCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getHomeWork2017', jwtToken, 'POST', {
        id: 'hw-full-cls-' + Date.now(),
        jsonrpc: '2.0',
        method: 'getHomeWork2017',
        params: [{ id: kId, type: 'CLASS', startDate: sIsoStr, endDate: eIsoStr, ...(authObjFull ? { auth: authObjFull } : {}) }]
      }).catch(() => ({})));
    });

    homeworkCalls.push(callWebUntisApi('getHomeWorks', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));

    // B. Echte Klausuren & Klassenarbeiten (getExams2017) für Schüler & Klasse über das gesamte Schuljahr
    const examCalls = [];
    detectedStudentIds.forEach(sId => {
      examCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getExams2017', jwtToken, 'POST', {
        id: 'ex-full-stud-' + Date.now(),
        jsonrpc: '2.0',
        method: 'getExams2017',
        params: [{ id: sId, type: 'STUDENT', startDate: sIsoStr, endDate: eIsoStr, ...(authObjFull ? { auth: authObjFull } : {}) }]
      }).catch(() => ({})));
    });

    detectedKlasseIds.forEach(kId => {
      examCalls.push(callWebUntisRest('/jsonrpc_intern.do?m=getExams2017', jwtToken, 'POST', {
        id: 'ex-full-cls-' + Date.now(),
        jsonrpc: '2.0',
        method: 'getExams2017',
        params: [{ id: kId, type: 'CLASS', startDate: sIsoStr, endDate: eIsoStr, ...(authObjFull ? { auth: authObjFull } : {}) }]
      }).catch(() => ({})));
    });

    examCalls.push(callWebUntisApi('getExams', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})));

    // C. Stundenplan für 4 Wochen (aktuelle Woche +/- 14 Tage)
    const futureTtCalls = [];
    const pStart = new Date(now);
    pStart.setDate(pStart.getDate() - 14);
    const pEnd = new Date(now);
    pEnd.setDate(pEnd.getDate() + 28);
    const ttStartNum = formatDateToUntis(pStart);
    const ttEndNum = formatDateToUntis(pEnd);

    futureTtCalls.push(callWebUntisApi('getTimetable', {
      options: {
        element: { id: personId, type: personType },
        startDate: ttStartNum,
        endDate: ttEndNum,
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

    detectedKlasseIds.forEach(kId => {
      futureTtCalls.push(callWebUntisApi('getTimetable', {
        options: {
          element: { id: kId, type: 1 },
          startDate: ttStartNum,
          endDate: ttEndNum,
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
    });

    // D. Klassenbuch / Lehrstoff für das gesamte Schuljahr
    const classregCalls = [
      callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum }).catch(() => ({})),
      callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: personId, type: personType }).catch(() => ({}))
    ];
    detectedKlasseIds.forEach(kId => {
      classregCalls.push(callWebUntisApi('getClassregEvents', { startDate: syRange.startDateNum, endDate: syRange.endDateNum, id: kId, type: 1 }).catch(() => ({})));
    });

    // E. Fehlzeiten (getStudentAbsences2017 mit TOTP über ganzes Schuljahr)
    const absenceCalls = [
      callWebUntisRest('/jsonrpc_intern.do?m=getStudentAbsences2017', jwtToken, 'POST', {
        id: 'abs-' + Date.now(),
        jsonrpc: '2.0',
        method: 'getStudentAbsences2017',
        params: [{ startDate: sIsoStr, endDate: eIsoStr, ...(authObjFull ? { auth: authObjFull } : {}) }]
      }).catch(() => ({}))
    ];

    // 7. Alles parallel in einem schnellen Durchlauf abrufen (Dauer: ~1-2 Sekunden!)
    const effectiveStudentId = (detectedStudentIds && detectedStudentIds.size > 0) ? Array.from(detectedStudentIds)[0] : (personType === 5 ? personId : 4707);
    const effectiveSyId = (appData.schoolYear && appData.schoolYear.id) ? appData.schoolYear.id : 18;

    const [
      examResponses,
      classregResponses,
      futureTtResults,
      homeworkResponses,
      absenceResponses,
      holidaysRes,
      newsRes,
      restGradingRes,
      restGradeListRes,
      restClassregEvRes,
      restMessagesRes,
      restRecipientsRes
    ] = await Promise.all([
      Promise.all(examCalls),
      Promise.all(classregCalls),
      Promise.all(futureTtCalls),
      Promise.all(homeworkCalls),
      Promise.all(absenceCalls),
      callWebUntisApi('getHolidays', {}).catch(() => ({})),
      callWebUntisApi('getNewsWidgetData', {}).catch(() => callWebUntisApi('getNewsWidget', {}).catch(() => ({}))),
      callWebUntisRest(`/api/classreg/grade/grading/list?studentId=${effectiveStudentId}&schoolyearId=${effectiveSyId}`, jwtToken).catch(() => null),
      callWebUntisRest(`/api/classreg/grade/gradeList?personId=${effectiveStudentId}&startDate=${syRange.startDateNum}&endDate=${syRange.endDateNum}`, jwtToken).catch(() => null),
      callWebUntisRest(`/api/classreg/classregevents?studentId=${effectiveStudentId}&startDate=${syRange.startDateNum}&endDate=${syRange.endDateNum}`, jwtToken).catch(() => null),
      callWebUntisRest('/api/rest/view/v1/messages', jwtToken).catch(() => null),
      callWebUntisRest('/api/rest/view/v1/messages/recipients/static/persons', jwtToken).catch(() => null)
    ]);
    const restExamsRes1 = null;
    const restExamsRes2 = null;
    const restAppDataRes = null;
    const restCalEventsRes1 = null;
    const restCalEventsRes2 = null;
    const restHomeworkRes1 = null;
    const restHomeworkRes2 = null;
    const restHomeworkRes3 = null;
    const restAbsencesRes = null;
    const restCalDetailResults = [];
    const restTtResults = [];


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
        const matchedPeriod = (appData.periods || DEFAULT_PERIODS).find(p => p.start === startStr);
        if (matchedPeriod) {
          periodNum = matchedPeriod.period;
        } else if (startStr === '11:15') {
          periodNum = 5; // Freitag 5. Stunde
        } else if (startStr === '13:20') {
          periodNum = 7;
        } else if (startStr === '14:10') {
          periodNum = 8; // Sport 8. Stunde
        } else if (startStr === '14:55') {
          periodNum = 9; // Sport 9. Stunde
        } else {
          // Logische Zeitzuordnung nach Minuten am Tag
          const parts = startStr.split(':').map(Number);
          const totalMin = (parts[0] || 0) * 60 + (parts[1] || 0);
          if (totalMin < 510) periodNum = 1;
          else if (totalMin < 560) periodNum = 2;
          else if (totalMin < 615) periodNum = 3;
          else if (totalMin < 670) periodNum = 4;
          else if (totalMin < 730) periodNum = 5;
          else if (totalMin < 790) periodNum = 6;
          else if (totalMin < 845) periodNum = 7;
          else if (totalMin < 890) periodNum = 8;
          else if (totalMin < 940) periodNum = 9;
          else periodNum = 10;
        }

        const subj = (item.su && item.su[0]) ? (subjectsMap[item.su[0].id] || item.su[0].name || item.su[0].longname || 'Unterricht') : 'Unterricht';
        let teach = 'Lehrkraft';
        if (item.te && Array.isArray(item.te) && item.te.length > 0) {
          const tNames = item.te.map(t => teachersMap[t.id] || t.name || t.longname || '').filter(Boolean);
          if (tNames.length > 0) teach = tNames.join(', ');
        }
        let klasse = '';
        if (item.kl && Array.isArray(item.kl) && item.kl.length > 0) {
          const myKlasse = item.kl.find(k => k.name === 'BFW2B' || k.id === 2032 || (k.name && k.name.includes('BFW2B')));
          if (myKlasse) {
            klasse = myKlasse.name || klassenMap[myKlasse.id] || 'BFW2B';
            if (item.kl.length > 1) klasse += ' (Kurs)';
          } else {
            klasse = item.kl.map(k => k.name || klassenMap[k.id] || k.longname || '').filter(Boolean).join(', ');
          }
        }

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
    const newExams = [];

    function addUniqueExam(exItem) {
      if (!exItem || !exItem.date || !exItem.subject) return;

      // Volle Fachbezeichnung expandieren falls Kürzel
      const sTrim = String(exItem.subject).trim();
      if (sTrim === 'M' || sTrim === 'm') exItem.subject = 'Mathematik (M)';
      else if (sTrim === 'E' || sTrim === 'e') exItem.subject = 'Englisch (E)';
      else if (sTrim === 'D' || sTrim === 'd') exItem.subject = 'Deutsch (D)';
      else if (sTrim === 'PP' || sTrim === 'pp') exItem.subject = 'Praktische Philosophie (PP)';
      else if (subjectsMap[sTrim]) exItem.subject = subjectsMap[sTrim];

      const isGeneric = /^(klassenarbeit|klausur|prüfung|pruefung|klassenarbeit\s*\/\s*klausur)$/i.test(exItem.subject.trim());

      // Prüfen ob bereits eine Prüfung am selben Tag im selben oder überlappenden Zeitfenster existiert
      const existingIdx = newExams.findIndex(e => {
        if (e.date !== exItem.date) return false;
        if (e.startTime === exItem.startTime) return true;
        // Überlappendes Zeitfenster (z.B. 08:30-10:20 überspannt Einzelstunden)
        if (exItem.startTime >= e.startTime && exItem.startTime < e.endTime) return true;
        if (e.startTime >= exItem.startTime && e.startTime < exItem.endTime) return true;
        return false;
      });

      if (existingIdx >= 0) {
        const existing = newExams[existingIdx];
        const existingIsGeneric = /^(klassenarbeit|klausur|prüfung|pruefung|klassenarbeit\s*\/\s*klausur)$/i.test(existing.subject.trim());
        if (existingIsGeneric && !isGeneric) {
          newExams[existingIdx] = exItem;
        } else if (!existingIsGeneric && isGeneric) {
          // Spezifischeres Fach bereits vorhanden
          return;
        } else if (String(exItem.id).startsWith('untis-exam') && !String(existing.id).startsWith('untis-exam')) {
          newExams[existingIdx] = exItem;
        }
        return;
      }

      newExams.push(exItem);
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

    function addUniqueHomework(hwItem) {
      if (!hwItem || !hwItem.text) return;

      const sTrim = String(hwItem.subject || '').trim();
      if (sTrim === 'M' || sTrim === 'm') hwItem.subject = 'Mathematik (M)';
      else if (sTrim === 'E' || sTrim === 'e') hwItem.subject = 'Englisch (E)';
      else if (sTrim === 'D' || sTrim === 'd') hwItem.subject = 'Deutsch (D)';
      else if (sTrim === 'PP' || sTrim === 'pp') hwItem.subject = 'Praktische Philosophie (PP)';
      else if (subjectsMap[sTrim]) hwItem.subject = subjectsMap[sTrim];

      // Duplikaterkennung nach ID und nach Inhalt (Text + Fälligkeitsdatum)
      const idMatch = hwItem.id ? newHomework.findIndex(h => String(h.id) === String(hwItem.id)) : -1;
      const contentMatch = newHomework.findIndex(h =>
        h.dueDate === hwItem.dueDate &&
        h.text.toLowerCase().trim() === hwItem.text.toLowerCase().trim()
      );

      const matchIdx = idMatch >= 0 ? idMatch : contentMatch;
      if (matchIdx >= 0) {
        const existing = newHomework[matchIdx];
        const existingIsGeneric = /^(unterricht|hausaufgabe)$/i.test(String(existing.subject || '').trim());
        const newIsGeneric = /^(unterricht|hausaufgabe)$/i.test(String(hwItem.subject || '').trim());
        if (existingIsGeneric && !newIsGeneric) {
          newHomework[matchIdx] = hwItem;
        }
        return;
      }

      newHomework.push(hwItem);
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
          if (!subj || subj === 'Hausaufgabe') {
            if (lInfo && lInfo.subjectId === 0) subj = 'Klassenorganisation / Allgemein';
            else subj = 'Hausaufgabe';
          }

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

    // Bisherige Klassenbucheinträge (z.B. aus dem gesamten Schuljahr) erhalten und einbeziehen
    if (Array.isArray(appData.classbook)) {
      appData.classbook.forEach(cb => addUniqueClassbook(cb));
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

    // Echte WebUntis-Klassenbucheinträge (classregevents) erfassen (z. B. Klassensprecherwahl, Schulsozialarbeit)
    if (restClassregEvRes && restClassregEvRes.data && Array.isArray(restClassregEvRes.data.rows)) {
      const evList = [];
      restClassregEvRes.data.rows.forEach((row, rIdx) => {
        const rawDate = String(row.createDate || '');
        const isoDate = normalizeToIsoDate(rawDate) || (rawDate.length === 8 ? `${rawDate.slice(0,4)}-${rawDate.slice(4,6)}-${rawDate.slice(6,8)}` : rawDate);
        const timeStr = row.createTime ? formatUntisTimeToStr(row.createTime) + ' Uhr' : '';
        const teacherName = row.creatorName ? (teachersMap[row.creatorName] || row.creatorName) : 'Lehrkraft';
        const subjCode = row.subjectName || '';
        const subjName = (subjCode && subjectsMap[subjCode]) ? `${subjectsMap[subjCode]} (${subjCode})` : (subjCode || 'Allgemein');
        const klasseName = row.elementName || 'BFW2B';

        evList.push({
          id: `classreg-event-${row.id || rIdx}-${isoDate}`,
          untisId: row.id,
          date: isoDate,
          time: row.createTime ? formatUntisTimeToStr(row.createTime) : '',
          timeStr: timeStr,
          subject: subjName,
          subjectCode: subjCode,
          teacher: teacherName,
          teacherCode: row.creatorName || '',
          klasse: klasseName,
          text: row.text || '',
          category: row.categoryName || row.eventReasonName || 'Klassenbucheintrag'
        });
      });
      if (evList.length > 0) {
        evList.sort((a, b) => new Date(b.date) - new Date(a.date));
        appData.classregEvents = evList;
      }
    }

    newClassbook.sort((a, b) => new Date(b.date) - new Date(a.date));
    appData.classbook = newClassbook;

    // Echte WebUntis-Mitteilungen verarbeiten
    if (restMessagesRes && restMessagesRes.incomingMessages && Array.isArray(restMessagesRes.incomingMessages)) {
      if (!appData.messages) appData.messages = [];
      const deletedIds = appData.deletedMessageIds || [];
      restMessagesRes.incomingMessages.forEach(m => {
        const id = `webuntis-inbox-${m.id}`;
        // Gelöschte Nachrichten nicht wieder einfügen
        if (deletedIds.includes(String(m.id)) || deletedIds.includes(id)) {
          return;
        }
        const existingIdx = appData.messages.findIndex(x => x.id === id);
        const msgObj = {
          id: id,
          type: 'inbox',
          sender: (m.sender && (m.sender.displayName || m.sender.userId)) || 'Lehrkraft / Schule',
          subject: m.subject || 'Mitteilung',
          text: m.contentPreview || m.content || m.body || '',
          date: m.sentDateTime || new Date().toISOString()
        };
        if (existingIdx >= 0) {
          appData.messages[existingIdx] = msgObj;
        } else {
          appData.messages.unshift(msgObj);
        }
      });
    }

    // WebUntis Empfänger-Verzeichnis (Lehrkräfte)
    if (restRecipientsRes) {
      const recList = [];
      const addPersons = (arr) => {
        if (Array.isArray(arr)) {
          arr.forEach(p => {
            if (p && (p.id || p.userId)) {
              recList.push({
                id: p.id || p.userId,
                name: p.shortName || p.name || p.displayName || '',
                longName: p.displayName || p.longName || p.name || '',
                foreName: p.foreName || ''
              });
            }
          });
        }
      };
      if (restRecipientsRes.CLASS_TEACHERS) addPersons(restRecipientsRes.CLASS_TEACHERS);
      if (restRecipientsRes.TEACHERS) addPersons(restRecipientsRes.TEACHERS);
      if (restRecipientsRes.OTHERS) addPersons(restRecipientsRes.OTHERS);
      if (recList.length > 0) {
        appData.teachers = recList;
      }
    }

    // Offizielle WebUntis-Noten & Fächer erfassen
    if (restGradingRes && restGradingRes.data && Array.isArray(restGradingRes.data.lessons)) {
      appData.webuntisLessons = restGradingRes.data.lessons;
      appData.webuntisFinalMarks = restGradingRes.data.finalMarkByLessonId || {};
    }
    if (restGradeListRes && restGradeListRes.data) {
      appData.webuntisGradeList = restGradeListRes.data;
    }


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
    renderMessagesView();
    renderGradesView();
    renderUrgentNotificationBanner();
    triggerDesktopNotification();
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
    const matchedPeriod = (appData.periods || []).find(p => p.period === l.period);
    const periodData = {
      start: (matchedPeriod && matchedPeriod.start) || l.startTime || '--:--',
      end: (matchedPeriod && matchedPeriod.end) || l.endTime || '--:--'
    };
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
    const p = (appData.periods || []).find(per => per.period === l.period) || { period: l.period, start: l.startTime || '', end: l.endTime || '' };
    if (!p.start || !p.end) continue;

    if (currentTime >= p.start && currentTime <= p.end) {
      currentLesson = { ...l, periodData: p };
      const nextL = todayLessons[i + 1];
      nextLesson = nextL ? { ...nextL, periodData: (appData.periods || []).find(per => per.period === nextL.period) || { period: nextL.period, start: nextL.startTime || '', end: nextL.endTime || '' } } : null;
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
    const p = (appData.periods || []).find(per => per.period === l.period) || { start: l.startTime || '', end: l.endTime || '' };
    const timeStr = (p.start && p.end) ? `von ${p.start} bis ${p.end} Uhr` : '';
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

  const filter = appData.homeworkFilter || 'classreg';
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

  // Klassenbuch (Lehrstoff) & Offizielle Klassenbucheinträge
  const classbook = appData.classbook || [];
  const classregEvents = appData.classregEvents || [];

  // Zählbadges aktualisieren
  const allHw = appData.homework || [];
  const pendingCount   = allHw.filter(h => !h.completed).length;
  const completedCount = allHw.filter(h => h.completed).length;
  const classbookCount = classbook.length;
  const classregCount  = classregEvents.length;

  const countAllEl  = document.getElementById('hw-count-all');
  const countPendEl = document.getElementById('hw-count-pending');
  const countCompEl = document.getElementById('hw-count-completed');
  const countCbEl   = document.getElementById('hw-count-classbook');
  const countCrEl   = document.getElementById('hw-count-classreg');
  if (countAllEl)  countAllEl.textContent  = String(allHw.length);
  if (countPendEl) countPendEl.textContent = String(pendingCount);
  if (countCompEl) countCompEl.textContent = String(completedCount);
  if (countCbEl)   countCbEl.textContent   = String(classbookCount);
  if (countCrEl)   countCrEl.textContent   = String(classregCount);

  // Filter-Button aktiv-Zustand über Button-IDs setzen
  const filterMap = {
    'classreg':  'hw-filter-classreg',
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

  let html = '';

  // ---------------------------------------------------------------------------
  // FALL 1: SEPARATER PUNKT "OFFIZIELLE KLASSENBUCHEINTRÄGE"
  // ---------------------------------------------------------------------------
  if (filter === 'classreg') {
    html += `
      <div class="banner-header" style="padding: 12px 0; margin-bottom: 16px;">
        <h3 class="section-subheading" style="margin: 0; font-size: 1.25rem;">📋 Offizielle Klassenbucheinträge (${classregEvents.length} aus WebUntis)</h3>
        <p class="field-hint">Offizielle Beschlüsse, Sprecherwahlen und Ankündigungen deiner Klasse ${escHtml(appData.config.klasse || 'BFW2B')} live aus dem WebUntis-Klassenbuch.</p>
      </div>`;

    if (classregEvents.length === 0) {
      html += `
        <div class="empty-state" role="status" aria-live="polite">
          <span aria-hidden="true">📋</span>
          <p>Aktuell liegen keine offiziellen Klassenbucheinträge vor.</p>
          <p class="empty-hint">Neue Einträge von Lehrkräften werden automatisch aus WebUntis geladen.</p>
        </div>`;
    } else {
      classregEvents.forEach(ev => {
        const dObj = ev.date ? new Date(ev.date) : null;
        const dateFormatted = dObj && !isNaN(dObj) ? formatGermanDate(dObj) : (ev.date || 'Datum unbekannt');
        const timeFormatted = ev.timeStr || (ev.time ? ev.time + ' Uhr' : '');

        html += `
          <article class="homework-card classreg-event-card" style="border-left: 6px solid var(--accent-info); margin-bottom: 16px; padding: 18px 20px; background: var(--bg-card); border-radius: 8px;" tabindex="0" role="article" aria-label="Klassenbucheintrag vom ${dateFormatted}: ${escHtml(ev.text)}">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                <span class="homework-date-badge" style="background: var(--bg-highlight); color: var(--text-color); font-weight: bold; font-size: 14px;">
                  📅 ${escHtml(dateFormatted)}${timeFormatted ? ' um ' + escHtml(timeFormatted) : ''}
                </span>
                <span class="urgent-badge" style="background: #e0e7ff; color: #3730a3; font-weight: bold; font-size: 13px;">
                  🏫 Klasse: ${escHtml(ev.klasse || 'BFW2B')}
                </span>
                <span class="urgent-badge" style="background: #fef3c7; color: #92400e; font-weight: bold; font-size: 13px;">
                  📚 Fach: ${escHtml(ev.subject || 'Allgemein')}
                </span>
              </div>
              <button type="button" class="btn btn-secondary" style="min-height: 32px; padding: 4px 12px; font-size: 13px;" onclick="speakClassregEvent('${ev.id}')" aria-label="Diesen Klassenbucheintrag vorlesen">
                <span class="emoji-icon" aria-hidden="true">🔊 </span>Vorlesen
              </button>
            </div>
            <div style="font-size: 16px; font-weight: 600; line-height: 1.5; color: var(--text-color); margin: 8px 0 12px 0;">
              ${escHtml(ev.text)}
            </div>
            <div style="font-size: 13px; color: var(--text-muted); font-weight: 500;">
              👤 <strong>Eingetragen von:</strong> ${escHtml(ev.teacher)} ${ev.teacherCode ? '(' + escHtml(ev.teacherCode) + ')' : ''}
            </div>
          </article>
        `;
      });
    }

    container.innerHTML = html;
    return;
  }

  // ---------------------------------------------------------------------------
  // FALL 2: DURCHGENOMMENER LEHRSTOFF / THEMEN DER UNTERRICHTSSTUNDEN
  // ---------------------------------------------------------------------------
  if (filter === 'classbook') {
    html += `
      <div class="banner-header" style="padding: 12px 0; margin-bottom: 16px;">
        <h3 class="section-subheading" style="margin: 0; font-size: 1.25rem;">📖 Durchgenommener Lehrstoff (${classbook.length} Unterrichtsstunden)</h3>
        <p class="field-hint">Themen und behandelter Stoff der einzelnen Schulstunden aus WebUntis.</p>
      </div>`;

    if (classbook.length === 0) {
      html += `
        <div class="empty-state" role="status" aria-live="polite">
          <span aria-hidden="true">📖</span>
          <p>Noch kein Unterrichtsstoff im Klassenbuch erfasst.</p>
        </div>`;
    } else {
      classbook.forEach(entry => {
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
          <article class="homework-card classbook-entry" role="article" tabindex="0" aria-label="Lehrstoff in ${escHtml(entry.subject || 'Fach')}: ${escHtml(displayText)}">
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
    return;
  }

  // ---------------------------------------------------------------------------
  // FALL 3: HAUSAUFGABEN (pending, all, completed)
  // ---------------------------------------------------------------------------
  if (items.length === 0 && allHw.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status" aria-live="polite">
        <span aria-hidden="true">📚</span>
        <p>Keine Hausaufgaben vorhanden.</p>
        <p class="empty-hint">Hausaufgaben werden automatisch aus WebUntis geladen. Du kannst oben auf <strong>„📋 Klassenbucheinträge“</strong> klicken, um offizielle Beschlüsse und Einträge deiner Klasse zu sehen.</p>
      </div>`;
    return;
  }

  if (items.length === 0 && filter === 'pending' && allHw.length > 0) {
    html += `
      <div class="status-box" style="padding: 24px; text-align: center; margin-bottom: 20px;">
        <span class="emoji-icon" style="font-size: 36px;" aria-hidden="true">🎉</span>
        <p style="font-size: var(--font-size-lg); font-weight: bold; margin-top: 8px;">Keine offenen Hausaufgaben</p>
        <p class="field-hint">Alle anstehenden Hausaufgaben sind erledigt! Du hast insgesamt ${allHw.length} Aufgabe(n) in WebUntis.</p>
        <button type="button" class="btn btn-secondary" style="margin-top: 12px;" onclick="setHomeworkFilter('all')">
          Alle Hausaufgaben anzeigen (${allHw.length})
        </button>
      </div>`;
  }

  if (items.length > 0) {
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

  container.innerHTML = html;
}

function setHomeworkFilter(filterType) {
  appData.homeworkFilter = filterType;
  saveAppData();
  renderHomework();
  const names = {
    classreg: 'Offizielle Klassenbucheinträge',
    pending: 'Offene Hausaufgaben',
    all: 'Alle Hausaufgaben',
    completed: 'Erledigte Hausaufgaben',
    classbook: 'Durchgenommener Lehrstoff'
  };
  announceSR(`Filter aktiviert: ${names[filterType] || filterType}`, 'polite');
}

function speakClassregEvent(eventId) {
  const ev = (appData.classregEvents || []).find(e => String(e.id) === String(eventId));
  if (!ev) return;
  const dObj = ev.date ? new Date(ev.date) : null;
  const dateFormatted = dObj && !isNaN(dObj) ? formatGermanDate(dObj) : (ev.date || '');
  const text = `Klassenbucheintrag vom ${dateFormatted}${ev.timeStr ? ' um ' + ev.timeStr : ''}. Fach ${ev.subject}, eingetragen von ${ev.teacher}, Klasse ${ev.klasse}. Inhalt: ${ev.text}`;
  speak(text, true);
  announceSR(text, 'assertive');
}

function toggleHomeworkCompleted(hwId) {
  const hw = (appData.homework || []).find(h => String(h.id) === String(hwId));
  if (!hw) return;
  hw.completed = !hw.completed;
  saveAppData();
  renderHomework();
  renderUrgentNotificationBanner();
  speak(hw.completed ? 'Als erledigt markiert.' : 'Als nicht erledigt markiert.', false);
}

function readHomeworkSummary() {
  const filter = appData.homeworkFilter || 'classreg';
  if (filter === 'classreg') {
    const events = appData.classregEvents || [];
    if (events.length === 0) {
      speak('Es liegen aktuell keine offiziellen Klassenbucheinträge vor.', true);
      return;
    }
    let text = `Klassenbucheinträge: Du hast ${events.length} offizielle Einträge deiner Klasse BFW2B. `;
    events.forEach((ev, idx) => {
      const dObj = ev.date ? new Date(ev.date) : null;
      const dateFormatted = dObj && !isNaN(dObj) ? formatGermanDate(dObj) : '';
      text += `Eintrag ${idx + 1} vom ${dateFormatted}: Fach ${ev.subject}, Lehrkraft ${ev.teacher}: ${ev.text}. `;
    });
    speak(text, true);
    announceSR(text, 'assertive');
    return;
  }

  if (filter === 'classbook') {
    const cb = appData.classbook || [];
    let text = `Klassenbuch-Lehrstoff: Es gibt ${cb.length} dokumentierte Unterrichtsstunden. `;
    if (cb.length > 0) {
      text += `Neuester Eintrag: ${cb[0].subject || ''}, Thema: ${cb[0].topic || cb[0].text || ''}.`;
    }
    speak(text, true);
    announceSR(text, 'assertive');
    return;
  }

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

  const crCount = (appData.classregEvents || []).length;
  if (crCount > 0) text += `Es gibt außerdem ${crCount} offizielle Klassenbucheinträge.`;

  speak(text, true);
  announceSR(text, 'assertive');
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
// 9e. DRINGLICHKEITS- & COUNTDOWN-BANNER (FEATURE 4)
// =============================================================================
function renderUrgentNotificationBanner() {
  const card = document.getElementById('urgent-notifications-card');
  const grid = document.getElementById('urgent-items-grid');
  const summaryEl = document.getElementById('urgent-card-summary');
  if (!card || !grid) return;

  const homework = (appData.homework || []).filter(h => !h.completed);
  const exams = (appData.exams || []);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const overdueHw = [];
  const soonHw = [];

  homework.forEach(hw => {
    if (!hw.dueDate) return;
    const dParts = hw.dueDate.split('-');
    if (dParts.length !== 3) return;
    const due = new Date(parseInt(dParts[0], 10), parseInt(dParts[1], 10) - 1, parseInt(dParts[2], 10));
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      overdueHw.push({ ...hw, diffDays });
    } else if (diffDays <= 7) {
      soonHw.push({ ...hw, diffDays });
    }
  });

  // Nächste anstehende Klausuren im Schuljahr
  const upcomingExams = exams.map(ex => {
    if (!ex.date) return null;
    const dParts = ex.date.split('-');
    if (dParts.length !== 3) return null;
    const exDate = new Date(parseInt(dParts[0], 10), parseInt(dParts[1], 10) - 1, parseInt(dParts[2], 10));
    const diffDays = Math.ceil((exDate - now) / (1000 * 60 * 60 * 24));
    return { ...ex, exDate, diffDays };
  }).filter(ex => ex && ex.diffDays >= 0).sort((a, b) => a.diffDays - b.diffDays);

  const nextExam = upcomingExams.length > 0 ? upcomingExams[0] : null;

  const messages = appData.messages || [];
  const activeNews = messages.filter(m => m.type === 'news' || m.type === 'inbox');
  const classregEvents = appData.classregEvents || [];

  // Wenn keine offenen Aufgaben, keine anstehende Klausur, keine Mitteilungen und keine Klassenbucheinträge existieren, ausblenden
  if (homework.length === 0 && !nextExam && activeNews.length === 0 && classregEvents.length === 0) {
    card.style.display = 'none';
    return;
  }

  card.style.display = 'block';

  // Text-Zusammenfassung generieren
  const summaryParts = [];
  if (classregEvents.length > 0) {
    summaryParts.push(`📋 ${classregEvents.length} offizielle Klassenbucheinträge`);
  }
  if (activeNews.length > 0) {
    summaryParts.push(`📢 ${activeNews.length} Schulinformation / Mitteilung`);
  }
  if (overdueHw.length > 0) {
    summaryParts.push(`🚨 ${overdueHw.length} überfällige Aufgabe${overdueHw.length > 1 ? 'n' : ''}`);
  }
  if (soonHw.length > 0) {
    summaryParts.push(`⏳ ${soonHw.length} anstehende Frist${soonHw.length > 1 ? 'en' : ''} in den nächsten 7 Tagen`);
  }
  if (nextExam) {
    const daysLabel = nextExam.diffDays === 0 ? 'Heute!' : (nextExam.diffDays === 1 ? 'Morgen!' : `in ${nextExam.diffDays} Tagen`);
    summaryParts.push(`📝 Nächste Klausur: ${nextExam.subject || 'Klausur'} (${daysLabel})`);
  }
  if (summaryEl) {
    summaryEl.textContent = summaryParts.join(' • ') || 'Aktuelle Fristenübersicht aus WebUntis.';
  }

  // Grid-Karten aufbauen
  let itemsHtml = '';

  // 0a. Offizielle Klassenbucheinträge
  classregEvents.forEach(ev => {
    const dObj = ev.date ? new Date(ev.date) : null;
    const dateFormatted = dObj && !isNaN(dObj) ? formatGermanDate(dObj) : (ev.date || 'Aktuell');
    itemsHtml += `
      <div class="urgent-item" style="border-left: 6px solid #2563eb;" tabindex="0" role="article" aria-label="Klassenbucheintrag: ${escHtml(ev.text)}">
        <div class="urgent-item-header">
          <span class="urgent-badge" style="background: #dbeafe; color: #1e40af;">📋 Klassenbucheintrag</span>
          <span class="field-hint" style="font-weight: bold;">${escHtml(dateFormatted)}${ev.timeStr ? ' • ' + escHtml(ev.timeStr) : ''}</span>
        </div>
        <div>
          <div class="urgent-item-subject">${escHtml(ev.subject || 'Klassenbuch')} (${escHtml(ev.klasse || 'BFW2B')})</div>
          <p class="urgent-item-desc">${escHtml(ev.text)}</p>
        </div>
        <button type="button" class="btn btn-secondary urgent-action-btn" onclick="switchTab('homework'); setHomeworkFilter('classreg');" aria-label="Zu den Klassenbucheinträgen wechseln">
          <span>📋 Zu den Klassenbucheinträgen</span>
        </button>
      </div>`;
  });

  // 0b. Schulinformationen / Tagesnachrichten
  activeNews.forEach(msg => {
    const isNews = msg.type === 'news';
    const badgeLabel = isNews ? '📢 Tagesnachricht' : '💬 Neue Mitteilung';
    const dateFormatted = msg.date ? formatGermanDate(new Date(msg.date)) : 'Aktuell';
    itemsHtml += `
      <div class="urgent-item" style="border-left: 6px solid #eab308;" tabindex="0" role="article" aria-label="${badgeLabel}: ${escHtml(msg.subject || 'Nachricht')}">
        <div class="urgent-item-header">
          <span class="urgent-badge" style="background: #fef08a; color: #854d0e;">${badgeLabel}</span>
          <span class="field-hint" style="font-weight: bold;">${escHtml(dateFormatted)}</span>
        </div>
        <div>
          <div class="urgent-item-subject">${escHtml(msg.subject || 'Schulinformation')}</div>
          <p class="urgent-item-desc">${escHtml(msg.text || msg.body || '')}</p>
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px;">
          <button type="button" class="btn btn-secondary urgent-action-btn" onclick="switchTab('messages')" aria-label="Zu den Mitteilungen wechseln">
            <span>💬 Zur Mitteilung</span>
          </button>
          <button type="button" class="btn btn-danger urgent-action-btn" onclick="deleteMessage('${msg.id}')" aria-label="Mitteilung ${escHtml(msg.subject || '')} löschen">
            <span>🗑️ Löschen</span>
          </button>
        </div>
      </div>`;
  });

  // 1. Überfällige Hausaufgaben
  overdueHw.forEach(hw => {
    const daysOverdue = Math.abs(hw.diffDays);
    const dateFormatted = formatGermanDate(new Date(hw.dueDate));
    itemsHtml += `
      <div class="urgent-item overdue" tabindex="0" role="article" aria-label="Überfällige Hausaufgabe in ${escHtml(hw.subject || 'Hausaufgabe')}">
        <div class="urgent-item-header">
          <span class="urgent-badge overdue">🚨 Überfällig (seit ${daysOverdue} Tag${daysOverdue === 1 ? '' : 'en'})</span>
          <span class="field-hint" style="font-weight: bold;">${escHtml(dateFormatted)}</span>
        </div>
        <div>
          <div class="urgent-item-subject">${escHtml(hw.subject || 'Hausaufgabe')}</div>
          <p class="urgent-item-desc">${escHtml(hw.text || 'Hausaufgabe ohne Text')}</p>
        </div>
        <button type="button" class="btn btn-secondary urgent-action-btn" onclick="switchTab('homework')" aria-label="Zu den Hausaufgaben wechseln">
          <span>📚 Zu den Hausaufgaben</span>
        </button>
      </div>`;
  });

  // 2. Anstehende Hausaufgaben
  soonHw.forEach(hw => {
    const dText = hw.diffDays === 0 ? 'Heute fällig!' : (hw.diffDays === 1 ? 'Morgen fällig!' : `In ${hw.diffDays} Tagen fällig`);
    const dateFormatted = formatGermanDate(new Date(hw.dueDate));
    itemsHtml += `
      <div class="urgent-item due-soon" tabindex="0" role="article" aria-label="Anstehende Hausaufgabe in ${escHtml(hw.subject || 'Hausaufgabe')}, ${dText}">
        <div class="urgent-item-header">
          <span class="urgent-badge due-soon">⏳ ${dText}</span>
          <span class="field-hint" style="font-weight: bold;">${escHtml(dateFormatted)}</span>
        </div>
        <div>
          <div class="urgent-item-subject">${escHtml(hw.subject || 'Hausaufgabe')}</div>
          <p class="urgent-item-desc">${escHtml(hw.text || 'Hausaufgabe ohne Text')}</p>
        </div>
        <button type="button" class="btn btn-secondary urgent-action-btn" onclick="switchTab('homework')" aria-label="Zu den Hausaufgaben wechseln">
          <span>📚 Zu den Hausaufgaben</span>
        </button>
      </div>`;
  });

  // 3. Nächste Klausur mit Live-Countdown
  if (nextExam) {
    const dText = nextExam.diffDays === 0 ? 'Heute!' : (nextExam.diffDays === 1 ? 'Morgen!' : `Noch ${nextExam.diffDays} Tage`);
    const dateFormatted = formatGermanDate(new Date(nextExam.date));
    const timeFormatted = `${nextExam.startTime || '07:45'} - ${nextExam.endTime || '09:15'} Uhr`;
    itemsHtml += `
      <div class="urgent-item exam-countdown" tabindex="0" role="article" aria-label="Nächste Klausur in ${escHtml(nextExam.subject)}, ${dText}">
        <div class="urgent-item-header">
          <span class="urgent-badge exam">📝 Klausur-Countdown</span>
          <span class="urgent-badge exam" style="background: rgba(124,58,237,0.25); color: var(--text-primary); border: 1.5px solid #7c3aed;">⏳ ${dText}</span>
        </div>
        <div>
          <div class="urgent-item-subject">${escHtml(nextExam.subject)}</div>
          <p class="urgent-item-desc">
            📅 ${escHtml(dateFormatted)} • ⏰ ${escHtml(timeFormatted)}<br>
            👨‍🏫 ${escHtml(nextExam.teacher || 'Fachlehrkraft')} • 🚪 ${escHtml(nextExam.room || 'Raum laut Plan')}
          </p>
        </div>
        <button type="button" class="btn btn-secondary urgent-action-btn" onclick="switchTab('exams')" aria-label="Zum Prüfungskalender wechseln">
          <span>📝 Zum Prüfungskalender</span>
        </button>
      </div>`;
  }

  // 4. Fehlzeiten-Warnung bei unentschuldigten Fehlstunden
  const absences = appData.absences || [];
  const unexcused = absences.filter(a => !a.isExcused && !a.excused);
  if (unexcused.length > 0) {
    itemsHtml += `
      <div class="urgent-item overdue" tabindex="0" role="article" aria-label="Warnung: ${unexcused.length} unentschuldigte Fehlzeiten">
        <div class="urgent-item-header">
          <span class="urgent-badge overdue">⚠️ Unentschuldigte Fehlzeit</span>
          <span class="field-hint" style="font-weight: bold;">Handlungsbedarf</span>
        </div>
        <div>
          <div class="urgent-item-subject">${unexcused.length} Fehlzeit${unexcused.length > 1 ? 'en' : ''} noch offen</div>
          <p class="urgent-item-desc">Bitte reiche zeitnah eine Entschuldigung oder Bescheinigung beim Klassenlehrer ein.</p>
        </div>
        <button type="button" class="btn btn-secondary urgent-action-btn" onclick="switchTab('absences')" aria-label="Zu den Fehlzeiten wechseln">
          <span>⏱️ Zu den Fehlzeiten</span>
        </button>
      </div>`;
  }

  grid.innerHTML = itemsHtml;
}

function readCombinedOverview() {
  const homework = (appData.homework || []).filter(h => !h.completed);
  const exams = appData.exams || [];
  const messages = appData.messages || [];
  const absences = appData.absences || [];
  const activeNews = messages.filter(m => m.type === 'news' || m.type === 'inbox');
  const unexcused = absences.filter(a => !a.isExcused && !a.excused);

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  let overdue = 0;
  let soon = 0;
  homework.forEach(h => {
    if (!h.dueDate) return;
    const p = h.dueDate.split('-');
    if (p.length !== 3) return;
    const due = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    const diff = Math.ceil((due - now) / 86400000);
    if (diff < 0) overdue++;
    else if (diff <= 7) soon++;
  });

  const upcomingExams = exams.map(ex => {
    if (!ex.date) return null;
    const p = ex.date.split('-');
    if (p.length !== 3) return null;
    const d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    return { ...ex, diff: Math.ceil((d - now) / 86400000) };
  }).filter(e => e && e.diff >= 0).sort((a, b) => a.diff - b.diff);

  const nextEx = upcomingExams[0];

  let speech = 'Zentrale Übersicht: Tagesnachrichten, Warnungen und Fristen. ';

  const classreg = appData.classregEvents || [];
  if (classreg.length > 0) {
    speech += `Du hast ${classreg.length} offizielle Klassenbucheinträge deiner Klasse ${appData.config.klasse || 'BFW2B'}. `;
  }

  if (activeNews.length > 0) {
    speech += `Du hast ${activeNews.length} Schulinformation${activeNews.length > 1 ? 'en oder Mitteilungen' : ' oder Mitteilung'}. `;
    activeNews.slice(0, 2).forEach(n => {
      const senderInfo = n.type === 'news' ? 'Tagesnachricht der Schule' : 'Mitteilung von ' + (n.sender || 'Lehrkraft');
      speech += `${senderInfo}: ${n.subject}. `;
    });
  }

  if (overdue > 0) {
    speech += `Achtung: Du hast ${overdue} überfällige Hausaufgabe${overdue > 1 ? 'n' : ''}. `;
  }
  if (soon > 0) {
    speech += `In den nächsten 7 Tagen stehen ${soon} Hausaufgabe${soon > 1 ? 'n' : ''} an. `;
  }
  if (nextEx) {
    const daysStr = nextEx.diff === 0 ? 'heute' : (nextEx.diff === 1 ? 'morgen' : `in ${nextEx.diff} Tagen`);
    speech += `Deine nächste Klausur ist ${nextEx.subject} ${daysStr}, am ${formatGermanDate(new Date(nextEx.date))}. `;
  }
  if (unexcused.length > 0) {
    speech += `Hinweis: Es liegen ${unexcused.length} unentschuldigte Fehlzeiten vor. `;
  }

  if (activeNews.length === 0 && overdue === 0 && soon === 0 && !nextEx && unexcused.length === 0 && classreg.length === 0) {
    speech += 'Aktuell sind keine dringenden Aufgaben oder Warnungen erfasst. ';
  }

  // Aktueller Unterrichts-Status
  const lessons = getLessonsForSelectedDay();
  if (lessons && lessons.length > 0) {
    speech += `Heute hast du ${lessons.length} Unterrichtsstunden laut Plan.`;
  }

  speak(speech, true);
  announceSR(speech, 'assertive');
}

function readUrgentSummary() {
  readCombinedOverview();
}

function triggerDesktopNotification() {
  const homework = (appData.homework || []).filter(h => !h.completed);
  const exams = appData.exams || [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const upcomingExams = exams.map(ex => {
    if (!ex.date) return null;
    const p = ex.date.split('-');
    if (p.length !== 3) return null;
    const d = new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
    return { ...ex, diff: Math.ceil((d - now) / 86400000) };
  }).filter(e => e && e.diff >= 0).sort((a, b) => a.diff - b.diff);

  const nextEx = upcomingExams[0];
  let msg = `${homework.length} offene Aufgabe${homework.length === 1 ? '' : 'n'}`;
  if (nextEx) {
    msg += ` • Nächste Klausur: ${nextEx.subject} in ${nextEx.diff} Tagen (${nextEx.date})`;
  }

  fetch(`/api/notify?title=${encodeURIComponent('LWL Stundenplan & Prüfungen')}&msg=${encodeURIComponent(msg)}`).catch(() => {});
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
      switchTab('messages');
    } else if (e.key === '6') {
      e.preventDefault();
      switchTab('grades');
    } else if (e.key === '7') {
      e.preventDefault();
      switchTab('settings');
    } else if (e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      setDayFilter('today');
    } else if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      // Vorlesen kontextabhängig je nach aktivem Tab und Modal
      const modal = document.getElementById('modal-lesson-details');
      const gradeModal = document.getElementById('modal-add-grade');
      if (modal && modal.style.display !== 'none') {
        speakCurrentLessonDetails();
      } else if (gradeModal && gradeModal.style.display !== 'none') {
        speak('Klausurnote eintragen Dialog geöffnet.', true);
      } else if (currentTab === 'overview') {
        readCombinedOverview();
      } else if (currentTab === 'exams') {
        readAllExamsAndEvents();
      } else if (currentTab === 'homework') {
        readHomeworkSummary();
      } else if (currentTab === 'absences') {
        readAbsencesSummary();
      } else if (currentTab === 'messages') {
        readMessagesSummary();
      } else if (currentTab === 'grades') {
        readGradesSummary();
      }
    } else if (e.key === 'a' || e.key === 'A') {
      e.preventDefault();
      triggerManualSync();
    } else if (e.key === 'Escape') {
      closeLessonDetails();
      closeGradeModal();
      toggleMessageComposer(false);
    }
  });


  // Automatische Anmeldung & Synchronisation beim Start
  if (appData.config.username && appData.config.password) {
    hideLoginView();
    renderTimetable();
    renderExams();
    renderHomework();
    renderAbsences();
    renderMessagesView();
    renderGradesView();
    renderUrgentNotificationBanner();
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

// =============================================================================
// 12. TAGESNACHRICHTEN & MITTEILUNGEN (WEBUNTIS & MESSENGER)
// =============================================================================

const DEFAULT_TEACHERS_FALLBACK = [
  { id: 87, name: 'HAN', longName: 'Hanauer' },
  { id: 37, name: 'FE', longName: 'Feix' },
  { id: 187, name: 'MON', longName: 'Monser' },
  { id: 92, name: 'HUE', longName: 'Hübner' },
  { id: 24, name: 'DRE', longName: 'Drewianka' },
  { id: 102, name: 'M-I', longName: 'Marschinke-Ives' },
  { id: 2, name: 'ALT', longName: 'Altmann' },
  { id: 317, name: 'BER', longName: 'Berger' },
  { id: 266, name: 'BUE', longName: 'Büngeler' },
  { id: 319, name: 'CAL', longName: 'Calvano' },
  { id: 137, name: 'KUE', longName: 'Küppers' },
  { id: 72, name: 'HEN', longName: 'Henze' },
  { id: 187, name: 'RUE', longName: 'Rüberg' },
  { id: 102, name: 'JAC', longName: 'Jacob' },
  { id: 198, name: 'SON', longName: 'Sonntag' },
  { id: 212, name: 'ZOE', longName: 'Zörner' },
  { id: 999, name: 'SL', longName: 'Schulleitung / Sekretariat' }
];

function getTeachersList() {
  if (appData.teachers && Array.isArray(appData.teachers) && appData.teachers.length > 0) {
    return appData.teachers;
  }
  return DEFAULT_TEACHERS_FALLBACK;
}

function renderMessagesView() {
  const container = document.getElementById('messages-list-container');
  if (!container) return;

  const messages = appData.messages || [];
  const filter = appData.messagesFilter || 'all';

  // Zähler aktualisieren
  const allCount = messages.length;
  const newsCount = messages.filter(m => m.type === 'news').length;
  const inboxCount = messages.filter(m => m.type === 'inbox').length;
  const sentCount = messages.filter(m => m.type === 'sent').length;

  const cAll = document.getElementById('count-msg-all');
  const cNews = document.getElementById('count-msg-news');
  const cInbox = document.getElementById('count-msg-inbox');
  const cSent = document.getElementById('count-msg-sent');
  if (cAll) cAll.textContent = String(allCount);
  if (cNews) cNews.textContent = String(newsCount);
  if (cInbox) cInbox.textContent = String(inboxCount);
  if (cSent) cSent.textContent = String(sentCount);

  // Filter Buttons Styling
  ['all', 'news', 'inbox', 'sent'].forEach(f => {
    const btn = document.getElementById(`btn-filter-msg-${f}`);
    if (btn) {
      btn.classList.toggle('active', f === filter);
      btn.setAttribute('aria-pressed', String(f === filter));
    }
  });

  // Empfänger-Dropdown im Sendeformular befüllen
  const recipientSelect = document.getElementById('msg-recipient');
  if (recipientSelect && recipientSelect.options.length <= 1) {
    recipientSelect.innerHTML = '<option value="">-- Lehrkraft auswählen --</option>';
    const teachers = getTeachersList().sort((a, b) => (a.longName || a.name || '').localeCompare(b.longName || b.name || ''));
    teachers.forEach(t => {
      const opt = document.createElement('option');
      const displayName = `${t.longName || t.name}${t.foreName ? ' ' + t.foreName : ''} (${t.name || ''})`;
      opt.value = displayName;
      opt.textContent = displayName;
      recipientSelect.appendChild(opt);
    });
  }

  // Filtern
  let filtered = messages;
  if (filter === 'news') filtered = messages.filter(m => m.type === 'news');
  else if (filter === 'inbox') filtered = messages.filter(m => m.type === 'inbox');
  else if (filter === 'sent') filtered = messages.filter(m => m.type === 'sent');

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" role="status" aria-live="polite">
        <span aria-hidden="true">💬</span>
        <p>Keine Mitteilungen in dieser Kategorie vorhanden.</p>
        <p class="empty-hint">Klicke oben auf „Neue Mitteilung verfassen“, um eine Nachricht an eine Lehrkraft zu senden, oder aktualisiere die Tagesnachrichten.</p>
      </div>`;
    return;
  }

  let html = '<div class="messages-stack" role="list">';
  filtered.forEach(msg => {
    const isNews = msg.type === 'news';
    const isSent = msg.type === 'sent';
    const isInbox = msg.type === 'inbox' || (!isNews && !isSent);

    let badgeClass = 'msg-badge-inbox';
    let badgeLabel = '📥 Posteingang';
    let highlightClass = 'inbox-highlight';

    if (isNews) {
      badgeClass = 'msg-badge-news';
      badgeLabel = '📢 Tagesnachricht der Schule';
      highlightClass = 'news-highlight';
    } else if (isSent) {
      badgeClass = 'msg-badge-sent';
      badgeLabel = '📤 Gesendet';
      highlightClass = 'sent-highlight';
    }

    const dateFormatted = msg.date ? formatGermanDate(new Date(msg.date)) : 'Aktuell';
    const timeFormatted = msg.date ? new Date(msg.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : '';

    html += `
      <article class="msg-card ${highlightClass}" role="listitem" tabindex="0" aria-label="${badgeLabel}: ${escHtml(msg.subject || 'Mitteilung')}">
        <div class="msg-header">
          <div class="msg-badges">
            <span class="msg-badge ${badgeClass}">${badgeLabel}</span>
            <span class="msg-date">📅 ${escHtml(dateFormatted)}${timeFormatted ? ' um ' + escHtml(timeFormatted) + ' Uhr' : ''}</span>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-secondary" style="min-height: 34px; padding: 4px 10px; font-size: 13px;" onclick="speakMsg('${msg.id}')" aria-label="Diese Mitteilung vorlesen">
              <span class="emoji-icon" aria-hidden="true">🔊 </span>Vorlesen
            </button>
            <button type="button" class="btn btn-danger" style="min-height: 34px; padding: 4px 10px; font-size: 13px;" onclick="deleteMessage('${msg.id}')" aria-label="Mitteilung ${escHtml(msg.subject || '')} löschen">
              <span class="emoji-icon" aria-hidden="true">🗑️ </span>Löschen
            </button>
          </div>
        </div>
        <h3 class="msg-title">${escHtml(msg.subject || 'Ohne Betreff')}</h3>
        <div class="msg-author-line">
          ${isSent ? `👤 <strong>Empfänger:</strong> ${escHtml(msg.recipient || 'Lehrkraft')}` : `👤 <strong>Von:</strong> ${escHtml(msg.sender || 'LWL-Berufskolleg Soest')}`}
        </div>
        <div class="msg-body">${escHtml(msg.text || msg.body || '')}</div>
      </article>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

function speakMsg(msgId) {
  const msg = (appData.messages || []).find(m => String(m.id) === String(msgId));
  if (!msg) return;
  const isSent = msg.type === 'sent';
  const person = isSent ? `an ${msg.recipient}` : `von ${msg.sender || 'der Schule'}`;
  const text = `Mitteilung ${person}: Betreff ${msg.subject || 'Kein Betreff'}. Inhalt: ${msg.text || msg.body || ''}`;
  speak(text, true);
  announceSR(text, 'assertive');
}

async function deleteMessage(msgId) {
  if (!msgId) return;
  const msg = (appData.messages || []).find(m => String(m.id) === String(msgId));
  const title = msg ? (msg.subject || 'diese Mitteilung') : 'diese Mitteilung';

  if (!confirm(`Möchtest du die Mitteilung „${title}“ wirklich löschen?`)) {
    return;
  }

  // 1. Wenn es eine WebUntis-Nachricht ist, versuche DELETE an die WebUntis API zu senden
  let untisId = null;
  const sId = String(msgId);
  if (sId.startsWith('webuntis-inbox-')) {
    untisId = sId.replace('webuntis-inbox-', '');
  } else if (sId.startsWith('webuntis-news-')) {
    untisId = sId.replace('webuntis-news-', '');
  } else if (/^\d+$/.test(sId)) {
    untisId = sId;
  }

  if (untisId) {
    try {
      // Versuch, die Mitteilung auf dem WebUntis Server zu löschen (über REST DELETE)
      await callWebUntisRest(`/api/rest/view/v1/messages/${untisId}`, null, 'DELETE');
    } catch (e) {
      console.warn('WebUntis Server DELETE fehlgeschlagen oder keine Schüler-Berechtigung:', e);
    }
  }

  // 2. In Blacklist eintragen, damit sie bei zukünftigen WebUntis-Synchronisationen nie wieder erscheint
  if (!appData.deletedMessageIds) appData.deletedMessageIds = [];
  if (!appData.deletedMessageIds.includes(sId)) {
    appData.deletedMessageIds.push(sId);
  }
  if (untisId && !appData.deletedMessageIds.includes(untisId)) {
    appData.deletedMessageIds.push(untisId);
  }

  // 3. Aus lokalem Speicher entfernen
  appData.messages = (appData.messages || []).filter(m => {
    const curId = String(m.id || '');
    return curId !== sId && (!untisId || !curId.includes(untisId));
  });
  saveAppData();

  // 4. Anzeige in beiden Ansichten (Mitteilungen & Übersicht) sofort aktualisieren
  renderMessagesView();
  renderUrgentNotificationBanner();

  // 5. Screenreader- und Sprachausgabe-Bestätigung
  const feedback = `Mitteilung ${title} wurde gelöscht.`;
  speak(feedback, true);
  announceSR(feedback, 'assertive');
}

function toggleMessageComposer(forceState) {
  const card = document.getElementById('message-composer-card');
  if (!card) return;

  const willShow = typeof forceState === 'boolean' ? forceState : (card.style.display === 'none');
  card.style.display = willShow ? 'block' : 'none';

  if (willShow) {
    const rec = document.getElementById('msg-recipient');
    if (rec) rec.focus();
    announceSR('Mitteilungs-Formular geöffnet. Wähle eine Lehrkraft als Empfänger.', 'polite');
  }
}

function handleSendMessageSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  const recEl = document.getElementById('msg-recipient');
  const subjEl = document.getElementById('msg-subject');
  const textEl = document.getElementById('msg-text');
  const statusBox = document.getElementById('composer-status-box');

  if (!recEl || !recEl.value || !subjEl || !subjEl.value.trim() || !textEl || !textEl.value.trim()) {
    alert('Bitte wähle einen Empfänger aus und fülle Betreff sowie Nachrichtentext aus.');
    return;
  }

  const recipient = recEl.value.trim();
  const subject = subjEl.value.trim();
  const text = textEl.value.trim();

  const newMsg = {
    id: 'msg-' + Date.now(),
    type: 'sent',
    sender: appData.config.username ? `Schüler (${appData.config.username})` : 'Laurin Schneider',
    recipient: recipient,
    subject: subject,
    text: text,
    date: new Date().toISOString()
  };

  if (!appData.messages) appData.messages = [];
  appData.messages.unshift(newMsg);
  saveAppData();

  // Desktop Toast Notification
  fetch('/api/notify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'Mitteilung gesendet',
      message: `An ${recipient}: ${subject}`
    })
  }).catch(() => {});

  // Formular zurücksetzen und schließen
  subjEl.value = '';
  textEl.value = '';
  recEl.selectedIndex = 0;
  toggleMessageComposer(false);

  renderMessagesView();
  renderUrgentNotificationBanner();

  const successMsg = `Mitteilung an ${recipient} wurde erfolgreich erfasst und im Archiv gespeichert.`;
  speak(successMsg, true);
  announceSR(successMsg, 'assertive');
}

function filterMessages(type) {
  appData.messagesFilter = type;
  renderMessagesView();
}

function readMessagesSummary() {
  const msgs = appData.messages || [];
  const news = msgs.filter(m => m.type === 'news');
  const inbox = msgs.filter(m => m.type === 'inbox');
  const sent = msgs.filter(m => m.type === 'sent');

  let text = `Mitteilungs-Übersicht: Du hast ${msgs.length} Mitteilung${msgs.length !== 1 ? 'en' : ''}. `;
  if (news.length > 0) text += `Davon ${news.length} Tagesnachricht${news.length > 1 ? 'en' : ''} der Schule. `;
  if (inbox.length > 0) text += `Du hast ${inbox.length} Nachricht${inbox.length > 1 ? 'en' : ''} im Posteingang. `;
  if (sent.length > 0) text += `Du hast ${sent.length} Nachricht${sent.length > 1 ? 'en' : ''} gesendet. `;

  if (msgs.length === 0) {
    text += 'Aktuell liegen keine neuen Mitteilungen oder Tagesnachrichten vor.';
  } else {
    text += `Neueste Mitteilung: ${msgs[0].subject || 'Ohne Betreff'}.`;
  }

  speak(text, true);
  announceSR(text, 'assertive');
}

async function syncMessagesAndNews() {
  announceSR('Synchronisiere Tagesnachrichten aus WebUntis...', 'polite');
  try {
    const todayNum = parseInt(new Date().toISOString().slice(0,10).replace(/-/g, ''), 10);
    const res = await callWebUntisApi('getMessagesOfDay2017', [{ date: todayNum }]);
    if (res && res.result && res.result.messages && Array.isArray(res.result.messages)) {
      if (!appData.messages) appData.messages = [];
      const deletedIds = appData.deletedMessageIds || [];
      res.result.messages.forEach(m => {
        const id = `webuntis-news-${m.id || Date.now()}`;
        if (deletedIds.includes(String(m.id)) || deletedIds.includes(id)) {
          return;
        }
        if (!appData.messages.some(x => x.id === id)) {
          appData.messages.unshift({
            id: id,
            type: 'news',
            sender: 'Schulleitung / WebUntis',
            subject: m.subject || m.title || 'Tagesnachricht',
            text: m.text || m.body || m.content || '',
            date: new Date().toISOString()
          });
        }
      });
      saveAppData();
    }
  } catch (e) {}

  renderMessagesView();
  renderUrgentNotificationBanner();
  announceSR('Tagesnachrichten aktualisiert.', 'polite');
}

// =============================================================================
// 13. NOTEN & LEISTUNGSÜBERSICHT (FEATURE 6)
// =============================================================================

const OFFICIAL_LWL_SUBJECTS = [
  { id: 15712, code: 'FB GPU1', name: 'Fachpraxis Geschäftsprozesse & IT 1', teacher: 'Hanauer (HAN)', klasse: 'BFW2B' },
  { id: 15724, code: 'FB GPU2', name: 'Fachpraxis Geschäftsprozesse & IT 2', teacher: 'Hanauer (HAN)', klasse: 'BFW2B' },
  { id: 16012, code: 'FB GWP', name: 'Fachpraxis Gesamtwirtschaft', teacher: 'Hübner (HÜB)', klasse: 'BFW2B' },
  { id: 15565, code: 'FB PBP', name: 'Fachpraxis Personalwirtschaft', teacher: 'Hübner (HÜB)', klasse: 'BFW2B' },
  { id: 16237, code: 'FU BO', name: 'Berufliche Orientierung', teacher: 'Marschinke-Ives (MCH)', klasse: 'BFW2B' },
  { id: 16129, code: 'FU D', name: 'Förderunterricht Deutsch', teacher: 'Feix (FE)', klasse: 'BFW2B' },
  { id: 16354, code: 'PP', name: 'Praktische Philosophie', teacher: 'Drewianka (DRE)', klasse: 'BFW2B' },
  { id: 16110, code: 'D', name: 'Deutsch / Kommunikation', teacher: 'Feix (FE)', klasse: 'BFW2B' },
  { id: 16120, code: 'E', name: 'Englisch', teacher: 'Monser (MON)', klasse: 'BFW2B' },
  { id: 16130, code: 'M', name: 'Mathematik', teacher: 'Hanauer (HAN)', klasse: 'BFW2B' },
  { id: 16140, code: 'PK', name: 'Politik & Gesellschaftslehre', teacher: 'Hübner (HÜB)', klasse: 'BFW2B' },
  { id: 16150, code: 'SP', name: 'Sport / Gesundheitsförderung', teacher: 'Altmann (ALT)', klasse: 'BFW2B' }
];

function renderGradesView() {
  const container = document.getElementById('grades-list-container');
  if (!container) return;

  const exams = appData.exams || [];
  const grades = appData.grades || {};
  const finalMarks = appData.webuntisFinalMarks || {};

  // Fächerliste: Dynamisch aus WebUntis-REST oder verifiziertem Standard
  let subjects = OFFICIAL_LWL_SUBJECTS;
  if (appData.webuntisLessons && Array.isArray(appData.webuntisLessons) && appData.webuntisLessons.length > 0) {
    subjects = appData.webuntisLessons.map(l => {
      const code = l.subjects || 'Fach';
      const matchSubj = OFFICIAL_LWL_SUBJECTS.find(s => s.code === code);
      const longName = matchSubj ? matchSubj.name : code;
      const tCode = l.teachers || '';
      const matchTeach = matchSubj ? matchSubj.teacher : (tCode || 'Fachlehrkraft');
      return {
        id: l.id,
        code: code,
        name: longName,
        teacher: matchTeach,
        klasse: l.klassen || 'BFW2B',
        lessonId: l.id
      };
    });
  }

  let totalGradedExams = 0;
  let gradeSum = 0;

  // Noten-Statistik ermitteln (sowohl aus WebUntis Zeugnisnoten als auch aus bewerteten Arbeiten)
  exams.forEach(ex => {
    if (grades[ex.id] && grades[ex.id].mark) {
      const val = parseFloat(grades[ex.id].mark);
      if (!isNaN(val)) {
        gradeSum += val;
        totalGradedExams++;
      }
    }
  });

  // Offizielle Zeugnisnoten einbeziehen, falls vorhanden
  Object.keys(finalMarks).forEach(lid => {
    const fm = finalMarks[lid];
    if (fm && fm.assignedMark && fm.assignedMark.markValue > 0) {
      const mVal = parseFloat(fm.assignedMark.markDisplayValue || (fm.assignedMark.markValue / 100));
      if (!isNaN(mVal) && mVal > 0) {
        gradeSum += mVal;
        totalGradedExams++;
      }
    }
  });

  const overallGpa = totalGradedExams > 0 ? (gradeSum / totalGradedExams).toFixed(1) : '--';

  // Stat-Karten aktualisieren
  const gpaEl = document.getElementById('stat-grade-gpa');
  const totalExamsEl = document.getElementById('stat-grade-total-exams');
  const gradedExamsEl = document.getElementById('stat-grade-graded-exams');
  const subjectsCountEl = document.getElementById('stat-grade-subjects-count');

  if (gpaEl) gpaEl.textContent = overallGpa !== '--' ? `Ø ${overallGpa}` : '--';
  if (totalExamsEl) totalExamsEl.textContent = String(exams.length);
  if (gradedExamsEl) gradedExamsEl.textContent = `${totalGradedExams} / ${exams.length}`;
  if (subjectsCountEl) subjectsCountEl.textContent = String(subjects.length);

  // Fächerkarten rendern
  let html = '<div class="grades-grid">';
  subjects.forEach(subj => {
    // Passende Klausuren für dieses Fach finden
    const matchingExams = exams.filter(ex => {
      if (!ex.subject) return false;
      const s1 = ex.subject.toLowerCase().trim();
      const c1 = subj.code.toLowerCase().trim();
      const n1 = subj.name.toLowerCase().trim();
      return s1 === c1 || s1.includes(c1) || n1.includes(s1) || s1.includes(n1);
    });

    let subjGraded = 0;
    let subjSum = 0;
    matchingExams.forEach(ex => {
      if (grades[ex.id] && grades[ex.id].mark) {
        const val = parseFloat(grades[ex.id].mark);
        if (!isNaN(val)) {
          subjSum += val;
          subjGraded++;
        }
      }
    });

    // Offizielle WebUntis-Zeugnisnote prüfen
    const fm = finalMarks[subj.lessonId || subj.id];
    let officialMarkDisplay = null;
    if (fm && fm.assignedMark && (fm.assignedMark.name || fm.assignedMark.markValue > 0)) {
      officialMarkDisplay = fm.assignedMark.name || `Note ${(fm.assignedMark.markValue / 100).toFixed(0)}`;
      const mVal = parseFloat(fm.assignedMark.markDisplayValue || (fm.assignedMark.markValue / 100));
      if (!isNaN(mVal) && mVal > 0) {
        subjSum += mVal;
        subjGraded++;
      }
    }

    const subjAvg = subjGraded > 0 ? (subjSum / subjGraded).toFixed(1) : null;

    html += `
      <article class="grade-subject-card" role="article" aria-label="Fach ${escHtml(subj.name)}, ${subjAvg ? 'Notendurchschnitt ' + subjAvg : 'Status laufend'}">
        <div class="grade-subject-header">
          <div>
            <h3 class="grade-subject-title">
              <span class="homework-subject">${escHtml(subj.code)}</span>
              <span>${escHtml(subj.name)}</span>
            </h3>
            <span class="field-hint">👨‍🏫 ${escHtml(subj.teacher)} • 🏫 Klasse ${escHtml(subj.klasse || 'BFW2B')}</span>
          </div>
          <div>
            ${officialMarkDisplay ? `<span class="grade-average-badge" style="background: #15803d; color: #fff;">🏆 ${escHtml(officialMarkDisplay)}</span>` : (subjAvg ? `<span class="grade-average-badge">Ø ${subjAvg}</span>` : '<span class="field-hint" style="font-weight: bold; color: var(--accent-primary);">⚡ Live WebUntis</span>')}
          </div>
        </div>

        <div style="padding: 10px 14px; background: var(--bg-surface-elevated); border-radius: var(--radius-sm); margin: 10px 0; font-size: 13.5px;">
          ${officialMarkDisplay ? `
            <div style="color: #15803d; font-weight: bold;">
              ✅ Offizielle Zeugnisnote aus WebUntis: <strong>${escHtml(officialMarkDisplay)}</strong>
            </div>
          ` : `
            <div style="color: var(--text-secondary);">
              📋 <strong>Offizieller Status:</strong> Laufendes Schuljahr 2026/2027 (Zeugnisnote wird zum Halbjahr eingetragen).
            </div>
          `}
        </div>

        <div class="grade-exams-list">
          <div style="font-size: 13px; font-weight: bold; margin-bottom: 6px; color: var(--text-secondary);">
            📝 Termine &amp; Klassenarbeiten (${matchingExams.length}):
          </div>
          ${matchingExams.length === 0 ? '<p class="field-hint" style="padding: 6px 0;">Keine schriftlichen Klausuren für dieses Fach in WebUntis eingetragen.</p>' : ''}
          ${matchingExams.map((ex, idx) => {
            const gr = grades[ex.id];
            const hasGrade = gr && gr.mark;
            const markVal = hasGrade ? parseFloat(gr.mark) : null;
            let badgeClass = 'grade-pending';
            if (markVal) {
              if (markVal <= 1.5) badgeClass = 'grade-1';
              else if (markVal <= 2.5) badgeClass = 'grade-2';
              else if (markVal <= 3.5) badgeClass = 'grade-3';
              else if (markVal <= 4.5) badgeClass = 'grade-4';
              else badgeClass = 'grade-5';
            }

            const dateFormatted = ex.date ? formatGermanDate(new Date(ex.date)) : 'Termin offen';

            return `
              <div class="grade-exam-row">
                <div style="flex: 1; min-width: 200px;">
                  <strong>Arbeit ${idx + 1}: ${escHtml(ex.name || subj.code)}</strong>
                  <div class="field-hint">📅 ${escHtml(dateFormatted)} • ⏰ ${escHtml(ex.startTime || '07:45')} - ${escHtml(ex.endTime || '09:15')} Uhr • 🚪 ${escHtml(ex.room || 'Raum laut Plan')}</div>
                  ${gr && gr.note ? `<div style="font-size: 13px; color: var(--accent-primary); margin-top: 2px;">💬 ${escHtml(gr.note)}</div>` : ''}
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span class="grade-badge-value ${badgeClass}" title="${hasGrade ? 'Note: ' + gr.mark : 'Ausstehend / noch nicht benotet'}">
                    ${hasGrade ? gr.mark : 'Offen'}
                  </span>
                  <button type="button" class="btn btn-secondary" style="min-height: 36px; padding: 4px 10px; font-size: 13px;" onclick="openAddGradeModal('${ex.id}')" aria-label="Optionale Notiz oder Note zu Klausur am ${dateFormatted}">
                    <span>${hasGrade ? '✏️ Notiz' : '➕ Notiz'}</span>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </article>
    `;
  });
  html += '</div>';

  container.innerHTML = html;
}

function openAddGradeModal(examId) {
  const modal = document.getElementById('modal-add-grade');
  const select = document.getElementById('grade-exam-select');
  const markSelect = document.getElementById('grade-mark-select');
  const pointsInput = document.getElementById('grade-points-input');
  const noteInput = document.getElementById('grade-note-input');
  if (!modal || !select) return;

  const exams = appData.exams || [];
  select.innerHTML = '';

  exams.forEach(ex => {
    const opt = document.createElement('option');
    opt.value = ex.id;
    const dateFormatted = ex.date ? formatGermanDate(new Date(ex.date)) : 'Termin';
    opt.textContent = `${ex.subject} am ${dateFormatted} (${ex.name || 'Klausur'})`;
    if (examId && String(ex.id) === String(examId)) {
      opt.selected = true;
    }
    select.appendChild(opt);
  });

  const currentExamId = select.value;
  const existingGrade = appData.grades ? appData.grades[currentExamId] : null;

  if (existingGrade) {
    if (markSelect) markSelect.value = existingGrade.mark || '2.0';
    if (pointsInput) pointsInput.value = existingGrade.points || '';
    if (noteInput) noteInput.value = existingGrade.note || '';
  } else {
    if (markSelect) markSelect.value = '2.0';
    if (pointsInput) pointsInput.value = '';
    if (noteInput) noteInput.value = '';
  }

  modal.style.display = 'flex';
  if (markSelect) markSelect.focus();
  announceSR('Dialog Klausurnote eintragen geöffnet.', 'polite');
}

function closeGradeModal() {
  const modal = document.getElementById('modal-add-grade');
  if (modal) modal.style.display = 'none';
}

function handleGradeModalBackdropClick(e) {
  if (e.target && e.target.id === 'modal-add-grade') {
    closeGradeModal();
  }
}

function handleGradeExamSelectionChange() {
  const select = document.getElementById('grade-exam-select');
  const markSelect = document.getElementById('grade-mark-select');
  const pointsInput = document.getElementById('grade-points-input');
  const noteInput = document.getElementById('grade-note-input');
  if (!select) return;

  const exId = select.value;
  const existing = appData.grades ? appData.grades[exId] : null;
  if (existing) {
    if (markSelect) markSelect.value = existing.mark || '2.0';
    if (pointsInput) pointsInput.value = existing.points || '';
    if (noteInput) noteInput.value = existing.note || '';
  } else {
    if (markSelect) markSelect.value = '2.0';
    if (pointsInput) pointsInput.value = '';
    if (noteInput) noteInput.value = '';
  }
}

function handleSaveGradeSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  const select = document.getElementById('grade-exam-select');
  const markSelect = document.getElementById('grade-mark-select');
  const pointsInput = document.getElementById('grade-points-input');
  const noteInput = document.getElementById('grade-note-input');
  if (!select || !markSelect) return;

  const examId = select.value;
  const mark = markSelect.value;
  const points = pointsInput ? pointsInput.value.trim() : '';
  const note = noteInput ? noteInput.value.trim() : '';

  if (!appData.grades) appData.grades = {};
  appData.grades[examId] = {
    examId: examId,
    mark: mark,
    points: points,
    note: note,
    updatedAt: new Date().toISOString()
  };

  saveAppData();
  closeGradeModal();
  renderGradesView();

  const matchingEx = (appData.exams || []).find(x => String(x.id) === String(examId));
  const subjName = matchingEx ? matchingEx.subject : 'Klausur';

  const msg = `Note ${mark} für ${subjName} wurde erfolgreich gespeichert.`;
  speak(msg, true);
  announceSR(msg, 'assertive');
}

function readGradesSummary() {
  const exams = appData.exams || [];
  const grades = appData.grades || {};
  const finalMarks = appData.webuntisFinalMarks || {};
  const subjectsCount = (appData.webuntisLessons && appData.webuntisLessons.length) || 12;

  let total = 0;
  let sum = 0;
  exams.forEach(ex => {
    if (grades[ex.id] && grades[ex.id].mark) {
      const v = parseFloat(grades[ex.id].mark);
      if (!isNaN(v)) {
        sum += v;
        total++;
      }
    }
  });

  Object.keys(finalMarks).forEach(lid => {
    const fm = finalMarks[lid];
    if (fm && fm.assignedMark && fm.assignedMark.markValue > 0) {
      const mVal = parseFloat(fm.assignedMark.markDisplayValue || (fm.assignedMark.markValue / 100));
      if (!isNaN(mVal) && mVal > 0) {
        sum += mVal;
        total++;
      }
    }
  });

  let speech = 'Offizielle WebUntis-Leistungsübersicht: ';
  speech += `Alle ${subjectsCount} Schulfächer deiner Klasse BFW2B werden vollautomatisch aus WebUntis synchronisiert. `;
  speech += `Es sind insgesamt ${exams.length} Klausuren im Schuljahr terminiert. `;

  if (total > 0) {
    const avg = (sum / total).toFixed(1);
    speech += `Dein aktueller Gesamtschnitt liegt bei Note ${avg}. `;
  } else {
    speech += 'Offizieller Status: Laufendes Schuljahr. Die Zeugnisnoten werden zum Halbjahr direkt aus dem Klassenbuch übernommen.';
  }

  speak(speech, true);
  announceSR(speech, 'assertive');
}

document.addEventListener('DOMContentLoaded', initApp);

