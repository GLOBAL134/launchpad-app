import { NextRequest, NextResponse } from "next/server";
import { cleanAIMarkdownArtifacts } from "@/lib/monetization";

/**
 * Universal Resume File Parser (PDF, DOCX, TXT, MD)
 * Extracts pristine clean text with full Cyrillic (Russian) unicode support.
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Файл не прикреплен. Загрузите резюме в формате PDF, DOCX или TXT." },
        { status: 400 }
      );
    }

    const fileName = file.name || "resume";
    const fileExt = fileName.toLowerCase().split(".").pop() || "";
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = "";

    if (fileExt === "pdf" || file.type === "application/pdf") {
      try {
        const { extractText } = await import("unpdf");
        const { text } = await extractText(new Uint8Array(buffer));
        extractedText = Array.isArray(text) ? text.join("\n\n") : text || "";
      } catch (pdfErr) {
        console.error("unpdf error, trying pdf-parse fallback:", pdfErr);
        try {
          const { PDFParse } = await import("pdf-parse");
          const parser = new PDFParse({ data: buffer });
          const pdfResult = await parser.getText();
          if (pdfResult && Array.isArray(pdfResult.pages) && pdfResult.pages.length > 0) {
            extractedText = pdfResult.pages.map((p: any) => p.text || "").join("\n\n");
          } else {
            extractedText = typeof pdfResult === "string" ? pdfResult : pdfResult?.text || "";
          }
        } catch {
          return NextResponse.json(
            {
              error:
                "Не удалось извлечь текст из PDF (возможно, это сканированная картинка без текстового слоя). Скопируйте и вставьте текст вручную.",
            },
            { status: 422 }
          );
        }
      }
    } else if (
      fileExt === "docx" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const mammoth = await import("mammoth");
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (docxErr) {
        console.error("Mammoth DOCX error:", docxErr);
        return NextResponse.json(
          { error: "Ошибка чтения .docx файла. Проверьте, что документ не поврежден." },
          { status: 422 }
        );
      }
    } else if (fileExt === "txt" || fileExt === "md" || file.type.startsWith("text/")) {
      extractedText = buffer.toString("utf-8");
    } else {
      // Try text decoding as fallback
      try {
        extractedText = buffer.toString("utf-8");
      } catch {
        return NextResponse.json(
          { error: "Неподдерживаемый формат. Используйте PDF, DOCX, TXT или MD." },
          { status: 400 }
        );
      }
    }

    // Clean text and standardize formatting
    const cleaned = cleanAIMarkdownArtifacts(extractedText)
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]{2,}/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    if (!cleaned || cleaned.length < 25) {
      return NextResponse.json(
        {
          error:
            "В файле обнаружено слишком мало текста. Проверьте содержимое документа или вставьте резюме текстом.",
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      text: cleaned,
      fileName,
      charCount: cleaned.length,
      fileType: fileExt.toUpperCase(),
    });
  } catch (err: unknown) {
    console.error("Resume file parse error:", err);
    return NextResponse.json(
      { error: "Ошибка при обработке файла: " + (err instanceof Error ? err.message : String(err)) },
      { status: 500 }
    );
  }
}
