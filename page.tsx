"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { VideoFeed } from "./video-feed"
import { GroceryList } from "./grocery-list"
import Profile from "./profile"
import { NavigationPanels } from "./navigation-panels"
import { Sidebar } from "./components/sidebar"
import { cn } from "@/lib/utils"
import { ShoppingListPanel } from "./components/shopping-list-panel"

export default function FitnessSocial() {
  const [showGroceryList, setShowGroceryList] = useState(false)
  const [currentView, setCurrentView] = useState<"feed" | "profile">("feed")
  const [activePanel, setActivePanel] = useState<
    "search" | "explore" | "shopping" | "messages" | "notifications" | null
  >(null)

  return (
    <div className="min-h-screen bg-black">
      <div className="md:pl-[244px]">
        <main className="h-screen flex">
          {activePanel === "shopping" ? (
            <div className="fixed inset-0 left-[244px] bg-gray-100 z-10 flex">
              <ShoppingListPanel />
            </div>
          ) : (
            <>
              {activePanel && (
                <div
                  className={cn(
                    "fixed top-0 h-full pointer-events-none",
                    activePanel === "explore" ? "inset-0 left-[72px]" : "inset-0 left-[72px]",
                  )}
                >
                  <NavigationPanels type={activePanel} />
                </div>
              )}
              {(!activePanel || activePanel === "search") && (
                <div className="flex-1">
                  {currentView === "feed" ? (
                    <>
                      <div className="fixed top-4 right-4 z-50">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => setShowGroceryList(!showGroceryList)}
                        >
                          <ShoppingBag className="h-5 w-5" />
                        </Button>
                      </div>
                      {!activePanel && <VideoFeed />}
                    </>
                  ) : (
                    <Profile />
                  )}

                  {showGroceryList && currentView === "feed" && (
                    <div className="fixed right-4 top-14 w-[300px] z-50">
                      <GroceryList />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activePanel={activePanel}
        onPanelChange={setActivePanel}
      />
    </div>
  )
}

