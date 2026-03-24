# storyblok-to-md.ps1
# Converts stories.json (exported from Storyblok API) into .md files
# for use with Nuxt Content v3.
#
# Usage: .\scripts\storyblok-to-md.ps1
# Output: content/posts/<slug>.md

$inputFile  = Join-Path $PSScriptRoot "..\stories.json"
$outputDir  = Join-Path $PSScriptRoot "..\content\posts"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

function Coalesce($a, $b) { if ($null -ne $a -and $a -ne "") { $a } else { $b } }

# Storyblok language labels → Shiki grammar identifiers (PS hashtables are case-insensitive)
$langMap = @{
    "C#"         = "csharp"
    "C++"        = "cpp"
    "C"          = "c"
    "XML"        = "xml"
    "YAML"       = "yaml"
    "YML"        = "yaml"
    "Bash"       = "bash"
    "Shell"      = "bash"
    "SQL"        = "sql"
    "HTML"       = "html"
    "CSS"        = "css"
    "JavaScript" = "js"
    "TypeScript" = "ts"
}

function Normalize-Lang($lang) {
    if (-not $lang) { return "" }
    if ($langMap.ContainsKey($lang)) { return $langMap[$lang] }
    return $lang.ToLower()
}

# ---------------------------------------------------------------------------
# ProseMirror rich-text → Markdown converter
# ---------------------------------------------------------------------------

function Convert-Inline($nodes) {
    if (-not $nodes) { return "" }
    $sb = [System.Text.StringBuilder]::new()

    foreach ($node in $nodes) {
        $text = if ($null -ne $node.text) { $node.text } else { "" }

        if ($node.marks) {
            $marks = $node.marks | ForEach-Object { $_.type }

            if ($marks -contains "code") {
                $text = "``$text``"
            } else {
                if ($marks -contains "bold")   { $text = "**$text**" }
                if ($marks -contains "italic") { $text = "_${text}_" }
                if ($marks -contains "link") {
                    $linkMark = $node.marks | Where-Object { $_.type -eq "link" } | Select-Object -First 1
                    $href = $linkMark.attrs.href
                    $text = "[$text]($href)"
                }
            }
        }

        [void]$sb.Append($text)
    }

    return $sb.ToString()
}

function Convert-Node($node, [int]$indent = 0) {
    $pad = " " * $indent

    switch ($node.type) {
        "paragraph" {
            $line = Convert-Inline $node.content
            return "$line`n"
        }

        "bullet_list" {
            $lines = @()
            foreach ($item in $node.content) {
                $inner = ($item.content | ForEach-Object { Convert-Node $_ ($indent + 2) }) -join ""
                $inner = $inner.TrimEnd("`n")
                $lines += "${pad}- $($inner.TrimStart())"
            }
            return ($lines -join "`n") + "`n"
        }

        "ordered_list" {
            $lines = @()
            $i = 1
            foreach ($item in $node.content) {
                $inner = ($item.content | ForEach-Object { Convert-Node $_ ($indent + 3) }) -join ""
                $inner = $inner.TrimEnd("`n")
                $lines += "${pad}$i. $($inner.TrimStart())"
                $i++
            }
            return ($lines -join "`n") + "`n"
        }

        "blockquote" {
            $inner = ($node.content | ForEach-Object { Convert-Node $_ }) -join ""
            return ($inner -split "`n" | ForEach-Object { "> $_" }) -join "`n" + "`n"
        }

        "code_block" {
            $lang = if ($node.attrs -and $node.attrs.language) { $node.attrs.language } else { "" }
            $code = ($node.content | ForEach-Object { $_.text }) -join ""
            return "``````$lang`n$code`n```````n"
        }

        "hard_break" { return "`n" }

        "image" {
            $src = $node.attrs.src
            $alt = if ($node.attrs -and $node.attrs.alt) { $node.attrs.alt } else { "" }
            return "![$alt]($src)`n"
        }

        default { return "" }
    }
}

function Convert-RichText($doc) {
    if (-not $doc -or -not $doc.content) { return "" }
    $parts = $doc.content | ForEach-Object { Convert-Node $_ }
    return ($parts -join "`n").Trim()
}

# ---------------------------------------------------------------------------
# Main conversion
# ---------------------------------------------------------------------------

if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

$json    = Get-Content $inputFile -Raw -Encoding utf8 | ConvertFrom-Json
$stories = $json.stories | Where-Object { $_.full_slug -match "^posts/.+" }

Write-Host "Found $($stories.Count) post(s) to convert."

foreach ($story in $stories) {
    $body    = $story.content.body
    $slug    = $story.slug
    $outFile = Join-Path $outputDir "$slug.md"

    # --- Extract BlogPost metadata component ---
    $meta = $body | Where-Object { $_.component -eq "BlogPost" } | Select-Object -First 1

    $title       = Coalesce $meta.Title $story.name
    $description = if ($meta -and $meta.Description) { $meta.Description } else { "" }
    $imageUrl    = if ($meta -and $meta.Image -and $meta.Image.filename) { $meta.Image.filename } else { "" }
    $imageAlt    = if ($meta -and $meta.Image -and $meta.Image.alt) { $meta.Image.alt } else { "" }
    $writtenDate = if ($meta -and $meta.WrittenDate) { $meta.WrittenDate } else { $story.first_published_at }
    $tags        = if ($meta -and $meta.Tags) {
        $meta.Tags | Where-Object { $_.text } | ForEach-Object { $_.text }
    } else { @() }

    # Normalise date to YYYY-MM-DD
    if ($writtenDate -match "(\d{4}-\d{2}-\d{2})") {
        $date = $Matches[1]
    } else {
        $date = (Get-Date $story.first_published_at).ToString("yyyy-MM-dd")
    }

    # --- Build YAML frontmatter ---
    $tagsYaml = if ($tags) {
        "[" + (($tags | ForEach-Object { "`"$_`"" }) -join ", ") + "]"
    } else { "[]" }

    $safeTitle       = $title -replace '"', "'"
    $safeDescription = $description -replace '"', "'"
    $safeImageAlt    = $imageAlt -replace '"', "'"

    $fm = @"
---
title: "$safeTitle"
description: "$safeDescription"
date: $date
tags: $tagsYaml
image: $imageUrl
imageAlt: "$safeImageAlt"
---
"@

    # --- Convert body components to Markdown ---
    $mdParts = @()

    foreach ($block in $body) {
        switch ($block.component) {
            "BlogPost"           { <# already used for frontmatter #> }
            "BlogSectionHeading" { $mdParts += "## $($block.text)" }
            "BlogSection"        { $mdParts += Convert-RichText $block.Text }
            "Image"              {
                $src   = if ($block.Image -and $block.Image.filename) { $block.Image.filename } else { "" }
                $alt   = if ($block.Image -and $block.Image.alt)      { $block.Image.alt }      else { "" }
                $title = if ($block.Image -and $block.Image.title)    { $block.Image.title }    else { "" }
                if ($src) {
                    if ($title) {
                        $mdParts += "<figure>`n<img src=`"$src`" alt=`"$alt`" />`n<figcaption>$title</figcaption>`n</figure>"
                    } else {
                        $mdParts += "<figure>`n<img src=`"$src`" alt=`"$alt`" />`n</figure>"
                    }
                }
            }
            "CodeBlock"          {
                $rawLang = if ($block.Code -and $block.Code.language) { $block.Code.language } else { "" }
                $lang  = Normalize-Lang $rawLang
                $title = if ($block.Code -and $block.Code.title)    { $block.Code.title }    else { "" }
                $code  = if ($block.Code -and $block.Code.code)     { $block.Code.code }     else { "" }
                $fence = if ($title) { "``````$lang [$title]" } else { "``````$lang" }
                $mdParts += "$fence`n$code`n``````"
            }
        }
    }

    $mdBody = $mdParts -join "`n`n"

    # --- Write file ---
    $fileContent = "$fm`n`n$mdBody`n"
    # Tidy up bold marks with trailing space before closing ** (e.g. "**Foo: **" → "**Foo:**")
    $fileContent = $fileContent -replace '\*\*([^*]+?) \*\*', '**$1**'
    [System.IO.File]::WriteAllText($outFile, $fileContent, [System.Text.UTF8Encoding]::new($false))
    Write-Host "  v $slug -> content/posts/$slug.md"
}

Write-Host "`nDone! $($stories.Count) file(s) written to content/posts/"
