$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "      🚀 Aurora Classroom Demo Start     " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Ensure script runs in project root
$projectRoot = $PSScriptRoot
if ($projectRoot) {
    Set-Location $projectRoot
}

# Check for Node.js
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Host "Error: npm not found, please install Node.js!" -ForegroundColor Red
    Pause
    exit
}

# Check for dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "`n[*] node_modules not found, installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies!" -ForegroundColor Red
        Pause
        exit
    }
    Write-Host "[OK] Dependencies installed!" -ForegroundColor Green
} else {
    Write-Host "`n[OK] Dependencies ready." -ForegroundColor Green
}

Write-Host "`n[*] Starting development server..." -ForegroundColor Yellow
Write-Host "[*] The browser will open automatically (http://localhost:3000)." -ForegroundColor Yellow
Write-Host "[*] Press Ctrl+C to stop the server.`n" -ForegroundColor DarkGray

# Start dev server
npm run dev -- --open

Write-Host "`nServer stopped." -ForegroundColor Yellow
Pause
