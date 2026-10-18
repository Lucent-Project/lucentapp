# Politique de confidentialité de Lucent

Lucent est une application de notes et de tâches pour Android et Windows. Cette politique décrit ce que l'application stocke, ce qu'elle transmet hors de votre appareil, et comment vous contrôlez l'un et l'autre. Elle décrit Lucent tel qu'il est compilé dans ce dépôt.

**Dernière mise à jour : 25 septembre 2026**

## 1. Version abrégée

- Lucent ne comporte aucun compte, aucune inscription et aucun serveur exploité par Lucent. Il n'existe aucun mécanisme permettant à la développeuse de recevoir vos notes, vos tâches, vos fichiers ou vos données d'utilisation.
- Les notes, tâches, carnets, listes à cocher, l'historique des versions, les conversations avec l'assistant, les pièces jointes, les clés d'API et les paramètres sont stockés sur votre appareil et chiffrés au repos.
- L'application ne contient aucun outil d'analyse, aucune publicité et aucune télémétrie.
- Chaque fonctionnalité sollicitant le réseau est facultative et désactivée par défaut : l'assistant cloud, la recherche web, la recherche sémantique, la sauvegarde cloud et la vérification automatique des mises à jour.
- Lorsque vous utilisez l'assistant cloud, votre message est envoyé directement depuis votre appareil au fournisseur dont vous avez renseigné la clé d'API. Il ne transite jamais par Lucent.
- Le modèle local optionnel répond intégralement sur votre appareil et n'envoie rien nulle part.

La suite de ce document détaille chacune de ces affirmations, y compris leurs limites.

## 2. Origine de cette politique

Lucent est développé par Jessica Martinez. Toute question relative à cette politique ou au traitement des données par l'application peut être adressée à **yuan47578@gmail.com**.

Lucent est un logiciel libre publié sous licence MIT. La développeuse n'exploite aucun service collectant ou stockant des données utilisateur, et l'application ne comporte aucun composant serveur.

## 3. Ce que Lucent stocke sur votre appareil

Tout ce que vous créez dans Lucent réside dans l'espace de stockage privé de l'application sur votre appareil. Cet espace n'est pas accessible aux autres applications ordinaires, et il est supprimé lorsque vous désinstallez l'application ou effacez ses données.

Les éléments stockés comprennent :

- les notes, y compris leur texte, leur mise en forme, leurs étiquettes, leurs couleurs, leur statut d'épinglage et d'archivage, les listes à cocher, les dessins, les liens et l'historique des versions ;
- les tâches, y compris les sous-tâches, priorités, dates d'échéance, règles de récurrence, rappels, notes et l'historique des versions ;
- les carnets de notes et les éléments qui y sont classés ;
- les conversations et messages de l'assistant, y compris les traces de raisonnement renvoyées par le modèle ;
- les pièces jointes ajoutées à une note ou à une tâche, ainsi que les pièces jointes envoyées à l'assistant ;
- les polices importées et les fichiers de modèles locaux importés ;
- les paramètres, notamment le fournisseur choisi, l'URL de base, le nom du modèle, les clés d'API, le mot de passe de sauvegarde, les identifiants de verrouillage de l'application et les identifiants de sauvegarde cloud ;
- les journaux de diagnostic, si vous avez activé la journalisation de diagnostic.

### 3.1 Chiffrement au repos

La base de données est chiffrée avec SQLCipher. Sur Android, l'application utilise Room sur SQLCipher ; sur Windows, elle utilise SQLite via le pilote JDBC fourni, configuré avec l'algorithme SQLCipher et le même type de clé 256 bits. Les notes, tâches, conversations, historiques et paramètres sont tous conservés dans cette base de données.

Les pièces jointes sont chiffrées séparément. Chaque fichier est écrit dans un conteneur authentifié AES-256-GCM, par blocs de 64 Kio, avant d'atteindre le disque. Le nom de fichier sur le disque est un identifiant aléatoire et non le nom visible dans l'application.

Les sauvegardes sont également toujours chiffrées ; voir la section 6.

### 3.2 Clés et secrets

La clé de la base de données et la clé des pièces jointes sont des valeurs aléatoires de 256 bits générées sur votre appareil. Elles ne dérivent d'aucune saisie de votre part et ne sont jamais écrites en texte brut sur le disque. Sur Android, elles sont encapsulées par une clé conservée dans le Keystore Android, adossé au matériel lorsque l'appareil le propose, avec une solution de repli locale à la machine si le Keystore est indisponible. Une copie de récupération de chaque clé est conservée afin qu'un problème de Keystore ne détruise pas vos données.

Les clés d'API, mots de passe WebDAV, mots de passe de sauvegarde et identifiants de verrouillage de l'application sont stockés par ce même mécanisme de secrets chiffrés, jamais en texte brut. Votre mot de passe de verrouillage de l'application et votre réponse de sécurité ne sont jamais stockés : seul un hachage salé est conservé, et le mot de passe lui-même ne peut en aucun cas être reconstitué à partir de celui-ci.

### 3.3 Ce que le chiffrement peut et ne peut pas faire

Le chiffrement protège ici les données au repos : une copie de la base de données, un fichier joint ou une sauvegarde extraite de l'appareil ne peuvent être lus sans la clé. Il ne protège pas contre une personne utilisant votre appareil déverrouillé avec votre compte de système d'exploitation, et il ne protège pas les données pendant que l'application est ouverte, car le contenu déchiffré réside nécessairement dans la mémoire de l'appareil pendant son affichage ou sa modification.

Lucent ne fait aucune fausse promesse à ce sujet. Si la bibliothèque de chiffrement ne peut être chargée, ou si une base de données ne peut être chiffrée ou déverrouillée, l'application enregistre le fait et le signale plutôt que de prétendre au succès ; les Paramètres proposent une vérification du chiffrement attestant que les valeurs sont correctement scellées et s'ouvrent sans encombre. Si une base de données ne peut être déchiffrée avec la clé stockée, Lucent la met de côté sans la supprimer et vous en avertit, afin que vous puissiez restaurer vos données depuis une sauvegarde.

Les widgets d'écran d'accueil sur Android affichent les titres des notes ou des tâches sur votre lanceur d'applications. Tout ce qu'un widget affiche est visible par quiconque a les yeux sur cet écran. Les widgets sont facultatifs et peuvent être retirés.

## 4. Ce qui ne quitte jamais votre appareil

Par défaut, rien ne quitte l'appareil. Lucent n'exige aucune connexion réseau pour les notes, tâches, rappels, historiques, pièces jointes, la recherche locale ou l'assistant sur l'appareil.

Précisément, Lucent ne contient aucun SDK d'analyse, aucun SDK publicitaire, aucun service de rapport de plantage et aucun identifiant de suivi. Il n'y a pas de système de compte ni d'empreinte d'appareil transmise où que ce soit. Crash Shield, lorsque vous l'activez, consigne les erreurs interceptées dans un fichier journal local sur l'appareil sans les transmettre. La journalisation de diagnostic fonctionne de la même manière : elle est désactivée par défaut, écrit localement, et n'est envoyée nulle part sauf si vous l'exportez vous-même et choisissez de partager le fichier.

En l'absence de serveur Lucent, la développeuse n'a aucun moyen de lire vos données, ni de les récupérer pour vous.

## 5. Quand les données quittent votre appareil

Chacun des éléments suivants est optionnel, désactivé par défaut et soumis à votre contrôle. Lorsqu'une de ces fonctionnalités est active, les données quittent l'appareil directement depuis l'application vers le tiers que vous avez configuré ; elles ne transitent par aucun service Lucent, puisqu'il n'en existe aucun.

### 5.1 L'assistant cloud (apportez votre propre clé)

L'assistant en mode cloud utilise une clé d'API fournie par vos soins et un prestataire que vous choisissez. Lucent comprend les formats de requêtes des points de terminaison compatibles OpenAI, Anthropic et Google, et toute adresse compatible OpenAI fonctionne, y compris DeepSeek et les passerelles auto-hébergées. Vous pouvez conserver plusieurs profils de prestataires et basculer entre eux.

Lorsque vous envoyez un message, Lucent émet une requête HTTPS depuis votre appareil vers l'URL de base configurée. Cette requête contient :

- le texte de votre message ;
- l'historique de la conversation inclus selon le paramètre de mémoire en vigueur ;
- les instructions système régissant le comportement de l'assistant ;
- les fichiers éventuels que vous avez joints au message ;
- le contexte de la note, de la tâche, du carnet ou de la recherche dont l'assistant a besoin pour répondre, ainsi que les résultats de tout outil que l'assistant a été autorisé à appeler.

Votre clé d'API est transmise à ce prestataire dans l'en-tête d'authentification de la requête. Elle n'est envoyée nulle part ailleurs. Veuillez consulter la politique de confidentialité propre au prestataire choisi pour savoir comment il traite le texte reçu ; ces conditions ne regardent que vous et ce tiers, et Lucent n'a aucune visibilité ni aucun contrôle sur celles-ci.

L'assistant ne peut modifier vos données en douce. Avant d'écrire quoi que ce soit, il vous montre ce qu'il a l'intention de faire, et cette étape de confirmation est active par défaut. Les outils sont facultatifs : le modèle local possède son propre interrupteur d'outils, et l'accès aux outils de l'assistant cloud est un paramètre que vous pouvez désactiver. Désactiver l'un ou l'autre signifie que le modèle peut discuter mais ne peut ni lire ni modifier vos notes et tâches.

### 5.2 Recherche web

La recherche web est désactivée par défaut. Lorsque vous l'activez et que l'assistant juge une recherche nécessaire, Lucent transmet la requête de recherche à un moteur de recherche public. Vous choisissez lequel, ou le laissez en mode Automatique, qui les interroge successivement jusqu'à obtenir une réponse : Bing, DuckDuckGo, Google, Brave, Mojeek, Yandex, Baidu, Sogou, 360 Search et l'API de recherche Wikipédia. Aucune clé d'API de recherche n'est requise et aucun compte n'est créé. Le texte de la requête quitte votre appareil ; les résultats reviennent à l'assistant et sont incorporés dans sa réponse. Le moteur qui répond voit la requête et votre adresse IP. La recherche web nécessite le mode agent et, sur le modèle local, l'interrupteur d'outils ; le mode Blackout la bloque intégralement.

### 5.3 Recherche sémantique

La recherche sémantique de Lucent suit l'assistant utilisé, sans aucun réglage supplémentaire. Lorsque le modèle local est actif, l'indexation reste sur l'appareil et n'est pas implémentée dans la version actuelle, de sorte que rien ne quitte l'appareil. Lorsque le modèle cloud est actif, le texte indexé est envoyé au point de terminaison de plongements vectoriels (embeddings) de votre fournisseur d'IA configuré pour générer chaque vecteur, ce qui signifie que le texte des notes quitte votre appareil. Basculer entre les deux modèles bascule également ce comportement.

### 5.4 Sauvegarde dans le cloud

La sauvegarde cloud est désactivée par défaut. Si vous l'activez, vous renseignez l'adresse, l'identifiant et le mot de passe d'un service compatible WebDAV auprès duquel vous détenez déjà un compte (comme Nutstore, Nextcloud, Koofr ou tout autre serveur WebDAV). Lucent téléverse vos fichiers de sauvegarde `.lcb` dans le dossier désigné sur ce serveur, et peut les lister et les télécharger pour une restauration. Les fichiers sont chiffrés avant d'être téléversés ; le service stocke le fichier chiffré, et les identifiants saisis sont envoyés à ce service pour s'authentifier. Le téléversement automatique dans le cloud est un commutateur distinct, également désactivé par défaut.

### 5.5 Vérification des mises à jour

La vérification automatique des mises à jour est désactivée par défaut. Lorsque vous l'activez ou demandez à Lucent de vérifier, l'application sollicite les informations de dernière version auprès de l'API publique des versions GitHub de ce dépôt et compare les numéros de version. La requête ne contient aucune donnée personnelle en dehors de ce qu'emporte toute requête HTTPS, comme votre adresse IP et un user agent identifiant Lucent. Si une version plus récente existe, Lucent vous la propose ; le programme d'installation ou l'APK n'est téléchargé depuis GitHub que si vous choisissez d'effectuer la mise à jour.

### 5.6 Partages et exportations

Lucent n'émet rien de son propre chef. Deux fonctionnalités confient des données à d'autres applications, toutes deux restant sous votre contrôle :

- **L'exportation.** L'exportation d'une note ou d'une tâche au format Markdown, Word, PDF ou Excel, ou l'exportation d'une sauvegarde, écrit un fichier à l'emplacement de votre choix. Les documents exportés ne sont délibérément pas chiffrés, car l'intérêt d'une exportation est d'être lisible ailleurs ; toute personne en possession du fichier peut le lire. Conservez-le dans un endroit que vous jugez approprié.
- **L'intégration au menu de partage.** Faire de Lucent une cible de partage est désactivé par défaut. Lorsque vous l'activez, Lucent apparaît dans le menu de partage des autres applications pour qu'on puisse lui envoyer du texte et des fichiers, et apparaît dans le menu de partage de votre système comme destination. Les contenus partagés dans Lucent sont stockés dans la même base de données chiffrée que le reste. Lucent n'envoie toujours rien à l'extérieur par lui-même.

### 5.7 Le modèle sur l'appareil

Si vous importez un modèle GGUF, l'assistant peut l'exécuter avec llama.cpp directement sur l'appareil. Dans ce mode, rien n'est envoyé nulle part : aucun compte, aucune clé d'API et aucune requête réseau ne sont impliqués dans la génération d'une réponse. Le fichier du modèle reste sur votre appareil, et le modèle est déchargé de la mémoire dès que vous quittez l'application. Les outils locaux dépendent d'un commutateur séparé, désactivé par défaut. L'accélération GPU est facultative et peut être désactivée.

### 5.8 La boîte à outils de l'agent

Au-delà des notes et des tâches, l'assistant peut disposer d'une véritable boîte à outils : un dossier d'espace de travail où il peut lire et écrire, des commandes shell, des documents, des plugins et des connexions à des services externes. Chacun de ces éléments dispose d'un interrupteur distinct dans Paramètres → Avancé → Boîte à outils, et les fonctions interagissant hors de votre appareil n'agissent que si vous les activez et, par défaut, vous demandent d'abord confirmation.

- **Espace de travail.** Vous choisissez un dossier unique. Tout ce que l'assistant lit ou écrit y demeure confiné. Les fichiers situés en dehors lui sont refusés, à moins d'accorder l'autorisation « en dehors de l'espace de travail », et rien en dehors ne pourra jamais être écrit.
- **Commandes.** L'exécution d'une commande shell requiert votre accord préalable, sauf modification de cette autorisation. Les commandes tournent sur votre machine avec un répertoire de travail situé dans l'espace de travail, selon un délai d'attente que vous fixez, et chacune est consignée dans le journal d'activité.
- **Documents.** Les fichiers Word, Excel et PowerPoint sont rédigés et lus sur votre appareil par le propre code de Lucent. Rien n'est téléversé pour convertir ou générer un fichier à aucun moment.
- **Plugins.** Les outils facultatifs — environnement utilisateur Linux, Python et bibliothèques documentaires, LibreOffice, Node.js, outils multimédias et d'OCR — ne sont téléchargés que sur votre demande expresse, depuis le projet d'origine ou un miroir public, directement dans votre stockage personnel. Lucent n'envoie aucune télémétrie à leur propos.
- **Connexions.** GitHub, Notion, Slack, Google Drive, OneDrive, GitLab, Jira, Linear, WebDAV et tout serveur MCP ajouté sont joints directement depuis votre appareil à l'aide d'un jeton fourni par vous. Seule la requête demandée est émise, et uniquement vers le service configuré. Lucent n'a aucun serveur intermédiaire et stocke les jetons chiffrés sur votre appareil.
- **Jetons et shell privilégié.** Les jetons d'accès GitHub sont stockés chiffrés et ne sont plus jamais réaffichés une fois enregistrés ; vous pouvez en conserver jusqu'à cinq. Sur Android, accorder l'autorisation Shizuku à l'assistant est une option distincte, désactivée par défaut, et c'est la seule condition permettant d'exécuter une commande avec ces privilèges.
- **Rapports des sous-agents.** Un rapport de sous-agent enregistré manuellement est écrit sous forme de fichier Markdown dans le sous-dossier `sub-agents` de l'espace de travail sur votre appareil, et rien n'est envoyé nulle part.
- **Contrôle de l'appareil (Android).** Si vous l'activez et allumez le service d'accessibilité, l'assistant peut lire l'écran, toucher, taper, prendre des captures d'écran, lister et ouvrir des applications, lire les notifications, et utiliser le presse-papiers et les capteurs. La lecture de l'écran a lieu sur l'appareil ; elle n'est transmise que si un résultat d'outil la contenant est envoyé au prestataire d'assistance choisi, selon le même canal que n'importe quel autre message émis.
- **Ce qui reste local.** L'espace de travail, les instantanés pris avant modification d'un fichier, le journal d'activité, les faits mémorisés et les fichiers de compétences restent tous sur votre appareil. Le journal d'activité enregistre le nom de l'outil, ses arguments (tronqués à 300 caractères) et le résultat ; il est stocké de manière chiffrée et peut être effacé à tout moment depuis cette même page de paramètres.

## 6. Sauvegardes

Une sauvegarde est un fichier unique `.lcb` que vous créez. Il peut contenir les notes, tâches, l'historique des versions, les carnets, conversations, pièces jointes, paramètres et clés d'API, et facultativement les polices et modèles locaux importés. Vous choisissez les éléments à inclure ainsi que l'emplacement d'enregistrement du fichier.

Chaque fichier `.lcb` est chiffré. Il existe deux modes :

- **Sans mot de passe.** Le fichier est chiffré avec la clé intégrée de l'application. Il se restaure sur tout appareil équipé de Lucent avec le seul fichier en main, ce qui est commode mais implique que quiconque détenant le fichier et une copie de l'application peut le lire.
- **Avec mot de passe.** La clé est dérivée de votre mot de passe par PBKDF2-HMAC-SHA256 avec 210 000 itérations, et n'existe nulle part ailleurs. Cette méthode est plus robuste, avec la contrepartie d'usage : ce même mot de passe est indispensable pour restaurer le fichier, il n'est stocké nulle part, et un mot de passe oublié ne pourra être récupéré par personne, y compris la développeuse.

Une sauvegarde protégée par mot de passe peut comporter une question et une réponse de sécurité facultatives afin de réinitialiser le mot de passe plus tard. Cette option est désactivée par défaut et ramène la solidité de la sauvegarde au maillon le plus faible entre le mot de passe et la réponse ; choisissez donc une question dont personne d'autre ne connaît la réponse.

Les sauvegardes automatiques, lorsqu'elles sont activées, écrivent dans un dossier de votre choix, conservent le nombre d'exemplaires défini par vous et peuvent également être téléversées vers votre dossier WebDAV configuré. Le fichier de sauvegarde reste le même conteneur chiffré dans tous les cas. L'emplacement de stockage de vos sauvegardes et le nombre de copies conservées relèvent exclusivement de votre décision, tout comme leur suppression.

## 7. Intégration à l'appareil

L'intégration du shell privilégié de Lucent est facultative, désactivée par défaut, et requiert un logiciel ainsi qu'une autorisation extérieurs à Lucent.

Sur Android, l'application peut employer Shizuku pour exécuter des opérations privilégiées lorsque vous avez installé Shizuku, lancé son service et octroyé l'autorisation à Lucent dans le système. Ce mécanisme permet d'accomplir des actions explicitement demandées que les applications ordinaires ne peuvent réaliser seules, comme installer une mise à jour d'application téléchargée. Lucent ne peut ni démarrer Shizuku, ni s'auto-octroyer l'autorisation, et n'accomplit rien par ce biais à moins d'avoir activé l'intégration et consenti l'autorisation. Vous pouvez révoquer cette permission à tout instant dans Shizuku ou dans les paramètres d'Android, et désactiver l'intégration dans Lucent. L'identité privilégiée effective peut être vérifiée dans l'application, qui affiche l'UID obtenu.

Lucent déclare également les autorisations Android ordinaires nécessaires à son fonctionnement, chacune répondant à un but précis ; voir la section 8.

## 8. Autorisations demandées par Lucent

| Autorisation | Pourquoi Lucent la demande |
|---|---|
| Accès réseau (Android `INTERNET`) | Envoi de messages au fournisseur d'assistance configuré, recherche web lorsque vous l'activez, sauvegarde WebDAV lorsque vous l'activez, et vérification des mises à jour lorsque vous l'activez. Rien n'est envoyé sans que l'une de ces fonctionnalités soit active. |
| Notifications (Android `POST_NOTIFICATIONS`) | Affichage des rappels de tâches et de la progression d'un téléchargement, d'une sauvegarde ou d'une génération en cours. |
| Alarmes exactes (Android `SCHEDULE_EXACT_ALARM`) | Déclenchement des rappels de tâches à l'heure précise fixée plutôt que de manière approximative. |
| Démarrage au lancement (Android `RECEIVE_BOOT_COMPLETED`) | Réenregistrement de vos rappels après redémarrage de l'appareil, pour qu'un rappel programmé pour demain subsiste après extinction. |
| Service de premier plan (Android `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_DATA_SYNC`) | Maintien en cours d'une sauvegarde, d'un téléchargement ou d'une génération de modèle lorsque l'application passe en arrière-plan, au lieu d'être interrompue en plein vol. |
| Déverrouillage biométrique (Android `USE_BIOMETRIC` ; Windows Hello sous Windows) | Possibilité de déverrouiller l'application par empreinte digitale ou reconnaissance faciale au lieu de saisir le mot de passe du verrou. Facultatif, désactivé par défaut, et employé uniquement pour le déverrouillage local. |
| Vibration (Android `VIBRATE`) | Retour haptique et tactile lors de la frappe. |
| Installation de paquets (Android `REQUEST_INSTALL_PACKAGES`) | Installation d'une mise à jour téléchargée par vos soins via l'installateur du système. |
| Autorisation de service Shizuku (Android `moe.shizuku.manager.permission.API_V23`) | Intégration privilégiée facultative décrite à la section 7. Déclarée uniquement pour permettre l'usage de Shizuku ; sans effet tant que Shizuku n'est pas installé et autorisé. |
| Accès à tous les fichiers (Android `MANAGE_EXTERNAL_STORAGE`) | Facultatif, inactif sans votre accord, servant uniquement à permettre la lecture et l'écriture de fichiers ordinaires dans le dossier d'espace de travail désigné. Sans cela, Lucent cantonne l'espace de travail à son propre stockage. |
| Position géographique (Android `ACCESS_COARSE_LOCATION`, `ACCESS_FINE_LOCATION`) | Consultée uniquement lorsque l'assistant appelle son outil de localisation, ce qui ne survient que si le contrôle de l'appareil est activé et l'autorisation accordée. Lucent ne vous suit jamais en arrière-plan. |

Lucent ne sollicite aucun accès généralisé à vos fichiers ou à votre stockage, sauf si vous activez la boîte à outils de l'agent et la pointez vers un dossier d'espace de travail, auquel cas l'accès à tous les fichiers permet à ce répertoire unique d'être manipulé comme des fichiers normaux ; vous pouvez le refuser et conserver l'espace de travail dans le stockage interne de Lucent. Partout ailleurs, les fichiers et répertoires sont sélectionnés par vous via le sélecteur de documents du système, et Lucent ne reçoit que l'élément spécifique choisi. Il en va de même pour les polices et modèles : vous les sélectionnez, et ils sont copiés dans l'espace privé de l'application.

## 9. Les commandes entre vos mains

La confidentialité dans Lucent repose sur un ensemble d'interrupteurs entièrement entre vos mains, tous situés dans les Paramètres. En voici les principaux :

- **Verrouillage de l'application.** Paramètres → Sécurité. Choisissez un mot de passe, et éventuellement une question de sécurité pour réinitialiser un mot de passe oublié. Seul un hachage salé est conservé.
- **Limites de tentatives de déverrouillage.** Aux côtés du verrouillage. Définissez le nombre d'essais permis au premier tour et aux suivants ; les échecs déclenchent des temps d'attente croissants mémorisés par-delà les redémarrages.
- **Effacement après échecs répétés.** Également aux côtés du verrouillage, désactivé par défaut. Après le nombre de mots de passe erronés fixé, toutes les données sont effacées. Cette mesure est irréversible et personne ne peut l'annuler.
- **Déverrouillage biométrique.** Facultatif, désactivé par défaut.
- **Mode Blackout.** Paramètres → Confidentialité. Tant qu'il est activé, rien ne quitte l'appareil : l'assistant cloud, la recherche web et les fonctions réseau sont coupés, les surfaces cloud sont figées, l'application est masquée de l'écran des applications récentes et ne peut être capturée en capture d'écran, la cible de partage est retirée, et un mot de passe est exigé à chaque retour. Il prévaut sur tous les autres réglages, et sa désactivation rétablit vos réglages précédents.
- **Journalisation de diagnostic.** Paramètres → Confidentialité, désactivée par défaut et requérant votre consentement exprès. Elle écrit localement, peut inclure le texte soumis à l'assistant, peut être exportée par vos soins, et peut être purgée et coupée à tout moment. Crash Shield, lorsqu'il est actif, la maintient en marche pour consigner les erreurs interceptées.
- **Crash Shield.** Paramètres → Confidentialité, désactivé par défaut. Il intercepte les erreurs internes à l'application afin qu'elle reste ouverte au lieu de se fermer brusquement, et les note localement. Il expose clairement ce qu'il ne peut intercepter : un plantage au cœur du moteur de modèle sur l'appareil, la fermeture forcée par le système pour libérer de la mémoire, ou l'arrêt par le système pour non-réponse.
- **Intégration au système.** Paramètres → Confidentialité, désactivée par défaut. Détermine si Lucent apparaît dans les menus de partage des autres applications.
- **Historique des versions.** Paramètres → Confidentialité. L'historique des notes et celui des tâches peuvent être coupés indépendamment, ce qui suspend la création de nouveaux instantanés.
- **Fournisseur d'assistance et mémoire.** Paramètres → Assistant, puis Modèle cloud ou Modèle local. Choisissez le prestataire, ou importez un modèle local sans aucun réseau. Chaque modèle dispose de son propre paramètre de mémoire qui règle la part de conversation passée jointe à chaque requête ; une mémoire plus basse limite le volume de texte sortant.
- **Recherche web.** Paramètres → Assistant → Personnalisation. Un interrupteur unique, désactivé par défaut, jouxté par le choix du moteur. Il est masqué lorsque le modèle local tourne sans mode agent faute d'usage possible, et réapparaît fidèlement tel que vous l'aviez laissé.
- **Recherche sémantique.** Paramètres → Assistant. Elle s'adapte au modèle en cours : le modèle local maintient l'indexation sur l'appareil, le modèle cloud confie le texte à votre fournisseur. Changez de modèle pour changer ce comportement, ou laissez l'assistant totalement éteint.
- **Contenu et mot de passe de sauvegarde.** Paramètres → Données. Choisissez ce qu'embarque une sauvegarde et si elle est protégée par mot de passe. La sauvegarde automatique, son dossier de destination, sa fréquence et le nombre de copies conservées sont à votre entière discrétion, l'option étant désactivée par défaut.
- **Sauvegarde cloud.** Paramètres → Données, désactivée par défaut. Configurez ou effacez vos identifiants WebDAV à tout moment.
- **Vérification du chiffrement.** Paramètres → Sécurité. Vérifie à la demande que les valeurs stockées sont bien scellées et se déverrouillent correctement.
- **Effacer toutes les données.** Paramètres → Données. Voir la section 10.

## 10. Conservation et suppression

Lucent conserve vos données sur votre appareil jusqu'à ce que vous les supprimiez. Les notes et tâches effacées rejoignent d'abord la corbeille et sont supprimées définitivement après 30 jours, à moins que vous ne vidiez la corbeille ou ne réinitialisiez toutes les données plus tôt. L'historique des versions n'est conservé que tant que le réglage d'historique correspondant demeure actif, et disparaît avec la note ou la tâche associée.

Pour tout supprimer :

- **Paramètres → Données → Effacer toutes les données** supprime chaque note, tâche et conversation, retire les pièces jointes, efface l'historique, réinitialise les paramètres dont votre clé d'API, supprime les modèles et polices importés, purge le journal de diagnostic local en le désactivant, et vide le cache de l'application. Cette action est irréversible. Des commandes plus ciblées permettent également de ne supprimer que les notes, que les tâches ou que l'historique de discussion.
- **Effacer les données de l'application** dans les paramètres système d'Android ou de Windows supprime l'espace de stockage de l'application de la même manière.
- **Désinstaller Lucent** supprime l'application et son stockage privé.

Trois éléments échappent à l'emprise de Lucent, et l'application ne peut les supprimer à votre place :

- les fichiers de sauvegarde que vous avez exportés vers un dossier, un autre appareil ou un service cloud ;
- les sauvegardes déjà téléversées sur votre service WebDAV ;
- tout ce que vous avez transmis à un fournisseur d'IA via l'assistant ou soumis à un moteur de recherche, qui relève de la politique de conservation propre à ce tiers.

Si vous souhaitez les voir disparaître également, supprimez les fichiers et faites usage des commandes de suppression propres à ces fournisseurs.

## 11. Enfants

Lucent est une application polyvalente de prise de notes et de gestion de tâches. Elle ne s'adresse pas aux enfants, ne propose aucun système de compte, aucune publicité et aucune fonction sociale, et la développeuse ne recueille aucune information personnelle auprès de quiconque, y compris des enfants. Les données de l'application restent sur l'appareil de la personne qui l'utilise.

## 12. Modifications de cette politique

Si une future version de Lucent vient à modifier la façon dont les données sont traitées, cette politique sera mise à jour et la date en tête de page changera. Les modifications de fond, c'est-à-dire celles influant sur ce qui quitte votre appareil, seront exposées dans les notes de version de la mise à jour concernée. La version de cette politique qui s'applique à vous est celle livrée avec la version de Lucent que vous utilisez, et son historique complet demeure consultable dans les commits du dépôt.

## 13. Contact

Les questions, remarques et préoccupations touchant à la vie privée dans Lucent peuvent être transmises à **yuan47578@gmail.com**.

---

Développeuse : Jessica Martinez

Copyright © 2026-2027 Jessica Martinez.
