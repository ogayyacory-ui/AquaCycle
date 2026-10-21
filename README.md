# AquaCycle

AquaCycle is a community water and sanitation action application. It brings
local issue reporting, community events, water information, practical solution
ideas, and an illustrative community-planning simulator into one mobile and web
experience.

The repository contains an Expo/React Native frontend and a Flask REST API.
This is a prototype: simulator and some impact figures are illustrative, and
the current API should not be deployed as a public production service without
additional security and operational work.

## Contents

- [Features](#features)
- [Technology](#technology)
- [Repository layout](#repository-layout)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Running the application](#running-the-application)
- [API reference](#api-reference)
- [Data and authentication](#data-and-authentication)
- [Tests and code quality](#tests-and-code-quality)
- [Troubleshooting](#troubleshooting)
- [Safety and prototype limitations](#safety-and-prototype-limitations)

## Features

- **Accounts:** create an account or sign in with email and password; Google
  sign-in is available when configured on both the client and server.
- **Water reports:** submit an issue with its type, description, urgency, and
  location, with optional photo/video references. Report details and status
  are surfaced in application workflows; the API also exposes an audit
  timeline.
- **Officer workflows:** review the incident queue, create reports, and update
  report status and operational details.
- **Community events:** browse and view events, create events, and register
  participants.
- **Map and location:** view locations and optionally use device location for
  location-aware features. The app requests location permission when needed.
- **Weather:** retrieve current local weather and search for a city.
- **Solutions:** browse ideas such as rainwater harvesting, greywater reuse,
  bio-sand filtration, smart water monitoring, and constructed wetlands.
- **Community simulator:** combine example systems and compare illustrative
  water, waste, CO₂, sanitation, and community-reach estimates.
- **AquaAI advisor:** receive general water and sanitation guidance. It can
  provide local fallback responses or use a configured external provider.
- **Impact dashboard:** view community report and event counts alongside
  example impact figures.

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React Native, Expo SDK 54, Expo Router, React Native Web |
| API | Python, Flask, Flask-SQLAlchemy, Flask-CORS |
| Database | SQLite |
| HTTP client | Axios |
| Weather and location | Expo Location and the backend weather service |

## Repository layout

```text
.
├── backend/
│   ├── app/
│   │   ├── routes/          # Flask API blueprints
│   │   ├── services/        # Weather, AI and simulator services
│   │   ├── __init__.py      # App factory, configuration and route setup
│   │   └── models.py        # SQLAlchemy data models
│   ├── tests/               # Backend tests
│   ├── requirements.txt
│   └── run.py               # Development API entry point
├── docs/
│   └── AQUACYCLE_OVERVIEW.md
├── frontend/
│   ├── app/                 # Expo Router pages and layouts
│   ├── components/          # Shared UI and platform-specific components
│   ├── context/             # Authentication context
│   ├── services/            # API and feature service functions
│   ├── constants/           # API URL and shared UI constants
│   └── package.json
└── mobile/                  # Additional Expo project configuration
```

The maintained cross-platform application is in `frontend/`. Its route files
are under `frontend/app/`; Expo Router derives navigation paths from those
files.

## Requirements

- Node.js and npm, using a Node version supported by Expo SDK 54.
- Python 3 and pip.
- A browser for web development, or an Android/iOS device or emulator for
  native development.
- Network access from the frontend device to the backend when using API-backed
  features.

## Getting started

### 1. Configure the backend

From the repository root, create and activate a Python virtual environment,
then install the backend dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

On Windows PowerShell, activate the environment with:

```powershell
.\.venv\Scripts\Activate.ps1
```

Set the required Flask secret before starting the API:

```bash
export AQUACYCLE_SECRET_KEY="replace-with-a-long-random-secret"
```

PowerShell:

```powershell
$env:AQUACYCLE_SECRET_KEY = "replace-with-a-long-random-secret"
```

You can also set these values in a local `backend/.env` file. Do not commit
secret values or share them in issue reports. The backend loads environment
configuration and requires `AQUACYCLE_SECRET_KEY` at startup.

### 2. Configure the frontend API address

Set `API_BASE_URL` in `frontend/constants/config.js` to the address where the
backend can be reached from the browser, emulator, or device. The checked-in
value is a LAN-specific example and will probably need to be changed for your
network.

- For a web browser on the same computer, use the backend host reachable from
  that browser, commonly `http://127.0.0.1:5000`.
- For a physical device, use the development computer's LAN IP address. The
  phone and computer must be able to reach one another on the network.
- For an emulator, use the host address appropriate to that emulator rather
  than assuming that `localhost` refers to the development computer.

The Flask development server listens on port `5000` and binds to
`0.0.0.0` when started with the provided entry point.

### 3. Install frontend packages

In a second terminal:

```bash
cd frontend
npm install
```

## Running the application

Start the backend from the `backend/` directory with the virtual environment
active:

```bash
python run.py
```

The API is available at `http://localhost:5000` on the development computer.
Check that it is running with:

```bash
curl http://localhost:5000/api/health
```

Start the frontend in another terminal:

```bash
cd frontend
npm start
```

Expo prints options for opening the app in a browser, emulator, or device.
Alternatively, use:

```bash
npm run web
npm run android
npm run ios
```

The `android` and `ios` commands may require the corresponding native
development tools. For a physical device, scan the development QR code using
an Expo-compatible development environment and ensure the API address is
reachable from that device.

## Configuration

| Variable or setting | Required | Purpose |
| --- | --- | --- |
| `AQUACYCLE_SECRET_KEY` | Yes | Signs time-limited authentication tokens and is required for API startup. |
| `GOOGLE_OAUTH_CLIENT_IDS` | For server-side Google sign-in | Comma-separated allowed Google OAuth client IDs. |
| `AQUA_AI_URL` or `AI_PROVIDER_URL` | Optional | URL for the configured advisor provider. |
| `AQUA_AI_API_KEY` or `AI_PROVIDER_KEY` | Optional | Credential for the configured advisor provider. |
| `API_BASE_URL` in `frontend/constants/config.js` | Yes for API calls | Base URL the frontend uses to reach Flask. |

If the advisor URL or key is not configured, the backend returns its built-in
local guidance. If configured, the provider is expected to accept the advisor
request and return a JSON answer. Keep provider credentials on the server;
never embed API secrets in the frontend.

Google sign-in also needs a suitable OAuth client configuration in the
frontend. If the backend has no allowed client IDs, its Google sign-in endpoint
returns an unavailable response.

## API reference

All routes below are served by the Flask application. JSON request bodies are
expected for `POST` and `PATCH` operations unless otherwise noted.

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/` | API welcome/status payload. |
| `GET` | `/api/health` | Health check. |
| `POST` | `/api/auth/signup` | Create an account. |
| `POST` | `/api/auth/register` | Alias for signup. |
| `POST` | `/api/auth/login` | Sign in with email and password. |
| `POST` | `/api/auth/google` | Verify a Google identity token and sign in. |
| `GET` | `/api/auth/me` | Return the account for a valid signed token supplied in an Authorization bearer header. |
| `GET` | `/api/weather?latitude=…&longitude=…` | Get weather for coordinates. |
| `GET` | `/api/weather/search?city=…` | Search for a city. |
| `POST` | `/api/advisor` | Get water guidance; accepts `message` and optional object `context`. |
| `GET` | `/api/events` | List events. |
| `GET` | `/api/events/<event_id>` | Get one event. |
| `POST` | `/api/events` | Create an event. |
| `POST` | `/api/events/<event_id>/register` | Register a participant. |
| `DELETE` | `/api/events/<event_id>` | Delete an event. |
| `GET` | `/api/reports` | List water reports. |
| `GET` | `/api/reports/<report_id>` | Get one report. |
| `GET` | `/api/reports/<report_id>/audit` | Get a report's audit timeline. |
| `POST` | `/api/reports` | Submit a report. |
| `PATCH` | `/api/reports/<report_id>/status` | Update report status and supported operations fields. |
| `GET` | `/api/solutions` | List solution ideas. |
| `GET` | `/api/simulator/options` | List simulator systems. |
| `POST` | `/api/simulator/calculate` | Calculate illustrative metrics for selected systems. |
| `GET` | `/api/impact` | Get impact dashboard data. |

The API currently has no generated OpenAPI document. Inspect the relevant
blueprint under `backend/app/routes/` for request validation and response
details.

## Data and authentication

The backend uses SQLite through Flask-SQLAlchemy. The database URI is
configured as `sqlite:///aquacycle.db`; the app creates its tables at startup
and adds selected columns to older local databases. Keep local database files
out of version control and back them up before manually changing the schema.

Main persisted entities include:

- **User:** account name, unique email, optional phone, password hash, and
  creation time.
- **Water report:** issue type, location and description; urgency and status;
  optional coordinates and media references; operational fields and timestamps.
- **Report audit log:** report actions, actor, details, and timestamp.
- **Event:** title, description, category, location, start time, organizer,
  capacity, and registration count.
- **Event registration:** participant name and email, linked to an event.

Signup and login return a signed token with the user profile. The API's
`/api/auth/me` endpoint accepts that token as a bearer token; tokens expire
after 24 hours. The current frontend authentication context keeps the signed-in
user in memory: it does not restore a session after a full app reload or
persist the returned token for authenticated API requests. Signing out clears
that in-memory user state.

## Tests and code quality

Run the backend unit tests from `backend/` with the same virtual environment
used to install the requirements:

```bash
python -m unittest discover -s tests
```

Run the frontend lint check from `frontend/`:

```bash
npm run lint
```

## Troubleshooting

- **Backend exits on startup:** confirm `AQUACYCLE_SECRET_KEY` is set in the
  environment used to run `python run.py`.
- **Frontend reports a network error:** verify the backend health endpoint,
  update `API_BASE_URL`, and confirm that the device/emulator can reach the
  computer hosting Flask.
- **Map or location features do not show location:** grant location permission
  in the browser or device settings. Weather/location features depend on
  permission and network access.
- **Google sign-in is unavailable:** configure matching frontend OAuth
  settings and the server's `GOOGLE_OAUTH_CLIENT_IDS`.
- **Advisor returns fallback guidance:** this is expected when the optional
  provider URL and key are not configured.
- **Expo cannot open the app:** install frontend dependencies and use a
  supported Expo development environment for the selected platform.

## Safety and prototype limitations

- Simulator outputs and some dashboard values are estimates or demo figures,
  not measured environmental outcomes.
- AquaCycle information and advisor responses are general guidance, not
  emergency services, professional engineering advice, water-quality testing,
  or public-health direction. Do not assume water is safe to drink because it
  looks clear.
- Location and report content may be sensitive. Request only needed
  permissions and do not publish real personal or precise location data in
  public demonstrations.
- Although the API issues account tokens, report/event management endpoints
  currently do not enforce user or officer authorization. Add authentication,
  role checks, validation, rate limiting, secure deployment configuration, and
  production-grade database migrations before exposing the API to untrusted
  users.
- The Flask development server is for local development, not production
  hosting. Use an appropriately secured production WSGI server and HTTPS for
  any deployment.

For a broader product description, see
[docs/AQUACYCLE_OVERVIEW.md](docs/AQUACYCLE_OVERVIEW.md).
