#!/bin/bash

echo "Starting LIMS System..."
echo

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting Backend Server..."
(
	cd "$SCRIPT_DIR/backend" && npm run dev &
)
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 5

echo "Starting Frontend Server..."
(
	cd "$SCRIPT_DIR" && npm run dev &
)
FRONTEND_PID=$!

echo
echo "LIMS System is starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop all services"

# Wait for both to exit
wait $BACKEND_PID $FRONTEND_PID 