# Deployment - TrackYourProject

## Live-Umgebung

Die Anwendung ist auf einem **Hetzner Cloud Server** deployed und produktiv erreichbar:

| | URL |
|---|---|
| **Frontend (Login)** | http://46.224.31.63/Login |
| **Backend API** | http://46.224.31.63/api/projects |
| **Server IP** | `46.224.31.63` |

Die Anwendung wurde lokal mit **XAMPP** entwickelt und anschliessend mit **Docker** containerisiert. Die Docker-Container wurden dann auf den Hetzner Server deployed.

---

## Architektur

Die Anwendung besteht aus drei Docker-Containern:

```
                        Hetzner Server (46.224.31.63)
               +--------------------------------------------+
               |          Docker Compose                     |
               |                                             |
Port 80 ------>|  [Nginx/Frontend]                           |
               |       |  Angular SPA (Production Build)     |
               |       |                                     |
               |       |-- /api/* -->  [Apache/Backend]      |
               |                        PHP 8.1 REST API     |
               |                           |                 |
               |                       [MySQL 8.0]           |
               |                        Port 3306            |
               |                        Volume: db_data      |
               +--------------------------------------------+
```

### Container-Uebersicht

| Container | Image | Aufgabe |
|---|---|---|
| `trackyourproject-frontend` | Nginx (Alpine) | Liefert die Angular-App aus, leitet `/api/*` an das Backend weiter |
| `trackyourproject-backend` | PHP 8.1 Apache | REST API (Login, Projekte, Tasks) |
| `trackyourproject-db` | MySQL 8.0 | Datenbank mit allen Projekt- und Nutzerdaten |

---

## Deployment-Schritte

### Voraussetzungen auf dem Hetzner Server

- Docker und Docker Compose installiert
- Port 80 offen (Firewall)

### 1. Repository auf den Server klonen

```bash
git clone <repository-url> /opt/trackyourproject
cd /opt/trackyourproject
```

### 2. Container starten

```bash
docker compose up -d --build
```

Dieser Befehl:
- Baut das **Frontend** (Angular Production Build via `npx nx build`) und packt es in einen Nginx-Container
- Baut das **Backend** (PHP-Dateien in einen Apache-Container)
- Startet eine **MySQL 8.0** Datenbank und importiert automatisch `src/Database-Assets/createDatabase.sql`
- Verbindet alle drei Container ueber ein internes Docker-Netzwerk (`app-net`)

### 3. Pruefen ob alles laeuft

```bash
docker compose ps
```

Alle drei Container sollten den Status `running` haben.

Dann im Browser testen:
- http://46.224.31.63/Login - Frontend erreichbar
- http://46.224.31.63/api/projects - API gibt JSON zurueck (Beweis fuer Datenbank-Anbindung)

---

## Konfiguration

### Docker Compose (`docker-compose.yml`)

- **MySQL** laeuft intern auf Port 3306 (extern auf 3307 gemappt)
- **Frontend** ist auf Port 80 erreichbar
- **Backend** ist nur intern ueber das Docker-Netzwerk erreichbar (kein externer Port)
- Nginx leitet alle Anfragen an `/api/*` per Reverse Proxy an den Backend-Container weiter

### Datenbank

- Die Datenbank wird beim ersten Start automatisch aus `src/Database-Assets/createDatabase.sql` initialisiert
- Daten werden in einem Docker Volume (`db_data`) persistiert und ueberleben Container-Neustarts

### Umgebungsvariablen (in `docker-compose.yml`)

| Variable | Wert | Beschreibung |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | `rootpassword` | MySQL Root-Passwort |
| `MYSQL_DATABASE` | `trackyourproject` | Datenbankname |
| `DB_HOST` | `db` | Hostname des DB-Containers |
| `DB_USER` | `root` | Datenbank-Benutzer |
| `DB_PASS` | `rootpassword` | Datenbank-Passwort |
| `DB_NAME` | `trackyourproject` | Datenbankname |

---

## Wichtige Dateien

| Datei | Beschreibung |
|---|---|
| `docker-compose.yml` | Definiert alle drei Services (DB, Backend, Frontend) |
| `docker/backend/Dockerfile` | PHP 8.1 Apache mit mysqli-Extension |
| `docker/frontend/Dockerfile` | Multi-Stage Build: Node (Angular Build) + Nginx |
| `docker/frontend/nginx.conf` | Nginx-Konfiguration mit SPA-Routing und API-Proxy |
| `.dockerignore` | Schliesst node_modules, dist, .git etc. vom Build aus |
| `src/Database-Assets/createDatabase.sql` | SQL-Schema fuer die initiale Datenbank-Erstellung |

---

## Nuetzliche Befehle

```bash
# Container-Status pruefen
docker compose ps

# Logs ansehen
docker compose logs -f

# Nur Backend-Logs
docker compose logs -f backend

# Container neu bauen und starten
docker compose up -d --build

# Container stoppen
docker compose down

# Container stoppen UND Datenbank-Volume loeschen (Achtung: alle Daten weg!)
docker compose down -v
```

---

## Entwicklung

Die lokale Entwicklung erfolgte mit **XAMPP** (Apache, MySQL, PHP). Nachdem die Anwendung lokal fertig entwickelt und getestet war, wurde sie mit Docker containerisiert und auf den Hetzner Server deployed.
