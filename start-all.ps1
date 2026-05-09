# Start Script for Amdox ERP

# Check for Node.js
if (-not (Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js is not installed. Please install it first." -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting Amdox ERP Full-Stack Application..." -ForegroundColor Cyan

# Start Backend in a new window
Write-Host "Starting Backend API on port 5000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'c:\Users\HP\Desktop\int proj\amdox-erp\backend'; npm run dev`""

# Start Frontend in a new window
Write-Host "Starting Frontend Vite App on port 5173..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"cd 'c:\Users\HP\Desktop\int proj\amdox-erp\frontend'; npm run dev`""

Write-Host "✅ Both services are starting up!" -ForegroundColor Green
Write-Host "Make sure MongoDB is running locally on port 27017." -ForegroundColor Magenta
Write-Host "To seed the database with demo data, run: cd backend; npm run seed" -ForegroundColor Cyan
