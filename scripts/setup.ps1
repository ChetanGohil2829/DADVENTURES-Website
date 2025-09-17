
param(
    [switch]$InitGit
)

$destRoot = "C:\Websites"
$dest = Join-Path $destRoot "DADVENTURES-FullBuild-TestedFinal"

Write-Host "Preparing installation..." -ForegroundColor Cyan

if (!(Test-Path $destRoot)) {
    New-Item -Path $destRoot -ItemType Directory | Out-Null
    Write-Host "Created $destRoot"
}

if (Test-Path $dest) {
    Remove-Item -Path $dest -Recurse -Force
    Write-Host "Removed old folder $dest"
}

$src = (Get-Location).Path
Copy-Item -Path "$src\*" -Destination $dest -Recurse

Write-Host "Installed site into $dest" -ForegroundColor Green

if ($InitGit) {
    Set-Location $dest
    if (!(Test-Path ".git")) {
        git init
        git add .
        git commit -m "Initial commit - DADVENTURES v1.0.0"
        Write-Host "Git repository initialized at $dest" -ForegroundColor Green
    } else {
        Write-Host "Git repo already exists, skipping init."
    }
}

Start-Process explorer.exe $dest
