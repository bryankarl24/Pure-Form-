"use client"

import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SharePostModalProps {
  postId: number
  postPreview: string
  onClose: () => void
  onShare: (userId: number, message: string) => void
}

interface User {
  id: number
  username: string
  name: string
  avatar: string
  online: boolean
}

// Mock followed users data
const followedUsers: User[] = [
  {
    id: 1,
    username: "fitness_expert",
    name: "Fitness Expert",
    avatar: "/placeholder.svg",
    online: true,
  },
  {
    id: 2,
    username: "health_guru",
    name: "Health Guru",
    avatar: "/placeholder.svg",
    online: false,
  },
  {
    id: 3,
    username: "workout_specialist",
    name: "Workout Specialist",
    avatar: "/placeholder.svg",
    online: true,
  },
]

export function SharePostModal({ postId, postPreview, onClose, onShare }: SharePostModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")

  const filteredUsers = followedUsers.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleShare = () => {
    if (selectedUser) {
      onShare(selectedUser.id, message)
      onClose()
    }
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>
        <div className="bg-white">
          {!selectedUser ? (
            <Command className="rounded-lg border">
              <CommandInput
                placeholder="Search users..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="text-gray-900"
              />
              <CommandList>
                <CommandEmpty>No users found.</CommandEmpty>
                <CommandGroup heading="Share with" className="text-gray-500">
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      className="flex items-center gap-3 p-2 cursor-pointer text-gray-900"
                      onSelect={() => setSelectedUser(user)}
                    >
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {user.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">@{user.username}</span>
                        <span className="text-sm text-gray-500">{user.name}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>{selectedUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">@{selectedUser.username}</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0" onClick={() => setSelectedUser(null)}>
                    Change
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border p-3 bg-gray-50">
                <p className="text-sm text-gray-500">Post Preview</p>
                <p className="text-sm mt-1">{postPreview}</p>
              </div>
              <textarea
                className="w-full rounded-lg border p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Add a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button onClick={handleShare}>Share</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

