import { create } from "zustand"

type WebScribStore = {
    generatedContent: string
    setGeneratedContent: (content: string) => void
    contentFormat: string
    setContentFormat: (format: string) => void
}

export const useWebScribStore = create<WebScribStore>((set) => ({
    generatedContent: "",
    setGeneratedContent: (content) => set({ generatedContent: content }),
    contentFormat: '.json',
    setContentFormat: (format) => set({ contentFormat: format }),
}))

