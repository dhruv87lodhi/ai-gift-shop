const { GoogleGenerativeAI } = require('@google/generative-ai');

const GOOGLE_API_KEY = "AIzaSyATZNFE2RpnAj8Yn9HMSfn1EfNZx_PBI-s";

async function testAI() {
  console.log("--- STARTING AI VARIATION TEST ---");
  
  const scenarios = [
    { recipient: "Mom", occasion: "Birthday", tone: "Heartfelt" },
    { recipient: "Best Friend", occasion: "Wedding", tone: "Witty" }
  ];

  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    for (const scenario of scenarios) {
      console.log(`\nScenario: To ${scenario.recipient} for ${scenario.occasion} (${scenario.tone} tone)`);
      console.log("Generating 3 variations to verify diversity...");
      
      for (let i = 1; i <= 3; i++) {
        const prompt = `Write a ${scenario.tone} gift note for ${scenario.recipient} on the occasion of ${scenario.occasion}. Keep it concise (2-4 sentences) and warm. Variation #${i}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        console.log(`Variation ${i}: "${text.trim().substring(0, 120)}..."`);
      }
    }
  } catch (err) {
    console.error("Test Failed:", err.message);
  }
  
  console.log("\n--- TEST COMPLETE ---");
}

testAI();
