import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react"
import { RecipeCard } from "./recipe-card"

export function PhotoFeed() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-4 p-4">
          <Avatar>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>FT</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">FitnessTom</p>
            <p className="text-xs text-muted-foreground">Meal Prep Expert</p>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Image
            src="/placeholder.svg"
            alt="Healthy meal"
            width={500}
            height={500}
            className="w-full aspect-square object-cover"
          />
        </CardContent>
        <CardFooter className="flex flex-col p-4 space-y-4">
          <div className="flex justify-between w-full">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-12 w-12" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-12 w-12" />
            </Button>
          </div>
          <p className="text-sm">
            Healthy meal prep for the week! Swipe to see the recipe and add ingredients to your grocery list 🥗
          </p>
          <RecipeCard
            title="Quinoa Buddha Bowl"
            ingredients={["1 cup quinoa", "2 cups mixed vegetables", "1 avocado", "2 tbsp olive oil", "1 lemon"]}
            instructions="1. Cook quinoa according to package instructions
2. Roast vegetables with olive oil
3. Assemble bowl and add sliced avocado
4. Drizzle with lemon juice"
            nutrition={{ calories: 450, protein: "15g", carbs: "48g", fat: "28g" }}
          />
        </CardFooter>
      </Card>
    </div>
  )
}

