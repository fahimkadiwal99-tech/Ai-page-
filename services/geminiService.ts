import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a professional headshot or edits an image based on input and prompt.
 * Uses gemini-2.5-flash-image.
 */
export const generateHeadshot = async (
  base64Image: string,
  prompt: string,
  blurIntensity: number = 50
): Promise<string> => {
  try {
    // Clean the base64 string if it contains the data URL prefix
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    // Construct blur instruction based on intensity
    let blurInstruction = '';
    if (blurIntensity <= 5) {
        blurInstruction = '3. Keep the background completely sharp and in focus.';
    } else if (blurIntensity < 35) {
        blurInstruction = '3. Apply a subtle background blur (soft focus) to slightly separate the subject.';
    } else if (blurIntensity < 75) {
        blurInstruction = '3. Apply a standard professional portrait background blur (bokeh).';
    } else {
        blurInstruction = '3. Apply a heavy, creamy background blur to isolate the subject completely.';
    }

    // Construct a strong system prompt for the task
    const finalPrompt = `
      You are an expert AI Photo Editor and Headshot Photographer. 
      Task: Edit the input image based on the user's request.
      
      User Instruction: "${prompt}"
      
      Requirements:
      1. Maintain the person's facial features and identity strictly.
      2. Improve lighting to be professional quality if appropriate for the style.
      ${blurInstruction}
      4. Output ONLY the image.
      5. Ensure the result is photorealistic and high resolution.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', 
              data: cleanBase64,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
        // No specific responseMimeType for image models in this context
      }
    });

    // Iterate through parts to find the image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};