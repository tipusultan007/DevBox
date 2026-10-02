@echo off
set "SCRIPT_DIR=%~dp0"
echo ========================================================
echo   DevBox Windows Hosts Synchronizer
echo ========================================================

net session >nul 2>&1
if %errorLevel% == 0 (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%sync-hosts.ps1"
) else (
    echo [DevBox] Requesting administrator rights to update hosts file...
    powershell.exe -NoProfile -Command "Start-Process cmd.exe -ArgumentList '/c \"\"%~f0\"\"' -Verb RunAs"
)

