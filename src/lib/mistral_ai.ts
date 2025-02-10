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
Based on the Extracted PDF Content, generate detailed, structured content strictly adhering to the sections of the Website Hierarchy. Ensure the content aligns with the descriptions and purpose of each section. 

#### Instructions:
- The output **MUST ONLY** be a valid **${outputFormat}** file.
- Do not include explanations, comments, or additional information outside the required code.
- Write the content in **${language}** for easy developer integration.
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