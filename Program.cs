using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Net;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading;
using System.Windows.Forms;

namespace BarrierefreierStundenplan
{
    static class Program
    {
        [DllImport("kernel32.dll")]
        private static extern IntPtr GetConsoleWindow();

        [DllImport("user32.dll")]
        private static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        private const int SW_HIDE = 0;
        private const int DEFAULT_PORT = 48250;
        private static int _activePort = DEFAULT_PORT;
        private const string DEFAULT_WEBUNTIS_URL = "https://lwl-bk-soest.webuntis.com/WebUntis/jsonrpc.do?school=lwl-bk-soest";
        
        // GitHub Auto-Updater Konfiguration
        private const string GITHUB_REPO = "Lauju1909/BarrierefreierStundenplanLWL";
        private const string GITHUB_RAW_BASE = "https://raw.githubusercontent.com/" + GITHUB_REPO + "/main";
        private const string VERSION_URL = GITHUB_RAW_BASE + "/version.json";

        private static HttpListener _listener;
        private static bool _isRunning = true;
        private static string _baseDir;
        private static Assembly _assembly;
        private static ManualResetEvent _exitEvent = new ManualResetEvent(false);

        // State für automatisches Beenden bei Alt+F4 / Fensterschließen
        private static readonly object _shutdownLock = new object();
        private static System.Threading.Timer _closingTimer = null;
        private static bool _closingPending = false;
        private static DateTime _lastActivity = DateTime.UtcNow;
        private static bool _pageHasLoaded = false;
        private static bool _isWindowHidden = false;

        [STAThread]
        static void Main()
        {
            // 1. Konsole sofort unsichtbar machen
            try
            {
                IntPtr consoleHwnd = GetConsoleWindow();
                if (consoleHwnd != IntPtr.Zero)
                {
                    ShowWindow(consoleHwnd, SW_HIDE);
                }
            }
            catch { }

            _baseDir = AppDomain.CurrentDomain.BaseDirectory;
            _assembly = Assembly.GetExecutingAssembly();

            // Vorherige temporäre Update-Dateien bereinigen
            try
            {
                string exePath = Process.GetCurrentProcess().MainModule.FileName;
                string oldPath = exePath + ".old";
                if (File.Exists(oldPath)) File.Delete(oldPath);
                string updPath = Path.Combine(_baseDir, "Stundenplan_LWL_Update.exe");
                if (File.Exists(updPath)) File.Delete(updPath);
            }
            catch { }

            // 2. Prüfen, ob bereits eine Instanz auf Port 48250 lauscht
            if (IsPortInUse(DEFAULT_PORT))
            {
                LaunchBestBrowser("http://127.0.0.1:" + DEFAULT_PORT + "/index.html");
                return;
            }

            try
            {
                try
                {
                    ServicePointManager.SecurityProtocol = (SecurityProtocolType)3072 | (SecurityProtocolType)12288 | SecurityProtocolType.Tls12;
                    ServicePointManager.DefaultConnectionLimit = 50;
                }
                catch { }

                // 3. Starte HttpListener mit Port-Fallback
                bool serverStarted = false;
                for (int p = DEFAULT_PORT; p <= DEFAULT_PORT + 5; p++)
                {
                    try
                    {
                        _listener = new HttpListener();
                        _listener.Prefixes.Add("http://127.0.0.1:" + p + "/");
                        _listener.Start();
                        _activePort = p;
                        serverStarted = true;
                        break;
                    }
                    catch
                    {
                        try { _listener.Close(); } catch { }
                    }
                }

                if (!serverStarted)
                {
                    MessageBox.Show("Der lokale Webserver konnte nicht gestartet werden. Bitte starte deinen Rechner neu.",
                        "Stundenplan LWL", MessageBoxButtons.OK, MessageBoxIcon.Warning);
                    return;
                }

                // 4. Server-Thread im Hintergrund starten
                Thread serverThread = new Thread(ListenLoop);
                serverThread.IsBackground = true;
                serverThread.Start();

                // 5. Asynchronen Auto-Update-Check beim Start ausführen
                CheckAndApplyUpdateAsync();

                // 6. Periodischer Hintergrund-Update-Check alle 30 Minuten
                Thread updateTimerThread = new Thread(() =>
                {
                    while (_isRunning)
                    {
                        Thread.Sleep(30 * 60 * 1000);
                        if (!_isRunning) break;
                        try { CheckAndApplyUpdate(); } catch { }
                    }
                });
                updateTimerThread.IsBackground = true;
                updateTimerThread.Start();

                // 7. Watchdog für automatisches Beenden bei Fensterschließen / Alt+F4
                Thread watchdogThread = new Thread(() =>
                {
                    while (_isRunning)
                    {
                        Thread.Sleep(2000);
                        if (!_isRunning) break;
                        lock (_shutdownLock)
                        {
                            // Sobald die Seite mindestens einmal geladen wurde und im sichtbaren Fenster
                            // seit über 8 Sekunden kein Signal mehr empfangen wurde: Beenden
                            if (_pageHasLoaded && !_isWindowHidden && (DateTime.UtcNow - _lastActivity).TotalSeconds > 8)
                            {
                                Environment.Exit(0);
                                break;
                            }
                        }
                    }
                });
                watchdogThread.IsBackground = true;
                watchdogThread.Start();

                string launchUrl = "http://127.0.0.1:" + _activePort + "/index.html";

                // 8. Browser öffnen
                LaunchBestBrowser(launchUrl);

                // 9. Blockieren bis Beenden-Signal
                _exitEvent.WaitOne();
                Environment.Exit(0);
            }
            catch (Exception ex)
            {
                try
                {
                    File.WriteAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "error.log"), ex.ToString());
                }
                catch { }
                MessageBox.Show("Hinweis beim Starten des Stundenplans: " + ex.Message,
                    "LWL Berufskolleg Soest", MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
            finally
            {
                _isRunning = false;
                if (_listener != null && _listener.IsListening)
                {
                    try { _listener.Stop(); } catch { }
                    try { _listener.Close(); } catch { }
                }
            }
        }

        private static bool IsPortInUse(int port)
        {
            try
            {
                using (TcpClient tcp = new TcpClient())
                {
                    IAsyncResult ar = tcp.BeginConnect("127.0.0.1", port, null, null);
                    bool success = ar.AsyncWaitHandle.WaitOne(300, false);
                    if (success && tcp.Connected)
                    {
                        tcp.EndConnect(ar);
                        return true;
                    }
                }
            }
            catch { }
            return false;
        }

        public static string GetLocalVersion()
        {
            // 1. Zuerst aus der eingebetteten Ressource der EXE lesen (autark)
            if (_assembly != null)
            {
                try
                {
                    foreach (string name in _assembly.GetManifestResourceNames())
                    {
                        if (name.EndsWith("version.json", StringComparison.OrdinalIgnoreCase))
                        {
                            using (Stream stream = _assembly.GetManifestResourceStream(name))
                            {
                                if (stream != null)
                                {
                                    using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
                                    {
                                        string txt = reader.ReadToEnd();
                                        Match m = Regex.Match(txt, "\"version\"\\s*:\\s*\"v?([^\"]+)\"");
                                        if (m.Success) return m.Groups[1].Value.Trim();
                                    }
                                }
                            }
                        }
                    }
                }
                catch { }
            }

            // 2. Fallback: Datei auf Disk prüfen
            string vPath = Path.Combine(_baseDir, "version.json");
            if (File.Exists(vPath))
            {
                try
                {
                    string txt = File.ReadAllText(vPath, Encoding.UTF8);
                    Match m = Regex.Match(txt, "\"version\"\\s*:\\s*\"v?([^\"]+)\"");
                    if (m.Success) return m.Groups[1].Value.Trim();
                }
                catch { }
            }
            return "1.4.1";
        }

        private static bool IsNewerVersion(string remote, string local)
        {
            try
            {
                Version r = new Version(remote.Trim('v', 'V'));
                Version l = new Version(local.Trim('v', 'V'));
                return r > l;
            }
            catch
            {
                return !string.Equals(remote.Trim(), local.Trim(), StringComparison.OrdinalIgnoreCase);
            }
        }

        private static void CheckAndApplyUpdateAsync()
        {
            ThreadPool.QueueUserWorkItem((_) =>
            {
                try
                {
                    CheckAndApplyUpdate();
                }
                catch { }
            });
        }

        public static bool CheckAndApplyUpdate()
        {
            try
            {
                string localVer = GetLocalVersion();
                long ticks = DateTime.UtcNow.Ticks;
                string verUrl = VERSION_URL + "?t=" + ticks;

                using (var client = new WebClient())
                {
                    client.Headers.Add("User-Agent", "StundenplanLWL-AutoUpdater");
                    client.Headers.Add("Cache-Control", "no-cache");
                    client.Headers.Add("Pragma", "no-cache");

                    string remoteJson = client.DownloadString(verUrl);
                    Match m = Regex.Match(remoteJson, "\"version\"\\s*:\\s*\"v?([^\"]+)\"");
                    if (!m.Success) return false;

                    string remoteVer = m.Groups[1].Value.Trim();
                    if (IsNewerVersion(remoteVer, localVer))
                    {
                        string currentExe = Process.GetCurrentProcess().MainModule.FileName;
                        string tempExe = Path.Combine(_baseDir, "Stundenplan_LWL_Update.exe");
                        string oldExe = currentExe + ".old";

                        string downloadUrl = "https://github.com/" + GITHUB_REPO + "/releases/latest/download/Stundenplan_LWL.exe";
                        client.DownloadFile(downloadUrl, tempExe);

                        FileInfo fi = new FileInfo(tempExe);
                        if (fi.Exists && fi.Length > 25000)
                        {
                            if (File.Exists(oldExe))
                            {
                                try { File.Delete(oldExe); } catch { }
                            }

                            // 1. Laufende EXE umbenennen (unter Windows NTFS bei laufendem Prozess erlaubt)
                            File.Move(currentExe, oldExe);

                            // 2. Neue EXE an die Originalstelle setzen
                            File.Move(tempExe, currentExe);

                            // 3. Im Hintergrund nach kurzer Pause neu starten
                            ThreadPool.QueueUserWorkItem((_) =>
                            {
                                try
                                {
                                    Thread.Sleep(1500);
                                    Process.Start(currentExe);
                                    Environment.Exit(0);
                                }
                                catch { }
                            });

                            return true;
                        }
                    }
                }
            }
            catch { }
            return false;
        }

        private static void ListenLoop()
        {
            while (_isRunning && _listener != null && _listener.IsListening)
            {
                try
                {
                    HttpListenerContext context = _listener.GetContext();
                    ThreadPool.QueueUserWorkItem((ctx) => HandleRequest((HttpListenerContext)ctx), context);
                }
                catch
                {
                    if (!_isRunning) break;
                }
            }
        }

        private static void HandleRequest(HttpListenerContext context)
        {
            HttpListenerRequest req = context.Request;
            HttpListenerResponse resp = context.Response;

            resp.Headers["Access-Control-Allow-Origin"] = "*";
            resp.Headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
            resp.Headers["Access-Control-Allow-Headers"] = "Content-Type, X-School, X-Server, X-JSESSIONID, X-Endpoint, X-Untis-Secret, X-Untis-User, Authorization, *";

            if (req.HttpMethod == "OPTIONS")
            {
                resp.StatusCode = 200;
                resp.Close();
                return;
            }

            string rawUrl = req.RawUrl.Split('?')[0];

            // Aktivität registrieren (hält Watchdog aktiv)
            if (rawUrl != "/api/window_closing" && rawUrl != "/api/shutdown")
            {
                lock (_shutdownLock)
                {
                    _lastActivity = DateTime.UtcNow;
                    _pageHasLoaded = true;
                }
            }

            // Nur wenn die HTML-Hauptseite neu geladen wird (z. B. bei F5/Reload),
            // wird ein anstehender Schließ-Timer storniert:
            if (rawUrl == "/index.html" || rawUrl == "/")
            {
                lock (_shutdownLock)
                {
                    if (_closingPending)
                    {
                        _closingPending = false;
                        if (_closingTimer != null)
                        {
                            try { _closingTimer.Dispose(); } catch { }
                            _closingTimer = null;
                        }
                    }
                }
            }

            // 1. Health-Check / Ping / Heartbeat
            if (rawUrl == "/api/ping")
            {
                string q = req.Url != null ? req.Url.Query : "";
                if (!string.IsNullOrEmpty(q) && q.IndexOf("hidden", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    lock (_shutdownLock) { _isWindowHidden = true; }
                }
                else
                {
                    lock (_shutdownLock) { _isWindowHidden = false; }
                }

                resp.StatusCode = 200;
                resp.ContentType = "application/json";
                byte[] pong = Encoding.UTF8.GetBytes("{\"status\":\"ok\"}");
                resp.OutputStream.Write(pong, 0, pong.Length);
                resp.Close();
                return;
            }

            // 2. Fenster wird geschlossen / Entladen (Alt+F4, Kreuz oder Tab schließen)
            if (rawUrl == "/api/window_closing")
            {
                resp.StatusCode = 200;
                resp.ContentType = "application/json";
                byte[] bye = Encoding.UTF8.GetBytes("{\"status\":\"closing_scheduled\"}");
                resp.OutputStream.Write(bye, 0, bye.Length);
                resp.Close();

                lock (_shutdownLock)
                {
                    _closingPending = true;
                    if (_closingTimer != null)
                    {
                        try { _closingTimer.Dispose(); } catch { }
                    }
                    _closingTimer = new System.Threading.Timer((_) =>
                    {
                        lock (_shutdownLock)
                        {
                            if (_closingPending)
                            {
                                Environment.Exit(0);
                            }
                        }
                    }, null, 1500, Timeout.Infinite);
                }
                return;
            }

            // 3. Sofortiges Beenden-Signal (Alt+F4 Tastendruck oder Beenden-Button)
            if (rawUrl == "/api/shutdown")
            {
                resp.StatusCode = 200;
                resp.ContentType = "application/json";
                byte[] bye = Encoding.UTF8.GetBytes("{\"status\":\"shutting_down\"}");
                resp.OutputStream.Write(bye, 0, bye.Length);
                resp.Close();

                ThreadPool.QueueUserWorkItem((_) =>
                {
                    Thread.Sleep(150);
                    Environment.Exit(0);
                });
                return;
            }

            // 3. Version & Auto-Update API
            if (rawUrl == "/api/version")
            {
                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                string vPath = Path.Combine(_baseDir, "version.json");
                byte[] vData;
                if (File.Exists(vPath))
                {
                    vData = File.ReadAllBytes(vPath);
                }
                else
                {
                    vData = Encoding.UTF8.GetBytes(string.Format("{{\"version\":\"{0}\",\"name\":\"Barrierefreier Stundenplan LWL\"}}", GetLocalVersion()));
                }
                resp.OutputStream.Write(vData, 0, vData.Length);
                resp.Close();
                return;
            }

            if (rawUrl == "/api/update/check")
            {
                bool updated = CheckAndApplyUpdate();
                string curVer = GetLocalVersion();
                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                byte[] resData = Encoding.UTF8.GetBytes(string.Format("{{\"updated\":{0},\"currentVersion\":\"{1}\"}}", updated ? "true" : "false", curVer));
                resp.OutputStream.Write(resData, 0, resData.Length);
                resp.Close();
                return;
            }

            // 3b. Untis TOTP Generator & Auth Helper API
            if (rawUrl.StartsWith("/api/untis/otp"))
            {
                string secret = req.QueryString["secret"];
                long ts = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
                int otp = GenerateTotp(secret, ts);
                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                byte[] okData = Encoding.UTF8.GetBytes(string.Format("{{\"otp\":{0},\"otpStr\":\"{1}\",\"clientTime\":{2}}}", otp, otp.ToString("D6"), ts));
                resp.OutputStream.Write(okData, 0, okData.Length);
                resp.Close();
                return;
            }

            // 3c. Untis Mobile Authentifizierung (C# Server-Side)
            if (req.HttpMethod == "POST" && rawUrl == "/api/untis/mobile_auth")
            {
                string body = "";
                using (var reader = new StreamReader(req.InputStream, req.ContentEncoding))
                {
                    body = reader.ReadToEnd();
                }

                string u = "", p = "", sc = "lwl-bk-soest", sv = "lwl-bk-soest.webuntis.com";
                Match mu = Regex.Match(body, "\"username\"\\s*:\\s*\"([^\"]+)\"");
                if (!mu.Success) mu = Regex.Match(body, "\"user\"\\s*:\\s*\"([^\"]+)\"");
                if (mu.Success) u = mu.Groups[1].Value;

                Match mp = Regex.Match(body, "\"password\"\\s*:\\s*\"([^\"]+)\"");
                if (mp.Success) p = mp.Groups[1].Value;

                Match msc = Regex.Match(body, "\"school\"\\s*:\\s*\"([^\"]+)\"");
                if (msc.Success) sc = msc.Groups[1].Value;

                Match msv = Regex.Match(body, "\"server\"\\s*:\\s*\"([^\"]+)\"");
                if (msv.Success) sv = msv.Groups[1].Value;

                string authResJson = ExecuteUntisMobileAuth(u, p, sc, sv);

                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                byte[] okData = Encoding.UTF8.GetBytes(authResJson);
                resp.OutputStream.Write(okData, 0, okData.Length);
                resp.Close();
                return;
            }

            // 3d. Debug Log API (Abruf des Live-WebUntis-Logs)
            if (rawUrl == "/api/debug_log")
            {
                string logContent = "Kein Log vorhanden.";
                string p1 = Path.Combine(@"C:\Users\lauri\Documents", "webuntis_debug.log");
                string p2 = Path.Combine(_baseDir, "webuntis_debug.log");
                if (File.Exists(p1)) { try { logContent = File.ReadAllText(p1, Encoding.UTF8); } catch { } }
                else if (File.Exists(p2)) { try { logContent = File.ReadAllText(p2, Encoding.UTF8); } catch { } }

                resp.StatusCode = 200;
                resp.ContentType = "text/plain; charset=utf-8";
                byte[] logData = Encoding.UTF8.GetBytes(logContent);
                resp.OutputStream.Write(logData, 0, logData.Length);
                resp.Close();
                return;
            }

            // 3e. Externe URLs sicher im Standard-Browser öffnen
            if (rawUrl.StartsWith("/api/open_url"))
            {
                string url = req.QueryString["url"];
                if (!string.IsNullOrEmpty(url) && (url.StartsWith("http://") || url.StartsWith("https://")))
                {
                    ThreadPool.QueueUserWorkItem((_) =>
                    {
                        try
                        {
                            Process.Start(new ProcessStartInfo
                            {
                                FileName = url,
                                UseShellExecute = true
                            });
                        }
                        catch { }
                    });
                }
                resp.StatusCode = 200;
                resp.ContentType = "application/json";
                byte[] okData = Encoding.UTF8.GetBytes("{\"status\":\"opened\"}");
                resp.OutputStream.Write(okData, 0, okData.Length);
                resp.Close();
                return;
            }

            // 4. Feedback & Archiv API (Lokal & E-Mail Weiterleitung an lauju1909@gmail.com)
            if (req.HttpMethod == "POST" && rawUrl == "/api/send_feedback")
            {
                string body = "";
                try
                {
                    using (var reader = new StreamReader(req.InputStream, req.ContentEncoding))
                    {
                        body = reader.ReadToEnd();
                    }

                    // 1. Lokales Archiv in Feedback_Archiv.txt speichern
                    string logPath = Path.Combine(_baseDir, "Feedback_Archiv.txt");
                    string entry = "\r\n[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss") + "]\r\n" + body + "\r\n----------------------------------\r\n";
                    File.AppendAllText(logPath, entry, Encoding.UTF8);

                    // 2. E-Mail Versand an lauju1909@gmail.com über formsubmit.co
                    ThreadPool.QueueUserWorkItem((_) =>
                    {
                        try
                        {
                            using (var wbMail = new WebClient())
                            {
                                wbMail.Headers[HttpRequestHeader.ContentType] = "application/json";
                                wbMail.Headers[HttpRequestHeader.Accept] = "application/json";
                                wbMail.Headers["User-Agent"] = "StundenplanLWL-Feedback";
                                wbMail.Encoding = Encoding.UTF8;
                                wbMail.UploadString("https://formsubmit.co/ajax/lauju1909@gmail.com", body);
                            }
                        }
                        catch { }
                    });

                    resp.StatusCode = 200;
                    resp.ContentType = "application/json; charset=utf-8";
                    byte[] okData = Encoding.UTF8.GetBytes("{\"status\":\"success\",\"message\":\"Feedback erfolgreich gespeichert und übertragen.\"}");
                    resp.OutputStream.Write(okData, 0, okData.Length);
                }
                catch (Exception ex)
                {
                    resp.StatusCode = 500;
                    byte[] errData = Encoding.UTF8.GetBytes("{\"status\":\"error\",\"message\":\"" + EscapeJsonString(ex.Message) + "\"}");
                    resp.OutputStream.Write(errData, 0, errData.Length);
                }
                resp.Close();
                return;
            }

            if (req.HttpMethod == "GET" && rawUrl == "/api/feedback_archive")
            {
                string logPath = Path.Combine(_baseDir, "Feedback_Archiv.txt");
                string logContent = "";
                if (File.Exists(logPath))
                {
                    try
                    {
                        logContent = File.ReadAllText(logPath, Encoding.UTF8);
                    }
                    catch { }
                }

                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                string escaped = EscapeJsonString(logContent);
                byte[] archData = Encoding.UTF8.GetBytes("{\"content\":\"" + escaped + "\"}");
                resp.OutputStream.Write(archData, 0, archData.Length);
                resp.Close();
                return;
            }

            if (req.HttpMethod == "POST" && rawUrl == "/api/feedback_archive/clear")
            {
                string logPath = Path.Combine(_baseDir, "Feedback_Archiv.txt");
                try
                {
                    if (File.Exists(logPath))
                    {
                        File.WriteAllText(logPath, "", Encoding.UTF8);
                    }
                }
                catch { }

                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                byte[] okData = Encoding.UTF8.GetBytes("{\"status\":\"cleared\"}");
                resp.OutputStream.Write(okData, 0, okData.Length);
                resp.Close();
                return;
            }

            if (rawUrl == "/api/open_feedback_zentrale")
            {
                ThreadPool.QueueUserWorkItem((_) =>
                {
                    try
                    {
                        string exePath = Path.Combine(_baseDir, "Feedback_Zentrale.exe");
                        if (File.Exists(exePath))
                        {
                            Process.Start(new ProcessStartInfo
                            {
                                FileName = exePath,
                                UseShellExecute = true
                            });
                        }
                        else
                        {
                            string htmlPath = Path.Combine(_baseDir, "Feedback_Inbox.html");
                            if (File.Exists(htmlPath))
                            {
                                LaunchBestBrowser("file:///" + htmlPath.Replace('\\', '/'));
                            }
                        }
                    }
                    catch { }
                });

                resp.StatusCode = 200;
                resp.ContentType = "application/json; charset=utf-8";
                byte[] okData = Encoding.UTF8.GetBytes("{\"status\":\"launched\"}");
                resp.OutputStream.Write(okData, 0, okData.Length);
                resp.Close();
                return;
            }

            // 5. WebUntis API Proxy Endpoint (JSON-RPC & REST, GET & POST)
            if (rawUrl.StartsWith("/api/webuntis"))
            {
                ProxyWebUntis(req, resp);
                return;
            }

            // 5. Integrierte statische Dateien (HTML, CSS, JS) aus Disk oder EXE servieren
            string filename = rawUrl.TrimStart('/');
            if (string.IsNullOrEmpty(filename) || filename == "/")
            {
                filename = "index.html";
            }

            string contentType;
            byte[] content = GetFileOrResourceBytes(filename, out contentType);
            if (content != null)
            {
                resp.StatusCode = 200;
                resp.ContentType = contentType;
                resp.ContentLength64 = content.Length;
                resp.OutputStream.Write(content, 0, content.Length);
                resp.OutputStream.Flush();
                resp.Close();
            }
            else
            {
                resp.StatusCode = 404;
                byte[] notFound = Encoding.UTF8.GetBytes("Datei nicht gefunden");
                resp.OutputStream.Write(notFound, 0, notFound.Length);
                resp.Close();
            }
        }

        private static byte[] GetFileOrResourceBytes(string filename, out string contentType)
        {
            contentType = "text/html; charset=utf-8";
            string ext = Path.GetExtension(filename).ToLower();
            if (ext == ".css") contentType = "text/css; charset=utf-8";
            else if (ext == ".js") contentType = "application/javascript; charset=utf-8";
            else if (ext == ".json") contentType = "application/json; charset=utf-8";
            else if (ext == ".html") contentType = "text/html; charset=utf-8";

            // 1. Direkt aus den internen Ressourcen der EXE laden (100% autark)
            if (_assembly != null)
            {
                string resName = null;
                foreach (string name in _assembly.GetManifestResourceNames())
                {
                    if (name.EndsWith(filename, StringComparison.OrdinalIgnoreCase))
                    {
                        resName = name;
                        break;
                    }
                }

                if (!string.IsNullOrEmpty(resName))
                {
                    using (Stream stream = _assembly.GetManifestResourceStream(resName))
                    {
                        if (stream != null)
                        {
                            using (MemoryStream ms = new MemoryStream())
                            {
                                stream.CopyTo(ms);
                                return ms.ToArray();
                            }
                        }
                    }
                }
            }

            // 2. Fallback: Datei im Ordner prüfen
            string diskPath = Path.Combine(_baseDir, filename);
            if (File.Exists(diskPath))
            {
                try
                {
                    return File.ReadAllBytes(diskPath);
                }
                catch { }
            }

            return null;
        }

        private static string _untisUser = null;
        private static string _untisSecret = null;
        private static string _untisJwt = null;
        private static string _untisSchool = "lwl-bk-soest";
        private static string _untisServer = "lwl-bk-soest.webuntis.com";
        private static int _untisPersonId = 0;

        private static string ExecuteUntisMobileAuth(string user, string pass, string sch, string srv)
        {
            if (string.IsNullOrEmpty(user) || string.IsNullOrEmpty(pass)) return "{\"error\":\"Missing credentials\"}";
            if (string.IsNullOrEmpty(sch)) sch = "lwl-bk-soest";
            if (string.IsNullOrEmpty(srv)) srv = "lwl-bk-soest.webuntis.com";

            _untisUser = user;
            _untisSchool = sch;
            _untisServer = srv;

            LogUntis(string.Format("Starting Untis Mobile Auth for user={0}, school={1}", user, sch));

            // Step 1: getAppSharedSecret
            try
            {
                string secUrl = string.Format("https://{0}/WebUntis/jsonrpc_intern.do?school={1}&m=getAppSharedSecret&a=false&s={0}&v=a6.7.0", srv, sch);
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(secUrl);
                req.Method = "POST";
                req.ContentType = "application/json; charset=utf-8";
                req.UserAgent = "WebUntis/Mobile (Android; de)";
                req.Timeout = 15000;

                string secBody = string.Format("{{\"id\":\"untis-mobile-android-6.7.0\",\"jsonrpc\":\"2.0\",\"method\":\"getAppSharedSecret\",\"params\":[{{\"password\":\"{0}\",\"userName\":\"{1}\"}}]}}",
                    EscapeJsonString(pass), EscapeJsonString(user));
                byte[] b = Encoding.UTF8.GetBytes(secBody);
                req.ContentLength = b.Length;
                using (Stream s = req.GetRequestStream()) { s.Write(b, 0, b.Length); }

                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                {
                    string resJson = sr.ReadToEnd();
                    LogUntis("getAppSharedSecret RESP: " + resJson);
                    Match m = Regex.Match(resJson, "\"result\"\\s*:\\s*\"([^\"]+)\"");
                    if (m.Success && !string.IsNullOrEmpty(m.Groups[1].Value))
                    {
                        _untisSecret = m.Groups[1].Value.Trim();
                        LogUntis("App Shared Secret obtained: " + _untisSecret.Substring(0, Math.Min(4, _untisSecret.Length)) + "***");
                    }
                }
            }
            catch (Exception ex)
            {
                LogUntis("getAppSharedSecret EX: " + ex.Message);
            }

            // Step 2: getAuthToken with TOTP if secret available
            if (!string.IsNullOrEmpty(_untisSecret))
            {
                try
                {
                    long nowMs = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
                    int otp = GenerateTotp(_untisSecret, nowMs);

                    string tokUrl = string.Format("https://{0}/WebUntis/jsonrpc_intern.do?school={1}&m=getAuthToken&a=false&s={0}&v=a6.7.0", srv, sch);
                    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(tokUrl);
                    req.Method = "POST";
                    req.ContentType = "application/json; charset=utf-8";
                    req.UserAgent = "WebUntis/Mobile (Android; de)";
                    req.Timeout = 15000;

                    string tokBody = string.Format("{{\"id\":\"untis-mobile-android-6.7.0\",\"jsonrpc\":\"2.0\",\"method\":\"getAuthToken\",\"params\":[{{\"auth\":{{\"clientTime\":{0},\"otp\":{1},\"user\":\"{2}\"}}}}]}}",
                        nowMs, otp, EscapeJsonString(user));
                    byte[] b = Encoding.UTF8.GetBytes(tokBody);
                    req.ContentLength = b.Length;
                    using (Stream s = req.GetRequestStream()) { s.Write(b, 0, b.Length); }

                    using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                    using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                    {
                        string resJson = sr.ReadToEnd();
                        LogUntis("getAuthToken RESP: " + resJson.Substring(0, Math.Min(120, resJson.Length)));
                        Match m = Regex.Match(resJson, "\"token\"\\s*:\\s*\"([^\"]+)\"");
                        if (m.Success)
                        {
                            _untisJwt = m.Groups[1].Value.Trim();
                        }
                    }
                }
                catch (Exception ex)
                {
                    LogUntis("getAuthToken EX: " + ex.Message);
                }
            }

            // Step 3: Fallback /api/mobile/v2/{school}/authentication if no JWT yet
            if (string.IsNullOrEmpty(_untisJwt))
            {
                try
                {
                    string authUrl = string.Format("https://{0}/WebUntis/api/mobile/v2/{1}/authentication", srv, sch);
                    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(authUrl);
                    req.Method = "POST";
                    req.ContentType = "application/json; charset=utf-8";
                    req.UserAgent = "WebUntis/Mobile (Android; de)";
                    req.Timeout = 15000;

                    string authBody = string.Format("{{\"username\":\"{0}\",\"password\":\"{1}\"}}", EscapeJsonString(user), EscapeJsonString(pass));
                    byte[] b = Encoding.UTF8.GetBytes(authBody);
                    req.ContentLength = b.Length;
                    using (Stream s = req.GetRequestStream()) { s.Write(b, 0, b.Length); }

                    using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                    using (StreamReader sr = new StreamReader(resp.GetResponseStream(), Encoding.UTF8))
                    {
                        string resJson = sr.ReadToEnd();
                        LogUntis("mobile/v2/authentication RESP: " + resJson.Substring(0, Math.Min(120, resJson.Length)));
                        Match m = Regex.Match(resJson, "\"jwt\"\\s*:\\s*\"([^\"]+)\"");
                        if (m.Success)
                        {
                            _untisJwt = m.Groups[1].Value.Trim();
                        }
                    }
                }
                catch (Exception ex)
                {
                    LogUntis("mobile/v2/authentication EX: " + ex.Message);
                }
            }

            // Step 4: Extract person_id from JWT payload if present
            if (!string.IsNullOrEmpty(_untisJwt))
            {
                try
                {
                    string[] parts = _untisJwt.Split('.');
                    if (parts.Length >= 2)
                    {
                        string payload = parts[1];
                        int pad = 4 - (payload.Length % 4);
                        if (pad < 4) payload += new string('=', pad);
                        byte[] claimsBytes = Convert.FromBase64String(payload.Replace('-', '+').Replace('_', '/'));
                        string claimsJson = Encoding.UTF8.GetString(claimsBytes);
                        LogUntis("JWT Claims: " + claimsJson);
                        Match mp = Regex.Match(claimsJson, "\"person_id\"\\s*:\\s*(\\d+)");
                        if (mp.Success)
                        {
                            _untisPersonId = int.Parse(mp.Groups[1].Value);
                        }
                    }
                }
                catch { }
            }

            return string.Format("{{\"success\":{0},\"appSharedSecret\":\"{1}\",\"jwtToken\":\"{2}\",\"personId\":{3}}}",
                (!string.IsNullOrEmpty(_untisJwt) || !string.IsNullOrEmpty(_untisSecret)) ? "true" : "false",
                EscapeJsonString(_untisSecret ?? ""),
                EscapeJsonString(_untisJwt ?? ""),
                _untisPersonId);
        }

        private static readonly object _debugLock = new object();
        private static void LogUntis(string msg)
        {
            try
            {
                lock (_debugLock)
                {
                    string line = "[" + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss.fff") + "] " + msg + "\r\n";
                    List<string> targetPaths = new List<string>();

                    targetPaths.Add(Path.Combine(@"C:\Users\lauri\Documents", "webuntis_debug.log"));
                    targetPaths.Add(Path.Combine(_baseDir, "webuntis_debug.log"));
                    targetPaths.Add(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "webuntis_debug.log"));
                    try
                    {
                        string docDir = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
                        if (!string.IsNullOrEmpty(docDir)) targetPaths.Add(Path.Combine(docDir, "webuntis_debug.log"));
                    }
                    catch { }

                    foreach (string logFile in targetPaths)
                    {
                        try
                        {
                            string dir = Path.GetDirectoryName(logFile);
                            if (Directory.Exists(dir))
                            {
                                if (File.Exists(logFile) && new FileInfo(logFile).Length > 1024 * 1024)
                                {
                                    try { File.Delete(logFile); } catch { }
                                }
                                File.AppendAllText(logFile, line, Encoding.UTF8);
                            }
                        }
                        catch { }
                    }
                }
            }
            catch { }
        }

        public static int GenerateTotp(string secret, long timestampMs)
        {
            try
            {
                if (string.IsNullOrEmpty(secret)) return 0;
                long step = (timestampMs / 1000) / 30;
                byte[] key = Base32Decode(secret);
                byte[] msg = BitConverter.GetBytes(step);
                if (BitConverter.IsLittleEndian) Array.Reverse(msg);

                using (HMACSHA1 hmac = new HMACSHA1(key))
                {
                    byte[] hash = hmac.ComputeHash(msg);
                    int offset = hash[hash.Length - 1] & 0x0F;
                    int binary = ((hash[offset] & 0x7F) << 24) |
                                 ((hash[offset + 1] & 0xFF) << 16) |
                                 ((hash[offset + 2] & 0xFF) << 8) |
                                 (hash[offset + 3] & 0xFF);
                    return binary % 1000000;
                }
            }
            catch
            {
                return 0;
            }
        }

        public static byte[] Base32Decode(string input)
        {
            if (string.IsNullOrEmpty(input)) return new byte[0];
            input = input.Trim().TrimEnd('=').ToUpperInvariant();
            const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
            int outputLen = input.Length * 5 / 8;
            byte[] result = new byte[outputLen];
            int curByte = 0, bitsLeft = 8;
            int outIndex = 0;
            for (int i = 0; i < input.Length; i++)
            {
                int val = alphabet.IndexOf(input[i]);
                if (val < 0) continue;
                if (bitsLeft > 5)
                {
                    curByte = (curByte << 5) | val;
                    bitsLeft -= 5;
                }
                else
                {
                    int shift = 5 - bitsLeft;
                    curByte = (curByte << bitsLeft) | (val >> shift);
                    if (outIndex < outputLen) result[outIndex++] = (byte)curByte;
                    curByte = val & ((1 << shift) - 1);
                    bitsLeft = 8 - shift;
                }
            }
            return result;
        }

        private static void ProxyWebUntis(HttpListenerRequest req, HttpListenerResponse resp)
        {
            string schoolHeader = req.Headers["X-School"];
            string serverHeader = req.Headers["X-Server"];
            string sessionId = req.Headers["X-JSESSIONID"];
            string customEndpoint = req.Headers["X-Endpoint"];
            string untisSecret = req.Headers["X-Untis-Secret"];
            if (string.IsNullOrEmpty(untisSecret)) untisSecret = _untisSecret;
            string untisUser = req.Headers["X-Untis-User"];
            if (string.IsNullOrEmpty(untisUser)) untisUser = _untisUser;

            string srv = !string.IsNullOrEmpty(serverHeader) ? serverHeader : (!string.IsNullOrEmpty(_untisServer) ? _untisServer : "lwl-bk-soest.webuntis.com");
            string sch = !string.IsNullOrEmpty(schoolHeader) ? schoolHeader : (!string.IsNullOrEmpty(_untisSchool) ? _untisSchool : "lwl-bk-soest");

            string targetUrl;
            if (!string.IsNullOrEmpty(customEndpoint))
            {
                string ep = customEndpoint.StartsWith("/") ? customEndpoint : "/" + customEndpoint;
                if (ep.StartsWith("/WebUntis/", StringComparison.OrdinalIgnoreCase))
                {
                    ep = ep.Substring(9);
                }
                if (!ep.Contains("school="))
                {
                    string queryChar = ep.Contains("?") ? "&" : "?";
                    ep = ep + queryChar + "school=" + sch;
                }
                if (ep.Contains("jsonrpc_intern.do"))
                {
                    if (!ep.Contains("v=")) ep += "&v=a6.7.0";
                    if (!ep.Contains("a=")) ep += "&a=false";
                    if (!ep.Contains("s=")) ep += "&s=" + srv;
                }
                targetUrl = string.Format("https://{0}/WebUntis{1}", srv, ep);
            }
            else
            {
                if (!string.IsNullOrEmpty(sessionId))
                {
                    targetUrl = string.Format("https://{0}/WebUntis/jsonrpc.do;jsessionid={1}?school={2}", srv, sessionId, sch);
                }
                else
                {
                    targetUrl = string.Format("https://{0}/WebUntis/jsonrpc.do?school={1}", srv, sch);
                }
            }

            try
            {
                HttpWebRequest outReq = (HttpWebRequest)WebRequest.Create(targetUrl);
                outReq.Method = req.HttpMethod;
                outReq.Timeout = 20000;
                outReq.UserAgent = "WebUntis/Mobile (Android; de)";
                outReq.Accept = "application/json, text/plain, */*";

                outReq.CookieContainer = new CookieContainer();
                if (!string.IsNullOrEmpty(sessionId))
                {
                    try
                    {
                        Uri targetUri = new Uri(targetUrl);
                        outReq.CookieContainer.Add(new Cookie("JSESSIONID", sessionId, "/", targetUri.Host));
                        outReq.CookieContainer.Add(new Cookie("JSESSIONID", sessionId, "/WebUntis", targetUri.Host));
                    }
                    catch { }
                }

                string authHeader = req.Headers["Authorization"];
                if (!string.IsNullOrEmpty(authHeader))
                {
                    outReq.Headers["Authorization"] = authHeader;
                }
                else if (!string.IsNullOrEmpty(_untisJwt))
                {
                    outReq.Headers["Authorization"] = "Bearer " + _untisJwt;
                }

                byte[] postBytes = null;
                if (req.HttpMethod == "POST" || req.HttpMethod == "PUT")
                {
                    using (Stream inStream = req.InputStream)
                    using (MemoryStream inMs = new MemoryStream())
                    {
                        inStream.CopyTo(inMs);
                        postBytes = inMs.ToArray();
                    }

                    // Automatische Auth-Injektion für Untis Mobile JSON-RPC Calls falls X-Untis-Secret & X-Untis-User übergeben wurden
                    if (!string.IsNullOrEmpty(untisSecret) && !string.IsNullOrEmpty(untisUser) && postBytes != null && postBytes.Length > 0)
                    {
                        try
                        {
                            string jsonStr = Encoding.UTF8.GetString(postBytes);
                            long nowMs = (long)(DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;
                            int otpVal = GenerateTotp(untisSecret, nowMs);

                            if (jsonStr.Contains("\"method\"") && !jsonStr.Contains("\"auth\""))
                            {
                                string authSnippet = string.Format("\"auth\":{{\"clientTime\":{0},\"otp\":{1},\"user\":\"{2}\"}}", nowMs, otpVal, EscapeJsonString(untisUser));

                                if (Regex.IsMatch(jsonStr, "\"params\"\\s*:\\s*\\[\\s*\\{"))
                                {
                                    jsonStr = Regex.Replace(jsonStr, "(\"params\"\\s*:\\s*\\[\\s*\\{)", "$1" + authSnippet + ",");
                                    postBytes = Encoding.UTF8.GetBytes(jsonStr);
                                }
                            }
                            else if (jsonStr.Contains("\"auth\"") && jsonStr.Contains("\"otp\""))
                            {
                                jsonStr = Regex.Replace(jsonStr, "\"otp\"\\s*:\\s*\\d+", "\"otp\":" + otpVal);
                                jsonStr = Regex.Replace(jsonStr, "\"clientTime\"\\s*:\\s*\\d+", "\"clientTime\":" + nowMs);
                                postBytes = Encoding.UTF8.GetBytes(jsonStr);
                            }
                        }
                        catch { }
                    }

                    outReq.ContentType = "application/json; charset=utf-8";
                    outReq.ContentLength = postBytes.Length;
                    using (Stream outStream = outReq.GetRequestStream())
                    {
                        outStream.Write(postBytes, 0, postBytes.Length);
                    }
                }

                string reqPreview = postBytes != null ? Encoding.UTF8.GetString(postBytes, 0, Math.Min(300, postBytes.Length)) : "";
                if (reqPreview.Contains("\"password\"")) reqPreview = Regex.Replace(reqPreview, "\"password\"\\s*:\\s*\"[^\"]+\"", "\"password\":\"***\"");
                LogUntis(string.Format("REQ {0} {1} | Body: {2}", req.HttpMethod, targetUrl, reqPreview));

                using (HttpWebResponse outResp = (HttpWebResponse)outReq.GetResponse())
                using (Stream respStream = outResp.GetResponseStream())
                using (MemoryStream ms = new MemoryStream())
                {
                    respStream.CopyTo(ms);
                    byte[] data = ms.ToArray();

                    resp.StatusCode = (int)outResp.StatusCode;
                    resp.ContentType = outResp.ContentType ?? "application/json; charset=utf-8";

                    string setCookie = outResp.Headers["Set-Cookie"];
                    if (!string.IsNullOrEmpty(setCookie))
                    {
                        resp.Headers["X-Set-Cookie"] = setCookie;
                    }

                    string respPreview = Encoding.UTF8.GetString(data, 0, Math.Min(400, data.Length)).Replace("\r", " ").Replace("\n", " ");
                    LogUntis(string.Format("RESP {0} ({1} bytes) {2}", (int)outResp.StatusCode, data.Length, respPreview));

                    resp.ContentLength64 = data.Length;
                    resp.OutputStream.Write(data, 0, data.Length);
                    resp.OutputStream.Flush();
                    resp.Close();
                }
            }
            catch (WebException webEx)
            {
                if (webEx.Response != null)
                {
                    using (HttpWebResponse errResp = (HttpWebResponse)webEx.Response)
                    using (Stream errStream = errResp.GetResponseStream())
                    using (MemoryStream ms = new MemoryStream())
                    {
                        errStream.CopyTo(ms);
                        byte[] data = ms.ToArray();
                        resp.StatusCode = (int)errResp.StatusCode;
                        resp.ContentType = "application/json; charset=utf-8";
                        resp.ContentLength64 = data.Length;

                        string errPreview = Encoding.UTF8.GetString(data, 0, Math.Min(400, data.Length)).Replace("\r", " ").Replace("\n", " ");
                        LogUntis(string.Format("ERR RESP {0} {1}", (int)errResp.StatusCode, errPreview));

                        resp.OutputStream.Write(data, 0, data.Length);
                        resp.OutputStream.Flush();
                        resp.Close();
                        return;
                    }
                }

                LogUntis(string.Format("ERR EXCEPTION: {0}", webEx.Message));
                resp.StatusCode = 500;
                byte[] err = Encoding.UTF8.GetBytes("{\"jsonrpc\":\"2.0\",\"id\":\"err\",\"error\":{\"message\":\"" + webEx.Message.Replace("\"", "'") + "\",\"code\":-1}}");
                resp.ContentType = "application/json; charset=utf-8";
                resp.OutputStream.Write(err, 0, err.Length);
                resp.Close();
            }
            catch (Exception ex)
            {
                LogUntis(string.Format("GENERAL EXCEPTION: {0}", ex.Message));
                resp.StatusCode = 500;
                byte[] err = Encoding.UTF8.GetBytes("{\"jsonrpc\":\"2.0\",\"id\":\"err\",\"error\":{\"message\":\"" + ex.Message.Replace("\"", "'") + "\",\"code\":-1}}");
                resp.ContentType = "application/json; charset=utf-8";
                resp.OutputStream.Write(err, 0, err.Length);
                resp.Close();
            }
        }

        private static void LaunchBestBrowser(string url)
        {
            // 1. Suche nach Microsoft Edge
            string edge = FindPath(new string[] {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Microsoft\Edge\Application\msedge.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Microsoft\Edge\Application\msedge.exe")
            });

            if (!string.IsNullOrEmpty(edge))
            {
                try
                {
                    Process.Start(edge, string.Format("--app=\"{0}\"", url));
                    return;
                }
                catch { }
            }

            // 2. Suche nach Google Chrome
            string chrome = FindPath(new string[] {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), @"Google\Chrome\Application\chrome.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
            });

            if (!string.IsNullOrEmpty(chrome))
            {
                try
                {
                    Process.Start(chrome, string.Format("--app=\"{0}\"", url));
                    return;
                }
                catch { }
            }

            // 3. Fallback: Standard-Webbrowser
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch { }
        }

        private static string FindPath(string[] paths)
        {
            foreach (string p in paths)
            {
                if (!string.IsNullOrEmpty(p) && File.Exists(p)) return p;
            }
            return null;
        }

        private static string EscapeJsonString(string s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            return s.Replace("\\", "\\\\")
                    .Replace("\"", "\\\"")
                    .Replace("\r", "\\r")
                    .Replace("\n", "\\n")
                    .Replace("\t", "\\t");
        }
    }
}
