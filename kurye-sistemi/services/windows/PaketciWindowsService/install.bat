@echo off
chcp 65001 > nul
echo ===========================================
echo Paketci Windows Service Kurulumuecho ===========================================
echo.

set SERVICE_NAME=PaketciWindowsService
set DISPLAY_NAME="Paketci Windows Service"
set DESCRIPTION="Paketci Kurye Sistemi Windows Servisi - Caller ID, POS ve Yazici Entegrasyonu"

REM Administrator kontrolu
net session > nul 2>&1
if %errorLevel% neq 0 (
    echo HATA: Administrator olarak calistirin!
    pause
    exit /b 1
)

echo 1. Eski servis kontrolu...
sc query %SERVICE_NAME% > nul 2>&1
if %errorLevel% equ 0 (
    echo    Servis zaten kurulu. Durduruluyor...
    sc stop %SERVICE_NAME%
    timeout /t 3 /nobreak > nul
    echo    Kaldiriliyor...
    sc delete %SERVICE_NAME%
    timeout /t 2 /nobreak > nul
)

echo.
echo 2. Yeni servis kurulumu...
set EXE_PATH=%~dp0PaketciWindowsService.exe
sc create %SERVICE_NAME% binPath="%EXE_PATH%" DisplayName=%DISPLAY_NAME% start=auto
if %errorLevel% neq 0 (
    echo HATA: Servis kurulumu basarisiz!
    pause
    exit /b 1
)

echo.
echo 3. Aciklama ayarlaniyor...
sc description %SERVICE_NAME% %DESCRIPTION%

echo.
echo 4. Servis baslatiliyor...
sc start %SERVICE_NAME%
if %errorLevel% neq 0 (
    echo UYARI: Servis baslatilamadi. Manuel baslatin.
    echo sc start %SERVICE_NAME%
)

echo.
echo ===========================================
echo Kurulum tamamlandi!
echo.
echo Servis durumunu kontrol:
echo   sc query %SERVICE_NAME%
echo.
echo Loglar: %~dp0logs\
echo Ayar:  %~dp0appsettings.json
echo ===========================================
pause
