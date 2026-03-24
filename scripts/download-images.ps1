# download-images.ps1
# Downloads all Storyblok images referenced in content/posts/*.md
# and rewrites the URLs to local /images/posts/<slug>/ paths.
#
# Usage: .\scripts\download-images.ps1

$postsDir  = Join-Path $PSScriptRoot "..\content\posts"
$publicDir = Join-Path $PSScriptRoot "..\public\images\posts"

$pattern = 'https://a\.storyblok\.com/[^\s"'')>\]`]+'

foreach ($mdFile in Get-ChildItem $postsDir -Filter "*.md") {
    $slug     = [System.IO.Path]::GetFileNameWithoutExtension($mdFile.Name)
    $imageDir = Join-Path $publicDir $slug
    $content  = Get-Content $mdFile.FullName -Raw -Encoding utf8

    # Find all unique Storyblok URLs in this file
    $urls = [regex]::Matches($content, $pattern) | ForEach-Object { $_.Value } | Sort-Object -Unique

    if (-not $urls) { continue }

    if (-not (Test-Path $imageDir)) {
        New-Item -ItemType Directory -Path $imageDir | Out-Null
    }

    Write-Host "`n[$slug]"

    foreach ($url in $urls) {
        # Derive a clean local filename from the last path segment
        $originalName = ($url -split '/')[-1]       # e.g. clocks.jpg
        $localName    = $originalName.ToLower() -replace '[^a-z0-9._-]', '-'
        $localPath    = Join-Path $imageDir $localName
        $publicPath   = "/images/posts/$slug/$localName"

        if (-not (Test-Path $localPath)) {
            try {
                Invoke-WebRequest -Uri $url -OutFile $localPath -UseBasicParsing
                Write-Host "  Downloaded: $localName"
            } catch {
                Write-Warning "  FAILED: $url - $_"
                continue
            }
        } else {
            Write-Host "  Exists:     $localName"
        }

        # Replace the URL in the file content
        $content = $content.Replace($url, $publicPath)
    }

    # Write updated content back (UTF8 no BOM)
    [System.IO.File]::WriteAllText($mdFile.FullName, $content, [System.Text.UTF8Encoding]::new($false))
}

Write-Host "`nDone!"
