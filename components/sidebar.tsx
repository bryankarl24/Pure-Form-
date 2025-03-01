"use client"

import { Button } from "@/components/ui/button"
import { Home, Search, Compass, MessageCircle, Heart, PlusSquare, User, Menu, ShoppingBag } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  currentView: "feed" | "profile"
  setCurrentView: (view: "feed" | "profile") => void
  activePanel: "search" | "explore" | "shopping" | "messages" | "notifications" | null
  onPanelChange: (panel: "search" | "explore" | "shopping" | "messages" | "notifications" | null) => void
}

export function Sidebar({ currentView, setCurrentView, activePanel, onPanelChange }: SidebarProps) {
  const handlePanelClick = (panel: "search" | "explore" | "shopping" | "messages" | "notifications") => {
    onPanelChange(activePanel === panel ? null : panel)
  }

  const menuItems = [
    {
      icon: Home,
      label: "Home",
      onClick: () => {
        setCurrentView("feed")
        onPanelChange(null)
      },
      active: currentView === "feed" && !activePanel,
    },
    {
      icon: Search,
      label: "Search",
      onClick: () => handlePanelClick("search"),
      active: activePanel === "search",
    },
    {
      icon: Compass,
      label: "Explore",
      onClick: () => handlePanelClick("explore"),
      active: activePanel === "explore",
    },
    {
      icon: ShoppingBag,
      label: "My Shopping List",
      onClick: () => handlePanelClick("shopping"),
      active: activePanel === "shopping",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      onClick: () => handlePanelClick("messages"),
      active: activePanel === "messages",
    },
    {
      icon: Heart,
      label: "Notifications",
      onClick: () => handlePanelClick("notifications"),
      active: activePanel === "notifications",
    },
    {
      icon: PlusSquare,
      label: "Create",
      onClick: () => {},
    },
    {
      icon: User,
      label: "Profile",
      onClick: () => {
        setCurrentView("profile")
        onPanelChange(null)
      },
      active: currentView === "profile",
    },
  ]

  return (
    <div
      className={cn(
        "hidden md:flex fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 flex-col p-3 transition-all duration-300",
        activePanel === "search" || activePanel === "messages" || activePanel === "notifications"
          ? "w-[72px]"
          : "w-[244px]",
      )}
    >
      <div className={cn("py-8 px-3 transition-all duration-300", activePanel ? "px-1" : "px-3")}>
        <h1
          className={cn(
            "text-xl font-serif tracking-tight transition-all duration-300",
            activePanel ? "opacity-0 w-0" : "opacity-100",
          )}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          PureForm
        </h1>
      </div>

      <div className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            className={cn(
              "w-full justify-start h-auto hover:bg-gray-100 text-base font-medium transition-all duration-300",
              activePanel ? "px-2 py-4" : "px-3 py-6 gap-4",
              item.active && "font-semibold bg-gray-100",
            )}
            onClick={item.onClick}
          >
            <item.icon className={cn("h-6 w-6", item.active && "scale-110")} />
            <span
              className={cn(
                "transition-all duration-300",
                activePanel === "search" || activePanel === "messages" || activePanel === "notifications"
                  ? "w-0 opacity-0"
                  : "opacity-100",
              )}
            >
              {item.label}
            </span>
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start h-auto hover:bg-gray-100 transition-all duration-300",
          activePanel ? "px-2 py-4" : "px-3 py-6 gap-4",
        )}
      >
        <Menu className="h-6 w-6" />
        <span className={cn("transition-all duration-300", activePanel ? "w-0 opacity-0" : "opacity-100")}>Menu</span>
      </Button>
    </div>
  )
}

