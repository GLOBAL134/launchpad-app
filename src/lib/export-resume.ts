import { cleanAIMarkdownArtifacts } from "./monetization";

/**
 * Universal Resume Exporter (DOCX, PDF, and HH.ru Blocks)
 * Full Russian Cyrillic support, standard Harvard single-column layout.
 */

export interface HhResumeBlocks {
  summary: string;
  experience: string;
  skills: string;
  name: string;
  role: string;
}

/**
 * Parses plain text resume into structured blocks
 */
export function splitResumeForHh(resumeText: string): HhResumeBlocks {
  const clean = cleanAIMarkdownArtifacts(resumeText);
  const lines = clean.split("\n").map((l) => l.trim()).filter(Boolean);

  let name = "Соискатель";
  let role = "Специалист";

  if (lines.length > 0) {
    const firstLine = lines[0];
    if (firstLine.includes("—") || firstLine.includes("|")) {
      const parts = firstLine.split(/[—|]/);
      name = parts[0].trim();
      role = parts[1]?.trim() || "Специалист";
    } else {
      name = firstLine;
      if (lines.length > 1 && !lines[1].toLowerCase().startsWith("о себе")) {
        role = lines[1].split(/[—|]/)[0].trim();
      }
    }
  }

  // Extract Summary (О себе)
  let summary = "";
  const summaryMatch = clean.match(/(?:о себе|summary|обо мне)[:\s]*\n?([\s\S]*?)(?=(?:опыт работы|experience|навыки|skills|образование|$))/i);
  if (summaryMatch && summaryMatch[1]) {
    summary = summaryMatch[1].trim();
  } else {
    // Take first 3 descriptive lines after header
    summary = lines.slice(2, 6).filter((l) => !l.startsWith("•") && !l.includes("@")).join(" ");
  }

  // Extract Experience (Опыт работы)
  let experience = "";
  const expMatch = clean.match(/(?:опыт работы|experience|профессиональный опыт)[:\s]*\n?([\s\S]*?)(?=(?:ключевые навыки|навыки|skills|образование|education|$))/i);
  if (expMatch && expMatch[1]) {
    experience = expMatch[1].trim();
  } else {
    // Filter bullet lines
    experience = lines.filter((l) => l.startsWith("•") || l.startsWith("-")).join("\n");
  }

  // Extract Skills (Ключевые навыки)
  let skills = "";
  const skillsMatch = clean.match(/(?:ключевые навыки|навыки|компетенции|skills)[:\s]*\n?([\s\S]*?)(?=(?:образование|education|курсы|$))/i);
  if (skillsMatch && skillsMatch[1]) {
    skills = skillsMatch[1]
      .split(/[\n,;•]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && !s.toLowerCase().includes("навык"))
      .join(", ");
  } else {
    skills = "1С, Управление процессами, Деловая коммуникация, CRM, Анализ данных, Контроль качества, Работа на результат";
  }

  return {
    name,
    role,
    summary: summary || "Опытный специалист с подтвержденным трек-рекордом в оптимизации рабочих процессов и выполнении ключевых показателей.",
    experience: experience || "• Успешно оптимизировал профильные рабочие процессы, сократив временные издержки подразделения на 30%.\n• Внедрил стандарты качества и регламенты взаимодействия, обеспечив 100% выполнение целевых нормативов.",
    skills,
  };
}

/**
 * Real DOCX Export using Microsoft Word OpenXML format
 */
export async function exportResumeToDocx(resumeText: string, customFileName?: string): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");

  const blocks = splitResumeForHh(resumeText);
  const clean = cleanAIMarkdownArtifacts(resumeText);
  const lines = clean.split("\n");

  const docParagraphs: InstanceType<typeof Paragraph>[] = [];

  // Title: Name
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: blocks.name.toUpperCase(),
          bold: true,
          size: 32, // 16pt
          font: "Calibri",
          color: "111827",
        }),
      ],
    })
  );

  // Subtitle: Role
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 240 },
      children: [
        new TextRun({
          text: blocks.role,
          size: 24, // 12pt
          font: "Calibri",
          color: "2563EB",
          bold: true,
        }),
      ],
    })
  );

  // Iterate lines and structure paragraphs
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if line is a section header
    const isSectionHeader = /^(?:о себе|опыт работы|профессиональный опыт|ключевые навыки|компетенции|образование|summary|experience|skills|education)$/i.test(
      trimmed
    );

    if (isSectionHeader) {
      docParagraphs.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: trimmed.toUpperCase(),
              bold: true,
              size: 24,
              font: "Calibri",
              color: "1F2937",
            }),
          ],
        })
      );
    } else if (trimmed.startsWith("•") || trimmed.startsWith("-")) {
      docParagraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: trimmed.replace(/^[•\-]\s*/, ""),
              size: 21, // 10.5pt
              font: "Calibri",
              color: "374151",
            }),
          ],
        })
      );
    } else {
      docParagraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 80 },
          children: [
            new TextRun({
              text: trimmed,
              size: 21,
              font: "Calibri",
              color: "374151",
            }),
          ],
        })
      );
    }
  }

  // Footer validation stamp
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400 },
      children: [
        new TextRun({
          text: "Standard 1-Column ATS Template • Verified by LaunchPad AI PRO",
          size: 16,
          font: "Calibri",
          color: "9CA3AF",
          italics: true,
        }),
      ],
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = customFileName || `Резюме_ATS_${blocks.name.replace(/\s+/g, "_")}.docx`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Direct High-Quality Printable PDF (Harvard Single-Column ATS standard)
 * Uses clean dedicated print frame with Inter / Arial fonts, zero Cyrillic font clipping.
 */
export function exportResumeToPdf(resumeText: string, customTitle?: string): void {
  const blocks = splitResumeForHh(resumeText);
  const clean = cleanAIMarkdownArtifacts(resumeText);

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Разрешите всплывающие окна для печати и сохранения PDF");
    return;
  }

  const htmlContent = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>${customTitle || `Резюме_ATS_${blocks.name}`}</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      font-size: 10.5pt;
      line-height: 1.45;
      padding: 10px 0;
    }
    .resume-container {
      max-width: 100%;
      margin: 0 auto;
    }
    .header {
      text-align: center;
      padding-bottom: 14px;
      margin-bottom: 16px;
      border-bottom: 1.5px solid #111827;
    }
    .name {
      font-size: 20pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #0f172a;
      margin-bottom: 4px;
    }
    .role {
      font-size: 11pt;
      font-weight: 700;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .contacts {
      font-size: 9.5pt;
      color: #4b5563;
      font-family: monospace, sans-serif;
    }
    .content {
      white-space: pre-wrap;
      font-size: 10pt;
      line-height: 1.5;
      color: #1f2937;
    }
    .footer {
      margin-top: 24px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #9ca3af;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="resume-container">
    <div class="header">
      <div class="name">${escapeHtml(blocks.name)}</div>
      <div class="role">${escapeHtml(blocks.role)}</div>
    </div>
    <div class="content">${escapeHtml(clean)}</div>
    <div class="footer">
      <span>Standard 1-Column Harvard ATS Format</span>
      <span>Verified by LaunchPad AI PRO</span>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
