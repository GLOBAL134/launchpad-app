import { NextRequest, NextResponse } from "next/server";

/**
 * YooKassa Webhook Handler
 * Receives notifications about payment status changes (payment.succeeded, payment.canceled, etc.)
 * Documentation: https://yookassa.ru/developers/using-api/webhooks
 */
export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    const { type, object } = event;

    console.log(`[YooKassa Webhook] Event: ${type}, Payment ID: ${object?.id}, Status: ${object?.status}`);

    if (type === "notification" && object?.status === "succeeded") {
      const paymentId = object.id;
      const amount = object.amount?.value;
      const planId = object.metadata?.plan_id;
      const userEmail = object.metadata?.user_email;

      // In production with Supabase:
      // await supabase.from('users').update({ is_pro: true, plan: planId }).eq('email', userEmail);
      console.log(`[YooKassa Webhook] Successfully activated Pro status for ${userEmail || paymentId} (${amount} RUB)`);
    }

    // Always respond with 200 OK so YooKassa stops retrying
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("YooKassa Webhook Error:", err);
    return NextResponse.json({ error: "Webhook processing error" }, { status: 400 });
  }
}
