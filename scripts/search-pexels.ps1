param(
	[Parameter(Mandatory = $true)]
	[string]$Query,
	[int]$PerPage = 12
)

$projectRoot = Split-Path -Parent $PSScriptRoot
$settingsPath = Join-Path $projectRoot ".env"

if (-not (Test-Path -LiteralPath $settingsPath)) {
	throw "Missing $settingsPath"
}

$settings = Get-Content -LiteralPath $settingsPath | ConvertFrom-StringData
if (-not $settings.PEXELS_API_KEY) {
	throw "PEXELS_API_KEY is missing from .env"
}

$encodedQuery = [uri]::EscapeDataString($Query)
$uri = "https://api.pexels.com/v1/videos/search?orientation=landscape&size=medium&per_page=$PerPage&query=$encodedQuery"
$response = Invoke-RestMethod -Uri $uri -Headers @{Authorization = $settings.PEXELS_API_KEY}

$response.videos | ForEach-Object {
	$video = $_
	$file = $video.video_files |
		Where-Object { $_.file_type -eq "video/mp4" -and $_.width -ge 1280 -and $_.height -ge 720 } |
		Sort-Object @{Expression = {[math]::Abs($_.width - 1920) + [math]::Abs($_.height - 1080)}} |
		Select-Object -First 1

	if ($file) {
		[PSCustomObject]@{
			id = $video.id
			duration = $video.duration
			creator = $video.user.name
			page = $video.url
			preview = $video.image
			download = $file.link
			width = $file.width
			height = $file.height
			fps = $file.fps
		}
	}
} | ConvertTo-Json -Depth 4
