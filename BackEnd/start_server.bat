@echo off
echo Starting Django Backend Server...
cd /d "%~dp0"
call venv\Scripts\activate.bat
python manage.py runserver
pause


