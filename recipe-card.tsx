"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RecipeCardProps {
  title: string
  ingredients: string[]
  instructions: string
  nutrition: {
    calories: number
    protein: string
    carbs: string
    fat: string
  }
}

export function RecipeCard({ title, ingredients, instructions, nutrition }: RecipeCardProps) {
  const { toast } = useToast()
  const [showIngredientModal, setShowIngredientModal] = useState(false)
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(ingredients)
  const [newIngredient, setNewIngredient] = useState("")

  const handleAddToGroceryList = () => {
    setSelectedIngredients(ingredients)
    setShowIngredientModal(true)
  }

  const handleConfirm = () => {
    setShowIngredientModal(false)
    toast({
      duration: 2000,
      className: "bg-green-500 border-green-600",
      description: (
        <div className="flex items-center text-white gap-3 text-lg">
          <Check className="h-10 w-10" />
          <span>Added to grocery list</span>
        </div>
      ),
    })
  }

  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredient) ? prev.filter((i) => i !== ingredient) : [...prev, ingredient],
    )
  }

  const addNewIngredient = () => {
    if (newIngredient.trim()) {
      setSelectedIngredients((prev) => [...prev, newIngredient.trim()])
      setNewIngredient("")
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold text-xl">{title}</h3>
        <p className="text-base text-gray-300">
          {nutrition.calories} cal | {nutrition.protein} protein | {nutrition.carbs} carbs | {nutrition.fat} fat
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-lg">Ingredients</h4>
        <ul className="text-base space-y-2">
          {ingredients.map((ingredient, index) => (
            <li key={index} className="flex items-center gap-2">
              • {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-lg">Instructions</h4>
        <p className="text-base whitespace-pre-line">{instructions}</p>
      </div>

      <Button className="w-full bg-white/10 hover:bg-white/20 text-white text-lg py-6" onClick={handleAddToGroceryList}>
        <Plus className="h-10 w-10 mr-3" />
        Add to Grocery List
      </Button>

      <Dialog open={showIngredientModal} onOpenChange={setShowIngredientModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Customize Grocery List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              {ingredients.map((ingredient) => (
                <div key={ingredient} className="flex items-center space-x-2">
                  <Checkbox
                    id={ingredient}
                    checked={selectedIngredients.includes(ingredient)}
                    onCheckedChange={() => toggleIngredient(ingredient)}
                  />
                  <Label htmlFor={ingredient} className="text-base">
                    {ingredient}
                  </Label>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add new ingredient"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addNewIngredient()
                  }
                }}
              />
              <Button variant="secondary" onClick={addNewIngredient}>
                Add
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setShowIngredientModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

