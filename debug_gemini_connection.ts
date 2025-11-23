
import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';

async function testGemini() {
  console.log("Starting Gemini Connection Test...");

  // 1. Load API Key
  let apiKey = process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
      try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8');
            console.log("Keys found in .env.local:");
            envContent.split('\n').forEach(line => {
                const [key] = line.split('=');
                if (key) console.log(`- ${key.trim()}`);
            });

            const match = envContent.match(/VITE_GEMINI_API_KEY=(.*)/);
            if (match) {
                apiKey = match[1].trim();
                console.log("Found VITE_GEMINI_API_KEY in .env.local");
            } else {
                // Fallback check for GEMINI_API_KEY or API_KEY
                const matchGemini = envContent.match(/^GEMINI_API_KEY=(.*)/m);
                const matchOld = envContent.match(/^API_KEY=(.*)/m);
                
                if (matchGemini) {
                     console.log("Found GEMINI_API_KEY in .env.local");
                     apiKey = matchGemini[1].trim();
                } else if (matchOld) {
                    console.log("Found API_KEY (old format) in .env.local");
                    apiKey = matchOld[1].trim();
                }
            }
        }
      } catch (e) {
          console.error("Error reading .env.local:", e);
      }
  }

  if (!apiKey) {
    console.error("❌ ERROR: VITE_GEMINI_API_KEY not found in environment or .env.local");
    return;
  }

  // 2. Initialize Client
  console.log("Initializing GoogleGenAI client...");
  const genAI = new GoogleGenAI({ apiKey });

  // 3. List Models
  console.log("Listing available models...");
  try {
      const models = await genAI.models.list();
      console.log("Available Models:");
      // The response structure might vary, let's inspect it
      let modelList: any[] = [];
      // @ts-ignore
      if (Array.isArray(models)) {
          modelList = models;
      // @ts-ignore
      } else if (models && Array.isArray(models.models)) {
          // @ts-ignore
          modelList = models.models;
      }
      
      console.log(`Found ${modelList.length} models in list.`);
      
      modelList.forEach((m: any) => {
          if (m && m.name) {
              console.log(`- ${m.name}`);
          }
      });

  } catch (e) {
      console.error("Failed to list models:", e);
  }

  // 4. Test Generation with Candidates
  const candidates = [
      "gemini-2.5-flash-preview-09-2025",
      "gemini-1.5-flash-8b",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro-002"
  ];

  for (const model of candidates) {
      console.log(`\nTesting generation with model: ${model}`);
      try {
        const result = await genAI.models.generateContent({
          model: model,
          contents: [{ role: "user", parts: [{ text: "Hello" }] }],
        });
        console.log(`✅ Success with ${model}!`);
        console.log(result.text);
        break; // Stop after first success
      } catch (e: any) {
        console.log(`❌ Failed with ${model}: ${e.message}`);
      }
  }
}

testGemini();
