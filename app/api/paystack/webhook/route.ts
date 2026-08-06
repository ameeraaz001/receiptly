import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  const signature =
    req.headers.get("x-paystack-signature");

  const hash = crypto
    .createHmac(
      "sha512",
      process.env.PAYSTACK_SECRET_KEY!
    )
    .update(rawBody)
    .digest("hex");

  if (
    !signature ||
    !crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature)
    )
  ) {
    return NextResponse.json(
      { error: "Invalid signature." },
      { status: 401 }
    );
  }

  try {
    const event = JSON.parse(rawBody);

    console.log(
      "Paystack webhook:",
      event.event
    );

    // --------------------------------
    // FIRST SUBSCRIPTION CREATED
    // --------------------------------

    if (event.event === "subscription.create") {
      const email =
        event.data?.customer?.email ||
        event.data?.email;

      const subscriptionCode =
        event.data?.subscription_code;

      const nextPaymentDate =
        event.data?.next_payment_date;

      if (email) {
        const { data: profile } =
          await supabaseAdmin
            .from("profiles")
            .select("id")
            .eq("email", email)
            .single();

        if (profile) {
          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "premium",
              receipt_limit: 999999,
              premium_until:
                nextPaymentDate ||
                new Date(
                  Date.now() +
                    30 * 24 * 60 * 60 * 1000
                ).toISOString(),
              paystack_subscription_code:
                subscriptionCode || null,
            })
            .eq("id", profile.id);
        }
      }
    }

    // --------------------------------
    // MONTHLY PAYMENT SUCCESS
    // --------------------------------

    if (event.event === "charge.success") {
      const email =
        event.data?.customer?.email;

      const reference =
        event.data?.reference;

      const amount =
        Number(event.data?.amount || 0);

      if (email && reference) {
        const { data: profile } =
          await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .eq("email", email)
            .single();

        if (profile) {
          const currentExpiry =
            await supabaseAdmin
              .from("profiles")
              .select("premium_until")
              .eq("id", profile.id)
              .single();

          const existingExpiry =
            currentExpiry.data?.premium_until
              ? new Date(
                  currentExpiry.data.premium_until
                )
              : new Date();

          const now = new Date();

          const baseDate =
            existingExpiry > now
              ? existingExpiry
              : now;

          baseDate.setMonth(
            baseDate.getMonth() + 1
          );

          await supabaseAdmin
            .from("profiles")
            .update({
              plan: "premium",
              receipt_limit: 999999,
              premium_until:
                baseDate.toISOString(),
            })
            .eq("id", profile.id);

          await supabaseAdmin
            .from("payments")
            .upsert(
              {
                user_id: profile.id,
                email: profile.email,
                reference,
                amount,
                plan: "premium",
                status: "success",
              },
              {
                onConflict: "reference",
              }
            );
        }
      }
    }

    // --------------------------------
    // SUBSCRIPTION DISABLED
    // --------------------------------

    if (
      event.event ===
        "subscription.disable" ||
      event.event ===
        "subscription.not_renew"
    ) {
      console.log(
        "Subscription status changed:",
        event.event
      );
    }

    // --------------------------------
    // PAYMENT FAILED
    // --------------------------------

    if (
      event.event ===
      "invoice.payment_failed"
    ) {
      console.log(
        "Premium payment failed."
      );
    }

    return NextResponse.json({
      received: true,
    });

  } catch (error) {
    console.error(
      "Webhook processing error:",
      error
    );

    return NextResponse.json(
      { error: "Webhook error." },
      { status: 500 }
    );
  }
}