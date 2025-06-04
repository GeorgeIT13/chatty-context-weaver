
interface OpenAIMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function sendToOpenAI(
  messages: OpenAIMessage[],
  systemPrompt: string,
  apiKey: string,
  model: string = "gpt-4o-mini"
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Failed to call OpenAI API");
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response received";
}
