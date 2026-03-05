# Market Mirror

Split deployment-ready structure:
- `frontend/` -> deploy to Vercel
- `backend/` -> deploy to Render

## Local Development

1. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Configure environment:
- Backend: copy `backend/.env.example` to `backend/.env` (or `.env.localhost`)
- Frontend: copy `frontend/.env.example` to `frontend/.env`

3. Run:
```bash
# backend
cd backend
npm run dev

# frontend (new terminal)
cd frontend
npm run dev
```

## Production Deploy

### Frontend (Vercel)
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Env:
  - `VITE_API_BASE_URL=https://your-render-backend.onrender.com`

### Backend (Render)
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Env:
  - `MONGODB_URI=...`
  - `MONGODB_DB_NAME=market_mirror`
  - `JWT_SECRET=...`
  - `ID=MAINADMIN`
  - `Pass=ITSMAINPASS#@YES`
  - `FRONTEND_URL=https://your-frontend.vercel.app`
  - `FRONTEND_URLS=https://your-frontend.vercel.app,https://www.yourdomain.com`
  - `CORS_ORIGINS=https://your-frontend.vercel.app,https://www.yourdomain.com`
  - `STRIPE_SECRET_KEY=...`
  - `STRIPE_WEBHOOK_SECRET=...` (optional with current webhook handler)

## Notes
- The API is token-based (`Authorization: Bearer ...`), so cross-origin auth works without cookie sessions.
- Checkout/success/cancel URLs are generated from backend frontend URL config and support separate frontend/backend origins.
