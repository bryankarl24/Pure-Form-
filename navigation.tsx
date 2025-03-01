"use client"

import { Home, Search, PlusCircle, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import CreatePostModal from "./create-post-modal"

interface NavigationProps {
  currentView: "feed" | "profile"
  setCurrentView: (view: "feed" | "profile") => void
}

export function Navigation({ currentView, setCurrentView }: NavigationProps) {
  const [showCreatePost, setShowCreatePost] = useState(false)

  const handlePost = async (data: { video: Blob; caption: string }) => {
    setShowCreatePost(false)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="mx-auto px-4 py-4 bg-black/80 backdrop-blur-md border-t border-white/10">
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <Button
              variant="ghost"
              size="icon"
              className={`h-16 w-16 transition-all duration-200 hover:scale-110 ${
                currentView === "feed" ? "text-white" : "text-gray-400"
              } hover:bg-white/20`}
              onClick={() => setCurrentView("feed")}
            >
              <Home className="h-10 w-10" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 transition-all duration-200 hover:scale-110 text-gray-400 hover:bg-white/20"
            >
              <Search className="h-10 w-10" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-16 w-16 transition-all duration-200 hover:scale-110 text-gray-400 hover:bg-white/20"
              onClick={() => setShowCreatePost(true)}
            >
              <PlusCircle className="h-10 w-10" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-16 w-16 transition-all duration-200 hover:scale-110 ${
                currentView === "profile" ? "text-white" : "text-gray-400"
              } hover:bg-white/20`}
              onClick={() => setCurrentView("profile")}
            >
              <User className="h-10 w-10" />
            </Button>
          </div>
        </div>
      </div>

      {showCreatePost && <CreatePostModal onClose={() => setShowCreatePost(false)} onPost={handlePost} />}
    </>
  )
}

