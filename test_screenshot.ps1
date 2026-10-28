$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$outPng = "c:\Users\medve\Documents\antigravity\serene-kepler\test_out.png"
$htmlFile = "file:///c:/Users/medve/Documents/antigravity/serene-kepler/test_slide.html"

$argsList = "--headless=new --disable-gpu --no-sandbox --hide-scrollbars --window-size=720,1280 --screenshot=""$outPng"" ""$htmlFile"""

Write-Host "Running Edge..."
$proc = Start-Process -FilePath $edge -ArgumentList $argsList -Wait -PassThru
Write-Host "ExitCode: $($proc.ExitCode)"
Write-Host "Exists: $(Test-Path $outPng)"
