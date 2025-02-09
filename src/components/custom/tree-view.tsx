"use client"

import { useState } from "react"
import { ChevronRight, ChevronDown, MoreVertical, PanelTop, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type TreeNode = {
  id: string
  name: string
  description: string
  children: TreeNode[]
}

type TreeViewProps = {
  data: TreeNode // Root
  onUpdate: (newData: TreeNode) => void
}

export function TreeView({ data, onUpdate }: TreeViewProps) {
  const [editingNode, setEditingNode] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const addNode = (parentId: string) => {
    const newNode: TreeNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: "New Node",
      description: "",
      children: [],
    }

    const updateTree = (node: TreeNode): TreeNode => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, newNode] }
      }
      return { ...node, children: node.children.map(updateTree) }
    }

    const newData = updateTree(data)
    onUpdate(newData)
    setExpanded((prev) => ({ ...prev, [parentId]: true }))
  }

  const removeNode = (id: string) => {

    if (id === editingNode) {
      setEditingNode(null)
      setExpanded((prev) => ({ ...prev, [id]: false }))
    }

    const updateTree = (node: TreeNode): TreeNode => {
      return {
        ...node,
        children: node.children.filter((child) => child.id !== id).map(updateTree),
      }
    }

    const newData = updateTree(data)
    onUpdate(newData)
  }

  const updateNode = (id: string, updates: Partial<TreeNode>) => {
    const updateTree = (node: TreeNode): TreeNode => {
      if (node.id === id) {
        return { ...node, ...updates }
      }
      return { ...node, children: node.children.map(updateTree) }
    }

    const newData = updateTree(data)
    onUpdate(newData)
  }

  const renderNode = (node: TreeNode, level = 0) => {
    const isEditing = editingNode === node.id
    const isLeaf = node.children.length === 0
    const isRoot = level === 0

    return (
      <div key={node.id} style={{ marginLeft: `${level * 10}px` }} className="mb-2 text-sm">
        <div className="flex items-center space-x-2 w-full">
          <div className="flex items-center space-x-2 flex-grow">
            {isLeaf && !isRoot ? (
              <Button
                variant="ghost"
                size="icon"
                className="w-[18px] h-[18px]"
                onClick={() => setExpanded((prev) => ({ ...prev, [node.id]: !prev[node.id] }))}
              >
                {expanded[node.id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </Button>
            ) : (
              <PanelTop size={16} />
            )}

            {isEditing && !isRoot ? (
              <Input
                value={node.name}
                onChange={(e) => updateNode(node.id, { name: e.target.value })}
                onBlur={() => setEditingNode(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingNode(null)
                  }
                }}
                className="h-8 flex-grow"
                autoFocus
              />
            ) : (
              <span className="font-medium flex-grow truncate">{node.name}</span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="w-6 h-6">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {isRoot ? (
                <DropdownMenuItem onSelect={() => addNode(node.id)}>Add Child</DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onSelect={() => addNode(node.id)}>Add Child</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setEditingNode(node.id)}>Edit Name</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => removeNode(node.id)}>Delete</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {!isRoot && isLeaf && expanded[node.id] && (
          <div className="mt-2">
            <Textarea
              value={node.description}
              onChange={(e) => updateNode(node.id, { description: e.target.value })}
              placeholder="Add description..."
              className="w-full text-sm"
              rows={2}
            />
          </div>
        )}
        {node.children.map((child) => renderNode(child, level + 1))}
      </div>
    )
  }


  return <div>{renderNode(data)}</div>
}

