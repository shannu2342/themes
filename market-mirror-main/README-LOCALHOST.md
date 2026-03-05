# Localhost Development Guide

This project is now split into:
- `frontend/` (Vite + React)
- `backend/` (Express + MongoDB + Stripe)

## Quick Start

1. Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2. Create env files:
- `backend/.env.localhost` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`

3. Start both:
- Windows: `start-localhost.bat`
- Linux/Mac: `chmod +x start-localhost.sh && ./start-localhost.sh`

## Local URLs
- Frontend: `http://localhost:8080`
- Backend: `http://localhost:3001`
- API: `http://localhost:3001/api/*`

## Required Backend Env (localhost)
```bash
PORT=3001
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=market_mirror
JWT_SECRET=your_secret
ID=MAINADMIN
Pass=ITSMAINPASS#@YES
STATIC_ADMIN_EMAIL=admin@themevault.com
FRONTEND_URL=http://localhost:8080
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
STRIPE_SECRET_KEY=sk_test_...
```

## Required Frontend Env (localhost)
```bash
VITE_API_BASE_URL=http://localhost:3001
```

## Stripe Testing
- Success card: `4242 4242 4242 4242`
- Failure card: `4000 0000 0000 0002`

## Common Issues
- `Missing MONGODB_URI`: set it in `backend/.env.localhost` or `backend/.env`.
- CORS errors: add your frontend origin to `CORS_ORIGINS` in backend env.
- Redirect goes to wrong domain after payment: set `FRONTEND_URL` correctly in backend env.
