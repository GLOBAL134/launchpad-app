Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\medve\.gemini\antigravity\brain\2361996b-fcd2-44d9-9102-8bb7308edac3\vc_ru_cover_banner_1793176438266.jpg"
$outCover1 = "C:\Users\medve\.gemini\antigravity\brain\2361996b-fcd2-44d9-9102-8bb7308edac3\vc-profile-cover.png"
$outCover2 = "c:\Users\medve\Documents\antigravity\serene-kepler\vc-profile-cover.png"
$outClean1 = "C:\Users\medve\.gemini\antigravity\brain\2361996b-fcd2-44d9-9102-8bb7308edac3\vc-cover-clean.png"

$src = [System.Drawing.Image]::FromFile($srcPath)

$targetWidth = 1920
$targetHeight = 640

$bmp = New-Object System.Drawing.Bitmap($targetWidth, $targetHeight)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$scale = [Math]::Max($targetWidth / $src.Width, $targetHeight / $src.Height)
$scaledW = [int]($src.Width * $scale)
$scaledH = [int]($src.Height * $scale)
$offsetX = [int](($targetWidth - $scaledW) / 2)
$offsetY = [int](($targetHeight - $scaledH) / 2)

$g.DrawImage($src, $offsetX, $offsetY, $scaledW, $scaledH)

$bmp.Save($outClean1, [System.Drawing.Imaging.ImageFormat]::Png)

$pt1 = New-Object System.Drawing.Point(0, 0)
$pt2 = New-Object System.Drawing.Point(1200, 0)
$cLeft1 = [System.Drawing.Color]::FromArgb(235, 11, 15, 23)
$cLeft2 = [System.Drawing.Color]::FromArgb(0, 11, 15, 23)
$leftGradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, $cLeft1, $cLeft2)
$g.FillRectangle($leftGradBrush, 0, 0, 1200, $targetHeight)
$leftGradBrush.Dispose()

$pt3 = New-Object System.Drawing.Point(0, 350)
$pt4 = New-Object System.Drawing.Point(0, $targetHeight)
$cBot1 = [System.Drawing.Color]::FromArgb(0, 11, 15, 23)
$cBot2 = [System.Drawing.Color]::FromArgb(210, 11, 15, 23)
$bottomGradBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt3, $pt4, $cBot1, $cBot2)
$g.FillRectangle($bottomGradBrush, 0, 350, $targetWidth, [int]($targetHeight - 350))
$bottomGradBrush.Dispose()

$neonPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 99, 102, 241), 3)
$g.DrawLine($neonPen, 0, 2, $targetWidth, 2)
$neonPen.Dispose()

$fontBadge = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
$fontTitle = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
$fontSub = New-Object System.Drawing.Font("Arial", 17, [System.Drawing.FontStyle]::Regular)
$fontPills = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
$fontDomain = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)

$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$indigoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(129, 140, 248))
$cyanBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
$emeraldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 211, 153))
$amberBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
$grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))

$badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(170, 30, 41, 59))
$badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(200, 99, 102, 241), 1)
$g.FillRectangle($badgeBg, 80, 65, 390, 36)
$g.DrawRectangle($badgePen, 80, 65, 390, 36)
$g.DrawString("AI JOB SEARCH COMMAND CENTER 2026", $fontBadge, $indigoBrush, 92, 74)

$g.DrawString("LaunchPad AI", $fontTitle, $whiteBrush, 75, 120)

$t1 = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::UTF8.GetBytes("Командный центр поиска работы в IT: обходите роботов ATS"))
$t2 = [System.Text.Encoding]::UTF8.GetString([System.Text.Encoding]::UTF8.GetBytes("AI-сканер резюме • Сопроводительные письма • Канбан-пайплайн"))

$g.DrawString($t1, $fontSub, $grayBrush, 80, 195)
$g.DrawString($t2, $fontSub, $cyanBrush, 80, 225)

function DrawBadge($bx, $by, $bw, $bh, $btext, $bBrush, $bBorder) {
    $sBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(180, 15, 23, 42))
    $sPen = New-Object System.Drawing.Pen($bBorder, 1)
    $g.FillRectangle($sBg, $bx, $by, $bw, $bh)
    $g.DrawRectangle($sPen, $bx, $by, $bw, $bh)
    $g.DrawString($btext, $fontPills, $bBrush, [float]($bx + 14), [float]($by + 8))
    $sBg.Dispose()
    $sPen.Dispose()
}

DrawBadge 80 270 240 36 "94% ATS Match Rate" $emeraldBrush ([System.Drawing.Color]::FromArgb(100, 16, 185, 129))
DrawBadge 335 270 250 36 "Cover Letter in 10s" $indigoBrush ([System.Drawing.Color]::FromArgb(100, 99, 102, 241))
DrawBadge 600 270 250 36 "Offer Conversion 3x" $amberBrush ([System.Drawing.Color]::FromArgb(100, 245, 158, 11))

$urlBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(210, 15, 23, 42))
$urlPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(180, 56, 189, 248), 1)
$g.FillRectangle($urlBg, 80, 325, 340, 42)
$g.DrawRectangle($urlPen, 80, 325, 340, 42)
$g.DrawString("launchpad-app-ashy.vercel.app", $fontDomain, $cyanBrush, 96, 335)

$g.DrawString("PROMO: START30 (-30%)", $fontBadge, $amberBrush, 435, 338)

$bmp.Save($outCover1, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($outCover2, [System.Drawing.Imaging.ImageFormat]::Png)

$src.Dispose()
$bmp.Dispose()
$g.Dispose()

Write-Host "COVERS_CREATED_SUCCESSFULLY"
