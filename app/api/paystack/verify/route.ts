import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { error: "Reference is required." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const result = await response.json();

    if (
      !result.status ||
      result.data?.status !== "success"
    ) {
      return NextResponse.json(
        { error: "Payment verification failed." },
        { status: 400 }
      );
    }

    

    const email =
      result.data.customer?.email ||
      result.data.metadata?.customer_email;

    if (!email) {
      return NextResponse.json(
        { error: "Customer email not found." },
        { status: 400 }
      );
    }

    const premiumUntil = new Date();

    premiumUntil.setMonth(
      premiumUntil.getMonth() + 1
    );

    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("id, email")
        .eq("email", email)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Receiptly profile not found." },
        { status: 404 }
      );
    }

    await supabaseAdmin
      .from("profiles")
      .update({
        plan: "premium",
        receipt_limit: 999999,
        premium_until:
          premiumUntil.toISOString(),
      })
      .eq("id", profile.id);

    await supabaseAdmin
      .from("payments")
      .upsert(
        {
          user_id: profile.id,
          email: profile.email,
          reference: result.data.reference,
          amount: Number(result.data.amount),
          plan: "premium",
          status: "success",
        },
        {
          onConflict: "reference",
        }
      );

    return NextResponse.json({
      success: true,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Server error." },
      { status: 500 }
    );
  }
}