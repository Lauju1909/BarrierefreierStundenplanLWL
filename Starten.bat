@echo off
chcp 65001 >nul
title Barrierefreier Stundenplan - LWL-Berufskolleg Soest
echo ======================================================================
echo  Barrierefreier Stundenplan ^& Pruefungen (LWL-Berufskolleg Soest)
echo  WCAG 2.2 AAA ^& NVDA-Optimiert
echo ======================================================================
echo.

cd /d "%~dp0"

if exist "Stundenplan_LWL.exe" (
    echo Starte Stundenplan mit integrierter WebUntis-API-Bridge...
    start "" "%~dp0Stundenplan_LWL.exe"
    exit
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Starte Python-Server mit WebUntis-API-Bridge...
    start "" python "%~dp0server.py"
    exit
)

echo Starte Direktansicht im Browser...
start "" "%~dp0index.html"
exit
