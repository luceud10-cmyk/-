
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AlternativeProduct } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING, description: "اسم المنتج باللغة العربية" },
    analysisConfidence: {
      type: Type.OBJECT,
      properties: {
        productIdentification: { type: Type.STRING },
        ocrAccuracy: { type: Type.STRING },
        dataSource: { type: Type.STRING }
      },
      required: ["productIdentification", "ocrAccuracy", "dataSource"]
    },
    overallScore: { type: Type.INTEGER },
    verdict: { type: Type.STRING, description: "التقييم النهائي: ممتاز، جيد، إلخ" },
    summary: { type: Type.STRING },
    negatives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING },
          value: { type: Type.STRING },
          severity: { type: Type.STRING },
          penalty: { type: Type.INTEGER },
          description: { type: Type.STRING }
        },
        required: ["component", "value", "severity", "penalty", "description"]
      }
    },
    positives: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING },
          value: { type: Type.STRING },
          severity: { type: Type.STRING },
          bonus: { type: Type.INTEGER },
          description: { type: Type.STRING }
        },
        required: ["component", "value", "severity", "bonus", "description"]
      }
    },
    questionable: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING },
          value: { type: Type.STRING },
          severity: { type: Type.STRING },
          penalty: { type: Type.INTEGER },
          description: { type: Type.STRING }
        },
        required: ["component", "value", "severity", "penalty", "description"]
      }
    }
  },
  required: ["productName", "analysisConfidence", "overallScore", "verdict", "summary", "negatives", "positives", "questionable"]
};

export async function analyzeProductImage(base64Image: string): Promise<AnalysisResult> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    قم بتحليل صورة هذا المنتج بعناية. 
    1. تعرف على المنتج ومكوناته المذكورة في الملصق.
    2. ابحث في قاعدة بياناتك (وإن لزم الأمر استخدم البحث عبر الإنترنت) لتقييم مدى صحة هذه المكونات.
    3. قدم تقريراً مفصلاً باللغة العربية يتبع الهيكل المحدد.
    4. تأكد من تقييم السلبيات (السكريات العالية، الدهون المتحولة، المواد الحافظة الضارة) والإيجابيات (الفيتامينات، المكونات الطبيعية، قلة المعالجة) والمكونات المشكوك فيها (E-numbers الغامضة أو المكونات التي قد تخفي الصوديوم/السكر).
    
    يجب أن يكون الرد بصيغة JSON حصراً.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { mimeType: "image/jpeg", data: base64Image.split(',')[1] } },
        { text: prompt }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
      tools: [{ googleSearch: {} }]
    }
  });

  try {
    const text = response.text;
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("حدث خطأ في معالجة البيانات من الذكاء الاصطناعي.");
  }
}

export async function getHealthierAlternatives(productName: string, badIngredients: string[]): Promise<AlternativeProduct[]> {
  const model = "gemini-3-flash-preview";
  const prompt = `
    بناءً على منتج "${productName}" الذي يحتوي على مكونات غير مرغوب فيها مثل (${badIngredients.join(', ')}).
    ابحث باستخدام Google Search عن 3 بدائل صحية مشابهة وموجودة فعلياً في السوق.
    يجب أن تكون البدائل أفضل من حيث المكونات والصحة.
    قدم النتيجة كقائمة JSON تحتوي على:
    - 'name': اسم المنتج البديل
    - 'reason': شرح بسيط جداً لماذا هو أفضل
    - 'sourceUrl': رابط لمعلومات عن المنتج أو تقييم صحي له.
    اللغة: العربية.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            reason: { type: Type.STRING },
            sourceUrl: { type: Type.STRING }
          },
          required: ["name", "reason", "sourceUrl"]
        }
      },
      tools: [{ googleSearch: {} }]
    }
  });

  try {
    return JSON.parse(response.text) as AlternativeProduct[];
  } catch (error) {
    console.error("Failed to fetch alternatives:", error);
    return [];
  }
}
