# Add System32 to PATH if not already there
 = [Environment]::GetEnvironmentVariable("Path", "User")
if ( -notlike "*C:\Windows\System32*") {
    [Environment]::SetEnvironmentVariable("Path",  + ";C:\Windows\System32;C:\Windows", "User")
    Write-Host "✅ Added System32 to PATH" -ForegroundColor Green
}

# Update current session PATH
C:\Python314\Scripts\;C:\Python314\;C:\Program Files\nodejs\;C:\ProgramData\chocolatey\bin;C:\Users\HomePC\AppData\Local\Programs\Microsoft VS Code\bin;C:\Users\HomePC\AppData\Roaming\npm;C:\Program Files\PostgreSQL\17\bin;C:\Program Files\PostgreSQL\16\bin;C:\Program Files\PostgreSQL\16\bin;C:\Program Files\Git\cmd;C:\Users\HomePC\AppData\Local\Programs\Microsoft VS Code\bin;C:\Users\HomePC\AppData\Roaming\npm;;C:\Windows\System32;C:\Windows = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   BUDGET APPLICATION LAUNCHER" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Server
Write-Host "📡 Starting Server..." -ForegroundColor Yellow
 = "C:\Users\HomePC\Downloads\budget-app\server"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🚀 SERVER STARTING...' -ForegroundColor Cyan; Set-Location ''; npm run dev" -WindowStyle Normal

# Wait for server to initialize
Start-Sleep -Seconds 3

# Start Client
Write-Host "🌐 Starting Client..." -ForegroundColor Yellow
 = "C:\Users\HomePC\Downloads\budget-app\client"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '🎨 CLIENT STARTING...' -ForegroundColor Magenta; Set-Location ''; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "✅ Applications are starting!" -ForegroundColor Green
Write-Host "📡 Server: http://localhost:5000" -ForegroundColor Cyan
Write-Host "🌐 Client: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  Press any key to stop all applications..." -ForegroundColor Yellow

# Wait for key press
 = System.Management.Automation.Internal.Host.InternalHost.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Kill all node processes
Write-Host ""
Write-Host "🛑 Stopping applications..." -ForegroundColor Red
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "✅ Applications stopped." -ForegroundColor Green
Write-Host ""
pause
