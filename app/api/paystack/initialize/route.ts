import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("id", userId)
        .single();

    if (profileError || !profile) {
      console.error("Profile error:", profileError);

      return NextResponse.json(
        { error: "Profile not found." },
        { status: 404 }
      );
    }

    const planCode =
      process.env.PAYSTACK_PLAN_CODE?.trim();

    if (!planCode) {
      return NextResponse.json(
        { error: "Paystack plan code is missing." },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL?.trim();

    if (!appUrl) {
      return NextResponse.json(
        { error: "App URL is missing." },
        { status: 500 }
      );
    }

    const secretKey =
      process.env.PAYSTACK_SECRET_KEY?.trim();

    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack secret key is missing." },
        { status: 500 }
      );
    }

    console.log("Paystack plan:", planCode);
    console.log("Paystack email:", profile.email);
    console.log("Paystack amount:", 70000);

    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",

        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: profile.email,

          // ₦700 = 70,000 kobo
          amount: 70000,

          // Monthly Paystack plan
          plan: planCode,

          callback_url:
            `${appUrl}/billing/success`,

          metadata: {
            user_id: profile.id,
            product: "receiptly_premium",
          },
        }),
      }
    );

    const result = await response.json();

    console.log(
      "PAYSTACK HTTP STATUS:",
      response.status
    );

    console.log(
      "PAYSTACK RESPONSE:",
      JSON.stringify(result, null, 2)
    );

    if (!response.ok || !result.status) {
      return NextResponse.json(
        {
          error:
            result.message ||
            "Paystack initialization failed.",

          paystack: result,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      authorization_url:
        result.data.authorization_url,

      reference:
        result.data.reference,
    });

  } catch (error) {
    console.error(
      "Paystack initialization error:",
      error
    );

    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}