import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Allow large image payloads for the photo translation feature
app.use(express.json({ limit: "15mb" }));

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper: Ensure API key is configured
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "GEMINI_API_KEY is not configured in the application environment.",
      hasKey: false,
    });
  }
  next();
};

// API: Check system status
app.get("/api/status", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// API 1: Medical Translation & Advice
app.post("/api/translate/medical", checkApiKey, async (req, res) => {
  const { symptom, customDetails, targetLang } = req.body;

  if (!symptom || !targetLang) {
    return res.status(400).json({ error: "Symptom and target language are required" });
  }

  try {
    const prompt = `User symptom: "${symptom}".
Custom details: "${customDetails || "None"}".
Target Local Language: "${targetLang}".

You are an AI medical emergency assistant for travelers. Translate this situation into a highly clear, urgent, yet polite emergency help request in ${targetLang} that the user can show to a passerby, doctor, or paramedic.
Generate a structured JSON response containing:
1. translatedHelp: The direct, large-font emergency message in ${targetLang} (e.g. "I am having chest pain, please call an ambulance!"). It must be extremely concise and direct so people can read it in 2 seconds.
2. pronunciation: A helper reading or pronunciation phonetic approximation if the traveler wants to say it (e.g., using English/Pinyin/easy phonetic sounds to approximate the local language).
3. explanation: What the generated message means exactly in Chinese so the traveler is assured.
4. emergencyTip: A short, practical advice in Chinese of what the traveler should do right now (e.g., "Sit down immediately", "Do not drink water", "Keep warm").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedHelp: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            explanation: { type: Type.STRING },
            emergencyTip: { type: Type.STRING },
          },
          required: ["translatedHelp", "pronunciation", "explanation", "emergencyTip"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Medical Translation Error:", error);
    res.status(500).json({ error: error.message || "Failed to process medical help" });
  }
});

// API 2: Lost Help
app.post("/api/translate/lost", checkApiKey, async (req, res) => {
  const { helpType, destination, currentLoc, targetLang, contactInfo } = req.body;

  if (!helpType || !targetLang) {
    return res.status(400).json({ error: "Help type and target language are required" });
  }

  try {
    const prompt = `Lost traveler scenario:
Help type: "${helpType}" (e.g. "Ask taxi driver to take me to hotel", "Ask passerby for directions", "Help call a taxi", "Help contact family").
Target/Destination Info: "${destination || "Not specified"}"
Current Location: "${currentLoc || "Not specified"}"
Target Local Language: "${targetLang}"
Emergency Contact: "${contactInfo || "None"}"

Generate a translation card in the local language (${targetLang}) for the traveler. Keep it simple, clear, and extremely legible for elderly-friendly layouts.
Generate structured JSON:
1. translatedHelp: The direct text in ${targetLang} to show a local person or taxi driver (e.g., "Hello, I am lost. Could you please call a taxi for me to go to this hotel: ...?").
2. explanation: The exact Chinese translation of the above text.
3. mapPrompt: A simple follow-up sentence in ${targetLang} to ask them to point on a map (e.g., "Could you please show me on the map?").`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            translatedHelp: { type: Type.STRING },
            explanation: { type: Type.STRING },
            mapPrompt: { type: Type.STRING },
          },
          required: ["translatedHelp", "explanation", "mapPrompt"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini API");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Lost Translation Error:", error);
    res.status(500).json({ error: error.message || "Failed to process lost translation" });
  }
});

// API 3: Family Contact Help
app.post("/api/translate/family", checkApiKey, async (req, res) => {
  const { situation, familyLang, localLang, contactPhone } = req.body;

  if (!situation || !familyLang || !localLang) {
    return res.status(400).json({ error: "Situation, family language and local language are required" });
  }

  try {
    const prompt = `Traveler situation: "${situation}"
Family language: "${familyLang}" (e.g. Chinese)
Local language: "${localLang}" (e.g. Japanese)
Contact info to display: "${contactPhone || "None"}"

We need to generate a text message that the traveler can send to their family. Since they might be abroad, we need two versions:
1. A message in their family's language (${familyLang}) telling them they are safe/what happened.
2. A message in the local language (${localLang}) so if they find a local helper or paramedic, they can show it to them, or have the helper send it.

Generate structured JSON:
1. familyVersion: A warm, clear, and reassuring message in ${familyLang} summarizing the situation. (e.g., "爸/妈/家人，我现在在国外遇到点小状况，不过已经找到人帮忙了，别担心。这是我的大致位置...")
2. localVersion: A message in ${localLang} for local helpers to understand who to contact and what to say (e.g., "Hello, I am helping this visitor. Their family's number is... please message them.").
3. suggestions: A brief advice in Chinese of what messaging platforms are best used in that local region (e.g., Line in Japan, KakaoTalk in Korea, WhatsApp in Europe).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            familyVersion: { type: Type.STRING },
            localVersion: { type: Type.STRING },
            suggestions: { type: Type.STRING },
          },
          required: ["familyVersion", "localVersion", "suggestions"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Family Translation Error:", error);
    res.status(500).json({ error: error.message || "Failed to process family contact translation" });
  }
});

// API 4: Photo Translation
app.post("/api/translate/photo", checkApiKey, async (req, res) => {
  const { imageBase64, targetLang } = req.body;

  if (!imageBase64 || !targetLang) {
    return res.status(400).json({ error: "Image data and target language are required" });
  }

  try {
    // Standard clean base64 data
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const mimeType = imageBase64.match(/^data:(image\/\w+);base64,/)?.[1] || "image/jpeg";

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Analyze this image containing foreign text (like medicine labels, road signs, warnings, menus, or bills).
The target language of translation is Chinese (and reference language ${targetLang}).
Produce a structured JSON with:
1. detectedTitle: A short title of what this is (e.g., "Amoxicillin Medicine Box", "No Entry Road Sign").
2. meaning: "这是什么意思" - Clear explanation in Chinese of what the text says and its core translation.
3. action: "我该怎么做" - Actionable, simple, safety-conscious advice in Chinese for an elderly traveler. (e.g., "Do not enter this area", "Take 1 pill twice a day after meals, check if you are allergic to penicillin").`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedTitle: { type: Type.STRING },
            meaning: { type: Type.STRING },
            action: { type: Type.STRING },
          },
          required: ["detectedTitle", "meaning", "action"],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No response from Gemini Vision API");
    }

    res.json(JSON.parse(resultText.trim()));
  } catch (error: any) {
    console.error("Photo Translation Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze photo" });
  }
});

// Setup Vite or static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
