import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface PlanConfig {
  title: string;
  priceRub: number;
  description: string;
  durationMonths: number;
}

const PLANS: Record<string, PlanConfig> = {
  pro_monthly: {
    title: "LaunchPad Pro (1 месяц)",
    priceRub: 1490,
    description: "Подписка LaunchPad Pro на 1 месяц",
    durationMonths: 1,
  },
  pro_quarterly: {
    title: "LaunchPad Pro (3 месяца — Скидка 30%)",
    priceRub: 3490,
    description: "Подписка LaunchPad Pro на 3 месяца",
    durationMonths: 3,
  },
  coach_monthly: {
    title: "LaunchPad Coach (1 месяц)",
    priceRub: 4990,
    description: "Тариф для карьерных консультантов (до 25 клиентов)",
    durationMonths: 1,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { planId = "pro_monthly", returnUrl } = await req.json();

    const plan = PLANS[planId] || PLANS.pro_monthly;
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const idempotenceKey = uuidv4();
    const successUrl = returnUrl || `${baseUrl}/dashboard?payment=success&plan=${planId}`;

    // If real YooKassa credentials are configured in .env.local
    if (shopId && secretKey && shopId.trim().length > 3 && secretKey.trim().length > 10) {
      const authHeader = "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64");

      const yooResponse = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotence-Key": idempotenceKey,
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: {
            value: `${plan.priceRub}.00`,
            currency: "RUB",
          },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: successUrl,
          },
          description: plan.description,
          metadata: {
            plan_id: planId,
            user_email: "demo@launchpad.app",
          },
        }),
      });

      const yooData = await yooResponse.json();

      if (!yooResponse.ok) {
        throw new Error(yooData.description || "YooKassa payment initialization failed");
      }

      return NextResponse.json({
        paymentId: yooData.id,
        confirmationUrl: yooData.confirmation?.confirmation_url,
        isSimulated: false,
      });
    }

    // Interactive Demo / Sandbox Mode for testing without production merchant setup
    // Provides instant feedback and redirects to success state
    return NextResponse.json({
      paymentId: `sim_${idempotenceKey.slice(0, 8)}`,
      confirmationUrl: `${successUrl}&simulated=true`,
      isSimulated: true,
      message: "Тестовый режим ЮKassa: оплата подтверждена автоматически",
    });
  } catch (err: any) {
    console.error("YooKassa Create Payment Error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to create YooKassa payment" },
      { status: 500 }
    );
  }
}
