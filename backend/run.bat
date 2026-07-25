@echo off
set VENV=%~dp0.venv\Scripts\python.exe
if not exist "%VENV%" (
  echo Virtual environment not found. Create it with:
  echo     python -m venv .venv
  exit /b 1
)
"%VENV%" -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload-dir "%~dp0" --reload-exclude "%~dp0.venv"
