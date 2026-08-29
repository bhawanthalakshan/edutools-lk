# EduTools LK

> **"Learn Smart. Achieve More."**

EduTools LK is a full-stack educational resources and free online tools platform for Sri Lankan students, undergraduates, and lifelong learners.

---

## 🌟 Platform Features

- **6 Fully Functional Online Tools**:
  - **GPA Calculator** (`/tools/gpa-calculator`): Course credit weighted semester GPA calculation.
  - **CGPA Calculator** (`/tools/cgpa-calculator`): Cumulative multi-semester CGPA tracker.
  - **Percentage Calculator** (`/tools/percentage-calculator`): Score percentages and grade ratios.
  - **Age Calculator** (`/tools/age-calculator`): Years, months, days, and birthday countdown.
  - **Word Counter** (`/tools/word-counter`): Words, characters, sentences, paragraphs, and reading time.
  - **QR Code Generator** (`/tools/qr-code-generator`): Custom high-resolution QR codes with PNG download.
- **Academic Streams & Education Hub**:
  - G.C.E. Ordinary Level (`/education/ol`)
  - G.C.E. Advanced Level (`/education/al`)
  - University Degree Stream (`/education/university`)
  - IT & Programming Tutorials (`/education/it-programming`)
- **Full-Featured Blog & Reader**:
  - Searchable article directory with category filter pills and pagination (`/blog`).
  - Single article reader (`/article/:slug`) with metadata, tags, and related posts.
- **Global Search System**:
  - Navbar search bar submitting to `/search?q=query` with multi-entity hit counts (Articles, Tools, Categories).
- **Secure Authentication & Admin Control Panel**:
  - JWT authentication (`POST /api/auth/login`) with bcrypt password hashing.
  - Admin Dashboard (`/admin/dashboard`) featuring total metric counters and full CRUD operations (Create, Edit, Delete, Publish/Unpublish) for Articles, Categories, and Tools.
- **Monetization & AdSense Ready**:
  - Reusable `AdPlaceholder` component for non-intrusive banner and sidebar ad placements.
- **Production Hardening & SEO**:
  - Dynamic `title`, `meta description`, `OpenGraph` tags, and `canonical` URL updates.
  - `robots.txt` and `sitemap.xml` included.
  - Backend secured with `helmet` HTTP headers, `express-rate-limit` rate limiters, and CORS security.

---

## 📁 Repository Structure

```
edutools-lk/
├── frontend/             # React 19 + Vite 6 + Tailwind CSS v4 + React Router v7
│   ├── public/           # favicon.svg, robots.txt, sitemap.xml
│   ├── src/
│   │   ├── components/   # Navbar, Footer, Seo, AdPlaceholder, ArticleCard, RelatedTools, etc.
│   │   ├── context/      # AuthContext.jsx
│   │   ├── layouts/      # MainLayout.jsx
│   │   ├── pages/        # Home, Education, Tools, Blog, ArticleDetail, SearchResults, Legal, Admin
│   │   │   └── tools/    # GpaCalculator, CgpaCalculator, PercentageCalculator, AgeCalculator, WordCounter, QrCodeGenerator
│   │   └── services/     # api.js, articleService.js, categoryService.js, toolService.js
│   ├── package.json
│   └── vite.config.js
├── backend/              # Node.js + Express + Mongoose API Server
│   ├── config/           # Database configuration (db.js)
│   ├── controllers/      # authController, articleController, categoryController, toolController, contactController
│   ├── middleware/       # authMiddleware, errorMiddleware
│   ├── models/           # User.js, Article.js, Category.js, Tool.js, Contact.js
│   ├── routes/           # authRoutes, articleRoutes, categoryRoutes, toolRoutes, contactRoutes, healthRoutes
│   ├── .env.example      # Environment variable template
│   ├── seed.js           # Database seed script
│   ├── package.json
│   └── server.js         # Express server with Helmet & Rate-Limiter
└── README.md
```

---

## ⚙️ Requirements & Environment Setup

- **Node.js** (v18+ recommended)
- **MongoDB** (Local instance `mongodb://localhost:27017/edutools-lk` or MongoDB Atlas URI)

### Environment Variables (`backend/.env`)

Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/edutools-lk
JWT_SECRET=edutools_lk_secret_key_2026
CLIENT_URL=http://localhost:3000
```

---

## 🛠️ Step-by-Step Quick Start

### 1. Database Seeding & Admin Setup

```bash
# Navigate to backend and install dependencies
cd backend
npm install

# Seed default admin user, categories, tools, and sample articles
npm run seed
```

> **Default Seed Admin Credentials:**
> - **Email**: `admin@edutools.lk`
> - **Password**: `adminpassword123`

### 2. Run Backend Server

```bash
cd backend
npm run dev
```
> Server runs on `http://localhost:5000`

### 3. Run Frontend Application

```bash
cd frontend
npm install
npm run dev
```
> Application runs on `http://localhost:3000`

---

## 🧪 Key API Endpoints Reference

| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/health` | Health check endpoint | Public |
| POST | `/api/auth/login` | Admin login | Public |
| GET | `/api/auth/me` | Fetch authenticated user | Private/Admin |
| GET | `/api/categories` | Get categories | Public |
| POST | `/api/categories` | Create category | Private/Admin |
| GET | `/api/articles` | Get articles (search, category, page) | Public |
| GET | `/api/articles/:slug` | Get single article details | Public |
| POST | `/api/articles` | Create new article | Private/Admin |
| PUT | `/api/articles/:id` | Update article | Private/Admin |
| DELETE | `/api/articles/:id` | Delete article | Private/Admin |
| PATCH | `/api/articles/:id/status` | Toggle published / draft status | Private/Admin |
| GET | `/api/tools` | Get tools | Public |
| POST | `/api/contact` | Submit contact form | Public |

---

## 📄 License

Licensed under the ISC License.
