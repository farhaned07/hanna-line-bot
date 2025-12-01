const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ No API Key provided");
        process.exit(1);
    }

    console.log("🤖 Testing Gemini API Key...");
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        console.log("👉 Trying model: gemini-2.0-flash");
        const prompt = "Hello! Are you working?";
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Gemini Response:", text);
    } catch (error) {
        console.error("❌ Gemini Test Failed:", error.message);
        process.exit(1);
    }
}

testGemini();
