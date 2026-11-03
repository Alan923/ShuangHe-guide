$ErrorActionPreference = 'Stop'

$projectRoot = [System.IO.Path]::GetFullPath($PSScriptRoot).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$outputPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'cloudflare-pages-dist'))
$expectedPath = [System.IO.Path]::GetFullPath((Join-Path $projectRoot 'cloudflare-pages-dist'))
$rootPrefix = $projectRoot + [System.IO.Path]::DirectorySeparatorChar

if ($outputPath -ne $expectedPath -or -not $outputPath.StartsWith($rootPrefix, [System.StringComparison]::OrdinalIgnoreCase)) {
  throw "部署目录不在项目文件夹内：$outputPath"
}

if (Test-Path -LiteralPath $outputPath) {
  Remove-Item -LiteralPath $outputPath -Recurse -Force
}
New-Item -ItemType Directory -Path $outputPath | Out-Null

$siteFiles = @('index.html', 'style.css', 'app.js', 'data.js', 'favicon.svg')
foreach ($file in $siteFiles) {
  Copy-Item -LiteralPath (Join-Path $projectRoot $file) -Destination $outputPath
}
Copy-Item -LiteralPath (Join-Path $projectRoot 'assets') -Destination $outputPath -Recurse

Write-Host "Cloudflare Pages 静态文件已准备：$outputPath"
Write-Host '上传此文件夹内的文件；index.html 位于发布目录根部。'
