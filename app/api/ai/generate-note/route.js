import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { recipient, occasion, tone, prompt } = await req.json();

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const googleKey = process.env.GOOGLE_API_KEY;

    if (!openRouterKey && !googleKey) {
      console.warn("AI API keys are missing. Using fallback.");
      return NextResponse.json({
        text: `Dear ${recipient},\n\nHappy ${occasion}! I hope you have a wonderful day and enjoy this special gift.\n\nWarmly.`,
        success: false,
        error: "API Key missing"
      });
    }

    const aiPrompt = prompt || `Write a ${tone} gift note for ${recipient} on the occasion of ${occasion}. Keep it concise (2-4 sentences) and warm.`;

    // Try OpenRouter first if key exists
    if (openRouterKey && openRouterKey !== "your_openrouter_key_here") {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [{ role: "user", content: aiPrompt }],
            temperature: 0.8,
          }),
          signal: AbortSignal.timeout(8000)
        });

        const data = await response.json();
        if (response.ok && data.choices?.[0]?.message?.content) {
          return NextResponse.json({
            text: data.choices[0].message.content.trim(),
            success: true
          });
        }
      } catch (err) {
        console.error("OpenRouter Error:", err);
      }
    }

    // Try Google Gemini as secondary
    if (googleKey && googleKey !== "your_google_key_here") {
      try {
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(googleKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        const result = await model.generateContent(aiPrompt);
        const text = result.response.text();
        
        if (text) {
          return NextResponse.json({
            text: text.trim(),
            success: true
          });
        }
      } catch (err) {
        console.error("Gemini Error:", err);
      }
    }

    return NextResponse.json({
      text: "",
      success: false,
      error: "All AI providers failed or were not configured"
    });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({
      text: "",
      success: false,
      error: error.message === "signal timed out" ? "AI is taking longer than expected" : error.message
    });
  }
}
