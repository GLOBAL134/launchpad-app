Add-Type -AssemblyName System.Drawing
$filePath = 'C:\Users\medve\.gemini\antigravity\brain\2361996b-fcd2-44d9-9102-8bb7308edac3\vc_ru_cover_banner_1793176438266.jpg'
$img = [System.Drawing.Image]::FromFile($filePath)
Write-Host "Width: $($img.Width), Height: $($img.Height)"
$img.Dispose()
