@echo off
setlocal
chcp 65001 >nul
set "PYTHONUTF8=1"

cd /d "%~dp0"

echo.
echo ==========================================
echo   Portfolio - lancement local
echo ==========================================
echo.
echo 1 - Mode normal
echo 2 - Mode editeur local
echo.

choice /C 12 /N /M "Choisis le mode [1/2] : "
if errorlevel 2 (
  set "PORTFOLIO_URL=http://127.0.0.1:8000/?edit=1#portfolio"
  set "PORTFOLIO_MODE=editeur local"
) else (
  set "PORTFOLIO_URL=http://127.0.0.1:8000/#portfolio"
  set "PORTFOLIO_MODE=normal"
)

echo.
echo Mode choisi : %PORTFOLIO_MODE%
echo URL : %PORTFOLIO_URL%
echo.
echo Le navigateur va s'ouvrir automatiquement.
echo Laisse cette fenetre ouverte tant que tu utilises le portfolio.
echo Pour arreter le serveur : Ctrl+C
echo.

start "" "%PORTFOLIO_URL%"

where py >nul 2>nul
if %errorlevel%==0 (
  py -3 editor\server.py --host 127.0.0.1 --port 8000
) else (
  python editor\server.py --host 127.0.0.1 --port 8000
)

echo.
echo Serveur arrete.
pause
