import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface PlanConfig {
  title: string;
  priceRub: number;
  description: string;
  durationMonths: number;
}

const PLANS: Record<string, PlanConfig> = {
  turbo_24h: {
    title: "Турбо-Старт (24 часа)",
    priceRub: 290,
    description: "Разовый доступ к скачиванию Word/PDF и 15 AI-адаптациям резюме",
    durationMonths: 0.1,
  },
  offer_pro_30d: {
    title: "Оффер под ключ (30 дней PRO)",
    priceRub: 690,
    description: "Полный безлимит на 30 дней: Шпаргалка к интервью, Торг по зарплате, Канбан",
    durationMonths: 1,
  },
  pro_monthly: {
    title: "LaunchPad Pro (1 месяц)",
    priceRub: 690,
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

const PROMO_CODES: Record<string, number> = {
  START30: 0.3,
  RADAR20: 0.2,
  LAUNCH30: 0.3,
  OFFER50: 0.5,
};

export async function POST(req: NextRequest) {
  try {
    const { planId = "pro_monthly", returnUrl, promoCode } = await req.json();

    const plan = PLANS[planId] || PLANS.pro_monthly;
    let finalPrice = plan.priceRub;

    if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
      const discount = PROMO_CODES[promoCode.toUpperCase()];
      finalPrice = Math.round(plan.priceRub * (1 - discount));
    }

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
            value: `${finalPrice}.00`,
            currency: "RUB",
          },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: successUrl,
          },
          description: `${plan.description} (сумма: ${finalPrice} ₽${promoCode ? `, промокод: ${promoCode}` : ""})`,
          metadata: {
            plan_id: planId,
            promo_code: promoCode || "",
            final_price: finalPrice,
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
        finalPrice,
        isSimulated: false,
      });
    }

    // Interactive Demo / Sandbox Mode for testing without production merchant setup
    return NextResponse.json({
      paymentId: `sim_${idempotenceKey.slice(0, 8)}`,
      confirmationUrl: `${successUrl}&simulated=true&amount=${finalPrice}`,
      finalPrice,
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
