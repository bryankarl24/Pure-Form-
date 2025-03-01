"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ChevronRight,
  UserCircle,
  Bell,
  Shield,
  Clock,
  Bookmark,
  MessageCircle,
  Lock,
  Eye,
  Activity,
  HelpCircle,
  Info,
  Moon,
  Languages,
  LogOut,
  Heart,
} from "lucide-react"
import { LikedPosts } from "./liked-posts"

export function SettingsMenu() {
  const [showLikedPosts, setShowLikedPosts] = useState(false)

  const menuItems = [
    {
      section: "Your account",
      items: [
        { icon: UserCircle, label: "Personal details" },
        { icon: Bell, label: "Notifications" },
        { icon: Shield, label: "Security" },
        { icon: Lock, label: "Privacy" },
        { icon: Activity, label: "Account activity" },
        { icon: Clock, label: "Time spent" },
      ],
    },
    {
      section: "Content & Display",
      items: [
        { icon: Languages, label: "Language" },
        { icon: Moon, label: "Dark mode" },
        { icon: Eye, label: "Sensitive content control" },
      ],
    },
    {
      section: "Your activity",
      items: [
        {
          icon: Heart,
          label: "Liked posts",
          onClick: () => setShowLikedPosts(true),
        },
        { icon: Bookmark, label: "Saved recipes" },
        { icon: MessageCircle, label: "Comments" },
        { icon: Clock, label: "Recent activity" },
      ],
    },
    {
      section: "Support & About",
      items: [
        { icon: HelpCircle, label: "Help" },
        { icon: Info, label: "About" },
      ],
    },
  ]

  if (showLikedPosts) {
    return <LikedPosts />
  }

  return (
    <div className="fixed inset-0 bg-black text-white z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button variant="ghost" className="text-white hover:text-white/90" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <h1 className="text-lg font-semibold">Settings and Activity</h1>
        <div className="w-14" /> {/* Spacer for alignment */}
      </div>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-1">
          {/* Search bar */}
          <div className="mx-3 my-2">
            <div className="bg-gray-800/50 rounded-lg p-2.5 text-gray-400 text-sm">Search settings</div>
          </div>

          {menuItems.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="px-4 py-2 text-sm font-semibold text-gray-400">{section.section}</h2>
              <div className="space-y-0.5">
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    variant="ghost"
                    className="w-full justify-start px-4 py-6 h-auto hover:bg-gray-800/50 text-white"
                    onClick={item.onClick}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                ))}
              </div>
              {index < menuItems.length - 1 && <Separator className="my-2 bg-gray-800" />}
            </div>
          ))}

          {/* Additional accounts section */}
          <div className="px-4 py-2">
            <h2 className="text-sm font-semibold text-gray-400 mb-2">Additional accounts</h2>
            <Button variant="ghost" className="w-full justify-start px-4 py-6 h-auto hover:bg-gray-800/50 text-white">
              <UserCircle className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Add or switch accounts</span>
            </Button>
          </div>

          <Separator className="my-2 bg-gray-800" />

          {/* Logout section */}
          <div className="px-4 py-2">
            <Button variant="ghost" className="w-full justify-start px-4 py-6 h-auto hover:bg-gray-800/50 text-red-500">
              <LogOut className="w-5 h-5 mr-3" />
              <span className="flex-1 text-left">Log out</span>
            </Button>
          </div>

          {/* Version info */}
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            <p>Version 1.0.0</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

