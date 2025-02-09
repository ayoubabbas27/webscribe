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
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

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

export function Sidebar() {
    const [file, setFile] = useState<File | null>(null)
    const [outputFormat, setOutputFormat] = useState<string | null>(null)
    const [websiteTree, setWebsiteTree] = useState<TreeNode>(
        {
            id: "1",
            name: "Root",
            description: "",
            children: [],
        }
    )

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile && selectedFile.type === "application/pdf") {
            setFile(selectedFile)
        } else {
            alert("Please select a PDF file")
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
                            <Button size="sm" className="mt-3" onClick={() => setFile(null)}>Remove</Button>
                        </div>
                    )}
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
                        outputFormat == null ||
                        websiteTree.children.length === 0
                    }
                >
                    Generate Content
                </Button>
            </SidebarFooter>
        </SidebarComponent>
    )
}

