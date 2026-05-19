import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { CALEB_PERSONA } from "@/lib/ai/caleb-persona";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = await streamText({
        model: openai("gpt-4-turbo"),
        system: CALEB_PERSONA.systemPrompt,
        messages,
    });

    return result.toTextStreamResponse();
}
