export const generateTextGemini = async ({
  apiKey,
  prompt,
}: {
  apiKey: string;
  prompt: string;
}) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        systemInstruction: {
          role: "user",
          parts: [
            {
              text: "You will genearate a response to the following prompt",
            },
          ],
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
          responseMimeType: "text/plain",
        },
      }),
    }
  );

  const responseJson = await response.json();

  if (!response.ok) {
    throw new Error(responseJson.error.message);
  }

  const text = responseJson?.candidates[0]?.content?.parts[0]?.text;

  if (!text) {
    throw new Error("No text generated");
  }

  return text as string;
};
