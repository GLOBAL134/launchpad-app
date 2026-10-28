$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$baseDir = "c:\Users\medve\Documents\antigravity\serene-kepler"
$publicDir = "$baseDir\public"
$artifactDir = "C:\Users\medve\.gemini\antigravity\brain\2361996b-fcd2-44d9-9102-8bb7308edac3"

$slides = @(
    @{ Html = "$baseDir\slide1_art.html"; OutName = "slide-1-creative.png" },
    @{ Html = "$baseDir\slide2_art.html"; OutName = "slide-2-creative.png" },
    @{ Html = "$baseDir\slide3_art.html"; OutName = "slide-3-creative.png" }
)

foreach ($s in $slides) {
    $outPublic = Join-Path $publicDir $s.OutName
    $outArtifact = Join-Path $artifactDir $s.OutName
    $url = "file:///" + $s.Html.Replace("\", "/")

    $args = "--headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=720,1280 --screenshot=""$outPublic"" ""$url"""
    Write-Host "Rendering $($s.OutName)..."
    $proc = Start-Process -FilePath $edge -ArgumentList $args -Wait -PassThru
    
    if (Test-Path $outPublic) {
        Copy-Item $outPublic $outArtifact -Force
        $item = Get-Item $outPublic
        Write-Host "SUCCESS: $($s.OutName) ($($item.Length) bytes)"
    } else {
        Write-Host "FAILED to create $($s.OutName)"
    }
}
