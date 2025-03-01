"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Command, CommandGroup, CommandItem, CommandList, CommandInput, CommandEmpty } from "@/components/ui/command"
import {
  ShoppingBag,
  Plus,
  Trash2,
  UtensilsCrossed,
  Clock,
  Pencil,
  Check,
  X,
  Mail,
  MessageSquare,
  Maximize2,
  Minimize2,
} from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useShoppingList } from "@/contexts/shopping-list-context"

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

interface RecentIngredient {
  name: string
  lastUsed: Date
  category?: string
}

const mockSavedRecipes: Recipe[] = [
  {
    id: "1",
    title: "High Protein Breakfast Bowl",
    ingredients: ["Greek yogurt", "Granola", "Honey", "Mixed berries", "Chia seeds"],
    timestamp: new Date("2024-02-22"),
    source: "@fitness_chef",
  },
  {
    id: "2",
    title: "Pre-Workout Smoothie",
    ingredients: ["Banana", "Protein powder", "Almond milk", "Peanut butter", "Ice"],
    timestamp: new Date("2024-02-21"),
    source: "@health_guru",
  },
]

const ingredientSuggestions = [
  // Vegetables
  { name: "Artichoke", category: "Vegetables" },
  { name: "Asparagus", category: "Vegetables" },
  { name: "Avocado", category: "Vegetables" },
  { name: "Beets", category: "Vegetables" },
  { name: "Bell Peppers", category: "Vegetables" },
  { name: "Broccoli", category: "Vegetables" },
  { name: "Brussels Sprouts", category: "Vegetables" },
  { name: "Cabbage", category: "Vegetables" },
  { name: "Carrots", category: "Vegetables" },
  { name: "Cauliflower", category: "Vegetables" },
  { name: "Celery", category: "Vegetables" },
  { name: "Corn", category: "Vegetables" },
  { name: "Cucumber", category: "Vegetables" },
  { name: "Eggplant", category: "Vegetables" },
  { name: "Garlic", category: "Vegetables" },
  { name: "Green Beans", category: "Vegetables" },
  { name: "Kale", category: "Vegetables" },
  { name: "Lettuce", category: "Vegetables" },
  { name: "Mushrooms", category: "Vegetables" },
  { name: "Onions", category: "Vegetables" },
  { name: "Red Onions", category: "Vegetables" },
  { name: "Yellow Onions", category: "Vegetables" },
  { name: "White Onions", category: "Vegetables" },
  { name: "Sweet Onions", category: "Vegetables" },
  { name: "Green Onions", category: "Vegetables" },
  { name: "Parsnips", category: "Vegetables" },
  { name: "Peas", category: "Vegetables" },
  { name: "Potatoes", category: "Vegetables" },
  { name: "Russet Potatoes", category: "Vegetables" },
  { name: "Yukon Gold Potatoes", category: "Vegetables" },
  { name: "Red Potatoes", category: "Vegetables" },
  { name: "Fingerling Potatoes", category: "Vegetables" },
  { name: "Radishes", category: "Vegetables" },
  { name: "Romaine Lettuce", category: "Vegetables" },
  { name: "Spinach", category: "Vegetables" },
  { name: "Sweet Potatoes", category: "Vegetables" },
  { name: "Swiss Chard", category: "Vegetables" },
  { name: "Tomatoes", category: "Vegetables" },
  { name: "Turnips", category: "Vegetables" },
  { name: "Zucchini", category: "Vegetables" },

  // Fruits
  { name: "Apples", category: "Fruits" },
  { name: "Honeycrisp Apples", category: "Fruits" },
  { name: "Granny Smith Apples", category: "Fruits" },
  { name: "Fuji Apples", category: "Fruits" },
  { name: "Gala Apples", category: "Fruits" },
  { name: "Pink Lady Apples", category: "Fruits" },
  { name: "McIntosh Apples", category: "Fruits" },
  { name: "Apricots", category: "Fruits" },
  { name: "Bananas", category: "Fruits" },
  { name: "Blackberries", category: "Fruits" },
  { name: "Blueberries", category: "Fruits" },
  { name: "Cantaloupe", category: "Fruits" },
  { name: "Cherries", category: "Fruits" },
  { name: "Cranberries", category: "Fruits" },
  { name: "Figs", category: "Fruits" },
  { name: "Grapefruit", category: "Fruits" },
  { name: "Grapes", category: "Fruits" },
  { name: "Honeydew", category: "Fruits" },
  { name: "Kiwi", category: "Fruits" },
  { name: "Lemons", category: "Fruits" },
  { name: "Limes", category: "Fruits" },
  { name: "Mangos", category: "Fruits" },
  { name: "Nectarines", category: "Fruits" },
  { name: "Oranges", category: "Fruits" },
  { name: "Peaches", category: "Fruits" },
  { name: "Pears", category: "Fruits" },
  { name: "Pineapple", category: "Fruits" },
  { name: "Plums", category: "Fruits" },
  { name: "Pomegranate", category: "Fruits" },
  { name: "Raspberries", category: "Fruits" },
  { name: "Strawberries", category: "Fruits" },
  { name: "Tangerines", category: "Fruits" },
  { name: "Watermelon", category: "Fruits" },

  // Existing categories
  { name: "Protein powder", category: "Supplements" },
  { name: "Greek yogurt", category: "Dairy" },
  { name: "Plain Greek Yogurt", category: "Dairy" },
  { name: "Vanilla Greek Yogurt", category: "Dairy" },
  { name: "Strawberry Greek Yogurt", category: "Dairy" },
  { name: "Blueberry Greek Yogurt", category: "Dairy" },
  { name: "Sharp Cheddar Cheese", category: "Dairy" },
  { name: "Mild Cheddar Cheese", category: "Dairy" },
  { name: "Mozzarella Cheese", category: "Dairy" },
  { name: "Swiss Cheese", category: "Dairy" },
  { name: "Parmesan Cheese", category: "Dairy" },
  { name: "Feta Cheese", category: "Dairy" },
  { name: "Gouda Cheese", category: "Dairy" },
  { name: "Brie Cheese", category: "Dairy" },
  { name: "Chicken breast", category: "Meat" },
  { name: "Boneless Chicken Breast", category: "Meat" },
  { name: "Bone-in Chicken Breast", category: "Meat" },
  { name: "Chicken Thighs", category: "Meat" },
  { name: "Ground Chicken", category: "Meat" },
  { name: "Chicken Wings", category: "Meat" },
  { name: "Ground Beef 80/20", category: "Meat" },
  { name: "Ground Beef 90/10", category: "Meat" },
  { name: "Ribeye Steak", category: "Meat" },
  { name: "Sirloin Steak", category: "Meat" },
  { name: "NY Strip Steak", category: "Meat" },
  { name: "Beef Chuck Roast", category: "Meat" },
  { name: "Quinoa", category: "Grains" },
  { name: "Almond milk", category: "Dairy Alternatives" },
  { name: "Eggs", category: "Protein" },
  { name: "Oats", category: "Grains" },
  { name: "Salmon", category: "Fish" },
  { name: "Atlantic Salmon", category: "Fish" },
  { name: "Sockeye Salmon", category: "Fish" },
  { name: "Wild Caught Salmon", category: "Fish" },
  { name: "Farm Raised Salmon", category: "Fish" },
  { name: "Salmon Fillet", category: "Fish" },
  { name: "Albacore Tuna", category: "Fish" },
  { name: "Yellowfin Tuna", category: "Fish" },
  { name: "Chunk Light Tuna", category: "Fish" },
  { name: "Tuna Steak", category: "Fish" },
  { name: "Brown rice", category: "Grains" },
  { name: "Jasmine Rice", category: "Grains" },
  { name: "Basmati Rice", category: "Grains" },
  { name: "Arborio Rice", category: "Grains" },
  { name: "Wild Rice", category: "Grains" },
  { name: "Sushi Rice", category: "Grains" },
  { name: "Chia seeds", category: "Seeds" },
  { name: "Almonds", category: "Nuts" },
  { name: "Peanut butter", category: "Spreads" },
  { name: "Cottage cheese", category: "Dairy" },
  { name: "Olive oil", category: "Oils" },
  { name: "Whey protein", category: "Supplements" },
  { name: "Tuna", category: "Fish" },
  { name: "Black beans", category: "Legumes" },
  { name: "Coconut water", category: "Beverages" },
  { name: "Almond Milk", category: "Beverages" },
  { name: "Unsweetened Almond Milk", category: "Beverages" },
  { name: "Vanilla Almond Milk", category: "Beverages" },
  { name: "Chocolate Almond Milk", category: "Beverages" },
  { name: "Sweetened Almond Milk", category: "Beverages" },
  { name: "Oat Milk", category: "Beverages" },
  { name: "Unsweetened Oat Milk", category: "Beverages" },
  { name: "Vanilla Oat Milk", category: "Beverages" },
  { name: "Chocolate Oat Milk", category: "Beverages" },
  { name: "Green Tea", category: "Beverages" },
  { name: "Earl Grey Tea", category: "Beverages" },
  { name: "English Breakfast Tea", category: "Beverages" },
  { name: "Chamomile Tea", category: "Beverages" },
  { name: "Peppermint Tea", category: "Beverages" },
  { name: "Jasmine Green Tea", category: "Beverages" },
  { name: "Matcha Green Tea", category: "Beverages" },

  // Spices & Herbs
  { name: "Basil", category: "Spices & Herbs" },
  { name: "Black Pepper", category: "Spices & Herbs" },
  { name: "Cayenne", category: "Spices & Herbs" },
  { name: "Cinnamon", category: "Spices & Herbs" },
  { name: "Cumin", category: "Spices & Herbs" },
  { name: "Dill", category: "Spices & Herbs" },
  { name: "Ginger", category: "Spices & Herbs" },
  { name: "Oregano", category: "Spices & Herbs" },
  { name: "Paprika", category: "Spices & Herbs" },
  { name: "Rosemary", category: "Spices & Herbs" },
  { name: "Sage", category: "Spices & Herbs" },
  { name: "Thyme", category: "Spices & Herbs" },
  { name: "Turmeric", category: "Spices & Herbs" },

  // Condiments
  { name: "BBQ Sauce", category: "Condiments" },
  { name: "Hot Sauce", category: "Condiments" },
  { name: "Hummus", category: "Condiments" },
  { name: "Ketchup", category: "Condiments" },
  { name: "Mayonnaise", category: "Condiments" },
  { name: "Mustard", category: "Condiments" },
  { name: "Salsa", category: "Condiments" },
  { name: "Soy Sauce", category: "Condiments" },
  { name: "Sriracha", category: "Condiments" },
  { name: "Tahini", category: "Condiments" },

  // Snacks
  { name: "Dark Chocolate", category: "Snacks" },
  { name: "Dried Fruit", category: "Snacks" },
  { name: "Energy Bars", category: "Snacks" },
  { name: "Mixed Nuts", category: "Snacks" },
  { name: "Popcorn", category: "Snacks" },
  { name: "Protein Bars", category: "Snacks" },
  { name: "Rice Cakes", category: "Snacks" },
  { name: "Trail Mix", category: "Snacks" },

  // Chips & Snacks
  { name: "Potato Chips", category: "Chips & Snacks" },
  { name: "BBQ Potato Chips", category: "Chips & Snacks" },
  { name: "Sour Cream & Onion Chips", category: "Chips & Snacks" },
  { name: "Salt & Vinegar Chips", category: "Chips & Snacks" },
  { name: "Tortilla Chips", category: "Chips & Snacks" },
  { name: "Blue Corn Tortilla Chips", category: "Chips & Snacks" },
  { name: "Multigrain Tortilla Chips", category: "Chips & Snacks" },
  { name: "Corn Chips", category: "Chips & Snacks" },
  { name: "Nacho Cheese Chips", category: "Chips & Snacks" },
  { name: "Pita Chips", category: "Chips & Snacks" },
  { name: "Veggie Chips", category: "Chips & Snacks" },
  { name: "Sweet Potato Chips", category: "Chips & Snacks" },
  { name: "Kettle Chips", category: "Chips & Snacks" },
  { name: "Ridge Cut Potato Chips", category: "Chips & Snacks" },
  { name: "Pretzels", category: "Chips & Snacks" },
  { name: "Pretzel Sticks", category: "Chips & Snacks" },
  { name: "Pretzel Crisps", category: "Chips & Snacks" },
  { name: "Cheese Puffs", category: "Chips & Snacks" },
  { name: "Cheese Curls", category: "Chips & Snacks" },
  { name: "Popcorn", category: "Chips & Snacks" },
  { name: "Microwave Popcorn", category: "Chips & Snacks" },
  { name: "Butter Popcorn", category: "Chips & Snacks" },
  { name: "Caramel Popcorn", category: "Chips & Snacks" },
  { name: "Kettle Corn", category: "Chips & Snacks" },
  { name: "Crackers", category: "Chips & Snacks" },
  { name: "Saltine Crackers", category: "Chips & Snacks" },
  { name: "Cheese Crackers", category: "Chips & Snacks" },
  { name: "Graham Crackers", category: "Chips & Snacks" },
  { name: "Rice Cakes", category: "Chips & Snacks" },
  { name: "Granola Bars", category: "Chips & Snacks" },
  { name: "Protein Bars", category: "Chips & Snacks" },
  { name: "Energy Bars", category: "Chips & Snacks" },
  { name: "Fruit Snacks", category: "Chips & Snacks" },
  { name: "Dried Fruit", category: "Chips & Snacks" },
  { name: "Trail Mix", category: "Chips & Snacks" },
  { name: "Mixed Nuts", category: "Chips & Snacks" },
  { name: "Roasted Peanuts", category: "Chips & Snacks" },
  { name: "Cashews", category: "Chips & Snacks" },
  { name: "Almonds", category: "Chips & Snacks" },
  { name: "Pistachios", category: "Chips & Snacks" },
  { name: "Sunflower Seeds", category: "Chips & Snacks" },
  { name: "Pumpkin Seeds", category: "Chips & Snacks" },
  { name: "Beef Jerky", category: "Chips & Snacks" },
  { name: "Turkey Jerky", category: "Chips & Snacks" },
  { name: "Seaweed Snacks", category: "Chips & Snacks" },
  { name: "Rice Crackers", category: "Chips & Snacks" },
  { name: "Wasabi Peas", category: "Chips & Snacks" },
  { name: "Chocolate Covered Nuts", category: "Chips & Snacks" },
  { name: "Chocolate Covered Pretzels", category: "Chips & Snacks" },
  { name: "Chocolate Covered Raisins", category: "Chips & Snacks" },
  { name: "Gummy Bears", category: "Chips & Snacks" },
  { name: "Gummy Worms", category: "Chips & Snacks" },
  { name: "Licorice", category: "Chips & Snacks" },
  { name: "Hard Candy", category: "Chips & Snacks" },
  { name: "Mints", category: "Chips & Snacks" },
  { name: "Chewing Gum", category: "Chips & Snacks" },
  { name: "Cookie Snack Packs", category: "Chips & Snacks" },
  { name: "Mini Cookies", category: "Chips & Snacks" },
  { name: "Sandwich Cookies", category: "Chips & Snacks" },
  { name: "Chocolate Chip Cookies", category: "Chips & Snacks" },
  { name: "Oatmeal Cookies", category: "Chips & Snacks" },
  { name: "Brownie Bites", category: "Chips & Snacks" },
  { name: "Mini Muffins", category: "Chips & Snacks" },
  { name: "Snack Cakes", category: "Chips & Snacks" },
  { name: "Cheese Sticks", category: "Chips & Snacks" },
  { name: "String Cheese", category: "Chips & Snacks" },
  { name: "Mini Cheese Wheels", category: "Chips & Snacks" },
  { name: "Hummus Snack Packs", category: "Chips & Snacks" },
  { name: "Guacamole Snack Packs", category: "Chips & Snacks" },
  { name: "Salsa Snack Packs", category: "Chips & Snacks" },
  { name: "Veggie Straws", category: "Chips & Snacks" },
  { name: "Snap Pea Crisps", category: "Chips & Snacks" },
  { name: "Chickpea Snacks", category: "Chips & Snacks" },
  { name: "Roasted Edamame", category: "Chips & Snacks" },
  { name: "Protein Cookies", category: "Chips & Snacks" },
  { name: "Protein Chips", category: "Chips & Snacks" },
  { name: "Kale Chips", category: "Chips & Snacks" },
  { name: "Banana Chips", category: "Chips & Snacks" },
  { name: "Apple Chips", category: "Chips & Snacks" },
  { name: "Coconut Chips", category: "Chips & Snacks" },
  { name: "Plantain Chips", category: "Chips & Snacks" },
  { name: "Beet Chips", category: "Chips & Snacks" },
  { name: "Carrot Chips", category: "Chips & Snacks" },
  { name: "Dried Seaweed", category: "Chips & Snacks" },
  { name: "Rice Snacks", category: "Chips & Snacks" },
  { name: "Quinoa Chips", category: "Chips & Snacks" },
  { name: "Bean Chips", category: "Chips & Snacks" },
  { name: "Lentil Chips", category: "Chips & Snacks" },
  { name: "Multigrain Chips", category: "Chips & Snacks" },
  { name: "Popped Rice Crisps", category: "Chips & Snacks" },
  { name: "Cheese Crisps", category: "Chips & Snacks" },
  { name: "Meat Snack Sticks", category: "Chips & Snacks" },
  { name: "Protein Puffs", category: "Chips & Snacks" },
  { name: "Dried Chickpeas", category: "Chips & Snacks" },
  { name: "Roasted Broad Beans", category: "Chips & Snacks" },
  { name: "Dried Mango", category: "Chips & Snacks" },
  { name: "Dried Pineapple", category: "Chips & Snacks" },
  { name: "Dried Cranberries", category: "Chips & Snacks" },
  { name: "Dried Blueberries", category: "Chips & Snacks" },
  { name: "Mixed Dried Fruit", category: "Chips & Snacks" },
  { name: "Chocolate Covered Espresso Beans", category: "Chips & Snacks" },
  { name: "Yogurt Covered Raisins", category: "Chips & Snacks" },
  { name: "Yogurt Covered Pretzels", category: "Chips & Snacks" },
  { name: "Chocolate Covered Almonds", category: "Chips & Snacks" },
  { name: "Dark Chocolate Bar", category: "Chips & Snacks" },
  { name: "Milk Chocolate Bar", category: "Chips & Snacks" },
  { name: "White Chocolate Bar", category: "Chips & Snacks" },
  { name: "Chocolate Covered Protein Bars", category: "Chips & Snacks" },

  // Beverages
  { name: "Cola", category: "Beverages" },
  { name: "Diet Cola", category: "Beverages" },
  { name: "Zero Sugar Cola", category: "Beverages" },
  { name: "Lemon Lime Soda", category: "Beverages" },
  { name: "Ginger Ale", category: "Beverages" },
  { name: "Root Beer", category: "Beverages" },
  { name: "Cream Soda", category: "Beverages" },
  { name: "Orange Soda", category: "Beverages" },
  { name: "Grape Soda", category: "Beverages" },
  { name: "Sparkling Water", category: "Beverages" },
  { name: "Lemon Sparkling Water", category: "Beverages" },
  { name: "Lime Sparkling Water", category: "Beverages" },
  { name: "Berry Sparkling Water", category: "Beverages" },
  { name: "Orange Juice", category: "Beverages" },
  { name: "Apple Juice", category: "Beverages" },
  { name: "Cranberry Juice", category: "Beverages" },
  { name: "Grape Juice", category: "Beverages" },
  { name: "Pineapple Juice", category: "Beverages" },
  { name: "Tomato Juice", category: "Beverages" },
  { name: "Lemonade", category: "Beverages" },
  { name: "Iced Tea", category: "Beverages" },
  { name: "Sweet Tea", category: "Beverages" },
  { name: "Unsweetened Tea", category: "Beverages" },
  { name: "Sports Drink", category: "Beverages" },
  { name: "Energy Drink", category: "Beverages" },
  { name: "Coffee", category: "Beverages" },
  { name: "Ground Coffee", category: "Beverages" },
  { name: "Coffee Beans", category: "Beverages" },
  { name: "Instant Coffee", category: "Beverages" },
  { name: "Hot Chocolate", category: "Beverages" },
  { name: "Protein Shake", category: "Beverages" },
  { name: "Meal Replacement Shake", category: "Beverages" },

  // Seasonings & Spice Blends
  { name: "Italian Seasoning", category: "Seasonings" },
  { name: "Taco Seasoning", category: "Seasonings" },
  { name: "Cajun Seasoning", category: "Seasonings" },
  { name: "Greek Seasoning", category: "Seasonings" },
  { name: "Garlic Powder", category: "Seasonings" },
  { name: "Onion Powder", category: "Seasonings" },
  { name: "Chili Powder", category: "Seasonings" },
  { name: "Curry Powder", category: "Seasonings" },
  { name: "Ground Cumin", category: "Seasonings" },
  { name: "Ground Coriander", category: "Seasonings" },
  { name: "Ground Ginger", category: "Seasonings" },
  { name: "Ground Cinnamon", category: "Seasonings" },
  { name: "Ground Nutmeg", category: "Seasonings" },
  { name: "Ground Cloves", category: "Seasonings" },
  { name: "Bay Leaves", category: "Seasonings" },
  { name: "Red Pepper Flakes", category: "Seasonings" },
  { name: "Cayenne Pepper", category: "Seasonings" },
  { name: "Black Peppercorns", category: "Seasonings" },
  { name: "Sea Salt", category: "Seasonings" },
  { name: "Kosher Salt", category: "Seasonings" },
  { name: "Table Salt", category: "Seasonings" },
  { name: "Himalayan Pink Salt", category: "Seasonings" },
  { name: "Seasoned Salt", category: "Seasonings" },
  { name: "Garlic Salt", category: "Seasonings" },
  { name: "Celery Salt", category: "Seasonings" },
  { name: "Lemon Pepper", category: "Seasonings" },
  { name: "Steak Seasoning", category: "Seasonings" },
  { name: "Poultry Seasoning", category: "Seasonings" },
  { name: "Seafood Seasoning", category: "Seasonings" },

  // Dressings
  { name: "Ranch Dressing", category: "Dressings" },
  { name: "Italian Dressing", category: "Dressings" },
  { name: "Caesar Dressing", category: "Dressings" },
  { name: "Blue Cheese Dressing", category: "Dressings" },
  { name: "Thousand Island Dressing", category: "Dressings" },
  { name: "French Dressing", category: "Dressings" },
  { name: "Balsamic Vinaigrette", category: "Dressings" },
  { name: "Greek Dressing", category: "Dressings" },
  { name: "Honey Mustard Dressing", category: "Dressings" },
  { name: "Asian Sesame Dressing", category: "Dressings" },
  { name: "Raspberry Vinaigrette", category: "Dressings" },
  { name: "Light Ranch Dressing", category: "Dressings" },
  { name: "Light Italian Dressing", category: "Dressings" },
  { name: "Oil & Vinegar", category: "Dressings" },

  // Toppings
  { name: "Shredded Cheese", category: "Toppings" },
  { name: "Grated Parmesan", category: "Toppings" },
  { name: "Bacon Bits", category: "Toppings" },
  { name: "Croutons", category: "Toppings" },
  { name: "Sunflower Seeds", category: "Toppings" },
  { name: "Sesame Seeds", category: "Toppings" },
  { name: "Pine Nuts", category: "Toppings" },
  { name: "Sliced Almonds", category: "Toppings" },
  { name: "Candied Walnuts", category: "Toppings" },
  { name: "Dried Cranberries", category: "Toppings" },
  { name: "Raisins", category: "Toppings" },
  { name: "Chocolate Chips", category: "Toppings" },
  { name: "Sprinkles", category: "Toppings" },
  { name: "Whipped Cream", category: "Toppings" },
  { name: "Maple Syrup", category: "Toppings" },
  { name: "Honey", category: "Toppings" },
  { name: "Caramel Sauce", category: "Toppings" },
  { name: "Chocolate Sauce", category: "Toppings" },

  // Pasta & Noodles
  { name: "Spaghetti", category: "Pasta & Noodles" },
  { name: "Fettuccine", category: "Pasta & Noodles" },
  { name: "Linguine", category: "Pasta & Noodles" },
  { name: "Penne", category: "Pasta & Noodles" },
  { name: "Rigatoni", category: "Pasta & Noodles" },
  { name: "Rotini", category: "Pasta & Noodles" },
  { name: "Farfalle", category: "Pasta & Noodles" },
  { name: "Shells", category: "Pasta & Noodles" },
  { name: "Macaroni", category: "Pasta & Noodles" },
  { name: "Lasagna Noodles", category: "Pasta & Noodles" },
  { name: "Egg Noodles", category: "Pasta & Noodles" },
  { name: "Rice Noodles", category: "Pasta & Noodles" },
  { name: "Udon Noodles", category: "Pasta & Noodles" },
  { name: "Soba Noodles", category: "Pasta & Noodles" },
  { name: "Ramen Noodles", category: "Pasta & Noodles" },
  { name: "Whole Wheat Pasta", category: "Pasta & Noodles" },
  { name: "Gluten Free Pasta", category: "Pasta & Noodles" },
  { name: "Protein Pasta", category: "Pasta & Noodles" },

  // Personal Hygiene
  { name: "Shampoo", category: "Personal Hygiene" },
  { name: "Conditioner", category: "Personal Hygiene" },
  { name: "Body Wash", category: "Personal Hygiene" },
  { name: "Bar Soap", category: "Personal Hygiene" },
  { name: "Hand Soap", category: "Personal Hygiene" },
  { name: "Deodorant", category: "Personal Hygiene" },
  { name: "Toothpaste", category: "Personal Hygiene" },
  { name: "Mouthwash", category: "Personal Hygiene" },
  { name: "Dental Floss", category: "Personal Hygiene" },
  { name: "Toothbrush", category: "Personal Hygiene" },
  { name: "Razors", category: "Personal Hygiene" },
  { name: "Shaving Cream", category: "Personal Hygiene" },
  { name: "Lotion", category: "Personal Hygiene" },
  { name: "Face Wash", category: "Personal Hygiene" },
  { name: "Face Moisturizer", category: "Personal Hygiene" },
  { name: "Sunscreen", category: "Personal Hygiene" },
  { name: "Hand Sanitizer", category: "Personal Hygiene" },
  { name: "Cotton Swabs", category: "Personal Hygiene" },
  { name: "Cotton Balls", category: "Personal Hygiene" },
  { name: "Tissues", category: "Personal Hygiene" },
  { name: "Toilet Paper", category: "Personal Hygiene" },
  { name: "Body Lotion", category: "Personal Hygiene" },
  { name: "Hand Cream", category: "Personal Hygiene" },
  { name: "Lip Balm", category: "Personal Hygiene" },
  { name: "Hair Gel", category: "Personal Hygiene" },
  { name: "Hair Spray", category: "Personal Hygiene" },
  { name: "Hair Brush", category: "Personal Hygiene" },
  { name: "Hair Ties", category: "Personal Hygiene" },
  { name: "Feminine Products", category: "Personal Hygiene" },
  { name: "Band-Aids", category: "Personal Hygiene" },
  { name: "First Aid Kit", category: "Personal Hygiene" },

  // Sauces & Condiments
  { name: "Tomato Sauce", category: "Sauces & Condiments" },
  { name: "Pasta Sauce", category: "Sauces & Condiments" },
  { name: "Marinara Sauce", category: "Sauces & Condiments" },
  { name: "Alfredo Sauce", category: "Sauces & Condiments" },
  { name: "Pesto Sauce", category: "Sauces & Condiments" },
  { name: "BBQ Sauce", category: "Sauces & Condiments" },
  { name: "Hot Sauce", category: "Sauces & Condiments" },
  { name: "Sriracha Sauce", category: "Sauces & Condiments" },
  { name: "Tabasco Sauce", category: "Sauces & Condiments" },
  { name: "Worcestershire Sauce", category: "Sauces & Condiments" },
  { name: "Soy Sauce", category: "Sauces & Condiments" },
  { name: "Teriyaki Sauce", category: "Sauces & Condiments" },
  { name: "Fish Sauce", category: "Sauces & Condiments" },
  { name: "Oyster Sauce", category: "Sauces & Condiments" },
  { name: "Hoisin Sauce", category: "Sauces & Condiments" },
  { name: "Sweet Chili Sauce", category: "Sauces & Condiments" },
  { name: "Chili Garlic Sauce", category: "Sauces & Condiments" },
  { name: "Ketchup", category: "Sauces & Condiments" },
  { name: "Mustard", category: "Sauces & Condiments" },
  { name: "Dijon Mustard", category: "Sauces & Condiments" },
  { name: "Honey Mustard", category: "Sauces & Condiments" },
  { name: "Mayonnaise", category: "Sauces & Condiments" },
  { name: "Light Mayonnaise", category: "Sauces & Condiments" },
  { name: "Miracle Whip", category: "Sauces & Condiments" },
  { name: "Relish", category: "Sauces & Condiments" },
  { name: "Pickle Relish", category: "Sauces & Condiments" },
  { name: "Tartar Sauce", category: "Sauces & Condiments" },
  { name: "Cocktail Sauce", category: "Sauces & Condiments" },
  { name: "Steak Sauce", category: "Sauces & Condiments" },
  { name: "Horseradish", category: "Sauces & Condiments" },
  { name: "Salsa", category: "Sauces & Condiments" },
  { name: "Mild Salsa", category: "Sauces & Condiments" },
  { name: "Medium Salsa", category: "Sauces & Condiments" },
  { name: "Hot Salsa", category: "Sauces & Condiments" },
  { name: "Guacamole", category: "Sauces & Condiments" },
  { name: "Hummus", category: "Sauces & Condiments" },
  { name: "Tzatziki", category: "Sauces & Condiments" },
  { name: "Ranch Dip", category: "Sauces & Condiments" },
  { name: "French Onion Dip", category: "Sauces & Condiments" },
  { name: "Spinach Dip", category: "Sauces & Condiments" },
  { name: "Queso Dip", category: "Sauces & Condiments" },
  { name: "Bean Dip", category: "Sauces & Condiments" },
  { name: "Olive Oil", category: "Sauces & Condiments" },
  { name: "Extra Virgin Olive Oil", category: "Sauces & Condiments" },
  { name: "Vegetable Oil", category: "Sauces & Condiments" },
  { name: "Canola Oil", category: "Sauces & Condiments" },
  { name: "Coconut Oil", category: "Sauces & Condiments" },
  { name: "Sesame Oil", category: "Sauces & Condiments" },
  { name: "Balsamic Vinegar", category: "Sauces & Condiments" },
  { name: "Red Wine Vinegar", category: "Sauces & Condiments" },
  { name: "White Wine Vinegar", category: "Sauces & Condiments" },
  { name: "Apple Cider Vinegar", category: "Sauces & Condiments" },
  { name: "Rice Vinegar", category: "Sauces & Condiments" },
]

const recipeSuggestions = [
  { name: "High Protein", category: "Diet Type" },
  { name: "Low Carb", category: "Diet Type" },
  { name: "Vegan", category: "Diet Type" },
  { name: "Gluten Free", category: "Diet Type" },
  { name: "Pre Workout", category: "Timing" },
  { name: "Post Workout", category: "Timing" },
  { name: "Breakfast", category: "Meal Type" },
  { name: "Lunch", category: "Meal Type" },
  { name: "Dinner", category: "Meal Type" },
  { name: "Snacks", category: "Meal Type" },
  { name: "Smoothies", category: "Category" },
  { name: "Meal Prep", category: "Category" },
  { name: "Quick & Easy", category: "Category" },
  { name: "Under 30 Minutes", category: "Time" },
  { name: "Budget Friendly", category: "Category" },
]

export function ShoppingListPanel() {
  const {
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
  } = useShoppingList()

  const [newItem, setNewItem] = useState("")
  const [recipeSearchQuery, setRecipeSearchQuery] = useState("")
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const [editQuantity, setEditQuantity] = useState("")
  const [fullScreen, setFullScreen] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState([])

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(recipeSearchQuery.toLowerCase()),
  )

  useEffect(() => {
    const filtered = Array.from(new Set([...ingredientSuggestions.map((item) => item.name.toLowerCase())]))
      .map((name) => {
        const ingredientItem = ingredientSuggestions.find((item) => item.name.toLowerCase() === name)
        return {
          name: ingredientItem.name,
          category: ingredientItem.category,
        }
      })
      .filter(
        (ingredient) =>
          !items.some((item) => item.name.toLowerCase() === ingredient.name.toLowerCase()) &&
          ingredient.name.toLowerCase().includes(newItem.toLowerCase()),
      )
      .sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(newItem.toLowerCase())
        const bStartsWith = b.name.toLowerCase().startsWith(newItem.toLowerCase())
        if (aStartsWith !== bStartsWith) return aStartsWith ? -1 : 1
        return a.name.localeCompare(b.name)
      })
      .slice(0, 3)

    setFilteredSuggestions(filtered)
  }, [newItem, items])

  const capitalizeWords = (str: string) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const startEditing = (item: (typeof items)[0]) => {
    setEditingItem(item.id)
    setEditValue(item.name)
    setEditQuantity(item.quantity)
  }

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      editItem(id, editValue, editQuantity)
      setEditingItem(null)
      setEditValue("")
      setEditQuantity("")
      toast({
        description: "Item updated",
      })
    }
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setEditValue("")
    setEditQuantity("")
  }

  const shareViaEmail = () => {
    const itemsList = items.map((item) => `${item.quantity}x ${item.name}`).join("\n")
    window.location.href = `mailto:?subject=Shopping%20List&body=${encodeURIComponent(itemsList)}`
  }

  const shareViaText = () => {
    const itemsList = items.map((item) => `${item.quantity}x ${item.name}`).join("\n")
    window.location.href = `sms:?&body=${encodeURIComponent(itemsList)}`
  }

  return (
    <div
      className={`fixed ${fullScreen ? "inset-0" : "inset-0 left-[244px]"} bg-gray-100 z-10 flex transition-all duration-300`}
    >
      <div className="flex-1 flex flex-col h-full">
        <Tabs defaultValue="list" className="flex-1">
          <div className="bg-white border-b shadow-sm">
            <div className="px-6 pt-4">
              <TabsList className="w-full justify-start rounded-none bg-transparent p-0 border-0">
                <TabsTrigger
                  value="list"
                  className="rounded-md px-4 py-2 text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shopping List
                </TabsTrigger>
                <TabsTrigger
                  value="recipes"
                  className="rounded-md px-4 py-2 text-gray-600 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-900"
                >
                  <UtensilsCrossed className="mr-2 h-4 w-4" />
                  Saved Recipes ({recipes.length})
                </TabsTrigger>
              </TabsList>
            </div>
            <div className="flex items-center justify-between px-6 pb-4">
              <div /> {/* Spacer */}
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFullScreen((prev) => !prev)}
                  className="h-10 w-10"
                >
                  {fullScreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={shareViaEmail} className="h-10 w-10">
                  <Mail className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={shareViaText} className="h-10 w-10">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="list" className="flex-1 p-6 overflow-hidden">
            <div
              className={`flex flex-col h-full bg-white rounded-xl shadow-sm p-4 ${
                fullScreen
                  ? "[&_[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-16rem)]"
                  : "[&_[data-radix-scroll-area-viewport]]:max-h-[calc(4*4rem)]"
              }`}
            >
              <div className="relative flex items-center gap-2 mb-4">
                <div className="flex-1 relative">
                  <Command className="rounded-lg border" shouldFilter={false}>
                    <div className="flex items-center px-3">
                      <CommandInput
                        placeholder="Add new item..."
                        value={newItem}
                        onValueChange={(value) => {
                          setNewItem(value)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            const topSuggestion = filteredSuggestions[0]?.name
                            if (topSuggestion) {
                              addItem(topSuggestion)
                            } else if (newItem.trim()) {
                              addItem(newItem)
                            }
                          }
                        }}
                        className="flex-1 py-6 text-lg"
                        autoFocus
                      />
                    </div>
                    <CommandList>
                      <CommandEmpty>No suggestions found.</CommandEmpty>
                      <CommandGroup heading="Suggestions">
                        {filteredSuggestions.map((suggestion) => (
                          <CommandItem
                            key={suggestion.name}
                            onSelect={() => {
                              addItem(suggestion.name, "1", suggestion.category)
                              setNewItem("")
                            }}
                            className="flex items-center justify-between p-2 cursor-pointer"
                          >
                            <div className="flex items-center">
                              <Plus className="h-4 w-4 mr-2" />
                              <span>{suggestion.name}</span>
                            </div>
                            <span className="text-sm text-gray-500">{suggestion.category}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
                <Button
                  onClick={() => {
                    if (newItem.trim()) {
                      addItem(capitalizeWords(newItem))
                    }
                  }}
                  size="lg"
                  className="h-14 px-6"
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>

              <ScrollArea className="flex-1 -mx-2 px-2 mb-6 overflow-y-auto">
                <div className="space-y-[0.1rem] pr-4 pb-32">
                  {items.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-black">Your shopping list is empty</p>
                      <p className="text-sm mt-2 text-gray-500">Add items or import them from saved recipes</p>
                    </div>
                  ) : (
                    <>
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 rounded-lg transition-colors h-[4rem] ${
                            editingItem === item.id ? "bg-gray-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <Checkbox
                            checked={item.checked}
                            onCheckedChange={() => toggleItem(item.id)}
                            className="h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                            disabled={editingItem === item.id}
                          />
                          {editingItem === item.id ? (
                            <div className="flex-1 flex items-center gap-2">
                              <Input
                                value={editQuantity}
                                onChange={(e) => setEditQuantity(e.target.value)}
                                className="w-20 text-lg border-2 focus-visible:ring-2 bg-white text-black"
                                type="number"
                                min="1"
                              />
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveEdit(item.id)
                                  } else if (e.key === "Escape") {
                                    cancelEdit()
                                  }
                                }}
                                className="flex-1 text-lg border-2 focus-visible:ring-2 bg-white text-black"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => saveEdit(item.id)}
                                className="h-10 px-4"
                              >
                                <Check className="h-5 w-5 mr-2" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={cancelEdit} className="h-10 px-4">
                                <X className="h-5 w-5 mr-2" />
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="flex-1 flex items-center gap-4">
                                <div className="w-24 flex items-center gap-1">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => adjustQuantity(item.id, -1)}
                                    disabled={item.checked || editingItem === item.id}
                                  >
                                    -
                                  </Button>
                                  <span className="w-8 text-center text-gray-500 text-lg">×{item.quantity}</span>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => adjustQuantity(item.id, 1)}
                                    disabled={item.checked || editingItem === item.id}
                                  >
                                    +
                                  </Button>
                                </div>
                                <span
                                  className={`flex-1 text-lg ${
                                    item.checked ? "line-through text-gray-400" : "text-black"
                                  }`}
                                  onClick={() => startEditing(item)}
                                >
                                  {item.name}
                                </span>
                              </div>
                              {item.category && (
                                <Badge variant="secondary" className="text-sm px-2 py-1">
                                  {item.category}
                                </Badge>
                              )}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => startEditing(item)}
                                  className="h-10 w-10 bg-gray-100 hover:bg-gray-200"
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="h-10 w-10 bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                      {items.some((item) => item.checked) && (
                        <Button
                          variant="outline"
                          className="w-full mt-4 py-6 text-lg border-2 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={clearCheckedItems}
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          Clear checked items
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </ScrollArea>
              <div className="flex justify-end py-2 text-sm text-gray-500 fixed bottom-4 right-4 bg-white border rounded-lg px-3 shadow-sm">
                {items.reduce((total, item) => total + Number(item.quantity), 0)} items in list
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recipes" className="flex-1 p-6">
            <ScrollArea className="h-full">
              <div className="space-y-4 max-w-2xl mx-auto">
                <div className="sticky top-0 bg-gray-100 pb-4">
                  <div className="relative">
                    <Input
                      placeholder="Search recipes..."
                      value={recipeSearchQuery}
                      onChange={(e) => setRecipeSearchQuery(e.target.value)}
                      className="w-full bg-white"
                    />
                    {recipeSearchQuery && (
                      <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border shadow-lg">
                        <Command className="rounded-lg">
                          <CommandList>
                            <CommandGroup heading="Recipe Types">
                              {recipeSuggestions
                                .filter(
                                  (item) =>
                                    item.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
                                    item.category.toLowerCase().includes(recipeSearchQuery.toLowerCase()),
                                )
                                .map((suggestion) => (
                                  <CommandItem
                                    key={suggestion.name}
                                    onSelect={() => setRecipeSearchQuery(suggestion.name)}
                                    className="flex items-center justify-between p-2 cursor-pointer"
                                  >
                                    <span>{suggestion.name}</span>
                                    <span className="text-sm text-gray-500">{suggestion.category}</span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </div>
                    )}
                  </div>
                </div>

                {filteredRecipes.length === 0 ? (
                  <div className="text-center bg-white rounded-xl p-8 shadow-sm">
                    <UtensilsCrossed className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-black">No recipes found</p>
                    <p className="text-sm text-gray-500">Try adjusting your search terms</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredRecipes.map((recipe) => (
                      <Collapsible key={recipe.id}>
                        <Card className="border bg-white shadow-sm">
                          <CollapsibleTrigger asChild>
                            <CardHeader className="pb-2 cursor-pointer hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                  <CardTitle className="text-xl text-black">{recipe.title}</CardTitle>
                                  <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{new Date(recipe.timestamp).toLocaleDateString()}</span>
                                    <span>•</span>
                                    <span>{recipe.source}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant={addedRecipes.has(recipe.id) ? "destructive" : "default"}
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleRecipeInList(recipe)
                                    }}
                                  >
                                    {addedRecipes.has(recipe.id) ? (
                                      <>
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Remove from list
                                      </>
                                    ) : (
                                      <>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add to list
                                      </>
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeRecipe(recipe.id)
                                    }}
                                    className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <CardContent>
                              <div className="space-y-2 mt-2 pl-4">
                                {recipe.ingredients.map((ingredient, index) => (
                                  <div key={index} className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                                    <span className="text-black">{ingredient}</span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

