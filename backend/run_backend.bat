@echo off
echo Menginstal library yang dibutuhkan...
pip install -r requirements.txt
echo.
echo Menjalankan server backend...
python app.py
pause
