# CitiCare 🏙️

**Smart Civic Issue Reporting & Resolution System**

CitiCare connects Citizens, Municipal Departments, and Administrators on one platform to report, manage, and resolve civic issues.

---

## Tech Stack

| Layer      | Technologies                                                                              |
| ---------- | ----------------------------------------------------------------------------------------- |
| Frontend   | Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui, TanStack Query, Framer Motion, Leaflet, Recharts |
| Backend    | Node.js, Express.js, TypeScript, Prisma ORM, JWT, Passport.js, Multer, Nodemailer         |
| Database   | PostgreSQL 16 (Docker)                                                                    |
| Storage    | Cloudinary                                                                                |

---

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** (for PostgreSQL)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nikhilraj1388/CitiCare.git
cd CitiCare
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

This starts PostgreSQL 16 on `localhost:5432` with:
- User: `postgres`
- Password: `citicare_dev_2026`
- Database: `citicare`

### 3. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file (already provided, update if needed):
```
PORT=5000
DATABASE_URL=postgresql://postgres:citicare_dev_2026@localhost:5432/citicare
```

Start the development server:
```bash
npm run dev
```

Backend runs at: **http://localhost:5000**

### 4. Frontend Setup

```bash
cd frontend
npm install
```

Start the development server:
```bash
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## Project Structure

```
CitiCare/
├── frontend/           # Next.js 15 (App Router)
│   ├── src/
│   │   ├── app/        # Pages & layouts
│   │   ├── components/ # UI components (shadcn/ui)
│   │   ├── features/   # Feature modules
│   │   ├── hooks/      # Custom hooks
│   │   ├── lib/        # Axios, QueryProvider, utils
│   │   ├── services/   # API service functions
│   │   └── types/      # TypeScript interfaces
│   └── ...
├── backend/            # Express.js API
│   ├── src/
│   │   ├── config/     # App configuration
│   │   ├── controllers/# Route handlers
│   │   ├── middleware/ # Auth, errors, validation
│   │   ├── routes/     # API route definitions
│   │   ├── services/   # Business logic
│   │   ├── utils/      # Response helpers
│   │   └── validators/ # Request validation
│   ├── prisma/         # Database schema & migrations
│   └── ...
├── docker-compose.yml  # PostgreSQL container
└── *.md                # Project documentation
```

---

## API

All endpoints are versioned under `/api/v1`.

| Method | Endpoint            | Description       |
| ------ | ------------------- | ----------------- |
| GET    | `/api/v1/health`    | Health check      |

*More endpoints added as features are built.*

---

## Scripts

### Backend
| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start dev server (hot reload)|
| `npm run build`   | Compile TypeScript           |
| `npm run start`   | Start production server      |
| `npm run lint`    | Run ESLint                   |
| `npm run format`  | Run Prettier                 |

### Frontend
| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start dev server (Turbopack) |
| `npm run build`   | Production build             |
| `npm run start`   | Start production server      |
| `npm run lint`    | Run ESLint                   |

---

## License

ISC
