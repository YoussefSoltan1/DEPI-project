## 🎬 MovieHub — Your Personal Movie Companion

MovieHub is a full-stack movie discovery and recommendation platform built using **React (Vite)**, **Express**, **Drizzle ORM**, **PostgreSQL**, **TMDB API**, and **Google Gemini** for personalized AI-powered chat.
Users can browse trending movies and TV shows, add items to their wishlist, get intelligent recommendations, and chat with an AI assistant that knows their taste.

---

### 🚀 Features

* 🔐 **User Authentication** with session-based login
* 🎞️ **Trending & Popular** movie and TV listings via TMDB
* ❤️ **Wishlist Support** with add/remove toggles
* 🎯 **"Recommended for You"** section powered by TMDB similar movies
* 🤖 **Gemini Chatbot** that answers questions based on user's wishlist
* 🎥 **Detailed Media Pages** with cast, genres, videos, and trailers
* 🌙 **Dark mode theme** with modern responsive UI
* ⚡ **React Query + Axios** for data fetching & state management

---

### 🧱 Tech Stack

| Layer      | Tech                                    |
| ---------- | --------------------------------------- |
| Frontend   | React, Vite, TailwindCSS, Wouter Router |
| State Mgmt | React Query                             |
| Backend    | Express.js                              |
| ORM & DB   | Drizzle ORM + PostgreSQL                |
| Auth       | Passport.js + express-session           |
| AI Chat    | Google Gemini (via `@google/genai`)     |
| Movie Data | TMDB API                                |

---

### 📦 Project Structure

```bash
.
├── client/               # React front-end (Vite)
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   └── ...
├── server/               # Express backend
│   ├── routes.ts         # All REST API routes
│   ├── tmdb.ts           # TMDB interaction logic
│   ├── storage/          # Session & wishlist storage
│   └── ...
├── shared/               # Shared types and schemas
├── prisma/ or drizzle/   # Database schema (depending on ORM setup)
└── .env                  # Environment variables
```

---

### 🛠️ Setup Instructions

#### 1. Clone & Install

```bash
git clone [https://github.com/YoussefSoltan1/DEPI-project/]
cd DEPI-project
```

#### 2. Backend Setup

```bash
cd server
npm install
```

Configure `.env` in `/server`:

```env
DATABASE_URL=postgres://youruser:yourpass@localhost:5432/moviehub
SESSION_SECRET=your-secret
GEMINI_API_KEY=your-gemini-api-key
TMDB_API_KEY=your-tmdb-api-key
```

Run server:

```bash
npm run dev
```

#### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

### 🔐 Auth Flow

* User registers/login via `/auth`
* Session cookie stored via `express-session` + `connect-pg-simple`
* `/api/user` endpoint checks login status on page load

---

### 💡 Gemini Chatbot

* Lives in `Chatbot.tsx` component
* Sends wishlist + user question to Gemini (`gemini-1.5-flash`)
* Returns smart recommendations and responses

---

### ❤️ Wishlist & Recommendations

* Stored in `wishlists` table with userId + movieId
* Add/remove with `/api/wishlist` POST/DELETE
* Recommended movies fetched using `/api/movies/:id/similar`
* Uses last 5 wishlisted movies

---

### 🧪 Sample Queries

```bash
# Add movie to wishlist
POST /api/wishlist { movieId }

# Remove movie from wishlist
DELETE /api/wishlist/:movieId

# Get user wishlist
GET /api/wishlist

# Ask Gemini assistant
POST /api/chat { question }
```

---

Here’s an updated `README.md` section that includes **deployment instructions**, assuming you're using a basic setup with Node.js, PostgreSQL, and Vite (or similar) for the frontend:

---

## 🚀 Deployment Instructions

### 📦 Prerequisites

* Node.js (v18+)
* PostgreSQL database
* `pnpm` or `npm` or `yarn`
* TMDB API key
* Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/moviehub.git
cd moviehub
```

### 2. Set Up Environment Variables

Create a `.env` file in directory with the following content:

```env
DATABASE_URL=postgres://myuser:mypassword@localhost:5432/myapp
SESSION_SECRET=super-secret-key
GEMINI_API_KEY=your_gemini_api_key
TMDB_API_KEY=your_tmdb_api_key
```

Make sure the PostgreSQL database is running and accessible with the credentials above.

### 3. Install Dependencies

#### Backend

```bash
npm i
```

### 4. Run Migrations (if using Drizzle ORM)

```bash
cd server
npm drizzle-kit start  
npm drizzle-kit up
```

### 5. Start the App

```bash
npm run dev
```

Now visit `http://localhost:5173` to use the application.

### 🌍 Deploying to Production

* Use `pm2` or Docker to run the backend server.
* Host the frontend build (`pnpm build`) using Vercel, Netlify, or Nginx.
* Ensure `.env` variables are set correctly on your server.

### 📚 Future Improvements

* ✅ Rate or review movies
* ✅ Genre-based recommendations
* ✅ Merge movie & TV search into one interface
* ⏳ Offline mode / PWA support
* ⏳ Email verification / password reset

