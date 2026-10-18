# Lucent-Datenschutzrichtlinie

Lucent ist eine Notizen- und Aufgaben-App für Android und Windows. Diese Richtlinie beschreibt, was die
App speichert, was sie von Ihrem Gerät sendet und wie Sie beides steuern. Sie beschreibt Lucent so, wie
es in diesem Repository erstellt wird.

**Stand: 25. September 2026**

## 1. Die Kurzfassung

- Lucent hat kein Konto, keine Registrierung und keinen von der Entwicklerin betriebenen Server. Es gibt keinen Mechanismus, über den die Entwicklerin Ihre Notizen, Aufgaben, Dateien oder Nutzungsdaten erhalten könnte.
- Notizen, Aufgaben, Notizbücher, Checklisten, Versionsverläufe, Assistenten-Unterhaltungen, Anhänge, API-Schlüssel und Einstellungen werden auf Ihrem Gerät gespeichert und im Ruhezustand verschlüsselt.
- Die App enthält keinerlei Analyse-Tools, keine Werbung und keine Telemetrie.
- Jede Funktion, die das Netzwerk nutzt, ist optional und standardmäßig deaktiviert: der Cloud-Assistent, die Websuche, die semantische Suche, das Cloud-Backup und automatische Update-Prüfungen.
- Wenn Sie den Cloud-Assistenten nutzen, gelangt Ihre Nachricht direkt von Ihrem Gerät an den Anbieter, dessen API-Schlüssel Sie hinterlegt haben. Sie wird zu keinem Zeitpunkt über Lucent geleitet.
- Das optionale Modell auf dem Gerät antwortet vollständig auf Ihrem Gerät und sendet keinerlei Daten irgendwohin.

Der Rest dieses Dokuments erläutert jede dieser Aussagen im Detail, einschließlich der Grenzen.

## 2. Von wem diese Richtlinie stammt

Lucent wird von Jessica Martinez entwickelt. Fragen zu dieser Richtlinie oder zum Umgang der App mit Daten können an **yuan47578@gmail.com** gesendet werden.

Lucent ist freie Software, die unter der MIT-Lizenz veröffentlicht wird. Die Entwicklerin betreibt keinen Dienst, der Benutzerdaten erfasst oder speichert, und die Anwendung besitzt keine Serverkomponente.

## 3. Was Lucent auf Ihrem Gerät speichert

Alles, was Sie in Lucent erstellen, verbleibt im privaten Anwendungsspeicher der App auf dem Gerät. Dieser Speicherbereich kann von anderen gewöhnlichen Anwendungen nicht gelesen werden und wird entfernt, wenn Sie die App deinstallieren oder deren Daten löschen.

Zu den gespeicherten Inhalten gehören:

- Notizen, einschließlich deren Text, Formatierung, Tags, Farben, Anheft- und Archivierungsstatus, Checklisten, Skizzen, Links und Versionsverlauf;
- Aufgaben, einschließlich Unteraufgaben, Prioritäten, Fälligkeiten, Wiederholungsregeln, Erinnerungen, Notizen und Versionsverlauf;
- Notizbücher und die darin abgelegten Einträge;
- Assistenten-Unterhaltungen und -Nachrichten, einschließlich eventueller vom Modell zurückgegebener Denkprozess-Spuren (Reasoning Traces);
- Anhänge, die Sie einer Notiz oder Aufgabe hinzufügen, sowie Anhänge, die Sie an den Assistenten senden;
- importierte Schriftarten und importierte lokale Modelldateien;
- Einstellungen, einschließlich des gewählten Anbieters, der Basis-URL, des Modellnamens, der API-Schlüssel, des Backup-Passworts, der App-Sperrdaten und der Cloud-Backup-Zugangsdaten;
- Diagnosedaten, falls Sie die Protokollierung für Diagnosen aktiviert haben.

### 3.1 Verschlüsselung im Ruhezustand

Die Datenbank wird mit SQLCipher verschlüsselt. Unter Android verwendet die App Room über SQLCipher; unter Windows verwendet sie SQLite über den mitgelieferten JDBC-Treiber, der mit der SQLCipher-Verschlüsselung und derselben Art von 256-Bit-Schlüssel konfiguriert ist. Notizen, Aufgaben, Unterhaltungen, Versionsverläufe und Einstellungen befinden sich ausnahmslos in dieser Datenbank.

Anhänge werden separat verschlüsselt. Jede Datei wird in Blöcken von 64 KiB in einem authentifizierten AES-256-GCM-Container geschrieben, bevor sie die Festplatte erreicht. Der Dateiname auf dem Datenträger ist eine zufällige Kennung und nicht der Name, den Sie in der App sehen.

Backups sind ebenfalls stets verschlüsselt; siehe Abschnitt 6.

### 3.2 Schlüssel und Geheimnisse

Der Datenbankschlüssel und der Anhangsschlüssel sind zufällige 256-Bit-Werte, die auf Ihrem Gerät generiert werden. Sie werden nicht aus Eingaben von Ihnen abgeleitet und niemals im Klartext auf den Datenträger geschrieben. Unter Android werden sie durch einen Schlüssel geschützt, der im Android Keystore verwahrt wird (hardwaregestützt, sofern vom Gerät unterstützt), mit einem maschinenlokalen Fallback, falls der Keystore nicht verfügbar ist. Eine Wiederherstellungskopie jedes Schlüssels wird aufbewahrt, damit ein Keystore-Problem Ihre Daten nicht zerstört.

API-Schlüssel, WebDAV-Passwörter, das Backup-Passwort und Ihre Zugangsdaten für die App-Sperre werden über denselben Pfad für verschlüsselte Geheimnisse gespeichert, nicht als Klartext. Ihr Passwort für die App-Sperre und die Sicherheitsantwort werden überhaupt nicht gespeichert: Es wird lediglich ein gesalzener Hash aufbewahrt, aus dem das Passwort selbst nicht wiederhergestellt werden kann.

### 3.3 Was Verschlüsselung leisten kann und was nicht

Die Verschlüsselung schützt Daten im Ruhezustand: Eine Kopie der Datenbank, eine Anhangsdatei oder ein Backup, das vom Gerät entwendet wird, kann ohne den Schlüssel nicht gelesen werden. Sie schützt nicht vor Personen, die Ihr entsperrtes Gerät mit Ihrem Betriebssystemkonto verwenden, und sie schützt Daten nicht, während die App geöffnet ist, da entschlüsselte Inhalte während der Anzeige oder Bearbeitung zwingend im Arbeitsspeicher des Geräts vorliegen müssen.

Lucent macht sich hierbei nichts vor. Kann die Verschlüsselungsbibliothek nicht geladen oder eine Datenbank nicht verschlüsselt oder entsperrt werden, zeichnet die App diesen Umstand auf und meldet ihn, anstatt einen Erfolg vorzutäuschen; die Einstellungen bieten eine Verschlüsselungsprüfung, die verifiziert, ob Werte ordnungsgemäß versiegelt sind und sich korrekt öffnen lassen. Kann eine Datenbank mit dem gespeicherten Schlüssel nicht entschlüsselt werden, legt Lucent sie beiseite, anstatt sie zu löschen, und benachrichtigt Sie darüber, damit Sie aus einem Backup wiederherstellen können.

Startbildschirm-Widgets unter Android zeigen Notizentitel oder Aufgabentitel in Ihrem Launcher an. Alles, was ein Widget anzeigt, ist für jeden sichtbar, der diesen Bildschirm sehen kann. Die Widgets sind optional und können entfernt werden.

## 4. Was Ihr Gerät niemals verlässt

Standardmäßig verlässt überhaupt nichts Ihr Gerät. Lucent erfordert keine Netzwerkverbindung für Notizen, Aufgaben, Erinnerungen, Historie, Anhänge, lokale Suche oder den integrierten Assistenten auf dem Gerät.

Konkret enthält Lucent kein Analyse-SDK, kein Werbe-SDK, keinen Dienst zur Absturzmeldung und keine Tracking-Identifikatoren. Es gibt kein Kontosystem und keinen Gerätefingerabdruck, der irgendwohin übertragen wird. Wenn Crash Shield aktiviert ist, werden abgefangene Fehler in eine lokale Protokolldatei auf dem Gerät geschrieben und nicht übertragen. Die Diagnoseprotokollierung funktioniert auf dieselbe Weise: Sie ist standardmäßig deaktiviert, schreibt lokal und wird nur dann übertragen, wenn Sie sie selbst exportieren und die Datei weitergeben.

Da es keinen Lucent-Server gibt, hat die Entwicklerin keine Möglichkeit, Ihre Daten einzusehen oder diese für Sie wiederherzustellen.

## 5. Wann Daten Ihr Gerät verlassen

Jeder der folgenden Punkte ist optional, standardmäßig deaktiviert und liegt unter Ihrer Kontrolle. Wenn eine dieser Funktionen aktiv ist, verlassen Daten das Gerät direkt von der App an den von Ihnen konfigurierten Drittanbieter; sie passieren zu keinem Zeitpunkt einen Lucent-Dienst, da schlicht keiner existiert.

### 5.1 Der Cloud-Assistent (Bring Your Own Key)

Der Assistent im Cloud-Modus verwendet einen von Ihnen bereitgestellten API-Schlüssel und einen Anbieter Ihrer Wahl. Lucent beherrscht die Anfrageformate von OpenAI-kompatiblen, Anthropic-kompatiblen und Google-kompatiblen Endpunkten; jede OpenAI-kompatible Adresse funktioniert, einschließlich DeepSeek und selbst gehosteter Gateways. Sie können mehrere Anbieterprofile anlegen und zwischen ihnen wechseln.

Wenn Sie eine Nachricht senden, stellt Lucent eine HTTPS-Anfrage von Ihrem Gerät an die von Ihnen konfigurierte Basis-URL. Diese Anfrage enthält:

- Ihren Nachrichtentext;
- den Gesprächsverlauf, den die aktuelle Speichereinstellung umfasst;
- die Systemanweisungen, die das Verhalten des Assistenten definieren;
- alle Dateien, die Sie der Nachricht angehängt haben;
- den Notizen-, Aufgaben-, Notizbuch- oder Suchkontext, den der Assistent zur Beantwortung benötigt, sowie die Ergebnisse aller Werkzeuge, die der Assistent aufrufen durfte.

Ihr API-Schlüssel wird als Authentifizierungs-Header der Anfrage an diesen Anbieter gesendet. Er wird an keine andere Stelle übermittelt. Lesen Sie die Datenschutzrichtlinie des gewählten Anbieters, um zu verstehen, wie dieser mit den empfangenen Texten verfährt; diese Bedingungen gelten zwischen Ihnen und diesem Anbieter, und Lucent hat weder Einblick noch Kontrolle darüber.

Der Assistent kann Ihre Daten nicht unbemerkt verändern. Bevor er etwas schreibt, zeigt er Ihnen genau, was er beabsichtigt, und dieser Bestätigungsschritt ist standardmäßig aktiv. Werkzeuge sind optional: Das lokale Modell hat einen eigenen Schalter für Werkzeuge, und der Werkzeugzugriff des Cloud-Assistenten ist eine Einstellung, die Sie deaktivieren können. Das Deaktivieren bewirkt jeweils, dass das Modell zwar chatten, Ihre Notizen und Aufgaben jedoch weder lesen noch ändern kann.

### 5.2 Websuche

Die Websuche ist standardmäßig deaktiviert. Wenn Sie sie einschalten und der Assistent entscheidet, dass eine Suche erforderlich ist, sendet Lucent die Suchanfrage an eine öffentliche Suchmaschine. Sie wählen aus, welche das ist, oder belassen es bei Automatisch, wodurch nacheinander versucht wird, wer antwortet: Bing, DuckDuckGo, Google, Brave, Mojeek, Yandex, Baidu, Sogou, 360 Search und die Wikipedia-Such-API. Es wird kein Such-API-Schlüssel verwendet und kein Konto erstellt. Der Abfragetext verlässt Ihr Gerät; die Ergebnisse kehren zum Assistenten zurück und fließen in dessen Antwort ein. Die antwortende Suchmaschine sieht die Suchanfrage und Ihre IP-Adresse. Die Websuche erfordert den Agentenmodus und beim lokalen Modell den Werkzeugschalter; der Blackout-Modus blockiert sie vollständig.

### 5.3 Semantische Suche

Die semantische Suche von Lucent richtet sich nach dem gerade aktiven Assistenten, sodass keine zusätzlichen Einstellungen nötig sind. Solange das lokale Modell der aktive Assistent ist, verbleibt die Indexierung auf dem Gerät und ist im aktuellen Build nicht implementiert, sodass keine Daten abfließen. Solange das Cloud-Modell aktiv ist, wird der zu indexierende Text an den Embeddings-Endpunkt Ihres konfigurierten KI-Anbieters gesendet, um die Vektoren zu erzeugen; das bedeutet, dass Notizentexte Ihr Gerät verlassen. Ein Wechsel zwischen den beiden Modellen wechselt auch dieses Verhalten.

### 5.4 Cloud-Backup

Das Cloud-Backup ist standardmäßig deaktiviert. Wenn Sie es aktivieren, hinterlegen Sie Adresse, Benutzername und Passwort eines WebDAV-kompatiblen Dienstes, bei dem Sie bereits ein Konto besitzen – etwa Nutstore, Nextcloud, Koofr oder ein beliebiger anderer WebDAV-Server. Lucent lädt Ihre `.lcb`-Backup-Dateien in den von Ihnen angegebenen Ordner auf diesem Server hoch und kann sie für eine Wiederherstellung auflisten und wieder herunterladen. Die Dateien werden vor dem Hochladen verschlüsselt; der Dienst speichert die verschlüsselte Datei, und Ihre Zugangsdaten werden zur Authentifizierung an diesen Dienst übermittelt. Der automatische Cloud-Upload ist ein separater Schalter und ebenfalls standardmäßig aus.

### 5.5 Update-Prüfungen

Die automatische Suche nach Updates ist standardmäßig deaktiviert. Wenn Sie sie aktivieren oder Lucent manuell prüfen lassen, fordert die App über die öffentliche GitHub-Releases-API für dieses Repository die neuesten Versionsinformationen an und vergleicht die Versionsnummern. Die Anfrage enthält keine personenbezogenen Daten außer denen, die jede HTTPS-Anfrage übermittelt (wie Ihre IP-Adresse und ein User-Agent mit dem Namen Lucent). Existiert ein neueres Release, bietet Lucent dieses an; der Installer oder die APK wird nur dann von GitHub heruntergeladen, wenn Sie sich für die Aktualisierung entscheiden.

### 5.6 Teilen und Exporte

Lucent sendet von sich aus keinerlei Daten nach außen. Zwei Funktionen übergeben Daten an andere Anwendungen, und beide stehen unter Ihrer Kontrolle:

- **Exportieren.** Wenn Sie eine Notiz oder Aufgabe nach Markdown, Word, PDF oder Excel exportieren oder ein Backup ausgeben, wird eine Datei an einem von Ihnen gewählten Ort gespeichert. Exportierte Dokumente sind bewusst nicht verschlüsselt, da der Zweck eines Exports darin besteht, andernorts lesbar zu sein; jeder, der diese Datei erhält, kann sie lesen. Bewahren Sie sie an einem Ort auf, den Sie für angemessen erachten.
- **Teilen-Menü-Integration.** Dass Lucent als Freigabeziel erscheint, ist standardmäßig deaktiviert. Wenn Sie es einschalten, wird Lucent im Freigabemenü anderer Apps aufgeführt, sodass Texte und Dateien hineingeteilt werden können, und erscheint in Ihrem System als Ziel. Inhalte, die in Lucent geteilt werden, landen in derselben verschlüsselten Datenbank wie alles andere. Lucent sendet auch hierbei von sich aus nichts nach außen.

### 5.7 Das Modell auf dem Gerät

Wenn Sie ein GGUF-Modell importieren, kann der Assistent dieses mit llama.cpp direkt auf dem Gerät ausführen. In diesem Modus wird keinerlei Information irgendwohin gesendet: Weder ein Konto noch ein API-Schlüssel oder eine Netzwerkanfrage sind an der Generierung einer Antwort beteiligt. Die Modelldatei bleibt auf Ihrem Gerät, und das Modell wird entladen, wenn Sie die App verlassen. Lokale Werkzeuge sind ein separater Schalter und standardmäßig deaktiviert. Die GPU-Beschleunigung ist optional und kann abgeschaltet werden.

### 5.8 Das Agenten-Toolkit

Über Notizen und Aufgaben hinaus kann dem Assistenten ein echtes Toolkit an die Hand gegeben werden: ein Arbeitsbereichsordner (Workspace), den er lesen und beschreiben darf, Shell-Befehle, Dokumente, Plugins und Verbindungen zu externen Diensten. Jeder dieser Punkte ist ein eigener Schalter unter Einstellungen → Erweitert → Toolkit, und die Teile, die über Ihr Gerät hinausreichen, tun nur dann etwas, wenn Sie sie einschalten und standardmäßig vorher um Erlaubnis gefragt werden.

- **Arbeitsbereich (Workspace).** Sie wählen genau einen Ordner aus. Alles, was der Assistent liest oder schreibt, befindet sich darin. Dateien außerhalb werden abgelehnt, es sei denn, Sie erteilen die Berechtigung „außerhalb des Arbeitsbereichs“, und außerhalb darf niemals etwas geschrieben werden.
- **Befehle.** Das Ausführen eines Shell-Befehls fragt Sie vorher, es sei denn, Sie ändern diese Berechtigung. Befehle laufen auf Ihrer Maschine mit dem Arbeitsverzeichnis innerhalb des Arbeitsbereichs, mit einem von Ihnen festgelegten Timeout, und jeder Befehl wird im Aktivitätsprotokoll verzeichnet.
- **Dokumente.** Word-, Excel- und PowerPoint-Dateien werden direkt durch Lucents eigenen Code auf Ihrem Gerät gelesen und geschrieben. Zu keinem Zeitpunkt wird etwas hochgeladen, um eine Datei zu konvertieren oder zu erstellen.
- **Plugins.** Optionale Werkzeuge – ein Linux-Userland, Python mit Dokumentbibliotheken, LibreOffice, Node.js, Medien- und OCR-Werkzeuge – werden erst dann heruntergeladen, wenn Sie sie anfordern, und zwar direkt vom Upstream-Projekt oder einem öffentlichen Mirror in Ihren eigenen Speicher. Lucent sendet dazu keinerlei Telemetrie.
- **Verbindungen.** GitHub, Notion, Slack, Google Drive, OneDrive, GitLab, Jira, Linear, WebDAV und jeder hinzugefügte MCP-Server werden direkt von Ihrem Gerät mit einem von Ihnen bereitgestellten Token kontaktiert. Es wird nur die von Ihnen angeforderte Anfrage an den von Ihnen konfigurierten Dienst gesendet. Lucent schaltet keinen eigenen Server dazwischen und speichert die Tokens verschlüsselt auf Ihrem Gerät.
- **Tokens und privilegierte Shell.** GitHub-Zugriffstokens werden verschlüsselt gespeichert und nach dem Speichern nie wieder angezeigt; Sie können bis zu fünf hinterlegen. Unter Android ist die Erteilung der Shizuku-Berechtigung an den Assistenten ein eigener Schalter, der standardmäßig deaktiviert ist, und erst dann kann ein Befehl mit diesen Rechten ausgeführt werden.
- **Berichte von Unter-Agenten.** Ein von Hand gespeicherter Bericht eines Unter-Agenten wird als Markdown-Datei im Ordner `sub-agents` des Arbeitsbereichs auf Ihrem Gerät abgelegt; nichts wird übertragen.
- **Gerätesteuerung (Android).** Wenn Sie diese aktivieren und den Bedienungshilfen-Dienst einschalten, kann der Assistent den Bildschirm lesen, tippen, wischen, Screenshots erstellen, Apps auflisten und öffnen, Benachrichtigungen lesen sowie die Zwischenablage und Sensoren nutzen. Das Lesen des Bildschirms erfolgt auf dem Gerät; es wird nur dann übertragen, wenn ein Werkzeugergebnis an den von Ihnen gewählten KI-Anbieter übermittelt wird – auf demselben Kanal wie jede andere Nachricht.
- **Was lokal bleibt.** Der Arbeitsbereich, vor Dateiänderungen erstellte Snapshots, das Aktivitätsprotokoll, gemerkte Fakten und Skill-Dateien verbleiben ausnahmslos auf Ihrem Gerät. Das Aktivitätsprotokoll erfasst den Werkzeugnamen, die Argumente (gekürzt auf 300 Zeichen) und das Ergebnis; es wird verschlüsselt gespeichert und kann jederzeit auf derselben Einstellungsseite geleert werden.

## 6. Backups

Ein Backup ist eine einzelne `.lcb`-Datei, die Sie erstellen. Es kann Notizen, Aufgaben, Versionsverläufe, Notizbücher, Unterhaltungen, Anhänge, Einstellungen und API-Schlüssel sowie optional importierte Schriftarten und lokale Modelldateien enthalten. Sie entscheiden, was davon aufgenommen wird und wo die Datei gespeichert wird.

Jede `.lcb`-Datei ist verschlüsselt. Es gibt zwei Modi:

- **Ohne Passwort.** Die Datei wird mit dem integrierten Schlüssel der App verschlüsselt. Sie lässt sich auf jedem Gerät mit Lucent allein mithilfe dieser Datei wiederherstellen, was bequem ist, aber auch bedeutet, dass jeder, der die Datei und eine Kopie der App besitzt, sie lesen kann.
- **Mit Passwort.** Der Schlüssel wird aus Ihrem Passwort mittels PBKDF2-HMAC-SHA256 über 210.000 Iterationen abgeleitet und existiert nirgendwo sonst. Dies ist sicherer, bringt aber den üblichen Kompromiss mit sich: Dasselbe Passwort ist zur Wiederherstellung erforderlich, es wird nirgendwo gespeichert, und ein vergessenes Passwort kann von niemandem wiederhergestellt werden, auch nicht von der Entwicklerin.

Ein passwortgeschütztes Backup kann optional eine Sicherheitsfrage und -antwort enthalten, damit das Passwort später zurückgesetzt werden kann. Diese Option ist standardmäßig deaktiviert und macht das Backup nur so sicher wie das schwächere Glied aus Passwort und Antwort; wählen Sie daher eine Frage, deren Antwort niemand sonst kennt.

Automatische Backups schreiben bei Aktivierung in einen von Ihnen gewählten Ordner, bewahren die von Ihnen festgelegte Anzahl von Kopien auf und können zudem in Ihren konfigurierten WebDAV-Ordner hochgeladen werden. Die Backup-Datei selbst ist in jedem Fall derselbe verschlüsselte Container. Wo Ihre Backup-Dateien liegen und wie viele Kopien existieren, ist allein Ihre Entscheidung – ebenso wie deren Löschung.

## 7. Geräte-Integration

Lucents Integration einer privilegierten Shell ist optional, standardmäßig deaktiviert und erfordert Software und Berechtigungen außerhalb von Lucent.

Unter Android kann die App Shizuku nutzen, um privilegierte Operationen auszuführen, wenn Sie Shizuku installiert, dessen Dienst gestartet und Lucent die Berechtigung im System erteilt haben. Dies dient dazu, von Ihnen ausdrücklich angeforderte Aktionen durchzuführen, die normale Apps nicht eigenständig bewältigen können, wie etwa die Installation eines heruntergeladenen App-Updates. Lucent kann Shizuku nicht starten, sich die Berechtigung nicht selbst erteilen und führt über diesen Pfad nichts aus, es sei denn, Sie haben die Integration aktiviert und die Berechtigung erteilt. Sie können sie jederzeit in Shizuku oder in den Android-Einstellungen widerrufen und die Integration in Lucent abschalten. Eine Überprüfung der tatsächlichen privilegierten Identität ist in der App sichtbar, die die erhaltene UID anzeigt.

Lucent deklariert außerdem die regulären Android-Berechtigungen, die es für festgelegte Zwecke benötigt; siehe Abschnitt 8.

## 8. Berechtigungen, die Lucent anfordert

| Berechtigung | Warum Lucent danach fragt |
|---|---|
| Netzwerkzugriff (Android `INTERNET`) | Senden von Nachrichten an Ihren konfigurierten Assistentenanbieter, Websuche bei Aktivierung, WebDAV-Backup bei Aktivierung und Update-Prüfungen bei Aktivierung. Ohne eine dieser aktiven Funktionen wird nichts gesendet. |
| Benachrichtigungen (Android `POST_NOTIFICATIONS`) | Anzeigen von Aufgabenerinnerungen sowie des Fortschritts von Downloads, Backups oder Generierungen, die Sie gestartet haben. |
| Genaue Wecker (Android `SCHEDULE_EXACT_ALARM`) | Auslösen von Aufgabenerinnerungen exakt zur festgelegten Zeit statt nur näherungsweise. |
| Beim Start ausführen (Android `RECEIVE_BOOT_COMPLETED`) | Erneutes Registrieren Ihrer Erinnerungen nach dem Neustart des Geräts, damit eine Erinnerung für morgen den Neustart übersteht. |
| Vordergrunddienst (Android `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC`) | Fortführen eines Backups, Downloads oder einer Modellgenerierung, wenn sich die App nicht im Vordergrund befindet, anstatt mittendrin beendet zu werden. |
| Biometrische Entsperrung (Android `USE_BIOMETRIC`; Windows Hello unter Windows) | Ermöglicht das Entsperren der App per Fingerabdruck oder Gesichtserkennung statt der Eingabe des App-Sperrpassworts. Optional, standardmäßig aus und nur für die lokale Entsperrung genutzt. |
| Vibration (Android `VIBRATE`) | Haptisches Feedback beim Tippen. |
| Pakete installieren (Android `REQUEST_INSTALL_PACKAGES`) | Installieren eines von Ihnen heruntergeladenen Updates über das Installationsprogramm des Systems. |
| Shizuku-Dienstberechtigung (Android `moe.shizuku.manager.permission.API_V23`) | Die in Abschnitt 7 beschriebene optionale privilegierte Integration. Nur deklariert, damit Shizuku überhaupt genutzt werden kann; bleibt wirkungslos, sofern Sie Shizuku nicht installieren und die Berechtigung erteilen. |
| Zugriff auf alle Dateien (Android `MANAGE_EXTERNAL_STORAGE`) | Optional, inaktiv bis zur Erteilung, und ausschließlich dafür genutzt, damit der von Ihnen gewählte Arbeitsbereichsordner wie gewöhnliche Dateien gelesen und geschrieben werden kann. Ohne diese Berechtigung verbleibt der Arbeitsbereich im internen Speicher von Lucent. |
| Standort (Android `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`) | Wird nur abgefragt, wenn der Assistent sein Standort-Werkzeug aufruft, was wiederum nur bei aktivierter Gerätesteuerung und erteilter Berechtigung geschieht. Lucent trackt Sie niemals im Hintergrund. |

Lucent bittet nicht um weitreichenden Zugriff auf Ihre Dateien oder Ihren Speicher, es sei denn, Sie aktivieren das Agenten-Toolkit und verknüpfen es mit einem Arbeitsbereichsordner – in diesem Fall ermöglicht der Vollzugriff auf Dateien, dass dieser eine Ordner wie gewöhnliche Dateien gelesen und beschrieben werden kann. Sie können dies ablehnen und den Arbeitsbereich stattdessen im internen Speicher von Lucent belassen. An anderer Stelle werden Dateien und Ordner von Ihnen über die systemeigene Dateiauswahl ausgewählt, und Lucent erhält ausschließlich das ausgewählte Element. Bei Schriftarten und Modelldateien verhält es sich genauso: Sie wählen sie aus, und sie werden in den anwendungseigenen Speicher kopiert.

## 9. Die Kontrollen in Ihrer Hand

Datenschutz in Lucent besteht aus einer Reihe von Schaltern, die alle in Ihrer Hand liegen und sich in den Einstellungen befinden:

- **App-Sperre.** Einstellungen → Sicherheit. Wählen Sie ein Passwort und optional eine Sicherheitsfrage, damit ein vergessenes Passwort zurückgesetzt werden kann. Es wird ausschließlich ein gesalzener Hash gespeichert.
- **Begrenzung der Entsperrversuche.** Neben der App-Sperre. Legen Sie fest, wie viele Versuche in der ersten Runde und in späteren Runden erlaubt sind; Fehlversuche lösen stufenweise ansteigende Abkühlzeiten aus, die über Neustarts hinweg erhalten bleiben.
- **Löschen nach wiederholten Fehlversuchen.** Ebenfalls neben der App-Sperre, standardmäßig aus. Nach der von Ihnen festgelegten Anzahl falscher Passworteingaben wird alles gelöscht. Dies ist dauerhaft und kann von niemandem rückgängig gemacht werden.
- **Biometrische Entsperrung.** Optional, standardmäßig aus.
- **Blackout-Modus.** Einstellungen → Datenschutz. Wenn aktiv, verlässt nichts das Gerät: Cloud-Assistent, Websuche und Netzwerkfunktionen sind blockiert, Cloud-Oberflächen eingefroren, die App ist in der Übersicht der letzten Apps verborgen und kann nicht abfotografiert werden (Screenshots blockiert), das Freigabeziel ist entfernt und bei jeder Rückkehr wird das Passwort verlangt. Er überschreibt alle anderen Einstellungen; beim Ausschalten werden Ihre vorherigen Einstellungen wiederhergestellt.
- **Diagnoseprotokollierung.** Einstellungen → Datenschutz, standardmäßig aus und erfordert ausdrückliche Zustimmung. Sie schreibt lokal, kann von Ihnen an den Assistenten gesendete Texte enthalten, kann von Ihnen exportiert werden und lässt sich jederzeit leeren und abschalten. Crash Shield hält sie im aktivierten Zustand eingeschaltet, damit abgefangene Fehler protokolliert werden.
- **Crash Shield.** Einstellungen → Datenschutz, standardmäßig aus. Fängt Fehler innerhalb der App ab, sodass diese geöffnet bleibt, anstatt abzustürzen, und zeichnet sie lokal auf. Weist klar darauf hin, was nicht abgefangen werden kann: ein Absturz innerhalb der Modell-Engine auf dem Gerät, das Schließen der App durch das System zur Speicherfreigabe oder das Beenden wegen Nichtreagierens.
- **Systemintegration.** Einstellungen → Datenschutz, standardmäßig aus. Steuert, ob Lucent im Freigabemenü anderer Anwendungen erscheinen darf.
- **Versionsverlauf.** Einstellungen → Datenschutz. Notizen-Historie und Aufgaben-Historie können jeweils separat abgeschaltet werden, wodurch keine neuen Snapshots mehr angelegt werden.
- **Assistentenanbieter und Speicher.** Einstellungen → Assistent, dann Cloud-Modell oder Lokales Modell. Wählen Sie den Anbieter oder importieren Sie ein lokales Modell völlig ohne Netzwerk. Jedes Modell besitzt eine eigene Speichereinstellung, die steuert, wie viel des bisherigen Gesprächsverlaufs in jede Anfrage einfließt; weniger Speicher bedeutet, dass weniger Text das Gerät verlässt.
- **Websuche.** Einstellungen → Assistent → Personalisierung. Ein Schalter, standardmäßig aus, mit der Suchmaschine daneben. Sie ist ausgeblendet, während das lokale Modell ohne Agentenmodus läuft, da sie dann niemand nutzen kann, und kehrt exakt so zurück, wie Sie sie hinterlassen haben.
- **Semantische Suche.** Einstellungen → Assistent. Richtet sich nach dem aktiven Modell: Das lokale Modell indexiert auf dem Gerät, das Cloud-Modell sendet den Text an Ihren Anbieter. Wechseln Sie die Modelle, um das Verhalten anzupassen, oder lassen Sie den Assistenten ganz ausgeschaltet.
- **Backup-Inhalt und Passwort.** Einstellungen → Daten. Bestimmen Sie, was ein Backup umfasst und ob es passwortgeschützt ist. Das automatische Backup, dessen Zielordner, Intervall und Anzahl der Kopien liegen ganz bei Ihnen und sind standardmäßig aus.
- **Cloud-Backup.** Einstellungen → Daten, standardmäßig aus. Konfigurieren oder löschen Sie Ihre WebDAV-Zugangsdaten jederzeit.
- **Verschlüsselungsprüfung.** Einstellungen → Sicherheit. Prüft auf Knopfdruck, ob gespeicherte Werte versiegelt sind und sich fehlerfrei öffnen lassen.
- **Alle Daten löschen.** Einstellungen → Daten. Siehe Abschnitt 10.

## 10. Aufbewahrung und Löschung

Lucent speichert Ihre Daten auf Ihrem Gerät, bis Sie diese löschen. Notizen und Aufgaben, die Sie löschen, landen zuerst im Papierkorb und werden nach 30 Tagen endgültig entfernt, es sei denn, Sie leeren den Papierkorb oder löschen alle Daten früher. Der Versionsverlauf bleibt nur erhalten, solange die entsprechende Einstellung aktiv ist, und wird zusammen mit der zugehörigen Notiz oder Aufgabe gelöscht.

Um alles zu löschen:

- **Einstellungen → Daten → Alle Daten löschen** löscht jede Notiz, Aufgabe und Unterhaltung, entfernt Anhänge, leert die Historie, setzt Einstellungen inklusive Ihrer API-Schlüssel zurück, löscht importierte Modelle und Schriftarten, leert das lokale Diagnoseprotokoll und schaltet die Protokollierung ab und leert den Cache der App. Dies kann nicht rückgängig gemacht werden. Es gibt auch gezieltere Optionen, um nur Notizen, nur Aufgaben oder nur den Chat-Verlauf zu löschen.
- **Löschen der Anwendungsdaten** in den Systemeinstellungen von Android oder Windows entfernt den Speicher der App auf dieselbe Weise.
- **Deinstallation von Lucent** entfernt die Anwendung und deren privaten Speicher vollständig.

Drei Dinge liegen außerhalb von Lucents Reichweite und können von der App nicht für Sie gelöscht werden:

- Backup-Dateien, die Sie in einen Ordner, auf ein anderes Gerät oder zu einem Cloud-Dienst exportiert haben;
- Backups, die bereits auf Ihren WebDAV-Dienst hochgeladen wurden;
- Alles, was Sie über den Assistenten an einen KI-Anbieter übermittelt oder an einen Suchdienst gesendet haben und was den Aufbewahrungsrichtlinien des jeweiligen Anbieters unterliegt.

Möchten Sie auch diese Daten entfernen, löschen Sie die entsprechenden Dateien manuell bzw. nutzen Sie die Löschfunktionen des jeweiligen Anbieters.

## 11. Kinder

Lucent ist eine universelle Notizen- und Aufgaben-App. Sie richtet sich nicht an Kinder, besitzt kein Kontosystem, keine Werbung und keine Social-Media-Funktionen, und die Entwicklerin erfasst von niemandem personenbezogene Daten, auch nicht von Kindern. Die Daten der App verbleiben auf dem Gerät der Person, die sie nutzt.

## 12. Änderungen dieser Richtlinie

Sollte eine künftige Version von Lucent die Datenverarbeitung ändern, wird diese Richtlinie aktualisiert und das Datum oben angepasst. Wesentliche Änderungen – also solche, die beeinflussen, was Ihr Gerät verlässt – werden in den Versionshinweisen des entsprechenden Releases beschrieben. Die für Sie geltende Fassung dieser Richtlinie ist diejenige, die mit der von Ihnen verwendeten Version von Lucent ausgeliefert wird; ihr Verlauf ist in den Commits des Repositorys nachvollziehbar.

## 13. Kontakt

Fragen, Korrekturen und Anliegen zum Datenschutz in Lucent können an **yuan47578@gmail.com** gesendet werden.

---

Entwicklerin: Jessica Martinez

Copyright © 2026-2027 Jessica Martinez.
