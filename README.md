# 🚨 IncidentIQ — Production-Ready Incident Management Platform

IncidentIQ is a full-stack MERN incident management system with role-based workflows, real-time updates, analytics, SLA tracking, and Azure Functions automation.

---

## ✨ Feature Highlights

- 🔐 JWT auth with role-based UI/route controls (`reporter`, `responder`, `admin`)
- 🚨 Complete incident lifecycle management (`open → acknowledged → in_progress → resolved → closed`)
- 👥 Assignment workflow with responder directory and assignee filters
- 📊 Dashboard + analytics charts (severity, status, 7-day trend, resolution time)
- ⏱️ SLA tracking badges per incident by severity target
- 📎 Incident attachments upload/list/download
- ⚡ WebSocket realtime toast alerts + connection health indicator
- 🔎 Filtering, search, pagination, and role-aware incident visibility
- ☁️ Azure Functions timers for auto-escalation and cleanup

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────┐
│              React + Vite Frontend           │
│ Dashboard | Analytics | Incident UI | Auth   │
└───────────────────────┬──────────────────────┘
                        │ REST API + WebSocket
┌───────────────────────▼──────────────────────┐
│            Node.js + Express Backend         │
│ Auth | RBAC | Validation | Incident API      │
│ Attachment API | Analytics API | WS Server   │
└───────────────────────┬──────────────────────┘
                        │
              ┌─────────┼─────────┐
              │         │         │
      ┌───────▼──────┐  │  ┌──────▼─────────┐
      │ Mongo/Cosmos │  │  │ Azure Functions │
      │ Incident data│  │  │ Escalate/Cleanup│
      └──────────────┘  │  └─────────────────┘
                        │
                ┌───────▼────────┐
                │ App Insights*   │
                └─────────────────┘
```

`*` Optional via connection string.

---

## ✅ Current Feature Set

### Authentication & Authorization
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- JWT token auth with role claims
- Role-aware frontend controls and protected routes
- Responder directory endpoint: `GET /api/auth/responders` (responder/admin)

### Incident Management
- CRUD via `/api/incidents` (alias: `/api/records`)
- Assignment (`assignedTo`) and status updates
- Lifecycle timestamps: `createdAt`, `acknowledgedAt`, `resolvedAt`, `updatedAt`
- Incident detail timeline UI

### Search, Filters, Pagination
- Query support: `page`, `limit`, `severity`, `status`, `assignedTo`, `q`
- Frontend controls for all filters + pagination controls

### SLA Tracking
- Severity targets (acknowledgement SLA):
  - Critical: 15m
  - High: 1h
  - Medium: 4h
  - Low: 24h
- SLA states: `On track`, `Approaching breach`, `Breached`
- Displayed on incident cards and incident detail

### Attachments
- `POST /api/incidents/:id/attachments`
- `GET /api/incidents/:id/attachments`
- `GET /api/incidents/:id/attachments/:fileName`
- Local storage path: `backend/uploads/incidents/<incidentId>/`

### Real-Time Updates
- WebSocket events:
  - `incident_created`
  - `incident_updated`
  - `incident_resolved`
  - `incident_escalated`
- Frontend toast notifications for incident events
- Connection status indicator (connected/disconnected)

### Analytics & Dashboard
- Admin analytics API:
  - `GET /api/analytics/summary`
  - `GET /api/analytics/trends`
  - `GET /api/analytics/resolution-time`
- Dashboard widgets:
  - Open incidents
  - Critical incidents
  - Recently created/resolved incidents
  - Recent activity feed (created/resolved/escalated)
  - Chart widgets (severity/status/trend)

### Azure Functions
- `processNotifications` timer for auto-escalation
- `cleanupRecords` timer for retention cleanup
- Optional event-forwarding to backend realtime endpoint

---

## 🧰 Technology Stack

### Frontend
- React (Vite)
- React Router
- Axios
- CSS/Tailwind-style utility classes
- Native SVG chart widgets

### Backend
- Node.js + Express
- Mongoose (MongoDB/Cosmos Mongo API)
- `ws` for WebSocket broadcast
- JWT + bcrypt
- express-validator
- express-rate-limit

### Cloud / Infra
- Azure Functions (TypeScript)
- Bicep templates (App Service, Cosmos DB, Functions, Storage)

---

## 📁 Project Structure

```
backend/
  src/
    controllers/
    middleware/
    models/
    routes/
    websocket/
frontend/
  src/
    components/
    pages/
    lib/
functions/
  processNotifications/
  cleanupRecords/
infra/
  *.bicep
```

---

## 🔌 API Documentation

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login and receive token |
| GET | `/api/auth/me` | Authenticated | Current user |
| GET | `/api/auth/responders` | Responder/Admin | List responders/admins |

### Incidents
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/incidents` | Authenticated | List incidents (filters + pagination) |
| POST | `/api/incidents` | Authenticated | Create incident |
| GET | `/api/incidents/:id` | Authenticated | Incident detail |
| PUT | `/api/incidents/:id` | Authenticated | Update incident |
| DELETE | `/api/incidents/:id` | Admin | Delete incident |

### Attachments
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/incidents/:id/attachments` | Authenticated | Upload attachment |
| GET | `/api/incidents/:id/attachments` | Authenticated | List attachments |
| GET | `/api/incidents/:id/attachments/:fileName` | Authenticated | Download attachment |

### Analytics
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/analytics/summary` | Admin | Count by severity/status |
| GET | `/api/analytics/trends` | Admin | 7-day incident trend |
| GET | `/api/analytics/resolution-time` | Admin | Avg resolution minutes |

---

## 🔧 Environment Configuration

### Backend (`backend/.env.example`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | API port |
| `NODE_ENV` | Yes | Runtime mode |
| `MONGO_URI` | Yes | Mongo/Cosmos connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `ALLOWED_ORIGIN` | Yes | Frontend origin |
| `REALTIME_EVENT_KEY` | Yes | Shared key for serverless realtime events |

### Frontend (`frontend/.env.example`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | Yes | Backend API base URL |

### Functions (`functions/local.settings.json.example`)

| Variable | Required | Description |
|---|---|---|
| `AzureWebJobsStorage` | Yes | Functions storage |
| `FUNCTIONS_WORKER_RUNTIME` | Yes | Worker runtime (`node`) |
| `COSMOS_MONGO_URI` | Yes | Mongo/Cosmos URI |
| `COSMOS_DB_NAME` | Yes | Database name |
| `RETENTION_DAYS` | Yes | Cleanup retention window |
| `REALTIME_BROADCAST_URL` | Optional | Backend realtime event endpoint |
| `REALTIME_EVENT_KEY` | Optional | Shared key for realtime endpoint |

---

## 🚀 Local Development

### 1) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### 3) Azure Functions (optional)
```bash
cd functions
cp local.settings.json.example local.settings.json
npm install
npm run build
func start
```

---

## 🖼️ Screenshots


- Dashboard: `docs/screenshots/dashboard.png` *(placeholder)*
- Analytics: `docs/screenshots/analytics.png` *(placeholder)*
- Incident List: `docs/screenshots/incidents-list.png` *(placeholder)*
- Incident Detail + Timeline: `docs/screenshots/incident-detail-timeline.png` *(placeholder)*
- Attachment Upload: `docs/screenshots/incident-attachments.png` *(placeholder)*
- SLA Badges: `docs/screenshots/sla-badges.png` *(placeholder)*

---

## 🛡️ Validation & Error Handling Notes

- Backend validation covers register, incident create/update, incident query params, incident id params, and attachment upload/download params.
- Frontend displays user-friendly alerts for API failures, auth expiry, and attachment failures.
- WebSocket reconnect/disconnect status is surfaced both in navbar indicator and realtime toast notifications.
