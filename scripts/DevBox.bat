@echo off
set "ROOT=%~dp0..\"
cd /d "%ROOT%"
echo [DevBox] Launching DevBox Local Development Environment...
start /b "" node "apps\desktop\devbox-engine.cjs"
timeout /t 1 /nobreak >nul
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" (
    start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" --app="http://localhost:1421"
) else (
    start "" "http://localhost:1421"
)
