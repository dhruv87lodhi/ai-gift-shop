import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, currency = "INR", receipt } = await request.json();

    // Create order via Razorpay Orders API
    const auth = Buffer.from(
      `rzp_test_SiDxFKWZ89b1iB:aUSAH2NjxYMJo1bobzchRbkT`
    ).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: Math.round(amount * 100), // Convert to paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Razorpay order error:", errorData);
      return NextResponse.json(
        { error: "Failed to create order", details: errorData },
        { status: 500 }
      );
    }

    const order = await response.json();
    return NextResponse.json(order);
  } catch (error) {
    console.error("Razorpay API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
