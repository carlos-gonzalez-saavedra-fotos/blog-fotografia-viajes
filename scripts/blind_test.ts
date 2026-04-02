
import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

// El API Key se inyecta automáticamente en el entorno como GEMINI_API_KEY
// Pero en shell_exec a veces no está, así que intentaremos usarla si existe
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is required in environment");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function verifyVision(url: string) {
  try {
    console.log(`Descargando imagen para análisis real: ${url}`);
    const response = await fetch(url);
    const buffer = await response.buffer();
    const base64Data = buffer.toString("base64");

    console.log("Enviando a Gemini para descripción ciega...");
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/webp",
              },
            },
            {
              text: `PRUEBA CIEGA DE VISIÓN. No uses el nombre de la URL para adivinar. 
              Mira la imagen y responde con precisión extrema:
              1. ¿Qué color de ropa lleva la persona que camina más cerca de la cámara en el paseo?
              2. ¿Hay algún objeto de color ROJO brillante destacado en la escena? (ej: una sombrilla, una boya, una señal).
              3. Describe el estado del cielo (despejado, nubes, lluvia).
              4. ¿Se ven barcos en el agua? ¿Cuántos aproximadamente?
              Responde en una frase corta para cada punto.`,
            },
          ],
        },
      ],
    });

    console.log("--- RESULTADO DE LA IA (VISIÓN REAL) ---");
    console.log(result.text);
    console.log("-----------------------------------------");
  } catch (error) {
    console.error("Error en la prueba de visión:", error);
  }
}

// Imagen de San Sebastián (Bahía de la Concha)
const sanSebastianUrl = "https://i.postimg.cc/mrXfbWH3/San_Sebastián_013.webp";

verifyVision(sanSebastianUrl);
