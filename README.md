# Aarogya ID – Claims Management Platform

<div align="center">

![AarogyaID Banner](https://img.shields.io/badge/AarogyaID-Claims%20Management-blue?style=for-the-badge&logo=activity)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

**A production-quality full-stack health insurance claims management platform built for the Aarogya ID internship assignment.**

</div>

---

## Project Overview

Aarogya ID is a modern health-tech SaaS application that streamlines the health insurance claim process by providing dedicated portals for two user roles:

- **Patient Portal** — Submit claims, upload receipts/prescriptions, track status in real time, view AI-generated claim summaries
- **Insurer Portal** — Review claims, view documents, approve/reject with comments, track dashboard statistics

The platform is designed to look and feel like a real startup product — similar in aesthetic quality to Stripe, Linear, or Vercel — with smooth animations, beautiful typography, dark mode, and mobile-responsive design.

---

## Architecture

```
AarogyaID/
├── frontend/                  # React + Vite + TailwindCSS
│   └── src/
│       ├── components/        # Reusable UI components
│       │   ├── ui/            # Button, Card, Modal, Skeleton, StatusBadge
│       │   └── layout/        # Navbar, Breadcrumb
│       ├── pages/
│       │   ├── auth/          # LoginPage
│       │   ├── patient/       # PatientDashboard, SubmitClaim, ClaimDetails
│       │   └── insurer/       # InsurerDashboard, ClaimsTable, ReviewPage
│       ├── layouts/           # ProtectedLayout, AuthLayout
│       ├── hooks/             # useAuth, useTheme
│       ├── services/          # api.ts, auth.service.ts, claims.service.ts
│       ├── types/             # TypeScript types/interfaces
│       ├── utils/             # helpers.ts (formatting, risk levels)
│       └── context/           # AuthContext, ThemeContext
│
└── backend/                   # NestJS + MongoDB + JWT
    └── src/
        ├── auth/              # JWT Auth module (login, guards, strategies)
        ├── users/             # User schema + seeding service
        ├── claims/            # Claims schema, service, controller
        └── uploads/           # Multer file upload controller
```

---

## Features

### Patient Portal
- 📋 **Dashboard** — Summary cards (Total, Pending, Approved, Rejected), recent claims table
- 📝 **Submit Claim** — Form with drag-and-drop file upload, real-time risk indicator, inline validation
- 🔍 **Claim Details** — Timeline view, AI insights card, document preview modal, insurer comments
- 📄 **Document Upload** — PDF, JPG, PNG support up to 10MB

### Insurer Portal
- 📊 **Dashboard** — 5 stats cards including total approved amount, pending claims queue
- 📋 **Claims Table** — Searchable, filterable (status, amount range), sortable (newest/oldest/highest)
- ✅ **Review Page** — Approve/Reject with confirmation modal, add approved amount & comments, document preview

### AI Features (Preview)
- 🤖 **AI Claim Summary** — Auto-generated claim analysis based on description and uploaded document
- ⚠️ **Risk Indicator** — Low/Medium/High risk based on claim amount thresholds

### Platform
- 🔐 **JWT Authentication** — Role-based access control (Patient vs. Insurer)
- 🌙 **Dark Mode** — Full dark mode with localStorage persistence
- 📱 **Responsive** — Mobile and desktop layouts
- ✨ **Animations** — Framer Motion page transitions, card hover effects, loading skeletons
- 🔔 **Toast Notifications** — Success/error feedback for all actions

---

## Tech Stack

### Frontend
| Library | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 6.x | Build tool |
| TailwindCSS | 4.x | Styling |
| React Router | 7.x | Client-side routing |
| TanStack Query | 5.x | Server state management |
| React Hook Form | 7.x | Form management |
| Zod | 3.x | Schema validation |
| Axios | 1.x | HTTP client |
| Framer Motion | 12.x | Animations |
| Lucide React | Latest | Icons |
| React Hot Toast | 2.x | Toast notifications |

### Backend
| Library | Version | Purpose |
|---------|---------|---------|
| NestJS | 11.x | Backend framework |
| MongoDB | - | Database |
| Mongoose | 8.x | ODM |
| JWT | - | Authentication |
| Passport.js | - | Auth middleware |
| Multer | - | File uploads |
| bcryptjs | - | Password hashing |

---

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or MongoDB Atlas URI)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/IshaRode/aarogyaid-claims-management-assignment.git
cd aarogyaid-claims-management-assignment
```

---

## Running the Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/aarogyaid
JWT_SECRET=aarogyaid_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d
UPLOAD_DIR=./uploads
```

Start the backend:
```bash
npm run start:dev
```

The backend will start on **http://localhost:3001**

> ✅ Demo users are automatically seeded on first startup — no manual DB setup needed.

---

## Running the Frontend

```bash
cd frontend
npm install
```

Create `.env` file in `frontend/`:
```env
VITE_API_BASE_URL=http://localhost:3001
```

Start the frontend:
```bash
npm run dev
```

The frontend will start on **http://localhost:5173**

---

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/aarogyaid` |
| `JWT_SECRET` | JWT signing secret | `aarogyaid_super_secret_jwt_key_2024` |
| `JWT_EXPIRES_IN` | JWT token expiry | `7d` |
| `UPLOAD_DIR` | Upload directory path | `./uploads` |

### Frontend (`frontend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3001` |

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🧑 Patient | `patient@aarogyaid.com` | `password123` |
| 🏥 Insurer | `insurer@aarogyaid.com` | `password123` |

---

## API Documentation

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/login` | ❌ | Login with email + password |

**Request Body:**
```json
{
  "email": "patient@aarogyaid.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "...",
    "email": "patient@aarogyaid.com",
    "name": "Priya Sharma",
    "role": "patient"
  }
}
```

### Claims
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/claims` | ✅ | Patient | Submit a new claim |
| `GET` | `/claims/my` | ✅ | Patient | Get own claims |
| `GET` | `/claims/stats` | ✅ | Both | Get claim statistics |
| `GET` | `/claims` | ✅ | Insurer | Get all claims (with filters) |
| `GET` | `/claims/:id` | ✅ | Both | Get claim by ID |
| `PATCH` | `/claims/:id` | ✅ | Insurer | Update claim status |

**GET /claims Query Parameters (Insurer):**
- `status` — Filter by status (`Pending`, `Approved`, `Rejected`)
- `search` — Search by patient name or email
- `minAmount` — Minimum claim amount
- `maxAmount` — Maximum claim amount
- `sort` — Sort order (`newest`, `oldest`, `highest`)

### File Upload
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/uploads` | ✅ | Upload a document file |

Uploaded files are served at: `http://localhost:3001/uploads/<filename>`

---

## Screenshots

> _Screenshots to be added after running the application_

| Page | Description |
|------|-------------|
| Login | Split-screen login with demo buttons |
| Patient Dashboard | Stats cards + recent claims table |
| Submit Claim | Form with drag-and-drop upload + AI preview |
| Claim Details | Timeline + AI insights + document preview |
| Insurer Dashboard | Full stats + pending claims |
| Claims Table | Filterable/sortable claims list |
| Review Page | Approve/reject with confirmation modal |

---

## Folder Structure

```
frontend/src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx          # Animated button with variants
│   │   ├── Card.tsx            # Card + StatCard components
│   │   ├── Modal.tsx           # Backdrop modal with keyboard close
│   │   ├── Skeleton.tsx        # Loading skeleton states
│   │   └── StatusBadge.tsx     # Claim status badges with icons
│   └── layout/
│       ├── Navbar.tsx          # Sticky navbar with user avatar
│       └── Breadcrumb.tsx      # Page breadcrumb navigation
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx       # Split-screen login
│   ├── patient/
│   │   ├── PatientDashboard.tsx
│   │   ├── SubmitClaimPage.tsx
│   │   └── ClaimDetailsPage.tsx
│   ├── insurer/
│   │   ├── InsurerDashboard.tsx
│   │   ├── InsurerClaimsTable.tsx
│   │   └── ReviewPage.tsx
│   └── ErrorPages.tsx          # 404 + Unauthorized pages
├── layouts/
│   └── AppLayout.tsx           # ProtectedLayout + AuthLayout
├── services/
│   ├── api.ts                  # Axios instance + interceptors
│   ├── auth.service.ts
│   └── claims.service.ts
├── context/
│   ├── AuthContext.tsx         # JWT auth state
│   └── ThemeContext.tsx        # Dark mode state
├── types/index.ts              # All TypeScript interfaces
└── utils/helpers.ts            # Formatting utilities

backend/src/
├── auth/
│   ├── auth.module.ts
│   ├── auth.service.ts         # Login + JWT signing
│   ├── auth.controller.ts      # POST /auth/login
│   ├── jwt.strategy.ts         # Passport JWT strategy
│   ├── jwt-auth.guard.ts
│   ├── roles.guard.ts
│   └── roles.decorator.ts
├── users/
│   ├── users.module.ts
│   ├── users.service.ts        # User CRUD + seeding
│   └── user.schema.ts
├── claims/
│   ├── claims.module.ts
│   ├── claims.service.ts       # Business logic + AI summary
│   ├── claims.controller.ts
│   ├── claims.dto.ts
│   └── claim.schema.ts
├── uploads/
│   ├── uploads.module.ts
│   └── uploads.controller.ts  # Multer file upload
├── app.module.ts
└── main.ts
```

---

## Future Improvements

- [ ] Email notifications on claim status changes
- [ ] Real AI integration (Gemini/OpenAI) for claim summaries
- [ ] Claim amendment/resubmission flow
- [ ] Batch claim processing for insurers
- [ ] Analytics dashboard with charts (claim volume, approval rates)
- [ ] Mobile app (React Native)
- [ ] Document OCR for automatic data extraction
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Audit trail for all insurer actions
- [ ] Export claims to PDF/CSV

---

## License

This project is built for the Aarogya ID internship assignment.

---

<div align="center">
Built with ❤️ by Isha Rode
</div>
