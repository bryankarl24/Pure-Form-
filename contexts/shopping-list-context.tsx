"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ShoppingItem {
  id: string
  name: string
  quantity: string
  checked: boolean
  category?: string
}

interface Recipe {
  id: string
  title: string
  ingredients: string[]
  timestamp: Date
  source: string
}

interface ShoppingListContextType {
  items: ShoppingItem[]
  recipes: Recipe[]
  addedRecipes: Set<string>
  addItem: (name: string, quantity?: string, category?: string) => void
  removeItem: (id: string) => void
  toggleItem: (id: string) => void
  clearCheckedItems: () => void
  adjustQuantity: (itemId: string, adjustment: number) => void
  editItem: (id: string, name: string, quantity: string) => void
  toggleRecipeInList: (recipe: Recipe) => void
  removeRecipe: (recipeId: string) => void
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined)

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("shoppingList")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedRecipes")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [addedRecipes, setAddedRecipes] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("addedRecipes")
      return new Set(saved ? JSON.parse(saved) : [])
    }
    return new Set()
  })

  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items))
  }, [items])

  useEffect(() => {
    localStorage.setItem("savedRecipes", JSON.stringify(recipes))
  }, [recipes])

  useEffect(() => {
    localStorage.setItem("addedRecipes", JSON.stringify(Array.from(addedRecipes)))
  }, [addedRecipes])

  const addItem = (name: string, quantity = "1", category?: string) => {
    if (name.trim()) {
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        quantity,
        checked: false,
        category,
      }
      setItems((prev) => [newItem, ...prev])
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, checked: !item.checked }
        }
        return item
      }),
    )
  }

  const clearCheckedItems = () => {
    setItems((prev) => prev.filter((item) => !item.checked))
  }

  const adjustQuantity = (itemId: string, adjustment: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, Number.parseInt(item.quantity) + adjustment)
          return { ...item, quantity: newQuantity.toString() }
        }
        return item
      }),
    )
  }

  const editItem = (id: string, name: string, quantity: string) => {
    if (name.trim()) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: name.trim(), quantity: quantity || "1" } : item)),
      )
    }
  }

  const toggleRecipeInList = (recipe: Recipe) => {
    if (addedRecipes.has(recipe.id)) {
      // Remove recipe
      setAddedRecipes((prev) => {
        const next = new Set(prev)
        next.delete(recipe.id)
        return next
      })
      setItems((prev) => prev.filter((item) => item.category !== `Recipe: ${recipe.title}`))
    } else {
      // Add recipe
      setAddedRecipes((prev) => new Set(prev).add(recipe.id))
      const newItems = recipe.ingredients.map((ingredient) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: ingredient,
        quantity: "1",
        checked: false,
        category: `Recipe: ${recipe.title}`,
      }))
      setItems((prev) => [...newItems, ...prev])
    }
  }

  const removeRecipe = (recipeId: string) => {
    setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
    // Also remove any items associated with this recipe
    const recipe = recipes.find((r) => r.id === recipeId)
    if (recipe) {
      setItems((prev) => prev.filter((item) => item.category !== `Recipe: ${recipe.title}`))
    }
  }

  return (
    <ShoppingListContext.Provider
      value={{
        items,
        recipes,
        addedRecipes,
        addItem,
        removeItem,
        toggleItem,
        clearCheckedItems,
        adjustQuantity,
        editItem,
        toggleRecipeInList,
        removeRecipe,
      }}
    >
      {children}
    </ShoppingListContext.Provider>
  )
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext)
  if (context === undefined) {
    throw new Error("useShoppingList must be used within a ShoppingListProvider")
  }
  return context
}

