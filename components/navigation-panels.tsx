"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { FlameIcon as Fire, Search, Dumbbell, UtensilsCrossed, Hash, MapPin, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TabContainer } from "@/components/tab-container"
import { MessagesPage } from "@/components/messages-page"

// Mock suggested accounts
const suggestedAccounts = [
  {
    id: 1,
    username: "fitness_expert",
    name: "Fitness Expert",
    avatar: "/placeholder.svg",
    followers: 250000,
    isFollowing: false,
  },
  {
    id: 2,
    username: "health_coach",
    name: "Health Coach",
    avatar: "/placeholder.svg",
    followers: 180000,
    isFollowing: false,
  },
  {
    id: 3,
    username: "workout_guru",
    name: "Workout Guru",
    avatar: "/placeholder.svg",
    followers: 150000,
    isFollowing: false,
  },
  {
    id: 4,
    username: "nutrition_pro",
    name: "Nutrition Professional",
    avatar: "/placeholder.svg",
    followers: 120000,
    isFollowing: false,
  },
  {
    id: 5,
    username: "wellness_expert",
    name: "Wellness Expert",
    avatar: "/placeholder.svg",
    followers: 90000,
    isFollowing: false,
  },
]

const mockVideos = [
  {
    id: 1,
    category: "fitness",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    likes: 892000,
    comments: 45000,
  },
  {
    id: 2,
    category: "nutrition",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    likes: 654000,
    comments: 32000,
  },
  ...Array.from({ length: 18 }).map((_, i) => ({
    id: i + 3,
    category: i % 2 === 0 ? "fitness" : "nutrition",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    likes: Math.floor(Math.random() * 900000) + 100000,
    comments: Math.floor(Math.random() * 50000) + 10000,
  })),
]

// Rest of the existing mock data and interfaces remain unchanged
type NavigationPanelType = "search" | "explore" | "shopping" | "messages" | "notifications"

interface NavigationPanel {
  type: NavigationPanelType
}

// Remove this unused array
// const categories = [
//   { name: "All", icon: Search },
//   { name: "Workouts", icon: Dumbbell },
//   { name: "Nutrition", icon: UtensilsCrossed },
//   { name: "Trending", icon: Fire },
// ]

// Mock search suggestions data
const searchSuggestions = {
  users: [
    {
      id: 1,
      username: "fitness_coach",
      name: "Professional Fitness Coach",
      avatar: "/placeholder.svg",
      followers: 125000,
      verified: true,
    },
    {
      id: 2,
      username: "health_guru",
      name: "Health & Wellness Expert",
      avatar: "/placeholder.svg",
      followers: 89000,
      verified: true,
    },
    {
      id: 3,
      username: "workout_pro",
      name: "Workout Professional",
      avatar: "/placeholder.svg",
      followers: 67000,
      verified: false,
    },
  ],
  tags: [
    { name: "fitness", posts: 1200000 },
    { name: "workout", posts: 890000 },
    { name: "healthy", posts: 750000 },
    { name: "gym", posts: 650000 },
    { name: "nutrition", posts: 550000 },
    { name: "weightlifting", posts: 450000 },
    { name: "cardio", posts: 350000 },
    { name: "yoga", posts: 250000 },
  ],
  places: [
    { name: "Gold's Gym NYC", type: "Gym", location: "New York, NY" },
    { name: "LA Fitness Downtown", type: "Gym", location: "Los Angeles, CA" },
    { name: "CrossFit Arena", type: "Fitness Center", location: "Chicago, IL" },
    { name: "Yoga Studio Central", type: "Yoga Studio", location: "San Francisco, CA" },
  ],
}

// Mock recipe suggestions data
const recipeSuggestions = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    category: "Healthy Recipes",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    name: "Vegan Pasta Primavera",
    category: "Vegan Recipes",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    name: "Low-Carb Beef Stir-Fry",
    category: "Low-Carb Recipes",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    name: "Quick & Easy Smoothie",
    category: "Smoothie Recipes",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    name: "Homemade Protein Bars",
    category: "Snack Recipes",
    image: "/placeholder.svg",
  },
]

// Format numbers with K/M suffix
const formatNumber = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

interface SearchHistoryItem {
  id: number
  type: "user" | "tag" | "place"
  value: string
  details: {
    name?: string
    avatar?: string
    followers?: number
    posts?: number
    location?: string
    type?: string
  }
  timestamp: Date
}

export default function NavigationPanels({ type }: NavigationPanel) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    if (typeof window === "undefined") {
      return []
    }
    const saved = localStorage.getItem("searchHistory")
    return saved ? JSON.parse(saved) : []
  })
  const [following, setFollowing] = useState<number[]>([])
  const [activeFilter, setActiveFilter] = useState<"all" | "fitness" | "nutrition">("all")
  // Remove these unused state variables
  // const [recipeSearchQuery, setRecipeSearchQuery] = useState("")
  // const [filteredRecipes, setFilteredRecipes] = useState(recipeSuggestions)
  const [filteredSuggestions, setFilteredSuggestions] = useState({
    users: searchSuggestions.users,
    tags: searchSuggestions.tags,
    places: searchSuggestions.places,
  })

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
  }, [searchHistory])

  const addToSearchHistory = (item: Omit<SearchHistoryItem, "timestamp">) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter(
        (historyItem) => !(historyItem.type === item.type && historyItem.value === item.value),
      )
      return [{ ...item, timestamp: new Date() }, ...filtered].slice(0, 10)
    })
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
    localStorage.removeItem("searchHistory")
  }

  const toggleFollow = (accountId: number) => {
    setFollowing((prev) => (prev.includes(accountId) ? prev.filter((id) => id !== accountId) : [...prev, accountId]))
  }

  useEffect(() => {
    const query = searchQuery.toLowerCase()
    setFilteredSuggestions({
      users: searchSuggestions.users.filter(
        (user) => user.username.toLowerCase().includes(query) || user.name.toLowerCase().includes(query),
      ),
      tags: searchSuggestions.tags.filter((tag) => tag.name.toLowerCase().includes(query)),
      places: searchSuggestions.places.filter(
        (place) => place.name.toLowerCase().includes(query) || place.location.toLowerCase().includes(query),
      ),
    })
  }, [searchQuery])

  // Remove this unused effect
  // useEffect(() => {
  //   const filtered = recipeSuggestions.filter(
  //     (suggestion) =>
  //       suggestion.name.toLowerCase().includes(recipeSearchQuery.toLowerCase()) ||
  //       suggestion.category.toLowerCase().includes(recipeSearchQuery.toLowerCase()),
  //   )
  //   setFilteredRecipes(filtered)
  // }, [recipeSearchQuery])

  if (type === "search") {
    return (
      <div className="fixed inset-0 left-[72px] bg-black/80 backdrop-blur-md z-50 flex">
        {/* Left side - Search panel */}
        <div className="w-1/2 h-full overflow-hidden p-6">
          <Command className="rounded-xl border-2 border-white/20 bg-black/50">
            <div className="flex items-center px-3 border-b border-white/10">
              <Search className="h-4 w-4 text-white/40 shrink-0" />
              <CommandInput
                placeholder="Search users, tags, or places..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex-1 text-white placeholder:text-white/40 py-6"
              />
            </div>
            <CommandList className="text-white">
              <CommandEmpty>No results found.</CommandEmpty>

              {!searchQuery && searchHistory.length > 0 && (
                <CommandGroup heading="Recent Searches" className="text-gray-400">
                  <div className="flex items-center justify-between px-2 py-1">
                    <span className="text-sm text-gray-400">Recent</span>
                    <Button
                      variant="ghost"
                      className="text-xs text-gray-400 hover:text-white"
                      onClick={clearSearchHistory}
                    >
                      Clear all
                    </Button>
                  </div>
                  {searchHistory.map((item) => (
                    <CommandItem
                      key={`${item.type}-${item.value}-${item.timestamp}`}
                      className="flex items-center gap-3 p-2 text-white hover:bg-white/10"
                      onSelect={() => setSearchQuery(item.value)}
                    >
                      {item.type === "user" && (
                        <>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.details.avatar} />
                            <AvatarFallback>{item.value[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-medium">@{item.value}</span>
                            <span className="text-sm text-gray-400">{item.details.name}</span>
                          </div>
                        </>
                      )}
                      {item.type === "tag" && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Hash className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">#{item.value}</span>
                            <span className="text-sm text-gray-400">{formatNumber(item.details.posts)} posts</span>
                          </div>
                        </div>
                      )}
                      {item.type === "place" && (
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{item.value}</span>
                            <span className="text-sm text-gray-400">{item.details.location}</span>
                          </div>
                        </div>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {searchQuery && (
                <>
                  {filteredSuggestions.users.length > 0 && (
                    <CommandGroup heading="Users" className="text-gray-400">
                      {filteredSuggestions.users.map((user) => (
                        <CommandItem
                          key={user.id}
                          className="flex items-center gap-3 p-2 text-white hover:bg-white/10"
                          onSelect={() => {
                            setSearchQuery(user.username)
                            addToSearchHistory({
                              id: user.id,
                              type: "user",
                              value: user.username,
                              details: {
                                name: user.name,
                                avatar: user.avatar,
                                followers: user.followers,
                              },
                            })
                          }}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">@{user.username}</span>
                              {user.verified && <div className="text-blue-500">✓</div>}
                            </div>
                            <span className="text-sm text-gray-400">{formatNumber(user.followers)} followers</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {filteredSuggestions.tags.length > 0 && (
                    <CommandGroup heading="Tags" className="text-gray-400">
                      {filteredSuggestions.tags.map((tag) => (
                        <CommandItem
                          key={tag.name}
                          className="flex items-center gap-3 p-2 text-white hover:bg-white/10"
                          onSelect={() => {
                            setSearchQuery(tag.name)
                            addToSearchHistory({
                              id: Date.now(),
                              type: "tag",
                              value: tag.name,
                              details: {
                                posts: tag.posts,
                              },
                            })
                          }}
                        >
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <Hash className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">#{tag.name}</span>
                            <span className="text-sm text-gray-400">{formatNumber(tag.posts)} posts</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {filteredSuggestions.places.length > 0 && (
                    <CommandGroup heading="Places" className="text-gray-400">
                      {filteredSuggestions.places.map((place) => (
                        <CommandItem
                          key={place.name}
                          className="flex items-center gap-3 p-2 text-white hover:bg-white/10"
                          onSelect={() => {
                            setSearchQuery(place.name)
                            addToSearchHistory({
                              id: Date.now(),
                              type: "place",
                              value: place.name,
                              details: {
                                location: place.location,
                                type: place.type,
                              },
                            })
                          }}
                        >
                          <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{place.name}</span>
                            <span className="text-sm text-gray-400">{place.location}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </>
              )}

              {!searchQuery && (
                <CommandGroup heading="Trending" className="text-gray-400">
                  {searchSuggestions.tags.slice(0, 5).map((tag) => (
                    <CommandItem
                      key={tag.name}
                      className="flex items-center justify-between p-2 text-white hover:bg-white/10"
                      onSelect={() => {
                        setSearchQuery(tag.name)
                        addToSearchHistory({
                          id: Date.now(),
                          type: "tag",
                          value: tag.name,
                          details: {
                            posts: tag.posts,
                          },
                        })
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Fire className="h-4 w-4 text-orange-500" />
                        <span>#{tag.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{formatNumber(tag.posts)} posts</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </div>

        {/* Right side - Suggested accounts */}
        <div className="w-[300px] h-full border-l border-white/10 p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-6">Suggested for you</h2>
          <div className="space-y-6">
            {suggestedAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={account.avatar} />
                    <AvatarFallback>{account.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">@{account.username}</p>
                    <p className="text-xs text-gray-400">{formatNumber(account.followers)} followers</p>
                  </div>
                </div>
                <Button
                  variant={following.includes(account.id) ? "outline" : "default"}
                  className="h-8"
                  onClick={() => toggleFollow(account.id)}
                >
                  {following.includes(account.id) ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === "explore") {
    const filteredVideos = mockVideos.filter((video) => activeFilter === "all" || video.category === activeFilter)

    return (
      <div className="fixed inset-0 left-[244px] bg-gray-100 z-10 overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-white flex items-center gap-2">
          <TabContainer
            tabs={[
              { id: "all", label: "All", content: null },
              { id: "fitness", label: "Fitness", icon: <Dumbbell className="h-4 w-4 mr-2" />, content: null },
              {
                id: "nutrition",
                label: "Nutrition",
                icon: <UtensilsCrossed className="h-4 w-4 mr-2" />,
                content: null,
              },
            ]}
            defaultTab={activeFilter}
            variant="pills"
            onChange={(value) => setActiveFilter(value as "all" | "fitness" | "nutrition")}
            className="flex-wrap"
            tabsTriggerClassName="rounded-full"
          />
        </div>
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5 p-0.5">
            {filteredVideos.map((video) => (
              <div key={video.id} className="aspect-square relative group cursor-pointer bg-black">
                <video
                  src={video.videoUrl}
                  className="object-cover w-full h-full opacity-90 group-hover:opacity-50 transition-opacity"
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-4 text-white text-lg">
                    <div className="flex items-center gap-1">
                      <Heart className="h-6 w-6 fill-white" />
                      <span>{(video.likes / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-6 w-6 fill-white" />
                      <span>{(video.comments / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (type === "messages") {
    return (
      <div className="fixed inset-0 left-[72px] bg-black flex">
        <MessagesPage />
      </div>
    )
  }

  // Return other panel types unchanged
  return null
}

