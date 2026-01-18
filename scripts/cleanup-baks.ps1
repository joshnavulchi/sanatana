<#
Deletes all `*.json.bak` files under the repository `locales/` folder.
Usage:
  - Dry-run (show what would be removed):
    .\scripts\cleanup-baks.ps1 -WhatIf

  - Run and prompt for each file:
    .\scripts\cleanup-baks.ps1 -Confirm

  - Run without prompts (delete all):
    .\scripts\cleanup-baks.ps1
#>

param(
  [switch]$WhatIf,
  [switch]$Confirm
)

$root = Join-Path $PSScriptRoot "..\locales"
if (-not (Test-Path $root)) {
  Write-Error "Locales folder not found at: $root"
  exit 1
}

$files = Get-ChildItem -Path $root -Recurse -File -Filter '*.bak' | Where-Object { $_.Name -like '*.json.bak' }
if ($files.Count -eq 0) {
  Write-Output "No .json.bak files found under $root"
  exit 0
}

if ($WhatIf) {
  Write-Output "Dry-run: the following files would be removed:"
  $files | ForEach-Object { Write-Output $_.FullName }
  exit 0
}

foreach ($f in $files) {
  if ($Confirm) {
    $r = Read-Host "Remove $($f.FullName)? (y/N)"
    if ($r.ToLower() -ne 'y') { Write-Output "Skipped: $($f.FullName)"; continue }
  }
  try {
    Remove-Item -LiteralPath $f.FullName -Force
    Write-Output "Removed: $($f.FullName)"
  } catch {
    Write-Warning "Failed to remove: $($f.FullName) - $($_.Exception.Message)"
  }
}

Write-Output "Done."