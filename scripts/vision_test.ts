
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is required");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function analyzeImage(url: string) {
  try {
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64Data = buffer.toString("base64");

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/webp", // Assuming webp as per URLs, but gemini handles most
              },
            },
            {
              text: `Analiza esta foto de viaje. Responde SOLO con un objeto JSON (sin bloques de código markdown):
{
  "tipo": "arquitectura|naturaleza|personas|calle|interior|paisaje|agua|comida|otro",
  "elementos": ["lista de 5-8 elementos clave que SE VEN en la foto"],
  "hay_personas_reales": boolean,
  "hay_agua_visible": boolean,
  "es_escultura_o_estatua": boolean,
  "descripcion_corta": "una frase descriptiva de lo que muestra la foto"
}
Solo describe lo que ves. Si algo no está claro, usa null. Sé muy estricto con 'hay_personas_reales' (solo si son humanos vivos, no estatuas) y 'hay_agua_visible'.`,
            },
          ],
        },
      ],
    });

    const text = result.text || "";
    // Limpiar posibles bloques de código markdown si el modelo los incluye
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error(`Error analyzing ${url}:`, error);
    return null;
  }
}

const testUrls = [
  "https://i.postimg.cc/J0Kfnfyz/Danubio_congelado_a.webp", // Danubio
  "https://i.postimg.cc/mrXfbWH3/San_Sebastián_013.webp", // San Sebastián
  "https://i.postimg.cc/GmTbg28z/Oviedo_Santa_María_del_Naranco_004.webp", // Naranco
  "https://i.postimg.cc/mrFNrQcz/Santillana_del_Mar_006.webp", // Santillana
];

async function run() {
  console.log("Iniciando análisis visual...");
  for (const url of testUrls) {
    console.log(`Analizando: ${url}`);
    const data = await analyzeImage(url);
    console.log(JSON.stringify(data, null, 2));
    console.log("---");
  }
}

run();
