"use client"

import { useEffect, useState } from "react"
import { useWebScribStore } from "@/hooks/use-webscrib-store"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"

export default function Home() {
  const { generatedContent, contentFormat } = useWebScribStore()
  const [fileName, setFileName] = useState("generated-content")

  useEffect(() => {
    setFileName(`generated-content-${Date.now()}`)
  }, [contentFormat])
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent)
  }

  const downloadFile = () => {
    const blob = new Blob([generatedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fileName}${contentFormat}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto w-2/3 bg-white dark:bg-gray-800 rounded-lg shadow border">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-4 sm:flex sm:items-center sm:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100 sm:truncate">{fileName}</h1>
        </div>
        <div className="mt-4 flex sm:mt-0 sm:ml-4">
          <Button variant="outline" size="icon" className="ml-2" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="ml-2" onClick={downloadFile}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <SyntaxHighlighter
          language={contentFormat}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: "0.375rem",
            maxHeight: "calc(100vh - 200px)",
          }}
        >
          {generatedContent || "// Generated content will appear here"}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

