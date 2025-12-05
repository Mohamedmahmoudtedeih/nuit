# PowerShell script to start Django server
Write-Host "Starting Django Backend Server..." -ForegroundColor Green
Set-Location $PSScriptRoot
.\venv\Scripts\Activate.ps1
python manage.py runserver


