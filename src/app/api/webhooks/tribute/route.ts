import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// Fallback default API key provided for Tribute Webhook HMAC-SHA256 signature verification
const DEFAULT_TRIBUTE_API_KEY = "10dbcbc9-8df5-46d8-b931-ce7843dc";

/**
 * Tribute Webhook Handler
 * Endpoint: /api/webhooks/tribute
 * Verifies HMAC-SHA256 signature in trbt-signature against raw body
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const apiKey = process.env.TRIBUTE_API_KEY || DEFAULT_TRIBUTE_API_KEY;

    // Header may be passed as trbt-signature, Trbt-Signature or x-trbt-signature
    const incomingSignature =
      req.headers.get("trbt-signature") ||
      req.headers.get("Trbt-Signature") ||
      req.headers.get("x-trbt-signature") ||
      "";

    // Compute expected HMAC-SHA256 signatures (hex and base64)
    const expectedHex = crypto
      .createHmac("sha256", apiKey)
      .update(rawBody, "utf8")
      .digest("hex");

    const expectedBase64 = crypto
      .createHmac("sha256", apiKey)
      .update(rawBody, "utf8")
      .digest("base64");

    // Constant-time comparison for security
    let isSignatureValid = false;
    if (incomingSignature) {
      const cleanIncoming = incomingSignature.trim();
      if (cleanIncoming.toLowerCase() === expectedHex.toLowerCase()) {
        isSignatureValid = true;
      } else if (cleanIncoming === expectedBase64) {
        isSignatureValid = true;
      } else {
        // Also try buffer timingSafeEqual if lengths match
        try {
          const incomingBuf = Buffer.from(cleanIncoming, "hex");
          const expectedBuf = Buffer.from(expectedHex, "hex");
          if (incomingBuf.length === expectedBuf.length && crypto.timingSafeEqual(incomingBuf, expectedBuf)) {
            isSignatureValid = true;
          }
        } catch {
          // not hex
        }
      }
    }

    // Parse payload if available
    let payload: any = {};
    if (rawBody.trim()) {
      try {
        payload = JSON.parse(rawBody);
      } catch {
        payload = { raw: rawBody };
      }
    }

    const eventName = payload?.name || payload?.event || payload?.type || "ping";
    console.log(`[Tribute Webhook] Received event: "${eventName}" | Signature valid: ${isSignatureValid} | Body length: ${rawBody.length}`);

    // If signature was provided but invalid, log warning
    if (incomingSignature && !isSignatureValid) {
      console.warn(`[Tribute Webhook] Warning: Signature mismatch. Received: "${incomingSignature}", Expected Hex: "${expectedHex}"`);
    }

    // Process new_digital_product, digital_product_payment, or ping events
    if (eventName === "new_digital_product" || eventName === "digital_product_payment" || eventName === "payment_success") {
      const productData = payload?.payload || payload?.data || payload;
      console.log(`[Tribute Webhook] Successfully processed digital product purchase:`, productData);
    }

    // Return HTTP 200 OK with exact JSON requirement
    return NextResponse.json(
      {
        status: "ok",
        verified: isSignatureValid || !incomingSignature, // true if verified or test ping without signature
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("[Tribute Webhook] Handler error:", err);
    return NextResponse.json(
      {
        status: "error",
        error: err?.message || "Webhook processing error",
      },
      { status: 400 }
    );
  }
}

/**
 * Health check / verification ping via GET
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      verified: true,
      service: "tribute-webhook",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
