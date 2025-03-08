"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Mail, Phone, Apple, List, X } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { useShoppingList } from "@/contexts/shopping-list-context"

export function GroceryList() {
  const { items, toggleItem, removeItem, clearCheckedItems, adjustQuantity } = useShoppingList()
  const { toast } = useToast()
  const [mode, setMode] = useState<"view" | "delete">("view")
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const handleShare = (method: "email" | "text" | "notes") => {
    const itemsList = items.map((item) => `- ${item.quantity}x ${item.name}`).join("\n")

    switch (method) {
      case "email":
        window.location.href = `mailto:?subject=My%20Grocery%20List&body=${encodeURIComponent(itemsList)}`
        break
      case "text":
        window.location.href = `sms:?&body=${encodeURIComponent(itemsList)}`
        break
      case "notes":
        toast({
          description: "List has been added to Apple Notes",
        })
        break
    }
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const deleteSelectedItems = () => {
    selectedItems.forEach((id) => removeItem(id))
    setSelectedItems(new Set())
    setMode("view")
    toast({
      description: "Selected items removed",
    })
  }

  const selectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)))
    }
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl">Grocery List</CardTitle>
        <div className="flex gap-2">
          {mode === "view" ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-14 w-14">
                    <Mail className="h-10 w-10" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleShare("email")} className="text-lg py-4">
                    <Mail className="h-10 w-10 mr-3" />
                    Email List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("text")} className="text-lg py-4">
                    <Phone className="h-10 w-10 mr-3" />
                    Text List
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare("notes")} className="text-lg py-4">
                    <Apple className="h-10 w-10 mr-3" />
                    Add to Apple Notes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="icon" onClick={clearCheckedItems} className="h-14 w-14">
                <Trash2 className="h-10 w-10" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setMode("view")} className="h-14 w-14">
              <X className="h-10 w-10" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(value) => setMode(value as "view" | "delete")} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="view" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              View
            </TabsTrigger>
            <TabsTrigger value="delete" className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Remove Items
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-3">
          {mode === "delete" && items.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <Button variant="outline" onClick={selectAll}>
                {selectedItems.size === items.length ? "Deselect All" : "Select All"}
              </Button>
              <Button
                variant="destructive"
                onClick={deleteSelectedItems}
                disabled={selectedItems.size === 0}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedItems.size})
              </Button>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-2">
              {mode === "view" ? (
                <>
                  <div className="flex-1 flex items-center gap-4">
                    <div className="w-24 flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => adjustQuantity(item.id, -1)}
                        disabled={item.checked}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-gray-500">×{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => adjustQuantity(item.id, 1)}
                        disabled={item.checked}
                      >
                        +
                      </Button>
                    </div>
                    <span className={`flex-1 ${item.checked ? "line-through text-muted-foreground" : ""}`}>
                      {item.name}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Checkbox
                    id={`delete-${item.id}`}
                    checked={selectedItems.has(item.id)}
                    onCheckedChange={() => toggleSelectItem(item.id)}
                  /> 
                  <div className="flex-1 flex items-center gap-4">
                    <span className="w-8 text-center text-gray-500">×{item.quantity}</span>
                    <label htmlFor={`delete-${item.id}`} className="flex-1 cursor-pointer">
                      {item.name}
                    </label>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

