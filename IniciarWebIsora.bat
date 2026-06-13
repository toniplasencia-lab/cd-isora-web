@echo off
REM Arranca el servidor web del CD Union Isora (como admin) + cloudflared

cd /d "%~dp0"

REM --- Ventana 1: servidor en admin (PowerShell pide permisos automaticamente) ---
powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-NoExit','-ExecutionPolicy','Bypass','-Command','Set-Location -LiteralPath ''%~dp0''; .\servidor.ps1'"

REM Esperar 3 segundos para que arranque el servidor
timeout /t 3 /nobreak >nul

REM --- Ventana 2: cloudflared (no necesita admin) ---
start "Cloudflared Tunnel" powershell -NoExit -Command "Set-Location -LiteralPath \"$env:USERPROFILE\Downloads\"; .\cloudflared.exe tunnel --url http://localhost:8080"

exit