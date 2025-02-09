"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sidebar as SidebarComponent, SidebarContent, SidebarHeader, SidebarSeparator, SidebarFooter } from "@/components/ui/sidebar"
import { TreeView } from "@/components/custom/tree-view"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from "axios"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"

GlobalWorkerOptions.workerSrc = "/pdf.worker.mjs"

type TreeNode = {
    id: string
    name: string
    description: string
    children: TreeNode[]
}

const outputFormats = [
    'JSON',
    'JavaScript',
    'TypeScript'
]

const languages = [
    'Francais',
    'English'
]

export function Sidebar() {
    const [file, setFile] = useState<File | null>(null)
    const [fileContent, setFileContent] = useState<{ page: number; text: string; }[] | null>(null)
    const [language, setLanguage] = useState<string | null>(null)
    const [outputFormat, setOutputFormat] = useState<string | null>(null)
    const [websiteTree, setWebsiteTree] = useState<TreeNode>(
        {
            id: "1",
            name: "Root",
            description: "",
            children: [],
        }
    )

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile);

            const fileReader = new FileReader();
            fileReader.onload = async () => {
                const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
                const pdf = await getDocument(typedArray).promise;

                let structuredTextContent: { page: number; text: string }[] = [];

                // Extract text by page and structure it
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContentObj = await page.getTextContent();

                    let pageText = "";
                    textContentObj.items.forEach((item: any) => {
                        pageText += item.str + " ";
                    });

                    // Add the page content to the structured result
                    structuredTextContent.push({
                        page: i,
                        text: pageText.trim(),
                    });
                }

                // Store the structured content
                setFileContent(structuredTextContent);

                // Optionally, log the structured content for debugging
                console.log("Extracted PDF Content by Page:", structuredTextContent);
            };

            fileReader.readAsArrayBuffer(selectedFile);
        } else {
            alert("Please select a PDF file");
        }
    };


    const generateContent = async () => {
        const payload = { fileContent, outputFormat, websiteTree, languages }
        try {
            const response = await axios.post('/api/mistral_ai', payload);
            console.log(response.data)
        } catch (error) {
            console.error("generateContent(): ERROR => ", error)
        }
    }

    return (
        <SidebarComponent>
            <SidebarHeader className="p-3">
                <h2 className="text-lg font-semibold">WebScrib</h2>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent className="p-3 space-y-4">
                {/* File Upload */}
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="pdf-upload">Upload PDF</Label>
                        <Input id="pdf-upload" type="file" accept=".pdf" onChange={handleFileChange} />
                    </div>
                    {file && (
                        <div className="text-sm">
                            <p>Selected file: {file.name}</p>
                            <Button size="sm" className="mt-3" onClick={() => { setFile(null); setFileContent(null) }}>Remove</Button>
                        </div>
                    )}
                </div>

                {/* Output Luanguage */}
                <div className="space-y-4">
                    <Label>Select the content's language</Label>
                    <Select onValueChange={(value) => setLanguage(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {languages.map((item, index) => (
                                    <SelectItem key={index} value={item}>{item}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Output Format */}
                <div className="space-y-4">
                    <Label>Select output format</Label>
                    <Select onValueChange={(value) => setOutputFormat(value)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {outputFormats.map((item, index) => (
                                    <SelectItem key={index} value={item}>{item}</SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Website structure */}
                <div className="space-y-4 flex-1">
                    <Label>Define Website Structure</Label>
                    <div>
                        <TreeView
                            data={websiteTree}
                            onUpdate={setWebsiteTree}
                        />
                    </div>
                </div>
            </SidebarContent>
            <SidebarFooter>
                <Button
                    className="w-full"
                    disabled={
                        file == null ||
                        fileContent === null ||
                        language === null ||

                        outputFormat == null ||
                        websiteTree.children.length === 0
                    }
                    onClick={generateContent}
                >
                    Generate Content
                </Button>
            </SidebarFooter>
        </SidebarComponent>
    )
}

