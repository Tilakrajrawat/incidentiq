# 🚨 IncidentIQ — Incident Management Platform (Current Implementation)

A full-stack incident management platform built with a **React frontend**, **Node.js/Express backend**, **Mongo-compatible data model**, and optional **Azure Functions + Bicep infrastructure**.

It supports core incident workflows: authentication, role-aware access controls, incident CRUD, websocket broadcasts, and analytics endpoints.

---

## ✅ What this repository currently provides

- JWT-based auth (`register`, `login`, `me`)
- Role model: `reporter`, `responder`, `admin`
- Incident/record CRUD via `/api/incidents` (aliased to record routes)
- Severity and status fields with lifecycle timestamps (`acknowledgedAt`, `resolvedAt`)
- WebSocket event broadcasting for incident changes
- Admin-only analytics APIs
- Azure Function timers for auto-escalation and cleanup

---

## 🏗️ Runtime Architecture

```
┌──────────────────────────────────────────────┐
│                 React + Vite                  │
└───────────────────────┬──────────────────────┘
                        │ REST API + WebSocket
┌───────────────────────▼──────────────────────┐
│             Node.js + Express Backend         │
│   JWT Auth │ Role Checks │ WebSocket Server   │
│   Rate Limiting │ Validation │ Pagination      │
└───────────────────────┬──────────────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
     ┌──────▼──────┐ ┌──▼──────────┐ ┌──────────────────────┐
     │ MongoDB /   │ │ Azure Funcs │ │ App Insights          │
     │ Cosmos API  │ │ Timers      │ │ (optional logging)    │
     └─────────────┘ └─────┬───────┘ └──────────────────────┘
                           │
              ┌────────────┼─────────────┐
              │                          │
     ┌────────▼────────┐        ┌────────▼─────────┐
     │ Auto Escalation │        │ Cleanup (Delete) │
     │ Every 15 min    │        │ Daily at 2:00 AM │
     └─────────────────┘        └───────────────────┘
```

---

## ✨ Implemented Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication
- Role checks on protected routes
- BCrypt password hashing
- Role carried in JWT payload
- Route protection middleware (`authMiddleware`, `requireRole`)

| Role | Permissions |
|------|-------------|
| Reporter | Register/login, create incidents, view own incidents |
| Responder | Same role model supported in auth payload (no dedicated responder-only route layer yet) |
| Admin | View all incidents, delete incidents, access analytics |

---

### 🚨 Incident Lifecycle Management

**Severity Levels:**
```
critical → high → medium → low
```

**Incident Status Values:**
```
open → acknowledged → in_progress → resolved → closed
```

**Capabilities:**
- Create incidents with title, description/content, severity, optional tags in metadata
- Optional assignment field (`assignedTo`)
- Update status and write `acknowledgedAt`/`resolvedAt` timestamps
- Auto-mark escalated critical incidents via timer function
- Delete resolved/closed old incidents via cleanup timer

---

### ⚡ Real-Time Alerts (WebSocket)
- Incident events are broadcast to connected clients
- Frontend toast-style alerts currently subscribe to:
  - `incident_created`
  - `incident_escalated`
- Backend also broadcasts:
  - `incident_updated`
  - `incident_resolved`

---

### 🔄 Serverless Background Processing (Azure Functions)

**Auto-Escalation Function**
- Trigger: Timer — every 15 minutes
- Finds critical incidents still open after 15 minutes
- Marks `escalated: true` and writes escalation metadata
- Forwards `incident_escalated` event to backend event endpoint (best effort)

**Cleanup Function**
- Trigger: Timer — daily at 2:00 AM (`0 0 2 * * *`)
- Deletes closed/resolved incidents older than retention window (default 30 days)
- Uses `RETENTION_DAYS` env var

---

### 📊 Analytics API

| Endpoint | Description | Access |
|----------|-------------|--------|
| GET /api/analytics/summary | Incident counts by severity and status | Admin |
| GET /api/analytics/trends | Incident trend over last 7 days | Admin |
| GET /api/analytics/resolution-time | Average resolution time by severity | Admin |

> Note: these analytics endpoints are implemented in the backend API. A dedicated frontend analytics page is not included yet.

---

### 🔒 Security & Reliability
- BCrypt password hashing
- JWT token verification middleware
- Role-based route protection
- Input validation on register/create routes
- Rate limiting — 100 requests per 15 minutes per IP
- Centralized error handling
- Environment-based secrets management

---

## ☁️ Azure Components in this repo

| Service | Purpose |
|---------|---------|
| Azure App Service (Bicep) | Backend app + plan resources |
| Azure Cosmos DB (Mongo API) (Bicep) | Mongo-compatible account |
| Azure Functions (Bicep + TS functions) | Auto-escalation + cleanup timers |
| Storage Account (Bicep) | Function app storage dependency |
| Application Insights (runtime option) | Optional telemetry via connection string |

---

## 🧰 Tech Stack

### Frontend
- React 18 (Vite)
- Axios
- React Router v6
- Tailwind CSS
- WebSocket client

### Backend
- Node.js + Express.js
- JWT Authentication
- WebSocket Server (`ws`)
- Mongoose
- Express Rate Limit
- Express Validator

### Cloud / Infra
- Azure Functions (TypeScript)
- Bicep templates for App Service, Cosmos DB, Function App, Storage

---

## 📂 Project Structure (actual)

```
IncidentIQ/
├── backend/
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── recordController.js
│       │   └── analyticsController.js
│       ├── models/
│       │   ├── User.js
│       │   └── Record.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── roleMiddleware.js
│       │   ├── errorHandler.js
│       │   ├── validate.js
│       │   ├── rateLimiter.js
│       │   └── requestLogger.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── recordRoutes.js
│       │   └── analyticsRoutes.js
│       ├── websocket/
│       │   └── wsServer.js
│       └── utils/
│           └── logger.js
├── frontend/
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── lib/
│       │   ├── api.js
│       │   └── websocket.js
│       ├── components/
│       │   ├── Layout.jsx
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── IncidentCard.jsx
│       │   ├── SeverityBadge.jsx
│       │   ├── RecordForm.jsx
│       │   ├── RecordList.jsx
│       │   └── RealTimeAlert.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── Records.jsx
│           └── IncidentDetail.jsx
├── functions/
│   ├── processNotifications/
│   ├── cleanupRecords/
│   └── shared/
└── infra/
    ├── cosmos.bicep
    ├── appservice.bicep
    ├── functionapp.bicep
    └── storage.bicep
```

---

## 🚀 Getting Started

### Prerequisites
```
Node.js 18+
MongoDB (local) or Azure Cosmos DB Mongo connection string
Azure Functions Core Tools v4 (optional, for local function runs)
```

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in MongoDB/Cosmos DB connection string and JWT secret
npm install
npm run dev
# Server default: http://localhost:4000
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:4000 in .env
npm install
npm run dev
# App default: http://localhost:5173
```

### Azure Functions Setup
```bash
cd functions
cp local.settings.json.example local.settings.json
# Fill in COSMOS_MONGO_URI and related settings
npm install
npm run build
func start
# or: npm start
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register with role selection | Public |
| POST | /api/auth/login | Login and receive JWT | Public |
| GET | /api/auth/me | Get current user profile | Authenticated |

### Incidents
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/incidents | Get incidents (paginated, filterable) | Authenticated |
| POST | /api/incidents | Create new incident | Authenticated |
| GET | /api/incidents/:id | Get incident by ID | Authenticated |
| PUT | /api/incidents/:id | Update incident fields/status | Authenticated |
| DELETE | /api/incidents/:id | Delete incident | Admin only |

> `/api/records` is also exposed and maps to the same handlers.

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/analytics/summary | Counts by severity and status | Admin |
| GET | /api/analytics/trends | Last 7 days trend | Admin |
| GET | /api/analytics/resolution-time | Avg resolution time by severity | Admin |

---

## 🗄️ Data Model

### Record (Incident) Schema
```javascript
{
  title: String,
  content: String,
  severity: String,        // critical / high / medium / low
  status: String,          // open / acknowledged / in_progress / resolved / closed
  assignedTo: ObjectId,    // Reference to User
  userId: ObjectId,        // Reporter
  escalated: Boolean,
  metadata: Object,
  acknowledgedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

