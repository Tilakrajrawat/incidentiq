# 🚨 IncidentIQ — Cloud-Native Incident Management System

A **production-grade incident management platform** built on a cloud-native MERN stack, designed to help engineering teams report, track, escalate, and resolve incidents in real time.

Built with **Azure-native architecture** including serverless background processing, Cosmos DB-compatible data models, infrastructure-as-code, and fully prepared CI/CD pipelines.

---

## 🎯 Problem Statement

When production systems fail, teams need a fast, structured way to report incidents, assign severity, notify the right people, and track resolution. IncidentIQ provides exactly that — a lightweight but powerful incident lifecycle management system inspired by tools like PagerDuty and OpsGenie.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                 │
│              Azure App Service (Static Web App)          │
└───────────────────────┬─────────────────────────────────┘
                        │ REST API + WebSocket
┌───────────────────────▼─────────────────────────────────┐
│              Node.js + Express.js Backend                │
│                 Azure App Service                        │
│   JWT Auth │ Role-based Access │ WebSocket Server        │
└───────────────────────┬─────────────────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          │             │              │
┌─────────▼──┐  ┌───────▼──────┐  ┌───▼──────────────────┐
│ Cosmos DB  │  │Azure Functions│  │  App Insights Logger  │
│(Mongo API) │  │  Serverless   │  │  Observability        │
└────────────┘  └──────────────┘  └──────────────────────┘
                        │
          ┌─────────────┼──────────────┐
          │                            │
┌─────────▼──────────┐    ┌────────────▼───────────┐
│ Auto-Escalation    │    │  Cleanup & Archival     │
│ Timer Trigger      │    │  Timer Trigger          │
│ (every 15 min)     │    │  (daily)                │
└────────────────────┘    └────────────────────────┘
```

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication
- Role-based access control — **Reporter / Responder / Admin**
- BCrypt password hashing
- Environment-based secure configuration

### 🚨 Incident Lifecycle Management
- Create incidents with severity levels — **Critical / High / Medium / Low**
- Assign incidents to responders
- Track status — **Open / Acknowledged / In Progress / Resolved / Closed**
- Full audit trail of status changes with timestamps

### ⚡ Real-time Features
- WebSocket-based live notifications when critical incidents are created
- Live status updates pushed to all active dashboard users
- Instant alerts when incidents are escalated

### 🔄 Serverless Background Processing (Azure Functions)
- **Auto-Escalation Function** — Timer trigger every 15 minutes, automatically escalates unacknowledged Critical incidents and notifies admins
- **Cleanup Function** — Daily timer trigger archives resolved incidents older than 30 days, keeping the system performant

### 📊 Analytics Dashboard
- Active incidents by severity
- Average resolution time by severity level
- Incident trend over last 7 days
- Team response rate metrics

### ☁️ Azure-Native Infrastructure
- **Azure App Service** — Backend and frontend deployment ready
- **Cosmos DB (Mongo API)** — Schemas designed with logical partitioning for scalability
- **Azure Functions** — Serverless background jobs with TypeScript
- **Azure Application Insights** — Structured logging and observability patterns
- **Azure Blob Storage** — Incident attachment support
- **Infrastructure as Code** — Full Bicep templates for all resources

### 🔄 CI/CD Pipelines
- GitHub Actions workflows for backend, frontend, and functions deployment
- Environment-based configuration management
- Automated deployment to Azure App Service

---

## 🧰 Tech Stack

### Frontend
- React 18 (Vite)
- Axios
- React Router v6
- Tailwind CSS
- WebSocket client for real-time updates

### Backend
- Node.js + Express.js
- JWT Authentication
- WebSocket Server (ws library)
- Mongoose (Cosmos DB Mongo API compatible)
- Structured logging with Application Insights patterns

### Cloud & DevOps
| Service | Purpose |
|---------|---------|
| Azure App Service | Backend + Frontend hosting |
| Azure Cosmos DB (Mongo API) | Primary database with partitioning |
| Azure Functions | Auto-escalation + cleanup jobs |
| Azure Application Insights | Logging and observability |
| Azure Blob Storage | Incident attachments |
| GitHub Actions | CI/CD pipelines |
| Bicep | Infrastructure as Code |

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
├── .github/
│   └── workflows/
│       ├── deploy-backend.yml
│       ├── deploy-frontend.yml
│       └── deploy-functions.yml
└── infra/
    ├── cosmos.bicep
    ├── appservice.bicep
    ├── functionapp.bicep
    └── storage.bicep
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local) or Azure Cosmos DB connection string
- Azure Functions Core Tools (for local function development)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Tilakrajrawat/IncidentIQ.git
cd IncidentIQ

# Backend setup
cd backend
cp .env.example .env
# Add your MongoDB/Cosmos DB connection string to .env
npm install
npm run dev

# Frontend setup (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev

# Functions setup (new terminal)
cd functions
cp local.settings.json.example local.settings.json
npm install
func start
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login and get JWT | Public |
| GET | /api/auth/me | Get current user | All roles |

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
| GET | /api/analytics/summary | Incident counts by severity and status | Admin |
| GET | /api/analytics/trends | Incident trend over last 7 days | Admin |
| GET | /api/analytics/resolution-time | Average resolution time by severity | Admin |

---

## 🗄️ Data Models

### Incident Schema
```javascript
{
  title: String,           // Short incident description
  description: String,     // Detailed description
  severity: String,        // CRITICAL / HIGH / MEDIUM / LOW
  status: String,          // OPEN / ACKNOWLEDGED / IN_PROGRESS / RESOLVED / CLOSED
  assignedTo: ObjectId,    // Reference to User
  reportedBy: ObjectId,    // Reference to User
  tags: [String],          // e.g. ['database', 'api', 'frontend']
  escalatedAt: Date,       // Set when auto-escalated
  resolvedAt: Date,        // Set when resolved
  createdAt: Date,
  updatedAt: Date
}
```

---

## ⚡ Azure Functions

### Auto-Escalation Function
- **Trigger**: Timer — runs every 15 minutes
- **Logic**: Finds all CRITICAL incidents that are still OPEN after 15 minutes, escalates to IN_PROGRESS, notifies admin users via WebSocket
- **Purpose**: Ensures critical incidents never go unacknowledged

### Cleanup Function
- **Trigger**: Timer — runs daily at midnight
- **Logic**: Archives CLOSED incidents older than 30 days to reduce query load
- **Purpose**: Keeps active incident collection lean and performant

---

## 🔍 Key Design Decisions

**Why Cosmos DB?**
Incidents are partitioned by severity, allowing high-throughput queries for critical incidents without scanning the entire collection.

**Why WebSockets for alerts?**
Polling for real-time incident alerts would create unnecessary load. WebSocket connections allow instant push notifications to all active dashboard users when critical incidents are created or escalated.

**Why Azure Functions for escalation?**
Escalation logic needs to run independently of user requests. A serverless timer trigger is the ideal pattern — no always-on server needed, scales automatically, costs nothing when idle.

**Why JWT over sessions?**
The backend is designed for horizontal scaling on Azure App Service. Stateless JWT authentication means any instance can validate any token without shared session storage.

---

## 📈 Future Enhancements
- Email/SMS notifications via Azure Communication Services
- On-call schedule management
- Slack/Teams webhook integration
- Mobile responsive PWA
- SLA tracking and breach alerts

---

## 👨‍💻 Author

**Tilak Raj Rawat**  
Final Year B.Tech CSE — Graphic Era Hill University  
[LinkedIn](https://linkedin.com/in/tilakrajrawat142) | [GitHub](https://github.com/Tilakrajrawat)
