export type TreeNode = {
    id: string
    name: string
    description: string
    children: TreeNode[]
}

export type Page = {
    page: number
    text: string
}