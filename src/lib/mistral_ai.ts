import { Mistral } from '@mistralai/mistralai';
import { Page, TreeNode } from '@/lib/types';

const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({ apiKey: apiKey });

const genPrompt = (data: { fileContent: Page[], language: string, outputFormat: string, websiteTree: TreeNode }): string => {
    const { fileContent, language, outputFormat, websiteTree } = data;

    const formattedPages: string = fileContent.map(item => `Page ${item.page}:\n${item.text}`).join('\n');

    const formatTree = (node: TreeNode, depth: number = 0) => {
        const indent: string = ' '.repeat(depth);
        const nodeInfo: string = `${indent}- ${node.name}: ${node.description}`
        const childrenInfo: string = node.children.map(child => formatTree(child, depth + 1)).join('\n');
        return `${nodeInfo}\n${childrenInfo}`;
    }

    const formattedTree: string = formatTree(websiteTree)

    return `
  ### Extracted PDF Content:
${formattedPages}

---
### Website Hierarchy:
${formattedTree}

---
### Task:
Based on the content provided in the Extracted PDF Content, generate detailed and well-structured content for each section of the Website Structure. Ensure the content aligns with the descriptions and purpose of each section. The output should be formatted as a **${outputFormat}** file, containing content in a format that developers can easily integrate into their project. Use the language specified (${language}) and ensure the content is informative, concise, and relevant.
`;
}

export const MistralRequest = async (
    mistralModel: string | null,
    MistralRole: "system" | "user" | "assistant" | "tool",
    data: { fileContent: Page[], language: string, outputFormat: string, websiteTree: TreeNode }
) => {
    const prompt: string = genPrompt(data)
    return await client.chat.complete({
        model: mistralModel,
        messages: [{
            role: MistralRole,
            content: prompt
        }],
    });
}