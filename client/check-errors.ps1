Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   PRE-BUILD ERROR CHECKER" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check for template literal issues
Write-Host "Checking for template literal issues..." -ForegroundColor Yellow
 = Get-ChildItem -Path src -Recurse -Include *.js | Select-String -Pattern '\]*}' -AllMatches
if (.Count -gt 0) {
    Write-Host "❌ Found template literals that may cause issues:" -ForegroundColor Red
     | ForEach-Object { Write-Host .Line.Trim() -ForegroundColor Red }
} else {
    Write-Host "✅ No template literal issues found" -ForegroundColor Green
}

Write-Host ""

# Check for missing keys in maps
Write-Host "Checking for missing React keys..." -ForegroundColor Yellow
 = Get-ChildItem -Path src -Recurse -Include *.js | Select-String -Pattern '\.map\([^)]*\)' | Where-Object {  -notmatch 'key=' }
if (.Count -gt 0) {
    Write-Host "⚠️  Found possible missing keys in map functions:" -ForegroundColor Yellow
     | ForEach-Object { Write-Host .Line.Trim() -ForegroundColor Yellow }
} else {
    Write-Host "✅ No obvious missing keys found" -ForegroundColor Green
}

Write-Host ""

# Check for common icon import errors
Write-Host "Checking for incorrect icon imports..." -ForegroundColor Yellow
 = Get-ChildItem -Path src -Recurse -Include *.js | Select-String -Pattern "import.*from '@heroicons/react"
 = @()
foreach ( in ) {
    if (.Line -match 'TrendingUpIcon') {
         += "Found TrendingUpIcon in " + .Path + " - should be ArrowTrendingUpIcon"
    }
    if (.Line -match 'TrendingDownIcon') {
         += "Found TrendingDownIcon in " + .Path + " - should be ArrowTrendingDownIcon"
    }
    if (.Line -match 'RefreshIcon') {
         += "Found RefreshIcon in " + .Path + " - should be ArrowPathIcon"
    }
    if (.Line -match 'DocumentReportIcon') {
         += "Found DocumentReportIcon in " + .Path + " - should be DocumentTextIcon"
    }
    if (.Line -match 'CogIcon') {
         += "Found CogIcon in " + .Path + " - should be Cog6ToothIcon"
    }
    if (.Line -match 'LogoutIcon') {
         += "Found LogoutIcon in " + .Path + " - should be ArrowLeftOnRectangleIcon"
    }
}
if (.Count -gt 0) {
    Write-Host "❌ Found incorrect icon imports:" -ForegroundColor Red
     | ForEach-Object { Write-Host  -ForegroundColor Red }
} else {
    Write-Host "✅ All icon imports appear correct" -ForegroundColor Green
}

Write-Host ""

# Check for BOM characters
Write-Host "Checking for BOM characters..." -ForegroundColor Yellow
 = Get-ChildItem -Path src -Recurse -Include *.js | ForEach-Object {
     = Get-Content .FullName -Encoding Byte -TotalCount 3
    if (.Count -ge 3 -and [0] -eq 0xEF -and [1] -eq 0xBB -and [2] -eq 0xBF) {
        .FullName
    }
}
if (.Count -gt 0) {
    Write-Host "⚠️  Found files with BOM characters:" -ForegroundColor Yellow
     | ForEach-Object { Write-Host  -ForegroundColor Yellow }
    Write-Host "These will cause warnings but won't break the build" -ForegroundColor Yellow
} else {
    Write-Host "✅ No BOM characters found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Run 'npm run build' to build the project" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
