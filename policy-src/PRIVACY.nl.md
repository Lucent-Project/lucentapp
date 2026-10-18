# Lucent Privacybeleid

Lucent is een notitie- en takenapplicatie voor Android en Windows. Dit beleid beschrijft wat de app
opslaat, wat deze verzendt vanaf uw apparaat en hoe u beide beheert. Het beschrijft Lucent zoals het in
deze repository wordt gebouwd.

**Laatst bijgewerkt: 25 september 2026**

## 1. De korte versie

- Lucent kent geen accounts, geen registratie en geen door de ontwikkelaar beheerde servers. Er bestaat geen mechanisme waarmee de ontwikkelaar uw notities, taken, bestanden of gebruiksgegevens ontvangt.
- Notities, taken, notitieboeken, checklists, versiegeschiedenis, gesprekken met de assistent, bijlagen, API-sleutels en instellingen worden op uw apparaat opgeslagen en in rust versleuteld.
- De app bevat geen analysehulpmiddelen, geen advertenties en geen telemetrie.
- Elke functie die gebruikmaakt van het netwerk is optioneel en standaard uitgeschakeld: de cloudassistent, zoeken op het web, semantisch zoeken, cloudback-up en automatische updatecontroles.
- Wanneer u de cloudassistent gebruikt, gaat uw bericht rechtstreeks van uw apparaat naar de provider van wie u de API-sleutel hebt ingevoerd. Het passeert Lucent op geen enkel moment.
- Het optionele model op het apparaat antwoordt volledig lokaal en stuurt nergens gegevens naartoe.

De rest van dit document licht elk van deze verklaringen in detail toe, inclusief de begrenzingen.

## 2. Van wie dit beleid afkomstig is

Lucent is ontwikkeld door Jessica Martinez. Vragen over dit beleid of over de gegevensverwerking door de app kunnen worden gestuurd naar **yuan47578@gmail.com**.

Lucent is vrije software die is vrijgegeven onder de MIT-licentie. De ontwikkelaar beheert geen dienst die gebruikersgegevens verzamelt of opslaat, en de applicatie heeft geen servercomponent.

## 3. Wat Lucent op uw apparaat opslaat

Alles wat u in Lucent aanmaakt, bevindt zich in de eigen privéopslag van de applicatie op het apparaat. Dat opslaggebied is niet leesbaar voor andere reguliere applicaties en wordt verwijderd wanneer u de app verwijdert of de gegevens ervan wist.

De opgeslagen gegevens omvatten:

- notities, inclusief hun tekst, opmaak, labels, kleuren, vastpin- en archiveringsstatus, checklists, schetsen, links en versiegeschiedenis;
- taken, inclusief subtaken, prioriteiten, vervaldatums, herhalingsregels, herinneringen, notities en versiegeschiedenis;
- notitieboeken en de daaronder gerangschikte items;
- gesprekken en berichten met de assistent, inclusief eventuele redeneersporen die het model heeft geretourneerd;
- bijlagen die u toevoegt aan een notitie of taak, en bijlagen die u naar de assistent stuurt;
- geïmporteerde lettertypen en geïmporteerde lokale modelbestanden;
- instellingen, waaronder de door u gekozen provider, basis-URL, modelnaam, API-sleutels, back-upwachtwoord, inloggegevens voor de app-vergrendeling en inloggegevens voor cloudback-up;
- diagnostische gegevens, indien u diagnostische logboekregistratie hebt ingeschakeld.

### 3.1 Versleuteling in rust

De database is versleuteld met SQLCipher. Op Android gebruikt de app Room via SQLCipher; op Windows gebruikt het SQLite via het meegeleverde JDBC-stuurprogramma dat is geconfigureerd met de SQLCipher-versleuteling en hetzelfde type 256-bits sleutel. Notities, taken, gesprekken, geschiedenis en instellingen bevinden zich allemaal in die database.

Bijlagen worden afzonderlijk versleuteld. Elk bestand wordt weggeschreven in een geauthenticeerde AES-256-GCM-container, in blokken van 64 KiB, voordat het de schijf bereikt. De bestandsnaam op schijf is een willekeurige identificatiecode in plaats van de naam die u in de app ziet.

Back-ups worden eveneens altijd versleuteld; zie paragraaf 6.

### 3.2 Sleutels en geheimen

De databasesleutel en de bijlagensleutel zijn willekeurige 256-bits waarden die op uw apparaat worden gegenereerd. Ze zijn niet afgeleid van iets dat u typt en worden nooit in platte tekst naar de schijf geschreven. Op Android worden ze beschermd door een sleutel in de Android Keystore (hardwarematig ondersteund waar het apparaat dit biedt), met een machinelokale terugvaloptie wanneer de Keystore niet beschikbaar is. Er wordt een herstelkopie van elke sleutel bewaard, zodat een Keystore-probleem uw gegevens niet vernietigt.

API-sleutels, WebDAV-wachtwoorden, het back-upwachtwoord en uw inloggegevens voor de app-vergrendeling worden via hetzelfde versleutelde pad opgeslagen, niet als platte tekst. Uw wachtwoord voor de app-vergrendeling en het beveiligingsantwoord worden helemaal niet opgeslagen: er wordt alleen een gehashte waarde met salt bewaard, waaruit het wachtwoord zelf niet kan worden herleid.

### 3.3 Wat versleuteling wel en niet kan doen

Versleuteling beschermt hier gegevens in rust: een kopie van de database, een bijlagebestand of een back-up die van het apparaat wordt gehaald, kan zonder de sleutel niet worden gelezen. Het beschermt niet tegen iemand die uw ontgrendelde apparaat gebruikt met uw besturingssysteemaccount, en het beschermt geen gegevens terwijl de app geopend is, omdat ontsleutelde inhoud noodzakelijkerwijs in het werkgeheugen van het apparaat aanwezig moet zijn tijdens weergave of bewerking.

Lucent doet hier niet geheimzinnig over. Als de versleutelingsbibliotheek niet kan worden geladen, of een database niet kan worden versleuteld of ontgrendeld, registreert de app dat feit en meldt het in plaats van succes te claimen; Instellingen biedt een versleutelingscontrole die verifieert of waarden correct zijn verzegeld en openen. Als een database niet kan worden ontsleuteld met de opgeslagen sleutel, zet Lucent deze terzijde in plaats van deze te verwijderen en meldt dit aan u, zodat u kunt herstellen vanaf een back-up.

Widgets op het startscherm van Android tonen notitietitels of taaktitels op uw startscherm. Alles wat een widget toont, is zichtbaar voor iedereen die dat scherm kan zien. De widgets zijn optioneel en kunnen worden verwijderd.

## 4. Wat uw apparaat nooit verlaat

Standaard verlaat niets uw apparaat. Lucent vereist geen netwerkverbinding voor notities, taken, herinneringen, geschiedenis, bijlagen, lokaal zoeken of de assistent op het apparaat.

Concreet bevat Lucent geen analyse-SDK's, geen advertentie-SDK's, geen crashrapportagedienst en geen tracking-identificatoren. Er is geen accountsysteem en geen apparaatvingerafdruk die ergens naartoe wordt verzonden. Crash Shield schrijft, wanneer u het inschakelt, opgevangen fouten naar een lokaal logbestand op het apparaat en verzendt deze niet. Diagnostische logboekregistratie werkt op dezelfde manier: het staat standaard uit, schrijft lokaal en wordt alleen ergens naartoe gestuurd als u het zelf exporteert en ervoor kiest het bestand te delen.

Omdat er geen Lucent-server is, heeft de ontwikkelaar geen mogelijkheid om uw gegevens in te zien en geen mogelijkheid om deze voor u te herstellen.

## 5. Wanneer gegevens uw apparaat wel verlaten

Elk van de volgende onderdelen is optioneel, standaard uitgeschakeld en staat onder uw controle. Wanneer een van deze onderdelen actief is, verlaten gegevens het apparaat rechtstreeks van de app naar de derde partij die u hebt geconfigureerd; gegevens passeren op geen enkel moment een dienst van Lucent, aangezien die simpelweg niet bestaat.

### 5.1 De cloudassistent (bring your own key)

De assistent in de cloudmodus maakt gebruik van een API-sleutel die u zelf verstrekt en een provider die u zelf kiest. Lucent ondersteunt de verzoekindelingen van OpenAI-compatibele, Anthropic-compatibele en Google-compatibele eindpunten; elk OpenAI-compatibel adres werkt, inclusief DeepSeek en zelf gehoste gateways. U kunt meerdere providerprofielen bewaren en daartussen schakelen.

Wanneer u een bericht verzendt, voert Lucent een HTTPS-verzoek uit vanaf uw apparaat naar de basis-URL die u hebt ingesteld. Dat verzoek bevat:

- uw berichttekst;
- de gespreksgeschiedenis die de huidige geheugeninstelling omvat;
- de systeeminstructies die het gedrag van de assistent bepalen;
- alle bestanden die u aan het bericht hebt toegevoegd;
- de context van de notitie, taak, het notitieboek of de zoekopdracht die de assistent nodig heeft om te kunnen antwoorden, evenals de resultaten van hulpmiddelen die de assistent mocht aanroepen.

Uw API-sleutel wordt naar die provider verzonden als de authenticatie-header voor het verzoek. De sleutel wordt nergens anders naartoe gestuurd. Lees het privacybeleid van de gekozen provider om te begrijpen wat deze doet met de ontvangen tekst; die voorwaarden gelden tussen u en die provider, en Lucent heeft daar geen inzicht in of controle over.

De assistent kan uw gegevens niet geruisloos wijzigen. Voordat hij iets schrijft, toont hij u wat hij van plan is, en die bevestigingsstap staat standaard ingeschakeld. Tools zijn optioneel: het lokale model heeft een eigen tool-schakelaar, en de toegang tot tools van de cloudassistent is een instelling die u kunt uitschakelen. Als u een van beide uitschakelt, kan het model chatten, maar kan het uw notities en taken niet lezen of aanpassen.

### 5.2 Zoeken op het web

Zoeken op het web staat standaard uitgeschakeld. Wanneer u dit inschakelt en de assistent besluit dat een zoekopdracht nodig is, stuurt Lucent de zoekopdracht naar een openbare zoekmachine. U kiest welke, of laat dit op Automatisch staan, waarbij zoekmachines om de beurt worden geprobeerd totdat er één antwoordt: Bing, DuckDuckGo, Google, Brave, Mojeek, Yandex, Baidu, Sogou, 360 Search en de Wikipedia-zoek-API. Er wordt geen zoek-API-sleutel gebruikt en er wordt geen account aangemaakt. De zoektekst verlaat uw apparaat; de resultaten komen terug naar de assistent en worden opgenomen in zijn antwoord. De zoekmachine die antwoordt, ziet de zoekopdracht en uw IP-adres. Zoeken op het web vereist de agent-modus en, bij het lokale model, de tool-schakelaar; Blackout Mode blokkeert dit volledig.

### 5.3 Semantisch zoeken

Het semantisch zoeken van Lucent volgt de assistent die u gebruikt, dus er valt niets extra's te kiezen. Zolang het lokale model de actieve assistent is, blijft de indexering op het apparaat en is deze in de huidige build niet geïmplementeerd, waardoor er niets weggaat. Zolang het cloudmodel actief is, wordt de te indexeren tekst naar het embeddings-eindpunt van uw geconfigureerde AI-provider gestuurd om vectoren te genereren, wat betekent dat notitietekst uw apparaat verlaat. Overschakelen tussen de twee modellen schakelt het gedrag mee om.

### 5.4 Cloudback-up

Cloudback-up staat standaard uitgeschakeld. Als u het inschakelt, voert u het adres, de gebruikersnaam en het wachtwoord in van een WebDAV-compatibele dienst waar u al een account bij hebt, zoals Nutstore, Nextcloud of Koofr, of een willekeurige andere WebDAV-server. Lucent uploadt uw `.lcb`-back-upbestanden naar de map die u op die server kiest, en kan deze weer weergeven en downloaden voor herstel. De bestanden worden versleuteld voordat ze worden geüpload; de dienst slaat het versleutelde bestand op en de inloggegevens die u invoert, worden naar die dienst verzonden om te verifiëren. Automatische cloudupload is een aparte schakelaar en staat eveneens standaard uit.

### 5.5 Updatecontroles

Automatische controle op updates staat standaard uitgeschakeld. Wanneer u dit inschakelt, of wanneer u Lucent handmatig laat controleren, vraagt de app de nieuwste release-informatie op via de openbare GitHub releases-API voor deze repository en vergelijkt versienummers. Het verzoek bevat geen persoonlijke gegevens behalve wat elk HTTPS-verzoek met zich meebrengt, zoals uw IP-adres en een user-agent die Lucent vermeldt. Als er een nieuwere release bestaat, biedt Lucent deze aan; het installatieprogramma of de APK wordt alleen gedownload van GitHub als u ervoor kiest om te updaten.

### 5.6 Delen en exporteren

Lucent verstuurt uit zichzelf niets naar buiten. Twee functies dragen gegevens over aan andere applicaties, en beide staan onder uw beheer:

- **Exporteren.** Het exporteren van een notitie of taak naar Markdown, Word, PDF of Excel, of het exporteren van een back-up, schrijft een bestand naar een locatie die u kiest. Geëxporteerde documenten zijn bewust niet versleuteld, omdat het doel van een export is dat het elders leesbaar is; iedereen die dat bestand verkrijgt, kan het lezen. Bewaar het op een plek die u passend acht.
- **Integratie met het deelmenu.** Lucent als deeldoel instellen staat standaard uitgeschakeld. Wanneer u dit inschakelt, verschijnt Lucent in het deelmenu van andere applicaties zodat tekst en bestanden erin gedeeld kunnen worden, en verschijnt het in het deelmenu van uw systeem als bestemming. Inhoud die in Lucent wordt gedeeld, wordt opgeslagen in dezelfde versleutelde database als al het andere. Lucent stuurt ook hierbij uit zichzelf niets naar buiten.

### 5.7 Het model op het apparaat

Als u een GGUF-model importeert, kan de assistent dit met llama.cpp direct op het apparaat uitvoeren. In die modus wordt er niets ergens naartoe gestuurd: er is geen account, geen API-sleutel en geen netwerkverzoek betrokken bij het genereren van een reactie. Het modelbestand blijft op uw apparaat en het model wordt ontladen wanneer u de app verlaat. Lokale tools zijn een aparte schakelaar en staan standaard uit. GPU-versnelling is optioneel en kan worden uitgeschakeld.

### 5.8 De agent-toolkit

Naast notities en taken kan de assistent worden uitgerust met een volwaardige toolkit: een werkruimtemap (workspace) die hij mag lezen en beschrijven, shell-opdrachten, documenten, plug-ins en verbindingen met externe diensten. Elk daarvan is een afzonderlijke schakelaar in Instellingen → Geavanceerd → Toolkit, en de onderdelen die buiten uw apparaat reiken, doen alleen iets wanneer u ze inschakelt en vragen standaard eerst om uw goedkeuring.

- **Werkruimte (Workspace).** U kiest één map. Alles wat de assistent leest of schrijft, bevindt zich daarbinnen. Bestanden daarbuiten worden geweigerd, tenzij u de machtiging "buiten de werkruimte" verleent, en buiten de map kan nooit iets worden geschreven.
- **Opdrachten.** Het uitvoeren van een shell-opdracht vraagt u eerst om toestemming, tenzij u die machtiging wijzigt. Opdrachten worden op uw computer uitgevoerd met de werkmap binnen de werkruimte, met een door u ingestelde time-out, en elke opdracht wordt geregistreerd in het activiteitenlogboek.
- **Documenten.** Word-, Excel- en PowerPoint-bestanden worden rechtstreeks op uw apparaat geschreven en gelezen door de eigen code van Lucent. Er wordt op geen enkel moment iets geüpload om een bestand te converteren of te maken.
- **Plug-ins.** Optionele tools – een Linux-userland, Python met documentbibliotheken, LibreOffice, Node.js, media- en OCR-tools – worden alleen gedownload wanneer u daarom vraagt, vanaf het bronproject of een openbare spiegelserver, rechtstreeks naar uw eigen opslag. Lucent verstuurt hierover geen telemetrie.
- **Verbindingen.** GitHub, Notion, Slack, Google Drive, OneDrive, GitLab, Jira, Linear, WebDAV en elke MCP-server die u toevoegt, worden rechtstreeks vanaf uw apparaat benaderd met een door u verstrekt token. Alleen het door u gevraagde verzoek wordt verzonden, en uitsluitend naar de door u geconfigureerde dienst. Lucent plaatst geen eigen server daartussen en slaat de tokens versleuteld op uw apparaat op.
- **Tokens en de bevoorrechte shell.** GitHub-toegangstokens worden versleuteld opgeslagen en na het opslaan nooit meer getoond; u kunt er maximaal vijf bewaren. Op Android is het verlenen van de Shizuku-machtiging aan de assistent een eigen schakelaar, standaard uitgeschakeld, en pas dan kan een opdracht met die rechten worden uitgevoerd.
- **Rapporten van sub-agenten.** Een rapport van een sub-agent dat u handmatig opslaat, wordt geschreven als een Markdown-bestand in de map `sub-agents` van de werkruimte op uw apparaat; er wordt niets verzonden.
- **Apparaatbediening (Android).** Als u dit inschakelt en de toegankelijkheidsdienst aanzet, kan de assistent het scherm lezen, tikken, typen, schermafbeeldingen maken, apps weergeven en openen, meldingen lezen en het klembord en sensoren gebruiken. Het lezen van het scherm gebeurt op het apparaat; het wordt alleen verzonden als een tool-resultaat dat dit bevat naar de door u gekozen assistent-provider gaat, wat hetzelfde kanaal is als elk ander bericht dat u verstuurt.
- **Wat lokaal blijft.** De werkruimte, momentopnamen die zijn gemaakt voordat een bestand wordt gewijzigd, het activiteitenlogboek, onthouden feiten en vaardigheidsbestanden blijven allemaal op uw apparaat. Het activiteitenlogboek legt de naam van de tool vast, de argumenten (ingekort tot 300 tekens) en het resultaat; het wordt versleuteld opgeslagen en kan op elk gewenst moment vanaf dezelfde instellingenpagina worden gewist.

## 6. Back-ups

Een back-up is één enkel `.lcb`-bestand dat u aanmaakt. Het kan notities, taken, versiegeschiedenis, notitieboeken, gesprekken, bijlagen, instellingen en API-sleutels bevatten, en optioneel geïmporteerde lettertypen en lokale modelbestanden. U kiest zelf wat daarin wordt opgenomen en waar het bestand wordt opgeslagen.

Elk `.lcb`-bestand is versleuteld. Er zijn twee modi:

- **Zonder wachtwoord.** Het bestand wordt versleuteld met de ingebouwde sleutel van de app. Het kan op elk apparaat met Lucent worden hersteld met niets anders dan het bestand, wat handig is, maar ook betekent dat iedereen die het bestand en een kopie van de app bezit, het kan lezen.
- **Met een wachtwoord.** De sleutel wordt afgeleid van uw wachtwoord met PBKDF2-HMAC-SHA256 via 210.000 iteraties en bestaat nergens anders. Dit is veiliger, met het gebruikelijke compromis: hetzelfde wachtwoord is vereist om het bestand te herstellen, het wordt nergens opgeslagen en een vergeten wachtwoord kan door niemand worden hersteld, ook niet door de ontwikkelaar.

Een met een wachtwoord beveiligde back-up kan optioneel een beveiligingsvraag en -antwoord bevatten, zodat het wachtwoord later kan worden hersteld. Die optie staat standaard uit en maakt de back-up slechts zo sterk als de zwakste schakel van het wachtwoord en het antwoord; kies daarom een vraag waarvan niemand anders het antwoord weet.

Automatische back-ups schrijven, wanneer u deze inschakelt, naar een map die u kiest, bewaren een door u ingesteld aantal kopieën en kunnen ook worden geüpload naar uw geconfigureerde WebDAV-map. Het back-upbestand zelf is in alle gevallen dezelfde versleutelde container. Waar uw back-upbestanden staan en hoeveel kopieën er bestaan, is geheel uw eigen beslissing; dat geldt ook voor het verwijderen ervan.

## 7. Apparaatintegratie

Lucents integratie met de bevoorrechte shell is optioneel, standaard uitgeschakeld en vereist software en machtigingen buiten Lucent om.

Op Android kan de app Shizuku gebruiken om bevoorrechte bewerkingen uit te voeren wanneer u Shizuku hebt geïnstalleerd, de service hebt gestart en Lucent toestemming hebt verleend in het systeem. Dit dient om acties uit te voeren waar u uitdrukkelijk om vraagt en die reguliere apps niet zelfstandig kunnen uitvoeren, zoals het installeren van een app-update die u hebt gedownload. Lucent kan Shizuku niet starten, zichzelf niet de toestemming verlenen en doet niets via dit pad tenzij u de integratie hebt ingeschakeld en de machtiging hebt verleend. U kunt deze op elk moment intrekken in Shizuku of in de instellingen van Android, en de integratie in Lucent uitschakelen. Controle van de bevoorrechte identiteit kan in de app worden bekeken, die de verkregen UID toont.

Lucent vermeldt ook de reguliere Android-machtigingen die het nodig heeft, elk voor een specifiek doel; zie paragraaf 8.

## 8. Machtigingen die Lucent vraagt

| Machtiging | Waarom Lucent hierom vraagt |
|---|---|
| Netwerktoegang (Android `INTERNET`) | Een bericht sturen naar de door u ingestelde assistent-provider, zoeken op het web wanneer u dit inschakelt, WebDAV-back-up wanneer u dit inschakelt en updatecontroles wanneer u deze inschakelt. Er wordt niets verzonden zonder dat een van deze functies actief is. |
| Meldingen (Android `POST_NOTIFICATIONS`) | Taakherinneringen tonen, evenals de voortgang van een download, back-up of generatie die u hebt gestart. |
| Exacte wekkers (Android `SCHEDULE_EXACT_ALARM`) | Taakherinneringen precies op het door u ingestelde tijdstip laten afgaan in plaats van bij benadering. |
| Uitvoeren bij opstarten (Android `RECEIVE_BOOT_COMPLETED`) | Uw herinneringen opnieuw registreren nadat het apparaat opnieuw is opgestart, zodat een herinnering voor morgen een herstart overleeft. |
| Voorgronddienst (Android `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC`) | Een back-up, download of modelgeneratie actief houden wanneer de app niet op de voorgrond draait, in plaats van halverwege te worden afgebroken. |
| Biometrische ontgrendeling (Android `USE_BIOMETRIC`; Windows Hello op Windows) | De app ontgrendelen met een vingerafdruk of gezicht in plaats van het intypen van het app-vergrendelingswachtwoord. Optioneel, standaard uit en alleen gebruikt voor lokale ontgrendeling. |
| Trilling (Android `VIBRATE`) | Haptische feedback bij het typen. |
| Pakketten installeren (Android `REQUEST_INSTALL_PACKAGES`) | Een update installeren die u hebt gedownload, via het installatieprogramma van het systeem. |
| Shizuku-servicemachtiging (Android `moe.shizuku.manager.permission.API_V23`) | De optionele bevoorrechte integratie beschreven in paragraaf 7. Alleen gedeclareerd zodat Shizuku überhaupt kan worden gebruikt; heeft geen effect tenzij u Shizuku installeert en toestemming verleent. |
| Toegang tot alle bestanden (Android `MANAGE_EXTERNAL_STORAGE`) | Optioneel, inactief totdat u dit toestaat, en uitsluitend gebruikt om de door u gekozen werkruimtemap als gewone bestanden te kunnen lezen en schrijven. Zonder deze machtiging bewaart Lucent de werkruimte binnen zijn eigen opslag. |
| Locatie (Android `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`) | Wordt alleen uitgelezen wanneer de assistent zijn locatietool aanroept, wat op zijn beurt alleen gebeurt wanneer apparaatbediening is ingeschakeld en u toestemming hebt verleend. Lucent volgt u nooit op de achtergrond. |

Lucent vraagt niet om brede toegang tot uw bestanden of opslag, tenzij u de agent-toolkit inschakelt en deze naar een werkruimtemap verwijst. In dat geval zorgt toegang tot alle bestanden ervoor dat die ene map als gewone bestanden kan worden gelezen en geschreven; u kunt dit weigeren en de werkruimte binnen de eigen opslag van Lucent houden. Elders worden bestanden en mappen door u gekozen via de systeemeigen documentkiezer en ontvangt Lucent alleen het specifieke item dat u hebt geselecteerd. Voor lettertypen en modelbestanden geldt hetzelfde: u kiest ze en ze worden naar de eigen opslag van de app gekopieerd.

## 9. De bedieningselementen in uw handen

Privacy in Lucent bestaat uit een reeks schakelaars, die u allemaal zelf bedient in Instellingen:

- **App-vergrendeling.** Instellingen → Beveiliging. Kies een wachtwoord en optioneel een beveiligingsvraag zodat een vergeten wachtwoord kan worden gereset. Er wordt alleen een gehashte waarde met salt opgeslagen.
- **Pogingenlimiet voor ontgrendelen.** Naast de app-vergrendeling. Stel in hoeveel pogingen zijn toegestaan in de eerste ronde en in latere rondes; mislukte pogingen leiden tot oplopende wachttijden die over herstarts heen worden onthouden.
- **Wissen na herhaaldelijk falen.** Eveneens naast de app-vergrendeling, standaard uit. Na het door u ingestelde aantal verkeerde wachtwoorden wordt alles gewist. Dit is permanent en kan door niemand ongedaan worden gemaakt.
- **Biometrische ontgrendeling.** Optioneel, standaard uit.
- **Blackout Mode.** Instellingen → Privacy. Zolang dit aanstaat, verlaat niets het apparaat: de cloudassistent, zoeken op het web en netwerkfuncties zijn geblokkeerd, cloud-onderdelen zijn bevroren, de app is verborgen in het overzicht met recente apps en kan niet worden vastgelegd via schermafbeeldingen, het deeldoel is verwijderd en er is telkens een wachtwoord vereist wanneer u terugkeert. Het overschrijft elke andere instelling; bij het uitschakelen worden uw eerdere instellingen hersteld.
- **Diagnostische logboekregistratie.** Instellingen → Privacy, standaard uit en vereist uitdrukkelijke toestemming. Het schrijft lokaal, kan tekst bevatten die u naar de assistent typt, kan door u worden geëxporteerd en kan op elk moment worden gewist en uitgeschakeld. Crash Shield houdt dit ingeschakeld zodat opgevangen fouten worden geregistreerd.
- **Crash Shield.** Instellingen → Privacy, standaard uit. Het vangt fouten in de app op zodat de app geopend blijft in plaats van crasht, en legt deze lokaal vast. Het vermeldt duidelijk wat het niet kan opvangen: een crash binnen de model-engine op het apparaat, het sluiten van de app door het systeem om geheugen vrij te maken of het beëindigen wegens niet reageren.
- **Systeemintegratie.** Instellingen → Privacy, standaard uit. Bepaalt of Lucent mag verschijnen in de deelmenu's van andere applicaties.
- **Versiegeschiedenis.** Instellingen → Privacy. Notitiegeschiedenis en taakgeschiedenis kunnen elk afzonderlijk worden uitgeschakeld, waardoor er geen nieuwe momentopnamen meer worden bewaard.
- **Assistent-provider en geheugen.** Instellingen → Assistent, vervolgens Cloudmodel of Lokaal model. Kies de provider of importeer een lokaal model zonder netwerkverbinding. Elk model heeft een eigen geheugeninstelling, die bepaalt hoeveel eerdere gespreksgeschiedenis in elk verzoek wordt opgenomen; minder geheugen betekent dat er minder tekst het apparaat verlaat.
- **Zoeken op het web.** Instellingen → Assistent → Personalisatie. Eén schakelaar, standaard uit, met de zoekmachine ernaast. Het is verborgen wanneer het lokale model draait zonder agent-modus, omdat niets het dan kan gebruiken, en keert exact terug zoals u het hebt achtergelaten.
- **Semantisch zoeken.** Instellingen → Assistent. Het volgt het actieve model: het lokale model indexeert op het apparaat, het cloudmodel stuurt de tekst naar uw provider. Wissel van model om het gedrag aan te passen, of laat de assistent helemaal uitgeschakeld.
- **Back-upinhoud en wachtwoord.** Instellingen → Gegevens. Kies wat een back-up bevat en of deze met een wachtwoord is beveiligd. Automatische back-up, de map, het interval en hoeveel kopieën worden bewaard, kunt u allemaal zelf instellen; het staat standaard uit.
- **Cloudback-up.** Instellingen → Gegevens, standaard uit. Stel uw WebDAV-inloggegevens op elk gewenst moment in of wis ze.
- **Versleutelingscontrole.** Instellingen → Beveiliging. Verifieert op verzoek of opgeslagen waarden verzegeld zijn en correct openen.
- **Alle gegevens wissen.** Instellingen → Gegevens. Zie paragraaf 10.

## 10. Bewaring en verwijdering

Lucent bewaart uw gegevens op uw apparaat totdat u ze verwijdert. Notities en taken die u verwijdert, gaan eerst naar de prullenbak en worden na 30 dagen definitief verwijderd, tenzij u de prullenbak eerder leegt of alle gegevens eerder wist. Versiegeschiedenis wordt alleen bewaard zolang de bijbehorende instelling aanstaat en wordt verwijderd samen met de notitie of taak waar deze bij hoort.

Om alles te wissen:

- **Instellingen → Gegevens → Alle gegevens wissen** verwijdert elke notitie, taak en gesprek, verwijdert bijlagen, wist de geschiedenis, reset instellingen inclusief uw API-sleutel, verwijdert geïmporteerde modellen en lettertypen, wist het lokale diagnostische logboek en schakelt logboekregistratie uit, en leegt het cachegeheugen van de app. Dit kan niet ongedaan worden gemaakt. Er zijn ook gerichtere opties om alleen notities, alleen taken of alleen de chatgeschiedenis te wissen.
- **De gegevens van de applicatie wissen** in de systeeminstellingen van Android of Windows verwijdert de opslag van de app op dezelfde manier.
- **Lucent verwijderen** verwijdert de applicatie en zijn privéopslag.

Drie zaken vallen buiten het bereik van Lucent en de app kan deze niet voor u verwijderen:

- back-upbestanden die u hebt geëxporteerd naar een map, een ander apparaat of een clouddienst;
- back-ups die al zijn geüpload naar uw WebDAV-dienst;
- alles wat u via de assistent naar een AI-provider hebt gestuurd of hebt ingediend bij een zoekdienst, wat valt onder het eigen bewaarbeleid van die provider.

Als u die ook weg wilt hebben, verwijdert u de bestanden handmatig en gebruikt u de verwijderingsopties van de betreffende provider.

## 11. Kinderen

Lucent is een algemene notitie- en takenapplicatie. Het is niet gericht op kinderen, heeft geen accountsysteem, geen advertenties en geen sociale functies, en de ontwikkelaar verzamelt van niemand persoonlijke gegevens, ook niet van kinderen. De gegevens van de app blijven op het apparaat van de persoon die deze gebruikt.

## 12. Wijzigingen in dit beleid

Als een toekomstige versie van Lucent de gegevensverwerking wijzigt, wordt dit beleid bijgewerkt en verandert de datum bovenaan. Inhoudelijke wijzigingen, dat wil zeggen wijzigingen die invloed hebben op wat uw apparaat verlaat, worden beschreven in de release-opmerkingen van de versie die ze introduceert. De versie van dit beleid die op u van toepassing is, is de versie die wordt meegeleverd met de versie van Lucent die u gebruikt, en de geschiedenis ervan is zichtbaar in de commits van de repository.

## 13. Contact

Vragen, correcties en opmerkingen over privacy in Lucent kunnen worden gestuurd naar **yuan47578@gmail.com**.

---

Ontwikkelaar: Jessica Martinez

Copyright © 2026-2027 Jessica Martinez.
