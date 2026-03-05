#!/bin/bash

echo "Starting Localhost Development Environment..."

if [ ! -f "backend/.env.localhost" ]; then
    echo "backend/.env.localhost file not found."
    echo "Please create backend/.env.localhost with your local configuration."
    exit 1
fi

echo "Starting Backend Server on port 3001..."
(
  cd backend || exit 1
  npm run dev
) &
BACKEND_PID=$!

echo "Starting Frontend on port 8080..."
(
  cd frontend || exit 1
  npm run dev
) &
FRONTEND_PID=$!

echo "Both servers started."
echo "Frontend: http://localhost:8080"
echo "Backend: http://localhost:3001"
echo "Press Ctrl+C to stop both servers"

cleanup() {
    echo "Stopping servers..."
    kill "$BACKEND_PID" 2>/dev/null
    kill "$FRONTEND_PID" 2>/dev/null
    echo "All servers stopped"
    exit 0
}

trap cleanup INT
wait
