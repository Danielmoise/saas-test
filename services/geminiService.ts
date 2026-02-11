
import { GoogleGenAI, Type } from "@google/genai";
import { Language, LandingPageContent, Review } from "../types";

const LOCALIZED_NAMES: Record<string, string[]> = {
  it: ["Marco", "Giulia", "Luca", "Francesca", "Alessandro", "Elena", "Roberto", "Sara", "Paolo", "Chiara", "Matteo", "Alice", "Davide", "Valentina", "Simone", "Federica"],
  en: ["John", "Emma", "Michael", "Sophia", "William", "Olivia", "James", "Ava", "Robert", "Isabella", "David", "Mia", "Richard", "Charlotte", "Joseph", "Amelia"],
  es: ["Carlos", "Maria", "Juan", "Elena", "Diego", "Carmen", "Javier", "Lucia", "Manuel", "Sofia", "Alejandro", "Paula", "Miguel", "Isabel", "Jose", "Daniela"],
  fr: ["Jean", "Marie", "Pierre", "Sophie", "Lucas", "Julie", "Thomas", "Emma", "Nicolas", "Léa", "Antoine", "Chloé", "Benoît", "Manon", "Hugo", "Camille"]
};

const CURRENCY_MAP: Record<string, string> = {
  [Language.ITALIAN]: "€",
  [Language.ENGLISH_UK]: "£",
  [Language.ENGLISH_US]: "$",
  [Language.FRENCH]: "€",
  [Language.SPANISH]: "€",
  [Language.GREEK]: "€",
  [Language.POLISH]: "zł",
  [Language.ENGLISH]: "$"
};

export const generateLandingContent = async (
  params: {
    productName: string,
    description: string,
    niche: string,
    target: string,
    tone: string,
    language: Language,
    featureCount: number,
    textDensity: 'short' | 'medium' | 'long',
    reviewCount: number
  }
): Promise<Record<string, LandingPageContent>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const densityInstructions = {
    short: "Usa frasi brevissime, elenchi puntati e uno stile 'punchy' e diretto.",
    medium: "Usa paragrafi di media lunghezza (2-3 frasi) bilanciando benefici e caratteristiche.",
    long: "Usa paragrafi ampi e descrittivi, ricchi di storytelling e dettagli tecnici."
  };

  const currencySymbol = CURRENCY_MAP[params.language] || "€";
  const aiReviewTarget = Math.min(params.reviewCount, 15);

  const prompt = `
    Sei un esperto Copywriter e Marketing Specialist. Genera contenuti per una landing page ad alta conversione.
    PRODOTTO: "${params.productName}"
    DESCRIZIONE: "${params.description}"
    TONO: "${params.tone}"
    LINGUA: "${params.language}"
    VALUTA RICHIESTA: "${currencySymbol}"
    
    REQUISITI MANDATORI:
    1. Genera ESATTAMENTE ${params.featureCount} elementi nell'array "features". Ogni elemento deve seguire lo schema "Titolo: Testo descrittivo".
    2. IMPORTANTE: Integra argomentazioni basate su experiences reali e feedback entusiasti dei clienti direttamente all'interno delle descrizioni dei benefici (features). Non creare una sezione titoli per i video.
    3. Genera un array "sellingPoints" di 4-5 punti di forza brevissimi (massimo 5-6 parole ciascuno).
    4. Lo stile deve essere: ${densityInstructions[params.textDensity]}
    5. Usa SEMPRE il simbolo della valuta "${currencySymbol}" nei campi "price" e "oldPrice".
    6. Genera ${aiReviewTarget} recensioni realistiche.
    7. Genera un "socialProofName" e un "socialProofCount".

    Restituisci ESCLUSIVAMENTE un JSON valido.
  `;

  const response = await ai.models.generateContent({
    model: model,
    // Using string prompt directly as it is the most robust method for single-turn text generation.
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          content: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              ctaText: { type: Type.STRING },
              urgencyText: { type: Type.STRING },
              price: { type: Type.STRING },
              oldPrice: { type: Type.STRING },
              discountLabel: { type: Type.STRING },
              guaranteeText: { type: Type.STRING },
              socialProofName: { type: Type.STRING },
              socialProofCount: { type: Type.NUMBER },
              features: { type: Type.ARRAY, items: { type: Type.STRING } },
              sellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
              reviews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    author: { type: Type.STRING },
                    rating: { type: Type.NUMBER },
                    comment: { type: Type.STRING },
                    date: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["title", "ctaText", "features", "sellingPoints", "reviews", "socialProofName", "socialProofCount", "price", "oldPrice"]
          }
        }
      }
    }
  });

  const rawText = response.text;
  if (!rawText) throw new Error("Risposta AI vuota");
  
  const json = JSON.parse(rawText);
  let finalReviews: Review[] = json.content.reviews || [];

  if (params.reviewCount > finalReviews.length) {
    const remaining = params.reviewCount - finalReviews.length;
    const names = LOCALIZED_NAMES[params.language] || LOCALIZED_NAMES.it;
    
    for (let i = 0; i < remaining; i++) {
      const name = names[Math.floor(Math.random() * names.length)];
      finalReviews.push({
        id: `bulk-${i}-${Date.now()}`,
        author: `${name} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}.`,
        rating: Math.random() > 0.1 ? 5 : 4,
        comment: "",
        date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toLocaleDateString(params.language)
      });
    }
  }

  json.content.reviews = finalReviews;
  return { [params.language]: json.content };
};

export const generateProductImagesFromReference = async (
  productName: string,
  baseImage: string,
  style: 'human' | 'tech' | 'info',
  count: number = 1
): Promise<string[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-2.5-flash-image';

  const stylePrompts = {
    human: "Lifestyle product photography with people in the background, warm natural lighting, authentic environment.",
    tech: "Studio macro photography, cinematic lighting, dark background, extreme focus on product textures and build quality.",
    info: "Clean marketing visual, white background, product centered, professional product graphics style."
  };

  const prompt = `Generate ${count} variations of the product "${productName}" in ${style} style. ${stylePrompts[style]}. Keep the core product appearance consistent with the reference image.`;

  const parts: any[] = [{ text: prompt }];
  if (baseImage.startsWith('data:')) {
    const [mimeInfo, base64Data] = baseImage.split(',');
    const mimeType = mimeInfo.match(/:(.*?);/)?.[1] || 'image/jpeg';
    parts.push({ inlineData: { data: base64Data, mimeType: mimeType } });
  } else if (baseImage) {
    parts.push({ text: `Reference image URL: ${baseImage}` });
  }

  const response = await ai.models.generateContent({
    model: model,
    // Using object with parts array for complex multimodal input.
    contents: { parts }
  });

  const images: string[] = [];
  const candidate = response.candidates?.[0];
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    }
  }
  return images;
};
