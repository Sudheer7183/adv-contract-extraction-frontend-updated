@echo off
echo ============================================
echo   Finding and Copying PDF.js Worker. To read the pdf viewer
echo ============================================
echo.

echo Searching for pdf.worker files...
echo.

REM Check all possible locations
set FOUND=0

if exist "node_modules\pdfjs-dist\legacy\build\pdf.worker.min.js" (
    echo Found: node_modules\pdfjs-dist\legacy\build\pdf.worker.min.js
    set WORKER_PATH=node_modules\pdfjs-dist\legacy\build\pdf.worker.min.js
    set FOUND=1
)

if exist "node_modules\pdfjs-dist\build\pdf.worker.min.js" (
    echo Found: node_modules\pdfjs-dist\build\pdf.worker.min.js
    if %FOUND%==0 (
        set WORKER_PATH=node_modules\pdfjs-dist\build\pdf.worker.min.js
        set FOUND=1
    )
)

if exist "node_modules\pdfjs-dist\build\pdf.worker.mjs" (
    echo Found: node_modules\pdfjs-dist\build\pdf.worker.mjs
    if %FOUND%==0 (
        set WORKER_PATH=node_modules\pdfjs-dist\build\pdf.worker.mjs
        set FOUND=1
    )
)

if exist "node_modules\pdfjs-dist\build\pdf.worker.js" (
    echo Found: node_modules\pdfjs-dist\build\pdf.worker.js
    if %FOUND%==0 (
        set WORKER_PATH=node_modules\pdfjs-dist\build\pdf.worker.js
        set FOUND=1
    )
)

echo.

if %FOUND%==1 (
    echo Creating public directory...
    if not exist "example\public" mkdir "example\public"
    
    echo Copying %WORKER_PATH% to example\public\pdf.worker.min.js
    copy "%WORKER_PATH%" "example\public\pdf.worker.min.js"
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ============================================
        echo   SUCCESS!
        echo ============================================
        echo Worker copied to: example\public\pdf.worker.min.js
        echo.
    ) else (
        echo ERROR: Copy failed
    )
) else (
    echo ============================================
    echo   No worker file found!
    echo ============================================
    echo.
    echo Listing pdfjs-dist directory contents:
    dir /s /b node_modules\pdfjs-dist\*.worker.* 2>nul
    echo.
    echo Try reinstalling pdfjs-dist:
    echo   npm install pdfjs-dist@4.9.155 --force
)

echo.
pause