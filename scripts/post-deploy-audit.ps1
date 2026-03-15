$ErrorActionPreference = 'Stop'

$urls = @(
  'https://sanatanadharmam.in/',
  'https://sanatanadharmam.in/about/',
  'https://sanatanadharmam.in/contact/',
  'https://sanatanadharmam.in/itihasa/',
  'https://sanatanadharmam.in/vedas/'
)

$results = @()
foreach ($url in $urls) {
  try {
    $res = Invoke-WebRequest -Uri $url -Method Head -MaximumRedirection 5 -UseBasicParsing
    $html = [string](curl.exe -L -s $url)

    $canonical = $null
    $canonMatch = [regex]::Match($html, '<link[^>]*rel="canonical"[^>]*href="([^"]+)"', 'IgnoreCase')
    if ($canonMatch.Success) { $canonical = $canonMatch.Groups[1].Value }

    $robotsMeta = $null
    $robotsMatch = [regex]::Match($html, '<meta[^>]*name="robots"[^>]*content="([^"]+)"', 'IgnoreCase')
    if ($robotsMatch.Success) { $robotsMeta = $robotsMatch.Groups[1].Value }

    $googlebotMeta = $null
    $googlebotMatch = [regex]::Match($html, '<meta[^>]*name="googlebot"[^>]*content="([^"]+)"', 'IgnoreCase')
    if ($googlebotMatch.Success) { $googlebotMeta = $googlebotMatch.Groups[1].Value }

    $xRobots = $res.Headers['X-Robots-Tag']
    $jsonLdCount = ([regex]::Matches($html, 'application/ld\+json', 'IgnoreCase')).Count

    $schemaTypes = @()
    $typeMatches = [regex]::Matches(
      $html,
      '@type[^A-Za-z]{0,20}(WebSite|Organization|WebPage|Article|BreadcrumbList|AboutPage|ContactPage|FAQPage|BlogPosting|NewsArticle|CollectionPage)',
      'IgnoreCase'
    )
    foreach ($tm in $typeMatches) {
      $schemaTypes += $tm.Groups[1].Value
    }
    $schemaTypes = $schemaTypes | Select-Object -Unique

    $richResultEligibleTypes = @(
      'Article', 'BlogPosting', 'NewsArticle', 'BreadcrumbList',
      'FAQPage', 'HowTo', 'Product', 'Recipe', 'Event', 'VideoObject'
    )
    $richResultTypesFound = @($schemaTypes | Where-Object { $richResultEligibleTypes -contains $_ })
    $hasRichResultType = $richResultTypesFound.Count -gt 0

    $hasNoindex = $false
    if ($robotsMeta -and $robotsMeta.ToLower().Contains('noindex')) { $hasNoindex = $true }
    if ($googlebotMeta -and $googlebotMeta.ToLower().Contains('noindex')) { $hasNoindex = $true }
    if ($xRobots -and $xRobots.ToLower().Contains('noindex')) { $hasNoindex = $true }

    $results += [pscustomobject]@{
      url = $url
      statusCode = [int]$res.StatusCode
      canonical = $canonical
      robotsMeta = $robotsMeta
      googlebotMeta = $googlebotMeta
      xRobotsTag = $xRobots
      hasNoindex = $hasNoindex
      jsonLdScriptCount = $jsonLdCount
      schemaTypesFound = $schemaTypes
      richResultTypesFound = $richResultTypesFound
      hasGoogleRichResultCandidate = $hasRichResultType
    }
  }
  catch {
    $results += [pscustomobject]@{
      url = $url
      statusCode = -1
      error = $_.Exception.Message
    }
  }
}

$robotsTxt = Invoke-WebRequest -Uri 'https://sanatanadharmam.in/robots.txt' -Method Get -UseBasicParsing
$sitemap = Invoke-WebRequest -Uri 'https://sanatanadharmam.in/sitemap.xml' -Method Get -UseBasicParsing

$contains404 = [bool]([regex]::Match([string]$sitemap.Content, '<loc>https://sanatanadharmam.in/404.html</loc>', 'IgnoreCase').Success)
$containsNotFound = [bool]([regex]::Match([string]$sitemap.Content, '<loc>https://sanatanadharmam.in/_not-found/</loc>', 'IgnoreCase').Success)

$audit = [pscustomobject]@{
  auditedAtUtc = (Get-Date).ToUniversalTime().ToString('o')
  source = 'live-production'
  baseUrl = 'https://sanatanadharmam.in'
  pages = $results
  robotsTxt = [pscustomobject]@{
    statusCode = [int]$robotsTxt.StatusCode
    hasSitemapDirective = ([string]$robotsTxt.Content -match 'Sitemap:\s*https://sanatanadharmam.in/sitemap.xml')
    contentPreview = (([string]$robotsTxt.Content -split [Environment]::NewLine) | Select-Object -First 10)
  }
  sitemap = [pscustomobject]@{
    statusCode = [int]$sitemap.StatusCode
    has404Html = $contains404
    hasNotFoundRoute = $containsNotFound
    urlCountApprox = ([regex]::Matches([string]$sitemap.Content, '<url>')).Count
  }
  recrawlTriggerPlan = [pscustomobject]@{
    enabled = $true
    actions = @(
      'In Search Console URL Inspection, request indexing for homepage + 5 priority URLs.',
      'Resubmit sitemap.xml after deploy.',
      'Update one high-authority internal page with fresh links to changed URLs to trigger recrawl.',
      'Ping changed URLs in Search Console if still in Crawled - currently not indexed after 48-72h.'
    )
  }
  dailyCoverageMonitoring = [pscustomobject]@{
    enabled = $true
    checks = @(
      'Search Console > Page indexing: track Indexed, Crawled - currently not indexed, Discovered - currently not indexed.',
      'Search Console > Enhancements: monitor rich result and structured data issue trends.',
      'Search Console > Sitemaps: ensure discovered URLs count is stable or increasing.',
      'Check a sample of 10 URLs/day for canonical consistency and robots indexability.'
    )
  }
}

$audit | ConvertTo-Json -Depth 8 | Set-Content -Path '.\public\post-deploy-verification.json' -Encoding UTF8

Write-Output 'WROTE public/post-deploy-verification.json'
$audit | ConvertTo-Json -Depth 3