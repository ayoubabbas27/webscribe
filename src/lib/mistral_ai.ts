import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

const prompt: string = `
        
`
export const MistralRequest = async (
    mistralModel: string | null,
    MistralRole: "system" | "user" | "assistant" | "tool",
    MistralContent: string
) => {
    return await client.chat.complete({
        model: mistralModel,
        messages: [{
            role: MistralRole,
            content: MistralContent
        }],
    });
}

