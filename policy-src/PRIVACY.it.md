# Informativa sulla privacy di Lucent

Lucent è un'applicazione per note e attività per Android e Windows. Questa informativa descrive cosa memorizza l'app, cosa invia all'esterno del dispositivo e come puoi controllare entrambi gli aspetti. Descrive Lucent così come è compilata in questo repository.

**Ultimo aggiornamento: 25 settembre 2026**

## 1. La versione breve

- Lucent non ha account, nessuna registrazione e nessun server gestito da Lucent. Non esiste alcun meccanismo mediante il quale la sviluppatrice riceva le tue note, attività, file o dati di utilizzo.
- Note, attività, taccuini, checklist, cronologia delle versioni, conversazioni con l'assistente, allegati, chiavi API e impostazioni sono memorizzati sul tuo dispositivo e crittografati a riposo.
- L'app non contiene strumenti di analisi, pubblicità né telemetria.
- Ogni funzionalità che utilizza la rete è facoltativa e disattivata per impostazione predefinita: l'assistente cloud, la ricerca web, la ricerca semantica, il backup su cloud e il controllo automatico degli aggiornamenti.
- Quando utilizzi l'assistente cloud, il tuo messaggio viaggia direttamente dal tuo dispositivo al fornitore di cui hai fornito la chiave API. Non passa attraverso Lucent.
- Il modello opzionale sul dispositivo risponde interamente sul tuo dispositivo e non invia nulla da nessuna parte.

Il resto di questo documento spiega ciascuna di queste affermazioni in dettaglio, inclusi i limiti.

## 2. Da chi proviene questa informativa

Lucent è sviluppata da Jessica Martinez. Domande su questa informativa, o sulla gestione dei dati da parte dell'app, possono essere inviate a **yuan47578@gmail.com**.

Lucent è software libero rilasciato con Licenza MIT. La sviluppatrice non gestisce alcun servizio che raccolga o memorizzi dati degli utenti, e l'applicazione non ha componenti server.

## 3. Cosa memorizza Lucent sul tuo dispositivo

Tutto ciò che crei in Lucent risiede nello spazio di archiviazione privato dell'applicazione sul dispositivo. Tale area non è accessibile ad altre normali applicazioni e viene rimossa quando disinstalli l'app o ne cancelli i dati.

Il materiale memorizzato include:

- note, inclusi testo, formattazione, tag, colori, stato di blocco in alto e archiviazione, checklist, scarabocchi, link e cronologia delle versioni;
- attività, inclusi sotto-attività, priorità, date di scadenza, regole di ricorrenza, promemoria, note e cronologia delle versioni;
- taccuini e gli elementi archiviati al loro interno;
- conversazioni e messaggi dell'assistente, comprese le tracce di ragionamento restituite dal modello;
- allegati aggiunti a una nota o a un'attività, e allegati inviati all'assistente;
- font importati e file di modelli locali importati;
- impostazioni, inclusi il fornitore scelto, l'URL di base, il nome del modello, le chiavi API, la password di backup, le credenziali di blocco dell'app e le credenziali del backup su cloud;
- diagnostica, se hai attivato la registrazione diagnostica.

### 3.1 Crittografia a riposo

Il database è crittografato con SQLCipher. Su Android l'app utilizza Room su SQLCipher; su Windows utilizza SQLite tramite il driver JDBC incluso, configurato con il cifrario SQLCipher e lo stesso tipo di chiave a 256 bit. Note, attività, conversazioni, cronologia e impostazioni risiedono tutte all'interno di tale database.

Gli allegati vengono crittografati separatamente. Ciascun file viene scritto in un contenitore autenticato AES-256-GCM, in blocchi da 64 KiB, prima di raggiungere il disco. Il nome del file sul disco è un identificatore casuale anziché il nome visibile nell'app.

Anche i backup sono sempre crittografati; si veda la sezione 6.

### 3.2 Chiavi e segreti

La chiave del database e la chiave degli allegati sono valori casuali a 256 bit generati sul tuo dispositivo. Non sono derivate da nulla che digiti e non vengono scritte su disco in testo normale. Su Android sono protette da una chiave custodita nell'Android Keystore, con supporto hardware laddove il dispositivo lo preveda, con un fallback locale alla macchina se il Keystore non è disponibile. Viene conservata una copia di ripristino di ciascuna chiave affinché un problema con il Keystore non distrugga i tuoi dati.

Le chiavi API, le password WebDAV, la password di backup e le credenziali di blocco dell'app vengono memorizzate tramite lo stesso percorso protetto per i segreti crittografati, mai in testo chiaro. La password di blocco dell'app e la risposta di sicurezza non vengono mai memorizzate: viene conservato solo un hash con salt, e la password stessa non può essere recuperata da esso.

### 3.3 Cosa può e cosa non può fare la crittografia

La crittografia protegge i dati a riposo: una copia del database, un allegato o un backup prelevato dal dispositivo non possono essere letti senza la chiave. Non protegge contro chi utilizzi il dispositivo sbloccato con il tuo account di sistema operativo, e non protegge i dati mentre l'app è aperta, poiché i contenuti decrittografati devono necessariamente trovarsi nella memoria del dispositivo mentre vengono visualizzati o modificati.

Lucent non fa false pretese su questo. Se la libreria di crittografia non può essere caricata, o se un database non può essere crittografato o sbloccato, l'app registra il fatto e lo segnala anziché dichiarare successo; le Impostazioni forniscono una verifica della crittografia che accerta che i valori siano sigillati e si aprano correttamente. Se un database non può essere decrittografato con la chiave memorizzata, Lucent lo mette da parte senza cancellarlo e ti avvisa, consentendoti di effettuare il ripristino da un backup.

I widget della schermata home su Android mostrano i titoli delle note o delle attività sul tuo launcher. Qualsiasi cosa mostri un widget è visibile a chiunque possa vedere quello schermo. I widget sono facoltativi e possono essere rimossi.

## 4. Cosa non lascia mai il tuo dispositivo

Per impostazione predefinita, nulla lascia il dispositivo. Lucent non richiede una connessione di rete per note, attività, promemoria, cronologia, allegati, ricerca locale o l'assistente sul dispositivo.

Nello specifico, Lucent non contiene alcun SDK di analisi, nessun SDK pubblicitario, nessun servizio di segnalazione arresti anomali e nessun identificatore di tracciamento. Non c'è alcun sistema di account né fingerprinting del dispositivo inviato da nessuna parte. Crash Shield, se attivato, scrive gli errori intercettati in un file di log locale sul dispositivo senza trasmetterli. La registrazione diagnostica funziona allo stesso modo: è disattivata per impostazione predefinita, scrive localmente e viene inviata altrove solo se la esporti tu stesso e decidi di condividere il file.

Poiché non esiste alcun server Lucent, la sviluppatrice non ha modo di leggere i tuoi dati, né di recuperarli per te.

## 5. Quando i dati lasciano il tuo dispositivo

Ognuna delle seguenti opzioni è facoltativa, disattivata per impostazione predefinita e sotto il tuo controllo. Quando una di esse è attiva, i dati lasciano il dispositivo direttamente dall'app verso la terza parte configurata; non passano attraverso alcun servizio Lucent, poiché non ne esiste alcuno.

### 5.1 L'assistente cloud (porta la tua chiave)

L'assistente in modalità cloud utilizza una chiave API fornita da te e un provider di tua scelta. Lucent gestisce i formati di richiesta per endpoint compatibili con OpenAI, Anthropic e Google, e qualsiasi indirizzo compatibile con OpenAI funziona, inclusi DeepSeek e gateway auto-ospitati. Puoi mantenere diversi profili di provider e passare dall'uno all'altro.

Quando invii un messaggio, Lucent effettua una richiesta HTTPS dal tuo dispositivo all'URL di base configurato. Tale richiesta contiene:

- il testo del tuo messaggio;
- la cronologia della conversazione inclusa dall'attuale impostazione di memoria;
- le istruzioni di sistema che definiscono il comportamento dell'assistente;
- gli eventuali file allegati al messaggio;
- il contesto della nota, dell'attività, del taccuino o della ricerca necessario all'assistente per rispondere, insieme ai risultati degli strumenti che l'assistente è stato autorizzato a chiamare.

La tua chiave API viene inviata a tale provider come intestazione di autenticazione per la richiesta. Non viene inviata da nessun'altra parte. Consulta l'informativa sulla privacy del provider scelto per comprendere come tratta il testo ricevuto; tali termini intercorrono esclusivamente tra te e quel fornitore, e Lucent non ha visibilità né controllo su di essi.

L'assistente non può modificare i tuoi dati di nascosto. Prima di scrivere qualsiasi cosa, ti mostra ciò che intende fare, e tale passaggio di conferma è attivo per impostazione predefinita. Gli strumenti sono facoltativi: il modello locale dispone di un proprio interruttore degli strumenti, e l'accesso agli strumenti per l'assistente cloud è un'impostazione che puoi disattivare. Disattivare l'uno o l'altro significa che il modello può chattare ma non può leggere o modificare le tue note e attività.

### 5.2 Ricerca web

La ricerca web è disattivata per impostazione predefinita. Quando la attivi e l'assistente determina che è necessaria una ricerca, Lucent invia la query a un motore di ricerca pubblico. Puoi scegliere quale usare o lasciarlo su Automatico, che li interpella in successione finché uno non risponde: Bing, DuckDuckGo, Google, Brave, Mojeek, Yandex, Baidu, Sogou, 360 Search e l'API di ricerca di Wikipedia. Non viene utilizzata alcuna chiave API di ricerca e non viene creato alcun account. Il testo della query lascia il dispositivo; i risultati tornano all'assistente e vengono inclusi nella risposta. Il motore che risponde visualizza la query e il tuo indirizzo IP. La ricerca web richiede la modalità agente e, sul modello locale, l'interruttore degli strumenti; la Modalità Blackout la blocca completamente.

### 5.3 Ricerca semantica

La ricerca semantica di Lucent segue l'assistente attualmente in uso, quindi non c'è alcuna scelta aggiuntiva da compiere. Quando il modello locale è attivo, l'indicizzazione rimane sul dispositivo e non è implementata nella build attuale, quindi nulla lascia il dispositivo. Quando il modello cloud è attivo, il testo in fase di indicizzazione viene inviato all'endpoint per gli embedding del provider IA configurato per produrre ogni vettore, il che significa che il testo delle note lascia il tuo dispositivo. Passare da un modello all'altro cambia di conseguenza questo comportamento.

### 5.4 Backup su cloud

Il backup su cloud è disattivato per impostazione predefinita. Se lo attivi, inserisci l'indirizzo, il nome utente e la password di un servizio compatibile con WebDAV presso cui possiedi già un account, come Nutstore, Nextcloud, Koofr o qualsiasi altro server WebDAV. Lucent carica i tuoi file di backup `.lcb` nella cartella indicata su quel server, e può elencarli e scaricarli di nuovo per un ripristino. I file vengono crittografati prima dell'invio; il servizio memorizza il file crittografato e le credenziali inserite vengono inviate a quel servizio per l'autenticazione. Il caricamento automatico su cloud è un'opzione separata, anch'essa disattivata per impostazione predefinita.

### 5.5 Controllo degli aggiornamenti

Il controllo automatico degli aggiornamenti è disattivato per impostazione predefinita. Quando lo attivi, o quando chiedi a Lucent di verificare, l'app richiede le informazioni sull'ultima versione all'API pubblica delle release di GitHub per questo repository e confronta i numeri di versione. La richiesta non contiene dati personali oltre a quanto trasmesso da qualsiasi normale richiesta HTTPS, come l'indirizzo IP e uno user agent che identifica Lucent. Se è disponibile una versione più recente, Lucent la propone; il programma di installazione o l'APK viene scaricato da GitHub solo se decidi di aggiornare.

### 5.6 Condivisione ed esportazioni

Lucent non trasmette nulla di propria iniziativa. Due funzionalità passano dati ad altre applicazioni, ed entrambe sono sotto il tuo controllo:

- **Esportazione.** Esportare una nota o un'attività in Markdown, Word, PDF o Excel, o esportare un backup, scrive un file nella posizione da te scelta. I documenti esportati non sono volutamente crittografati, poiché lo scopo di un'esportazione è essere leggibile altrove; chiunque entri in possesso di quel file può leggerlo. Conservalo in un luogo che ritieni appropriato.
- **Integrazione con il foglio di condivisione.** Rendere Lucent una destinazione di condivisione è disattivato per impostazione predefinita. Se lo attivi, Lucent compare nel menu di condivisione delle altre applicazioni per ricevere testo e file, e compare come destinazione nel foglio di condivisione del sistema. I contenuti condivisi in Lucent vengono memorizzati nello stesso database crittografato di tutto il resto. Lucent continua a non inviare alcunché all'esterno autonomamente.

### 5.7 Il modello sul dispositivo

Se importi un modello GGUF, l'assistente può eseguirlo direttamente con llama.cpp sul dispositivo. In questa modalità non viene inviato nulla da nessuna parte: nessun account, nessuna chiave API e nessuna richiesta di rete è coinvolta nella generazione di una risposta. Il file del modello rimane sul dispositivo e il modello viene scaricato dalla memoria non appena si esce dall'app. Gli strumenti locali sono gestiti da un interruttore separato, disattivato per impostazione predefinita. L'accelerazione GPU è facoltativa e può essere disattivata.

### 5.8 Il toolkit dell'agente

Oltre a note e attività, all'assistente può essere assegnato un vero e proprio toolkit: una cartella di lavoro in cui può leggere e scrivere, comandi shell, documenti, plugin e connessioni a servizi esterni. Ognuno di essi è gestito da un interruttore separato in Impostazioni → Avanzate → Toolkit, e le parti che interagiscono all'esterno del dispositivo agiscono solo se le attivi e, per impostazione predefinita, ti chiedono prima conferma.

- **Spazio di lavoro.** Scegli una singola cartella. Tutto ciò che l'assistente legge o scrive rimane confinato al suo interno. I file all'esterno vengono rifiutati a meno che non concedi il permesso "fuori dallo spazio di lavoro", e nulla all'esterno potrà mai essere scritto.
- **Comandi.** L'esecuzione di comandi shell richiede prima la tua approvazione, a meno che non modifichi tale autorizzazione. I comandi vengono eseguiti sulla tua macchina con directory di lavoro all'interno dello spazio di lavoro, con un timeout configurabile, e ciascuno viene registrato nel registro delle attività.
- **Documenti.** I file Word, Excel e PowerPoint vengono scritti e letti sul tuo dispositivo dal codice interno di Lucent. Nulla viene mai caricato online per convertire o creare file.
- **Plugin.** Gli strumenti facoltativi — ambiente utente Linux, Python con librerie per documenti, LibreOffice, Node.js, strumenti multimediali e OCR — vengono scaricati solo su tua esplicita richiesta, dal progetto originale o da un mirror pubblico, direttamente nel tuo spazio di archiviazione. Lucent non invia alcuna telemetria a loro riguardo.
- **Connessioni.** GitHub, Notion, Slack, Google Drive, OneDrive, GitLab, Jira, Linear, WebDAV e qualsiasi server MCP aggiunto vengono raggiunti direttamente dal tuo dispositivo con un token fornito da te. Viene inviata solo la richiesta espressamente richiesta, ed esclusivamente al servizio configurato. Lucent non interpone alcun server intermedio e memorizza i token in forma crittografata sul dispositivo.
- **Token e shell con privilegi.** I token di accesso GitHub sono archiviati in forma crittografata e non vengono mai più mostrati una volta salvati; puoi conservarne fino a cinque. Su Android, concedere all'assistente l'autorizzazione Shizuku è un'opzione distinta, disattivata per impostazione predefinita, ed è l'unico modo per consentire a un comando di essere eseguito con tali privilegi.
- **Rapporti dei sub-agenti.** Un rapporto di un sub-agente salvato manualmente viene scritto come file Markdown nella cartella `sub-agents` dello spazio di lavoro sul tuo dispositivo, senza inviare nulla altrove.
- **Controllo del dispositivo (Android).** Se abilitato e attivato il servizio di accessibilità, l'assistente può leggere lo schermo, toccare, digitare, catturare screenshot, elencare e aprire app, leggere notifiche e utilizzare appunti e sensori. La lettura dello schermo avviene sul dispositivo; viene trasmessa solo se il risultato di uno strumento che la contiene viene inviato al provider dell'assistente scelto, attraverso lo stesso canale di qualsiasi altro messaggio inviato.
- **Cosa rimane locale.** Lo spazio di lavoro, le istantanee scattate prima della modifica di un file, il registro delle attività, i fatti memorizzati e i file delle abilità rimangono tutti sul tuo dispositivo. Il registro delle attività annota il nome dello strumento, gli argomenti (troncati a 300 caratteri) e l'esito; è memorizzato in forma crittografata e può essere cancellato in qualsiasi momento dalla stessa pagina delle impostazioni.

## 6. Backup

Un backup è un singolo file `.lcb` creato da te. Può contenere note, attività, cronologia delle versioni, taccuini, conversazioni, allegati, impostazioni e chiavi API, e facoltativamente font e modelli locali importati. Scegli tu cosa includere e dove salvare il file.

Ogni file `.lcb` è crittografato. Sono disponibili due modalità:

- **Senza password.** Il file è crittografato con la chiave integrata dell'app. Si ripristina su qualsiasi dispositivo dotato di Lucent semplicemente con il file, il che è comodo ma implica che chiunque possieda il file e una copia dell'app può leggerlo.
- **Con password.** La chiave è derivata dalla tua password tramite PBKDF2-HMAC-SHA256 con 210.000 iterazioni e non esiste in nessun altro luogo. Questo metodo è più sicuro, con il consueto compromesso: la stessa password è necessaria per ripristinare il file, non è salvata da nessuna parte e una password dimenticata non potrà essere recuperata da nessuno, sviluppatrice inclusa.

Un backup protetto da password può facoltativamente includere una domanda e una risposta di sicurezza per reimpostare la password in un secondo momento. Tale opzione è disattivata per impostazione predefinita e rende il backup sicuro quanto il più debole tra password e risposta; scegli quindi una domanda la cui risposta sia nota solo a te.

I backup automatici, se abilitati, scrivono in una cartella scelta da te, conservano il numero di copie impostato e possono anche caricare i file nella cartella WebDAV configurata. Il file di backup rimane lo stesso contenitore crittografato in ogni circostanza. Dove risiedono i file di backup e quante copie conservare è interamente una tua decisione, così come la loro cancellazione.

## 7. Integrazione con il dispositivo

L'integrazione con la shell privilegiata di Lucent è facoltativa, disattivata per impostazione predefinita e richiede software e autorizzazioni esterni a Lucent.

Su Android, l'app può utilizzare Shizuku per eseguire operazioni con privilegi elevati qualora tu abbia installato Shizuku, avviato il relativo servizio e concesso l'autorizzazione a Lucent nel sistema. Questa funzionalità serve per eseguire azioni esplicitamente richieste che le normali applicazioni non possono compiere autonomamente, come l'installazione di un aggiornamento scaricato. Lucent non può avviare Shizuku, non può concedersi da sola l'autorizzazione e non esegue nulla attraverso questo percorso a meno che tu non abbia abilitato l'integrazione e concesso il permesso. Puoi revocarlo in qualsiasi momento all'interno di Shizuku o nelle impostazioni di Android, e disattivare l'integrazione in Lucent. La verifica dell'effettiva identità privilegiata è visibile nell'app, che mostra lo UID ottenuto.

Lucent dichiara inoltre le normali autorizzazioni Android di cui ha bisogno, ciascuna per uno scopo dichiarato; si veda la sezione 8.

## 8. Autorizzazioni richieste da Lucent

| Autorizzazione | Perché Lucent la richiede |
|---|---|
| Accesso alla rete (Android `INTERNET`) | Invio di messaggi al provider dell'assistente configurato, ricerca web quando la attivi, backup WebDAV quando lo attivi e controllo degli aggiornamenti quando lo abiliti. Nulla viene inviato se nessuna di queste opzioni è attiva. |
| Notifiche (Android `POST_NOTIFICATIONS`) | Mostrare promemoria delle attività e lo stato di avanzamento di download, backup o generazioni avviate. |
| Sveglie ed allarmi esatti (Android `SCHEDULE_EXACT_ALARM`) | Attivare i promemoria delle attività all'ora esatta impostata anziché in modo approssimativo. |
| Avvio all'accensione (Android `RECEIVE_BOOT_COMPLETED`) | Registrare nuovamente i promemoria dopo il riavvio del dispositivo, in modo che un promemoria per domani sopravviva all'accensione. |
| Servizio in primo piano (Android `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC`) | Mantenere in esecuzione un backup, un download o la generazione di un modello quando l'app non è in primo piano, anziché essere interrotta a metà. |
| Sblocco biometrico (Android `USE_BIOMETRIC`; Windows Hello su Windows) | Consentire lo sblocco dell'app con impronta digitale o riconoscimento facciale anziché digitare la password del blocco. Facoltativo, disattivato per impostazione predefinita e impiegato solo per lo sblocco locale. |
| Vibrazione (Android `VIBRATE`) | Risposta aptica e tattile durante la digitazione. |
| Installazione pacchetti (Android `REQUEST_INSTALL_PACKAGES`) | Installare un aggiornamento scaricato volontariamente tramite l'installer di sistema. |
| Autorizzazione servizio Shizuku (Android `moe.shizuku.manager.permission.API_V23`) | L'integrazione privilegiata facoltativa descritta nella sezione 7. Dichiarata unicamente affinché Shizuku possa essere utilizzato; non ha effetto finché non installi Shizuku e accordi il permesso. |
| Accesso a tutti i file (Android `MANAGE_EXTERNAL_STORAGE`) | Facoltativo, inattivo a meno che non venga accordato, impiegato unicamente affinché la cartella dello spazio di lavoro scelta possa essere letta e scritta come normali file. In assenza di questo permesso, Lucent mantiene lo spazio di lavoro nel proprio archivio privato. |
| Posizione (Android `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`) | Letta solo quando l'assistente richiama il relativo strumento di localizzazione, evento che si verifica solo con il controllo del dispositivo attivo e previa autorizzazione concessa. Lucent non ti traccia mai in background. |

Lucent non richiede un accesso indiscriminato ai tuoi file o alla memoria, a meno che tu non attivi il toolkit dell'agente puntandolo a una cartella di lavoro, nel qual caso l'accesso a tutti i file è ciò che consente a quella sola cartella di essere letta e scritta come file ordinari; puoi rifiutare il permesso e mantenere lo spazio di lavoro all'interno dell'archivio privato di Lucent. In ogni altro caso, file e cartelle vengono scelti direttamente da te tramite il selettore di documenti di sistema, e Lucent riceve solo l'elemento specifico selezionato. Lo stesso vale per font e file dei modelli: li scegli tu e vengono copiati nell'archivio privato dell'applicazione.

## 9. I controlli a tua disposizione

La privacy in Lucent è un insieme di interruttori, tutti nelle tue mani, tutti posizionati nelle Impostazioni. I principali:

- **Blocco dell'app.** Impostazioni → Sicurezza. Scegli una password e facoltativamente una domanda di sicurezza per reimpostare una password dimenticata. Viene memorizzato solo un hash con salt.
- **Limiti di tentativi di sblocco.** Accanto al blocco dell'app. Imposta quanti tentativi sono consentiti al primo turno e nei successivi; i fallimenti attivano tempi di attesa crescenti ricordati anche dopo il riavvio.
- **Cancellazione dopo ripetuti fallimenti.** Sempre accanto al blocco dell'app, disattivata per impostazione predefinita. Dopo il numero di password errate configurato, tutti i dati vengono cancellati. Questa azione è permanente e irreversibile.
- **Sblocco biometrico.** Facoltativo, disattivato per impostazione predefinita.
- **Modalità Blackout.** Impostazioni → Privacy. Quando attiva, nulla lascia il dispositivo: assistente cloud, ricerca web e funzionalità di rete sono bloccati, le superfici cloud sono congelate, l'app viene nascosta dalla schermata delle app recenti e non può essere catturata con screenshot, la destinazione di condivisione viene rimossa ed è richiesta una password a ogni rientro. Prevale su ogni altra impostazione e la sua disattivazione ripristina le configurazioni precedenti.
- **Registrazione diagnostica.** Impostazioni → Privacy, disattivata per impostazione predefinita e soggetta a consenso esplicito. Scrive in locale, può includere testo digitato all'assistente, può essere esportata e può essere azzerata o disattivata in qualsiasi momento. Crash Shield, se attivo, la mantiene accesa per registrare gli errori intercettati.
- **Crash Shield.** Impostazioni → Privacy, disattivato per impostazione predefinita. Intercetta gli errori interni all'app consentendole di restare aperta invece di chiudersi improvvisamente, e li registra in locale. Dichiara con chiarezza cosa non può intercettare: un arresto anomalo nel motore del modello sul dispositivo, la chiusura forzata dell'app da parte del sistema per liberare memoria o la terminazione per mancata risposta.
- **Integrazione di sistema.** Impostazioni → Privacy, disattivata per impostazione predefinita. Determina se Lucent può comparire nei menu di condivisione delle altre app.
- **Cronologia delle versioni.** Impostazioni → Privacy. La cronologia delle note e quella delle attività possono essere disattivate separatamente, interrompendo la creazione di nuove istantanee.
- **Provider dell'assistente e memoria.** Impostazioni → Assistente, quindi Modello cloud o Modello locale. Scegli il provider o importa un modello locale senza alcuna connessione di rete. Ciascun modello conserva la propria impostazione di memoria, che regola quanta cronologia pregressa includere in ogni richiesta; una memoria inferiore riduce il volume di testo trasmesso.
- **Ricerca web.** Impostazioni → Assistente → Personalizzazione. Un singolo interruttore, disattivato per impostazione predefinita, affiancato dal motore di ricerca. Rimane nascosto quando il modello locale è in esecuzione senza modalità agente poiché inutilizzabile in tale contesto, e ricompare esattamente come lo avevi lasciato.
- **Ricerca semantica.** Impostazioni → Assistente. Segue il modello attivo: il modello locale mantiene l'indicizzazione sul dispositivo, il modello cloud invia il testo al tuo fornitore. Cambia modello per variare tale comportamento, oppure mantieni l'assistente del tutto disattivato.
- **Contenuto del backup e password.** Impostazioni → Dati. Scegli cosa include un backup e se proteggerlo con password. Il backup automatico, la relativa cartella, l'intervallo e il numero di copie conservate sono configurabili liberamente e l'opzione è disattivata per impostazione predefinita.
- **Backup su cloud.** Impostazioni → Dati, disattivato per impostazione predefinita. Configura o cancella le tue credenziali WebDAV in qualsiasi momento.
- **Verifica crittografia.** Impostazioni → Sicurezza. Verifica su richiesta che i valori memorizzati siano correttamente sigillati e si aprano regolarmente.
- **Cancella tutti i dati.** Impostazioni → Dati. Si veda la sezione 10.

## 10. Conservazione e cancellazione

Lucent conserva i tuoi dati sul tuo dispositivo finché non decidi di eliminarli. Note e attività eliminate finiscono prima nel cestino e vengono rimosse definitivamente dopo 30 giorni, a meno che non svuoti il cestino o cancelli tutti i dati prima. La cronologia delle versioni viene conservata solo finché la relativa impostazione è attiva e scompare con la nota o l'attività a cui appartiene.

Per cancellare ogni cosa:

- **Impostazioni → Dati → Cancella tutti i dati** elimina ogni nota, attività e conversazione, rimuove gli allegati, azzera la cronologia, ripristina le impostazioni compresa la chiave API, elimina i modelli e i font importati, svuota il registro diagnostico locale disattivando la registrazione e cancella la cache dell'app. L'azione non può essere annullata. Sono disponibili anche controlli più mirati per cancellare solo le note, solo le attività o solo la cronologia delle chat.
- **Cancellare i dati dell'applicazione** nelle impostazioni di sistema di Android o Windows rimuove l'archivio dell'app nello stesso modo.
- **Disinstallare Lucent** rimuove l'applicazione e il relativo archivio privato.

Tre elementi sfuggono al controllo di Lucent, e l'app non può cancellarli per te:

- i file di backup esportati in una cartella, su un altro dispositivo o su un servizio cloud;
- i backup già caricati sul tuo servizio WebDAV;
- tutto ciò che hai inviato a un fornitore di IA tramite l'assistente o inoltrato a un motore di ricerca, che è regolato dall'informativa sulla conservazione di quel fornitore.

Se desideri rimuovere anche quelli, elimina i file e avvaliti degli strumenti di cancellazione messi a disposizione da tali fornitori.

## 11. Minori

Lucent è un'applicazione generica per note e attività. Non è destinata ai minori, non dispone di sistemi di account, pubblicità o funzionalità social, e la sviluppatrice non raccoglie dati personali da alcuno, inclusi i minori. I dati dell'app rimangono sul dispositivo della persona che la utilizza.

## 12. Modifiche a questa informativa

Qualora una futura versione di Lucent modifichi la gestione dei dati, questa informativa verrà aggiornata e la data in cima cambierà. Modifiche sostanziali, ovvero tali da influire su ciò che lascia il dispositivo, saranno descritte nelle note di rilascio della versione che le introduce. La versione di questa informativa applicabile al tuo caso è quella distribuita con la versione di Lucent in esecuzione, e la cronologia completa rimane visibile nei commit del repository.

## 13. Contatti

Domande, rettifiche e segnalazioni riguardanti la privacy in Lucent possono essere inviate a **yuan47578@gmail.com**.

---

Sviluppatrice: Jessica Martinez

Copyright © 2026-2027 Jessica Martinez.
