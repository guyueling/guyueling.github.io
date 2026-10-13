param([string]$Message)

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $Message) { $Message = "post: 更新于 $(Get-Date -Format 'yyyy-MM-dd HH:mm')" }

git add -A
git commit -m $Message
if ($LASTEXITCODE -ne 0) { Write-Host "没有改动需要提交" -ForegroundColor Yellow; exit 0 }

git push
if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "已推送。约 1 分钟后自动上线:" -ForegroundColor Green
  Write-Host "  https://blog.zwyy.xyz" -ForegroundColor Cyan
} else {
  Write-Host "推送失败，检查网络或 SSH key" -ForegroundColor Red
}
