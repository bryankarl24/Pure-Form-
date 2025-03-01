"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { MessageSquare, Search, MoreVertical, PenSquare, Users, Send, X, SmilePlus, Heart } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TabContainer } from "@/components/tab-container"

interface Reaction {
  emoji: string
  users: string[]
}

interface Message {
  id: number
  text: string
  timestamp: string
  fromUser: boolean
  reactions?: { [key: string]: Reaction }
  likes?: string[]
}

interface Chat {
  id: number
  username: string
  name: string
  avatar: string
  messages: Message[]
  online: boolean
  lastRead?: number // ID of last read message
}

interface DraftChat extends Chat {
  isDraft?: boolean
}

const initialChats: Chat[] = [
  {
    id: 1,
    username: "fitness_coach",
    name: "Professional Fitness Coach",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "Great progress on your workout routine!",
        timestamp: "2m ago",
        fromUser: false,
        likes: [],
      },
      {
        id: 2,
        text: "Thanks! I've been following your program consistently.",
        timestamp: "1m ago",
        fromUser: true,
        likes: [],
      },
    ],
  },
  {
    id: 2,
    username: "nutrition_expert",
    name: "Nutrition Specialist",
    avatar: "/placeholder.svg",
    online: false,
    messages: [
      {
        id: 1,
        text: "Here's your personalized meal plan 🥗",
        timestamp: "1h ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 3,
    username: "workout_pro",
    name: "Workout Professional",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "Your form in the last workout video was perfect! 💪",
        timestamp: "3h ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 4,
    username: "mindfulness_guru",
    name: "Mindfulness & Meditation Expert",
    avatar: "/placeholder.svg",
    online: false,
    messages: [
      {
        id: 1,
        text: "Don't forget to practice those breathing exercises we discussed",
        timestamp: "5h ago",
        fromUser: false,
        likes: [],
      },
      {
        id: 2,
        text: "I'll try them during my next session",
        timestamp: "4h ago",
        fromUser: true,
        likes: [],
      },
    ],
  },
  {
    id: 5,
    username: "yoga_master",
    name: "Yoga Instructor",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "Ready for tomorrow's sunrise yoga session? 🌅",
        timestamp: "6h ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 6,
    username: "meal_prep_expert",
    name: "Meal Prep Specialist",
    avatar: "/placeholder.svg",
    online: false,
    messages: [
      {
        id: 1,
        text: "Here's your customized meal plan for next week 📋",
        timestamp: "1d ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 7,
    username: "cardio_coach",
    name: "Cardio Training Expert",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "Great progress on your endurance training!",
        timestamp: "1d ago",
        fromUser: false,
        likes: [],
      },
      {
        id: 2,
        text: "Thanks! Those interval sessions really helped",
        timestamp: "1d ago",
        fromUser: true,
        likes: [],
      },
    ],
  },
  {
    id: 8,
    username: "strength_trainer",
    name: "Strength Training Coach",
    avatar: "/placeholder.svg",
    online: false,
    messages: [
      {
        id: 1,
        text: "Let's review your lifting technique tomorrow 🏋️‍♂️",
        timestamp: "2d ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 9,
    username: "wellness_coach",
    name: "Wellness & Health Coach",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "How's the new sleep schedule working for you?",
        timestamp: "2d ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 10,
    username: "recovery_specialist",
    name: "Recovery & Rehab Expert",
    avatar: "/placeholder.svg",
    online: false,
    messages: [
      {
        id: 1,
        text: "Remember to do those mobility exercises daily!",
        timestamp: "3d ago",
        fromUser: false,
        likes: [],
      },
      {
        id: 2,
        text: "Will do! They're really helping with flexibility",
        timestamp: "3d ago",
        fromUser: true,
        likes: [],
      },
    ],
  },
  {
    id: 11,
    username: "hiit_instructor",
    name: "HIIT Workout Specialist",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "Ready to crush another high-intensity session? 🔥",
        timestamp: "4d ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
  {
    id: 12,
    username: "sports_nutritionist",
    name: "Sports Nutrition Expert",
    avatar: "/placeholder.svg",
    online: true,
    messages: [
      {
        id: 1,
        text: "Your macro balance is looking much better this week!",
        timestamp: "5d ago",
        fromUser: false,
        likes: [],
      },
    ],
  },
]

const messageRequests = [
  {
    id: 1,
    username: "workout_pro",
    name: "Workout Professional",
    avatar: "/placeholder.svg",
    message: "Hey! I'd love to share some workout tips with you.",
    timestamp: "1d ago",
    mutualFollowers: 3,
  },
  {
    id: 2,
    username: "health_coach",
    name: "Health & Wellness Coach",
    avatar: "/placeholder.svg",
    message: "Hi! I noticed we have similar fitness goals.",
    timestamp: "2d ago",
    mutualFollowers: 5,
  },
]

const followedUsers = [
  {
    id: 1,
    username: "fitness_expert",
    name: "Fitness Expert",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Professional trainer & nutritionist",
  },
  {
    id: 2,
    username: "health_guru",
    name: "Health Guru",
    avatar: "/placeholder.svg",
    online: false,
    bio: "Wellness coach & meditation expert",
  },
  {
    id: 3,
    username: "workout_specialist",
    name: "Workout Specialist",
    avatar: "/placeholder.svg",
    online: true,
    bio: "HIIT & strength training pro",
  },
  {
    id: 4,
    username: "yoga_master",
    name: "Yoga Master",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Certified yoga instructor",
  },
  {
    id: 5,
    username: "nutrition_coach",
    name: "Nutrition Coach",
    avatar: "/placeholder.svg",
    online: false,
    bio: "Helping you eat better",
  },
  {
    id: 6,
    username: "mindfulness_guide",
    name: "Mindfulness Guide",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Mental wellness expert",
  },
  {
    id: 7,
    username: "cardio_king",
    name: "Cardio King",
    avatar: "/placeholder.svg",
    online: false,
    bio: "Endurance training specialist",
  },
  {
    id: 8,
    username: "strength_coach",
    name: "Strength Coach",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Powerlifting & bodybuilding",
  },
  {
    id: 9,
    username: "flexibility_pro",
    name: "Flexibility Pro",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Mobility & stretching expert",
  },
  {
    id: 10,
    username: "recovery_specialist",
    name: "Recovery Specialist",
    avatar: "/placeholder.svg",
    online: false,
    bio: "Rest & rehabilitation focus",
  },
  {
    id: 11,
    username: "sports_nutritionist",
    name: "Sports Nutritionist",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Performance nutrition expert",
  },
  {
    id: 12,
    username: "wellness_coach",
    name: "Wellness Coach",
    avatar: "/placeholder.svg",
    online: true,
    bio: "Holistic health approach",
  },
]

interface NewChatDialogProps {
  onClose: () => void
  onStartChat: (userId: number) => void
}

function NewChatDialog({ onClose, onStartChat }: NewChatDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState(followedUsers)

  useEffect(() => {
    const filtered = followedUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchQuery])

  // Mock frequent interactions data
  const frequentInteractions = followedUsers
    .slice(0, 5)
    .map((user) => ({
      ...user,
      interactions: Math.floor(Math.random() * 100) + 50, // Mock interaction count
    }))
    .sort((a, b) => b.interactions - a.interactions)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Message</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border">
          <CommandInput
            placeholder="Search users..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="text-gray-900"
          />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            {!searchQuery && (
              <CommandGroup heading="Suggested" className="text-gray-500">
                {frequentInteractions.map((user) => (
                  <CommandItem
                    key={user.id}
                    className="flex items-center gap-3 p-2 cursor-pointer text-gray-900"
                    onSelect={() => onStartChat(user.id)}
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
                    <div className="flex flex-col flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">@{user.username}</span>
                        <span className="text-xs text-gray-500">{user.interactions} interactions</span>
                      </div>
                      <span className="text-sm text-gray-500">{user.name}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            <CommandGroup heading="All Users" className="text-gray-500">
              {filteredUsers.map((user) => (
                <CommandItem
                  key={user.id}
                  className="flex items-center gap-3 p-2 cursor-pointer text-gray-900"
                  onSelect={() => onStartChat(user.id)}
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
      </DialogContent>
    </Dialog>
  )
}

export function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showNewChat, setShowNewChat] = useState(false)
  const [chats, setChats] = useState<DraftChat[]>(initialChats)
  const [selectedChat, setSelectedChat] = useState<DraftChat | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [filteredChats, setFilteredChats] = useState(chats)
  const [showEmojiPicker, setShowEmojiPicker] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("chats")

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    if (selectedChat) {
      scrollToBottom()
    }
  }, [selectedChat, scrollToBottom])

  // Filter chats based on search query
  useEffect(() => {
    const filtered = chats.filter(
      (chat) =>
        !chat.isDraft &&
        (chat.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.messages.some((msg) => msg.text.toLowerCase().includes(searchQuery.toLowerCase()))),
    )
    setFilteredChats(filtered)
  }, [chats, searchQuery])

  const handleStartChat = (userId: number) => {
    const user = followedUsers.find((u) => u.id === userId)
    if (user) {
      const newChat: DraftChat = {
        id: Date.now(),
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        online: user.online,
        messages: [],
        isDraft: true,
      }
      setSelectedChat(newChat)
      setShowNewChat(false)
    }
  }

  const handleReaction = (messageId: number, emoji: string) => {
    if (selectedChat) {
      const updatedChat = {
        ...selectedChat,
        messages: selectedChat.messages.map((msg) => {
          if (msg.id === messageId) {
            const reactions = msg.reactions || {}
            if (reactions[emoji]) {
              if (reactions[emoji].users.includes("currentUser")) {
                // Remove reaction if user already reacted with this emoji
                reactions[emoji].users = reactions[emoji].users.filter((u) => u !== "currentUser")
                if (reactions[emoji].users.length === 0) {
                  delete reactions[emoji]
                }
              } else {
                // Add user to existing reaction
                reactions[emoji].users.push("currentUser")
              }
            } else {
              // Create new reaction
              reactions[emoji] = {
                emoji,
                users: ["currentUser"],
              }
            }
            return { ...msg, reactions }
          }
          return msg
        }),
      }
      setSelectedChat(updatedChat)
      setChats((prev) => prev.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat)))
      setShowEmojiPicker(null)
    }
  }

  const handleLike = (messageId: number) => {
    if (selectedChat) {
      const updatedChat = {
        ...selectedChat,
        messages: selectedChat.messages.map((msg) => {
          if (msg.id === messageId) {
            const likes = msg.likes || []
            if (likes.includes("currentUser")) {
              return { ...msg, likes: likes.filter((u) => u !== "currentUser") }
            } else {
              return { ...msg, likes: [...likes, "currentUser"] }
            }
          }
          return msg
        }),
      }
      setSelectedChat(updatedChat)
      setChats((prev) => prev.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat)))
    }
  }

  const handleSendMessage = () => {
    if (selectedChat && newMessage.trim()) {
      const message: Message = {
        id: Date.now(),
        text: newMessage.trim(),
        timestamp: "Just now",
        fromUser: true,
        likes: [],
      }

      const updatedChat: DraftChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, message],
        isDraft: false,
        lastRead: message.id,
      }

      if (selectedChat.isDraft) {
        // Add new chat to the list
        setChats((prev) => [updatedChat, ...prev])
      } else {
        // Update existing chat
        setChats((prev) => prev.map((chat) => (chat.id === selectedChat.id ? updatedChat : chat)))
        // Move chat to top
        setChats((prev) => {
          const chatToMove = prev.find((c) => c.id === selectedChat.id)
          if (chatToMove) {
            const otherChats = prev.filter((c) => c.id !== selectedChat.id)
            return [chatToMove, ...otherChats]
          }
          return prev
        })
      }

      setSelectedChat(updatedChat)
      setNewMessage("")
      scrollToBottom()
    }
  }

  const handleExitChat = () => {
    setSelectedChat(null)
    setNewMessage("")
  }

  const markChatAsRead = (chatId: number) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastRead: chat.messages[chat.messages.length - 1]?.id,
          }
        }
        return chat
      }),
    )
  }

  const getUnreadCount = (chat: Chat) => {
    if (!chat.lastRead) return chat.messages.length
    return chat.messages.filter((msg) => !msg.fromUser && msg.id > (chat.lastRead || 0)).length
  }

  const sortedChats = filteredChats
    .filter((chat) => !chat.isDraft)
    .sort((a, b) => {
      const aLastMessage = a.messages[a.messages.length - 1]
      const bLastMessage = b.messages[b.messages.length - 1]
      if (!aLastMessage) return 1
      if (!bLastMessage) return -1
      return new Date(bLastMessage.timestamp) > new Date(aLastMessage.timestamp) ? 1 : -1
    })

  const renderChatsList = () => (
    <ScrollArea className="h-full">
      <div className="space-y-px pb-32">
        {sortedChats.map((chat) => {
          const unreadCount = getUnreadCount(chat)
          return (
            <Button
              key={chat.id}
              variant="ghost"
              className={`w-full justify-start px-4 py-3 h-auto hover:bg-white/5 ${
                selectedChat?.id === chat.id ? "bg-white/5" : ""
              }`}
              onClick={() => {
                setSelectedChat(chat)
                markChatAsRead(chat.id)
              }}
            >
              <div className="flex items-start gap-3 w-full">
                <div className="relative flex-shrink-0">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-black" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white truncate">@{chat.username}</span>
                    {chat.messages.length > 0 && (
                      <span className="text-sm text-white/40 flex-shrink-0">
                        {chat.messages[chat.messages.length - 1].timestamp}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    {chat.messages.length > 0 && (
                      <p className="text-sm text-white/60 truncate max-w-[180px]">
                        {chat.messages[chat.messages.length - 1].text}
                      </p>
                    )}
                    {unreadCount > 0 && (
                      <Badge variant="default" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Button>
          )
        })}
      </div>
    </ScrollArea>
  )

  const renderRequestsList = () => (
    <ScrollArea className="h-full">
      <div className="space-y-px">
        {messageRequests.map((request) => (
          <div key={request.id} className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 flex-shrink-0">
                <AvatarImage src={request.avatar} />
                <AvatarFallback>{request.username[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white">@{request.username}</span>
                    <p className="text-sm text-white/60">{request.name}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-white/60">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Block</DropdownMenuItem>
                      <DropdownMenuItem>Report</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <p className="text-sm text-white/60 mt-1 line-clamp-2">{request.message}</p>
                <div className="flex items-center gap-1 mt-2 text-sm text-white/40">
                  <Users className="h-4 w-4" />
                  {request.mutualFollowers} mutual followers
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button className="flex-1">Accept</Button>
                  <Button variant="outline" className="flex-1">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )

  const tabs = [
    {
      id: "chats",
      label: "Chats",
      content: renderChatsList(),
    },
    {
      id: "requests",
      label: "Requests",
      badge: messageRequests.length,
      content: renderRequestsList(),
    },
  ]

  return (
    <div className="fixed inset-0 left-[72px] bg-black flex">
      {/* Left sidebar */}
      <div className="w-[380px] border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-white">Messages</h1>
            <Button variant="ghost" size="icon" onClick={() => setShowNewChat(true)} className="text-white">
              <PenSquare className="h-5 w-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <TabContainer
            tabs={tabs}
            defaultTab="chats"
            variant="underline"
            onChange={setActiveTab}
            className="flex-1 flex flex-col"
            tabsListClassName="w-full flex justify-between rounded-none border-b border-white/10 bg-transparent p-0"
            tabsTriggerClassName="flex-1 rounded-none border-b-2 border-transparent px-4 py-3 text-white/70 transition-all duration-200 hover:text-white data-[state=active]:border-white data-[state=active]:bg-white/5 data-[state=active]:text-white"
            tabsContentClassName="flex-1 overflow-hidden transition-opacity duration-200 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100"
          />
        </div>
      </div>

      {/* Main content area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-white/5">
          <div className="border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium text-white">@{selectedChat.username}</span>
                  <span className="text-sm text-white/60">{selectedChat.name}</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleExitChat} className="text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {selectedChat.messages.map((message) => (
                <div key={message.id} className={`flex ${message.fromUser ? "justify-end" : "justify-start"}`}>
                  <div className="relative group">
                    <div className={`max-w-[70%] rounded-lg p-3 ${message.fromUser ? "bg-blue-600" : "bg-white/10"}`}>
                      <p className="text-white">{message.text}</p>
                      <span className="text-xs text-white/60 mt-1 block">{message.timestamp}</span>

                      {/* Reactions */}
                      {message.reactions && Object.keys(message.reactions).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Object.entries(message.reactions).map(([emoji, reaction]) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className={`px-2 py-1 rounded-full text-xs ${
                                reaction.users.includes("currentUser") ? "bg-white/20" : "bg-white/10"
                              } hover:bg-white/30 transition-colors`}
                            >
                              {emoji} {reaction.users.length}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Reaction buttons */}
                    <div
                      className={`absolute top-0 ${message.fromUser ? "right-full mr-2" : "left-full ml-2"} opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20"
                        onClick={() => handleLike(message.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            message.likes?.includes("currentUser") ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20"
                        onClick={() => setShowEmojiPicker(message.id)}
                      >
                        <SmilePlus className="h-4 w-4 text-white" />
                      </Button>
                    </div>

                    {/* Emoji picker */}
                    {showEmojiPicker === message.id && (
                      <div className={`absolute bottom-full ${message.fromUser ? "right-0" : "left-0"} mb-2`}>
                        <div className="bg-white rounded-lg shadow-lg p-2 grid grid-cols-8 gap-1">
                          {["❤️", "👍", "👎", "😂", "😮", "😢", "😡", "🎉"].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                              className="hover:bg-gray-100 p-1 rounded"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white/5">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-white/40" />
            <h2 className="text-xl font-semibold text-white mb-2">Your Messages</h2>
            <p className="text-white/60 mb-4">Send private messages to your fitness community</p>
            <Button onClick={() => setShowNewChat(true)}>Start a conversation</Button>
          </div>
        </div>
      )}

      {showNewChat && <NewChatDialog onClose={() => setShowNewChat(false)} onStartChat={handleStartChat} />}
    </div>
  )
}

