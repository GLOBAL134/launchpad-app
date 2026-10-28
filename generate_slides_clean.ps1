Add-Type -AssemblyName System.Drawing

$outDir = "c:\Users\medve\Documents\antigravity\serene-kepler\public"
$outDirArtifact = "C:\Users\medve\.gemini\antigravity\brain\2361996b-fcd2-44d9-9102-8bb7308edac3"

$w = 720
$h = 1280

function Create-Slide($filename, $badgeText, $titleText, $subText, $accentColor, $cardAction) {
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

    $bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 15, 23))
    $g.FillRectangle($bgBrush, 0, 0, $w, $h)
    $bgBrush.Dispose()

    $pt1 = New-Object System.Drawing.Point(0, 0)
    $pt2 = New-Object System.Drawing.Point($w, 600)
    $cTop = [System.Drawing.Color]::FromArgb(80, $accentColor.R, $accentColor.G, $accentColor.B)
    $cBot = [System.Drawing.Color]::FromArgb(0, 11, 15, 23)
    $glowBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush($pt1, $pt2, $cTop, $cBot)
    $g.FillRectangle($glowBrush, 0, 0, $w, 600)
    $glowBrush.Dispose()

    $brandFont = New-Object System.Drawing.Font("Arial", 16, [System.Drawing.FontStyle]::Bold)
    $brandBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString("LaunchPad AI", $brandFont, $brandBrush, 50, 60)
    $brandFont.Dispose()
    $brandBrush.Dispose()

    $badgeFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
    $badgeBrush = New-Object System.Drawing.SolidBrush($accentColor)
    $badgeBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(40, $accentColor.R, $accentColor.G, $accentColor.B))
    $badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(120, $accentColor.R, $accentColor.G, $accentColor.B), 1)
    $g.FillRectangle($badgeBg, 50, 110, 260, 32)
    $g.DrawRectangle($badgePen, 50, 110, 260, 32)
    $g.DrawString($badgeText, $badgeFont, $badgeBrush, 62, 118)

    $titleFont = New-Object System.Drawing.Font("Arial", 28, [System.Drawing.FontStyle]::Bold)
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString($titleText, $titleFont, $whiteBrush, 50, 160)

    $subFont = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Regular)
    $grayBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))
    $g.DrawString($subText, $subFont, $grayBrush, 50, 250)

    & $cardAction $g $w $h

    $ctaBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 24, 38))
    $ctaPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(45, 55, 75), 1)
    $g.FillRectangle($ctaBg, 50, 1140, [int]($w - 100), 75)
    $g.DrawRectangle($ctaPen, 50, 1140, [int]($w - 100), 75)
    $ctaBg.Dispose()
    $ctaPen.Dispose()

    $ctaFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
    $ctaBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
    $g.DrawString("launchpad-app-ashy.vercel.app", $ctaFont, $ctaBrush, 75, 1165)

    $promoFont = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
    $promoBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(251, 191, 36))
    $g.DrawString("START30 (-30%)", $promoFont, $promoBrush, 470, 1167)

    $f1 = Join-Path $outDir $filename
    $f2 = Join-Path $outDirArtifact $filename
    $bmp.Save($f1, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Save($f2, [System.Drawing.Imaging.ImageFormat]::Png)

    $bmp.Dispose()
    $g.Dispose()
    Write-Host "Created slide: $f1"
}

# --- SLIDE 1 ---
$act1 = {
    param($g, $w, $h)
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 24, 38))
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 189, 248), 2)
    $g.FillRectangle($cardBg, 50, 360, 620, 720)
    $g.DrawRectangle($cardPen, 50, 360, 620, 720)

    $scBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129))
    $scFont = New-Object System.Drawing.Font("Arial", 50, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("94%", $scFont, $scBrush, 280, 420)

    $lblFont = New-Object System.Drawing.Font("Arial", 13, [System.Drawing.FontStyle]::Bold)
    $lblBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))
    $g.DrawString("ATS MATCH SCORE: PASS", $lblFont, $lblBrush, 235, 515)

    $cmpFont = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Bold)
    $wBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $g.DrawString("Целевая вакансия: Яндекс (Senior PM)", $cmpFont, $wBrush, 90, 580)

    $kwTFont = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
    $greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(52, 211, 153))
    $g.DrawString("Найдено в резюме (18 совпадений):", $kwTFont, $greenBrush, 90, 630)

    $itFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Regular)
    $g.DrawString("- Agile / Scrum  - Unit-экономика  - PRD`n- CJM / CustDev  - Roadmap  - A/B-тесты", $itFont, $wBrush, 90, 665)

    $redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 113, 113))
    $g.DrawString("Не хватало в резюме (устранено AI):", $kwTFont, $redBrush, 90, 740)
    $g.DrawString("- CI/CD Pipelines  - Stakeholder Management`n- Microservices Architecture", $itFont, $wBrush, 90, 775)

    $recBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
    $g.FillRectangle($recBg, 90, 860, 540, 160)
    $aiFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Italic)
    $g.DrawString("AI-оптимизированное саммари:`n'Продуктовый лидер с 6+ годами опыта в AI/SaaS,`nуспешным запуском CI/CD пайплайнов и ростом`nвыручки на 38%...'", $aiFont, [System.Drawing.Brushes]::White, 110, 885)
}
Create-Slide "slide-1-scanner.png" "ATS-СКАНЕР РЕЗЮМЕ" "Проходите роботов`nпервичного отбора" "75% резюме отсеиваются алгоритмами ATS.`nНаш AI проверит совпадение ключевых навыков`nи покажет точный скор до отправки HR." ([System.Drawing.Color]::FromArgb(56, 189, 248)) $act1

# --- SLIDE 2 ---
$act2 = {
    param($g, $w, $h)
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 24, 38))
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), 2)
    $g.FillRectangle($cardBg, 50, 360, 620, 720)
    $g.DrawRectangle($cardPen, 50, 360, 620, 720)

    function MiniCard($y, $company, $role, $salary, $status, $color) {
        $b = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(28, 36, 52))
        $p = New-Object System.Drawing.Pen($color, 1)
        $g.FillRectangle($b, 90, $y, 540, 115)
        $g.DrawRectangle($p, 90, $y, 540, 115)

        $f1 = New-Object System.Drawing.Font("Arial", 14, [System.Drawing.FontStyle]::Bold)
        $g.DrawString($company, $f1, [System.Drawing.Brushes]::White, 110, [float]($y + 15))

        $f2 = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Regular)
        $g.DrawString($role, $f2, [System.Drawing.Brushes]::LightGray, 110, [float]($y + 42))

        $f3 = New-Object System.Drawing.Font("Arial", 12, [System.Drawing.FontStyle]::Bold)
        $sb = New-Object System.Drawing.SolidBrush($color)
        $g.DrawString($salary, $f3, $sb, 110, [float]($y + 72))

        $f4 = New-Object System.Drawing.Font("Arial", 10, [System.Drawing.FontStyle]::Bold)
        $g.DrawString($status, $f4, $sb, 390, [float]($y + 20))
    }

    MiniCard 400 "Т-Банк" "Senior Product Designer" "320 000 ₽" "Этап: Скрининг" ([System.Drawing.Color]::FromArgb(56, 189, 248))
    MiniCard 540 "Яндекс" "Product Manager (Поиск)" "350 000 ₽" "Этап: Интервью" ([System.Drawing.Color]::FromArgb(251, 191, 36))
    MiniCard 680 "VK" "Principal ML Engineer" "420 000 ₽" "Оффер получен!" ([System.Drawing.Color]::FromArgb(52, 211, 153))
    MiniCard 820 "Ozon" "Senior Frontend Lead" "290 000 ₽" "Фоллоу-ап сегодня" ([System.Drawing.Color]::FromArgb(192, 132, 252))

    $tipFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Italic)
    $g.DrawString("+ Вся история переписки и контакты рекрутеров в 1 клик", $tipFont, [System.Drawing.Brushes]::LightGray, 90, 980)
}
Create-Slide "slide-2-tracker.png" "КАНБАН-ПАЙПЛАЙН" "Управляйте откликами`nбез хаоса в таблицах" "Визуальная воронка со статусами от вишлиста`nдо оффера. Заметки по этапам, контакты HR`nи зарплатные вилки в рублях." ([System.Drawing.Color]::FromArgb(16, 185, 129)) $act2

# --- SLIDE 3 ---
$act3 = {
    param($g, $w, $h)
    $cardBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 24, 38))
    $cardPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(168, 85, 247), 2)
    $g.FillRectangle($cardBg, 50, 360, 620, 720)
    $g.DrawRectangle($cardPen, 50, 360, 620, 720)

    $tFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Bold)
    $g.DrawString("Тональность письма: Профессиональный / Уверенный", $tFont, [System.Drawing.Brushes]::White, 90, 410)

    $lBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(30, 41, 59))
    $g.FillRectangle($lBg, 90, 460, 540, 440)

    $pFont = New-Object System.Drawing.Font("Arial", 11, [System.Drawing.FontStyle]::Regular)
    $letter = "Здравствуйте, команда Яндекса!`n`nМеня зовут Алексей Морозов. Мой 6-летний опыт`nв управлении AI-продуктами и B2B SaaS полностью`nотвечает ключевым целям вашей облачной команды.`n`nВ CloudScale я увеличил DAU аналитической платформы`nс 5 000 до 45 000 пользователей, внедрил A/B-тесты`nи сократил time-to-market новых фич на 30%.`n`nБуду рад обсудить, как мой бэкграунд поможет`nусилить развитие сервисов Яндекса!"
    $g.DrawString($letter, $pFont, [System.Drawing.Brushes]::White, 110, 480)

    $g.DrawString("+ Экспорт в PDF и TXT в 1 клик", $tFont, [System.Drawing.Brushes]::LightGreen, 90, 930)
    $g.DrawString("+ Автоматический Follow-Up на 7, 14 и 21 день", $tFont, [System.Drawing.Brushes]::LightBlue, 90, 970)
}
Create-Slide "slide-3-letters.png" "AI COVER LETTER STUDIO" "Персонализированные`nписьма за 10 секунд" "Нейросеть пишет живые, убедительные письма`nпод конкретную вакансию на основе вашего реального`nопыта. Без шаблонной 'воды'." ([System.Drawing.Color]::FromArgb(168, 85, 247)) $act3

Write-Host "ALL_SLIDES_SUCCESS"
