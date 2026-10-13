param([Parameter(Mandatory=$true)][string]$Title)

$root = Split-Path -Parent $PSScriptRoot
$date = Get-Date -Format 'yyyy-MM-dd'
$time = Get-Date -Format 'HH:mm:ss'
$slug = ($Title -replace '\s+', '-')
$file = Join-Path $root "_posts\$date-$slug.md"

if (Test-Path $file) { Write-Host "文件已存在: $file" -ForegroundColor Yellow; exit 1 }

$content = @"
---
title: $Title
date: $date $time +0800
categories: [未分类]
tags: []
---

这里开始写正文。

<!-- more -->

## 小标题

正文...
"@

# 显式写成「无 BOM 的 UTF-8」—— Markdown 带 BOM 会让 Jekyll 认不出 front matter
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($file, $content, $utf8NoBom)

Write-Host ""
Write-Host "已创建: $file" -ForegroundColor Green
Write-Host "写完执行: .\tools\publish.ps1" -ForegroundColor Cyan
