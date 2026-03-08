# 🚨 IncidentIQ — Cloud-Native Incident Management Platform

A **cloud-native incident management platform** built with a **MERN stack and Azure services** that enables engineering teams to **report, track, escalate, and resolve incidents in real time**.

Inspired by tools like **PagerDuty and OpsGenie**, IncidentIQ demonstrates modern **distributed system design**, **real-time WebSocket architecture**, **serverless background processing**, and **cloud-native deployment practices**.

---

## 🎯 Problem Statement

When production systems fail, teams need a fast and structured incident response workflow. IncidentIQ provides:

- Fast incident reporting with severity classification
- Structured lifecycle tracking from OPEN to CLOSED
- Real-time alerts when critical incidents are created or escalated
- Automatic escalation of unattended critical incidents
- Operational analytics for incident pattern analysis

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────┐
│            React Frontend (Vite)              │
│        Azure Static Web Apps Ready           │
└───────────────────────┬──────────────────────┘
                        │ REST API + WebSocket
┌───────────────────────▼──────────────────────┐
│            Node.js + Express Backend          │
│              Azure App Service Ready          │
│   JWT Auth │ RBAC │ WebSocket Server          │
│   Rate Limiting │ Validation │ Pagination     │
└───────────────────────┬──────────────────────┘
                        │
            ┌───────────┼───────────┐
            │           │           │
     ┌──────▼──────┐ ┌──▼──────────┐ ┌──────────────────────┐
     │ Cosmos DB   │ │ Azure Funcs │ │ App Insights Logging  │
     │ Mongo API   │ │ Serverless  │ │ Observability        │
     └─────────────┘ │ Background  │ └──────────────────────┘
                     │ Jobs        │
                     └─────┬───────┘
                           │
              ┌────────────┼─────────────┐
              │                          │
     ┌────────▼────────┐        ┌────────▼─────────┐
     │ Auto Escalation │        │ Cleanup & Archive │
     │ Timer Trigger   │        │ Timer Trigger     │
     │ Every 15 min    │        │ Daily at Midnight │
     └─────────────────┘        └───────────────────┘
```

---

## ✨ Core Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control (RBAC)

| Role | Permissions |
|------|-------------|
| Reporter | Create and view incidents |
| Responder | Create, view, update incidents |
| Admin | Full access including delete and analytics |

- BCrypt password hashing
- Role carried in JWT payload
- Protected route middleware per role

---

### 🚨 Incident Lifecycle Management

**Severity Levels:**
```
CRITICAL → HIGH → MEDIUM → LOW
```

**Incident Status Flow:**
```
OPEN → ACKNOWLEDGED → IN_PROGRESS → RESOLVED → CLOSED
```

**Capabilities:**
- Create incidents with title, description, severity, tags
- Assign incidents to responders
- Update status with timestamps
- Track escalation time automatically
- Archive resolved incidents via background job

---

### ⚡ Real-Time Alerts (WebSocket)
- Live dashboard updates when incidents are created
- Instant push notifications for CRITICAL severity incidents
- Real-time escalation alerts broadcast to all admin users
- Status change events pushed to all connected clients

**WebSocket Events:**
```
incident_created
incident_updated
incident_escalated
incident_resolved
```

---

### 🔄 Serverless Background Processing (Azure Functions)

**Auto-Escalation Function**
- Trigger: Timer — every 15 minutes
- Finds CRITICAL incidents still OPEN after 15 minutes
- Escalates status and records escalation timestamp
- Broadcasts escalation alert via WebSocket to admins

**Cleanup & Archival Function**
- Trigger: Timer — daily at midnight
- Archives CLOSED/RESOLVED incidents older than 30 days
- Keeps active incident collection lean and performant
- Environment-driven via COSMOS_DB_NAME, INCIDENT_COLLECTION

---

### 📊 Analytics Dashboard

| Endpoint | Description | Access |
|----------|-------------|--------|
| GET /api/analytics/summary | Incident counts by severity and status | Admin |
| GET /api/analytics/trends | Incident trend over last 7 days | Admin |
| GET /api/analytics/resolution-time | Average resolution time by severity | Admin |

---

### 🔒 Security & Reliability
- BCrypt password hashing
- JWT token verification middleware
- Role-based route protection
- Input validation on all endpoints
- Rate limiting — 100 requests per 15 minutes per IP
- Centralized error handling
- Environment-based secrets management

---

## ☁️ Azure Cloud Architecture

| Service | Purpose |
|---------|---------|
| Azure App Service | Backend hosting |
| Azure Static Web Apps | Frontend hosting |
| Azure Cosmos DB (Mongo API) | Primary database |
| Azure Functions | Auto-escalation + cleanup jobs |
| Azure Application Insights | Structured logging and observability |
| GitHub Actions | CI/CD pipelines |
| Bicep | Infrastructure as Code |

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
- WebSocket Server (ws)
- Mongoose (Cosmos DB Mongo API compatible)
- Express Rate Limit
- Express Validator
- Structured logging middleware

### Cloud & DevOps
- Azure App Service
- Azure Cosmos DB
- Azure Functions (TypeScript)
- GitHub Actions
- Bicep (Infrastructure as Code)

---

## 📂 Project Structure

```
IncidentIQ/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── incidentController.js
│       │   └── analyticsController.js
│       ├── models/
│       │   ├── User.js
│       │   └── Incident.js
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   ├── roleMiddleware.js
│       │   ├── errorHandler.js
│       │   ├── validate.js
│       │   ├── rateLimiter.js
│       │   └── requestLogger.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── incidentRoutes.js
│       │   └── analyticsRoutes.js
│       ├── websocket/
│       │   └── wsServer.js
│       └── utils/
│           └── logger.js
├── frontend/
│   ├── .env.example
│   ├── package.json
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
│       │   └── RealTimeAlert.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── Incidents.jsx
│           ├── IncidentDetail.jsx
│           └── Analytics.jsx
├── functions/
│   ├── package.json
│   ├── tsconfig.json
│   ├── host.json
│   ├── local.settings.json.example
│   ├── shared/
│   │   └── cosmosClient.ts
│   ├── autoEscalation/
│   │   ├── function.json
│   │   └── index.ts
│   └── cleanupIncidents/
│       ├── function.json
│       └── index.ts
├── infra/
│   ├── cosmos.bicep
│   ├── appservice.bicep
│   ├── functionapp.bicep
│   └── storage.bicep
└── .github/
    └── workflows/
        ├── deploy-backend.yml
        ├── deploy-frontend.yml
        └── deploy-functions.yml
```

---

## 🚀 Getting Started

### Prerequisites
```
Node.js 18+
MongoDB (local) or Azure Cosmos DB connection string
Azure Functions Core Tools v4
```

### Clone Repository
```bash
git clone https://github.com/Tilakrajrawat/IncidentIQ.git
cd IncidentIQ
```

### Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in MongoDB/Cosmos DB connection string and JWT secret
npm install
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000 in .env
npm install
npm run dev
# App runs on http://localhost:5173
```

### Azure Functions Setup
```bash
cd functions
cp local.settings.json.example local.settings.json
# Fill in Cosmos DB connection string
npm install
func start
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register with role selection | Public |
| POST | /api/auth/login | Login and receive JWT | Public |
| GET | /api/auth/me | Get current user profile | All roles |

### Incidents
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/incidents | Get all incidents (paginated, filterable) | All roles |
| POST | /api/incidents | Create new incident | Reporter+ |
| GET | /api/incidents/:id | Get incident by ID | All roles |
| PUT | /api/incidents/:id | Update incident | Responder+ |
| PATCH | /api/incidents/:id/status | Update status only | Responder+ |
| DELETE | /api/incidents/:id | Delete incident | Admin only |

### Analytics
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/analytics/summary | Counts by severity and status | Admin |
| GET | /api/analytics/trends | Last 7 days trend | Admin |
| GET | /api/analytics/resolution-time | Avg resolution time by severity | Admin |

---

## 🗄️ Data Model

### Incident Schema
```javascript
{
  title: String,
  description: String,
  severity: String,        // CRITICAL / HIGH / MEDIUM / LOW
  status: String,          // OPEN / ACKNOWLEDGED / IN_PROGRESS / RESOLVED / CLOSED
  assignedTo: ObjectId,    // Reference to User
  reportedBy: ObjectId,    // Reference to User
  tags: [String],
  escalatedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Key Design Decisions

**Why Cosmos DB?**
Incidents are partitioned by severity, enabling high-throughput queries for critical incidents without full collection scans.

**Why WebSockets over polling?**
Polling for real-time alerts creates unnecessary load. WebSocket connections allow instant push notifications to all active dashboard users when critical incidents are created or escalated.

**Why Azure Functions for escalation?**
Escalation logic needs to run on a schedule, independent of user requests. A serverless timer trigger is the ideal pattern — no always-on server required, scales automatically, zero cost when idle.

**Why stateless JWT?**
The backend is designed for horizontal scaling on Azure App Service. Stateless JWT means any instance can validate any token without shared session storage.

---

## 📈 Future Enhancements
- Email/SMS notifications via Azure Communication Services
- File attachments via Azure Blob Storage
- Slack/Teams webhook integration
- On-call schedule management
- SLA breach alerts
- Mobile responsive PWA

---

## 👨‍💻 Author

**Tilak Raj Rawat**
Final Year B.Tech CSE — Graphic Era Hill University
[LinkedIn](https://linkedin.com/in/tilakrajrawat142) | [GitHub](https://github.com/Tilakrajrawat)
