# TDC Matchmaker Dashboard 💖

A production-ready MVP for The Date Crew (TDC) matchmakers. Built using a modern React + Vite frontend and an Express backend, and powered by Gemini 2.0 AI.

## 🚀 How to Run Locally

To start both the frontend and the backend locally, you will need two terminal windows.

**1. Start the Backend:**
```bash
cd backend
npm install
npm run dev
```
*(The backend will run on `http://localhost:5000`)*

**2. Start the Frontend:**
```bash
cd frontend
npm install
npm run dev
```
*(The frontend will run on `http://localhost:5173`)*

### 3. Login
Open your browser to `http://localhost:5173`.
You can log in with:
- **Email:** `priya@thedatecrew.com`
- **Password:** `password123`

---

## 🌍 How to Deploy

You mentioned deploying the frontend on Vercel and the backend on Render. Here is exactly how to do that seamlessly.

### 1. Database Decision
**Do I need MongoDB or Supabase?**
**No.** The PDF assignment states: *"mock JSON or simple SQLite/MongoDB is fine."* For this MVP, we have implemented a high-quality mock JSON data array in `server/data/profiles.js` containing 100 realistic profiles. Sticking to the mock JSON makes your Vercel/Render deployment **instant and zero-config**. You don't have to worry about provisioning databases or migrating data. It will "just work."

### 2. Backend (Render)
1. Push your code to GitHub.
2. Go to Render.com and create a **New Web Service**.
3. Select your repository.
4. **Root Directory:** `server`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. **Environment Variables:**
   - `GEMINI_API_KEY`: *(Get this from Google AI Studio)*
   - `FRONTEND_URL`: *(Your future Vercel URL, e.g. `https://tdc-dashboard.vercel.app`)*
8. Click Deploy. Once finished, copy the provided `onrender.com` URL.

### 3. Frontend (Vercel)
1. Go to Vercel.com and Add a New Project.
2. Select your repository.
3. **Framework Preset:** Vite
4. **Root Directory:** `client`
5. **Environment Variables:**
   - `VITE_API_URL`: *(Paste your Render backend URL here, e.g. `https://your-backend.onrender.com/api`)*
6. Click Deploy.

---

## 🧠 AI Usage (Gemini 2.0)
As requested, we skipped OpenAI and integrated **Google Gemini 2.0** into the dashboard. When you click **💌 Send Match** on a profile, the AI executes three tasks:
1. **Match Score:** It scores the match based on religious, geographic, and lifestyle compatibility.
2. **Profile Fit Reasoning:** It generates bullet points explaining exactly *why* this is a good or challenging match.
3. **Personalized Intro:** It generates a 1-2 sentence email hook to send to the client.

*(If no Gemini API key is provided, the backend falls back to a deterministic rule-engine that guarantees the dashboard keeps working flawlessly).*
