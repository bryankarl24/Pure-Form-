"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Grid, Bookmark, Lock, Play, UtensilsCrossed } from "lucide-react"
import Image from "next/image"
import { SettingsMenu } from "./settings-menu"

interface Recipe {
  id: number
  title: string
  image: string
  nutrition: {
    calories: number
    protein: string
  }
}

const savedRecipes: Recipe[] = [
  {
    id: 1,
    title: "Protein Smoothie Bowl",
    image: "/placeholder.svg",
    nutrition: {
      calories: 320,
      protein: "24g",
    },
  },
  {
    id: 2,
    title: "Quinoa Buddha Bowl",
    image: "/placeholder.svg",
    nutrition: {
      calories: 450,
      protein: "18g",
    },
  },
  {
    id: 3,
    title: "Greek Yogurt Parfait",
    image: "/placeholder.svg",
    nutrition: {
      calories: 280,
      protein: "22g",
    },
  },
  {
    id: 4,
    title: "Chicken Stir Fry",
    image: "/placeholder.svg",
    nutrition: {
      calories: 380,
      protein: "35g",
    },
  },
]

export default function Profile() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="min-h-screen bg-black text-white pb-20 pt-14">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <Lock className="w-6 h-6" />
        <h1 className="text-lg font-semibold">@fitnesstom</h1>
        <Button variant="ghost" size="icon" className="text-white" onClick={() => setShowSettings(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </Button>
      </div>

      {/* Settings Menu Modal */}
      {showSettings && <SettingsMenu />}

      {/* Profile Info */}
      <div className="px-4 pt-2">
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 border-2 border-white">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>FT</AvatarFallback>
          </Avatar>
          <h2 className="mt-2 text-xl font-semibold">@fitnesstom</h2>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 my-4">
          <div className="text-center">
            <div className="font-semibold">142</div>
            <div className="text-sm text-gray-400">Following</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">8,234</div>
            <div className="text-sm text-gray-400">Followers</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">23.4K</div>
            <div className="text-sm text-gray-400">Likes</div>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col items-center gap-3 my-4">
          <div className="text-center text-sm">
            🏋️‍♂️ Fitness Coach & Meal Prep Expert
            <br />🥗 Sharing healthy recipes daily
            <br />💪 Join my fitness journey
          </div>
          <Button className="w-full max-w-[220px] bg-white hover:bg-white/90 text-black">Edit Profile</Button>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="w-full h-16 bg-transparent border-b border-gray-800">
          <TabsTrigger
            value="videos"
            className="w-1/3 h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white text-gray-400 data-[state=active]:text-white transition-all duration-200 hover:text-white"
          >
            <Grid className="h-10 w-10" />
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="w-1/3 h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white text-gray-400 data-[state=active]:text-white transition-all duration-200 hover:text-white"
          >
            <Bookmark className="h-10 w-10" />
          </TabsTrigger>
          <TabsTrigger
            value="recipes"
            className="w-1/3 h-full data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-white text-gray-400 data-[state=active]:text-white transition-all duration-200 hover:text-white"
          >
            <UtensilsCrossed className="h-10 w-10" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="mt-0">
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="relative aspect-[3/4]">
                <Image src="/placeholder.svg" alt={`Video thumbnail ${i + 1}`} fill className="object-cover" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-base">
                  <Play className="w-6 h-6 fill-white" />
                  {Math.floor(Math.random() * 100)}K
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="saved" className="mt-0">
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="relative aspect-[3/4]">
                <Image src="/placeholder.svg" alt={`Saved video thumbnail ${i + 1}`} fill className="object-cover" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
                  <Bookmark className="w-3 h-3" />
                  Saved
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="recipes" className="mt-0">
          <div className="grid grid-cols-3 gap-0.5">
            {savedRecipes.map((recipe) => (
              <div key={recipe.id} className="relative aspect-square group">
                <Image src={recipe.image || "/placeholder.svg"} alt={recipe.title} fill className="object-cover" />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {/* Recipe Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-xs font-medium line-clamp-2">{recipe.title}</div>
                  <div className="flex items-center gap-2 text-xs mt-1">
                    <span>🔥 {recipe.nutrition.calories}</span>
                    <span>💪 {recipe.nutrition.protein}</span>
                  </div>
                </div>
                {/* Recipe Icon */}
                <div className="absolute top-2 right-2">
                  <UtensilsCrossed className="w-4 h-4 text-white" />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

