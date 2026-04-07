# URL Validation Script for Sanatanadharmam.in
# This script checks all URLs from the sitemap and validates their content

param(
    [string]$BaseUrl = "https://sanatanadharmam.in",
    [string]$SitemapPath = "public/sitemap.xml",
    [switch]$Verbose,
    [switch]$ExportResults
)

Write-Host "Starting URL validation for $BaseUrl" -ForegroundColor Cyan
Write-Host "Reading sitemap from $SitemapPath" -ForegroundColor Yellow

# Function to extract URLs from sitemap
function Get-UrlsFromSitemap {
    param([string]$SitemapPath)

    if (!(Test-Path $SitemapPath)) {
        Write-Error "Sitemap file not found: $SitemapPath"
        return @()
    }

    $content = Get-Content $SitemapPath -Raw
    $urls = @()

    # Extract URLs using regex
    $matches = [regex]::Matches($content, '<loc>(.*?)</loc>')
    foreach ($match in $matches) {
        $url = $match.Groups[1].Value
        if ($url -and $url.StartsWith($BaseUrl)) {
            $urls += $url
        }
    }

    return $urls
}

# Function to check URL status
function Test-UrlStatus {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -Uri $Url -Method Head -TimeoutSec 30 -ErrorAction Stop
        $statusCode = $response.StatusCode
        $contentType = $response.Headers.'Content-Type'

        return @{
            Url = $Url
            StatusCode = $statusCode
            ContentType = $contentType
            Success = $true
            Error = $null
        }
    }
    catch {
        return @{
            Url = $Url
            StatusCode = $null
            ContentType = $null
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Function to check URL content
function Test-UrlContent {
    param([string]$Url)

    try {
        $response = Invoke-WebRequest -Uri $Url -TimeoutSec 30 -ErrorAction Stop
        $statusCode = $response.StatusCode
        $contentLength = $response.Content.Length
        $title = ""

        # Try to extract title from HTML
        if ($response.Content -match '<title>(.*?)</title>') {
            $title = $matches[1]
        }

        # Check for common issues
        $hasMetaDescription = $response.Content -match '<meta name="description"'
        $hasCanonical = $response.Content -match '<link rel="canonical"'
        $hasOpenGraph = $response.Content -match '<meta property="og:'
        $hasSchema = $response.Content -match '"@context":\s*"https://schema\.org"'

        return @{
            Url = $Url
            StatusCode = $statusCode
            ContentLength = $contentLength
            Title = $title
            HasMetaDescription = $hasMetaDescription
            HasCanonical = $hasCanonical
            HasOpenGraph = $hasOpenGraph
            HasSchema = $hasSchema
            Success = $true
            Error = $null
        }
    }
    catch {
        return @{
            Url = $Url
            StatusCode = $null
            ContentLength = 0
            Title = ""
            HasMetaDescription = $false
            HasCanonical = $false
            HasOpenGraph = $false
            HasSchema = $false
            Success = $false
            Error = $_.Exception.Message
        }
    }
}

# Main execution
$urls = Get-UrlsFromSitemap -SitemapPath $SitemapPath

if ($urls.Count -eq 0) {
    Write-Error "No URLs found in sitemap"
    exit 1
}

Write-Host "Found $($urls.Count) URLs to check" -ForegroundColor Green

$results = @()
$successCount = 0
$errorCount = 0

foreach ($url in $urls) {
    if ($Verbose) {
        Write-Host "Checking: $url" -ForegroundColor Gray
    }

    $result = Test-UrlContent -Url $url
    $results += $result

    if ($result.Success) {
        $successCount++
        if ($Verbose) {
            Write-Host "  OK $($result.StatusCode) - $($result.Title)" -ForegroundColor Green
        }
    } else {
        $errorCount++
        Write-Host "  ERROR $($result.Url) - $($result.Error)" -ForegroundColor Red
    }
}

# Summary
Write-Host "`nValidation Summary:" -ForegroundColor Cyan
Write-Host "  Successful: $successCount" -ForegroundColor Green
Write-Host "  Failed: $errorCount" -ForegroundColor Red
Write-Host "  Success Rate: $([math]::Round(($successCount / $urls.Count) * 100, 2))%" -ForegroundColor Yellow

# Detailed SEO analysis
$seoResults = $results | Where-Object { $_.Success }

$withMetaDesc = ($seoResults | Where-Object { $_.HasMetaDescription }).Count
$withCanonical = ($seoResults | Where-Object { $_.HasCanonical }).Count
$withOpenGraph = ($seoResults | Where-Object { $_.HasOpenGraph }).Count
$withSchema = ($seoResults | Where-Object { $_.HasSchema }).Count

Write-Host "`nSEO Analysis (for successful pages):" -ForegroundColor Cyan
Write-Host "  Meta Description: $withMetaDesc / $($seoResults.Count)" -ForegroundColor $(if ($withMetaDesc -eq $seoResults.Count) { "Green" } else { "Yellow" })
Write-Host "  Canonical URLs: $withCanonical / $($seoResults.Count)" -ForegroundColor $(if ($withCanonical -eq $seoResults.Count) { "Green" } else { "Yellow" })
Write-Host "  Open Graph: $withOpenGraph / $($seoResults.Count)" -ForegroundColor $(if ($withOpenGraph -eq $seoResults.Count) { "Green" } else { "Yellow" })
Write-Host "  Schema Markup: $withSchema / $($seoResults.Count)" -ForegroundColor $(if ($withSchema -eq $seoResults.Count) { "Green" } else { "Yellow" })

# Export results if requested
if ($ExportResults) {
    $exportPath = "url-validation-results-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
    $results | ConvertTo-Json -Depth 10 | Out-File $exportPath
    Write-Host "`nResults exported to: $exportPath" -ForegroundColor Cyan
}

# Show failed URLs
$failedUrls = $results | Where-Object { !$_.Success }
if ($failedUrls.Count -gt 0) {
    Write-Host "`nFailed URLs:" -ForegroundColor Red
    $failedUrls | ForEach-Object {
        Write-Host "  - $($_.Url): $($_.Error)" -ForegroundColor Red
    }
}

Write-Host "`nURL validation complete!" -ForegroundColor Green