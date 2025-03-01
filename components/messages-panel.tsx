"use client"

import { useState, useEffect } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"

// Mock followed accounts data
const followedAccounts = [
  {
    id: 1,
    username: "fitness_coach",
    name: "Professional Fitness Coach",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: 2,
    username: "yoga_master",
    name: "Yoga & Meditation Expert",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: 3,
    username: "nutrition_guru",
    name: "Nutrition Specialist",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: 4,
    username: "workout_pro",
    name: "Workout Professional",
    avatar: "/placeholder.svg",
    isOnline: false,
  },
  {
    id: 5,
    username: "health_expert",
    name: "Health & Wellness Coach",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
]

export function MessagesPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredAccounts, setFilteredAccounts] = useState(followedAccounts)

  useEffect(() => {
    const filtered = followedAccounts.filter(
      (account) =>
        account.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredAccounts(filtered)
  }, [searchQuery])

  return (
    <div className="fixed inset-0 left-[72px] bg-white flex">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold">Your Messages</h2>
          <p className="text-gray-500">Send private messages to your fitness community</p>
        </div>

        <div className="w-full max-w-md mt-8">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Search accounts..." value={searchQuery} onValueChange={setSearchQuery} />
            <CommandList>
              <CommandEmpty>No accounts found.</CommandEmpty>
              <CommandGroup heading="Followed Accounts">
                <ScrollArea className="h-72">
                  {filteredAccounts.map((account) => (
                    <CommandItem
                      key={account.id}
                      className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100"
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={account.avatar} />
                          <AvatarFallback>{account.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {account.isOnline && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">@{account.username}</span>
                        <span className="text-sm text-gray-500">{account.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  )
}

