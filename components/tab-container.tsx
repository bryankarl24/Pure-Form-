"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
  badge?: number
  content: React.ReactNode
}

interface TabContainerProps {
  tabs: TabItem[]
  defaultTab?: string
  variant?: "default" | "pills" | "underline" | "minimal"
  orientation?: "horizontal" | "vertical"
  fullWidth?: boolean
  className?: string
  tabsListClassName?: string
  tabsTriggerClassName?: string
  tabsContentClassName?: string
  onChange?: (value: string) => void
}

export function TabContainer({
  tabs,
  defaultTab,
  variant = "default",
  orientation = "horizontal",
  fullWidth = false,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  onChange,
}: TabContainerProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab || tabs[0]?.id || "")

  useEffect(() => {
    if (defaultTab && defaultTab !== activeTab) {
      setActiveTab(defaultTab)
    }
  }, [defaultTab, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    if (onChange) {
      onChange(value)
    }
  }

  const getVariantStyles = () => {
    switch (variant) {
      case "pills":
        return {
          list: "bg-transparent p-0 gap-2",
          trigger: "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        }
      case "underline":
        return {
          list: "bg-transparent p-0 border-b",
          trigger:
            "rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none",
        }
      case "minimal":
        return {
          list: "bg-transparent p-0",
          trigger:
            "bg-transparent data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:font-semibold data-[state=active]:shadow-none",
        }
      default:
        return {
          list: "",
          trigger: "",
        }
    }
  }

  const variantStyles = getVariantStyles()

  return (
    <Tabs
      value={activeTab}
      onValueChange={handleTabChange}
      className={cn("w-full", orientation === "vertical" && "flex", className)}
    >
      <TabsList
        className={cn(
          variantStyles.list,
          orientation === "vertical" && "flex-col items-start",
          fullWidth && "w-full",
          tabsListClassName,
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className={cn(
              variantStyles.trigger,
              "relative transition-all duration-200",
              fullWidth && "flex-1 w-full",
              orientation === "vertical" && "justify-start w-full",
              tabsTriggerClassName,
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                {tab.badge}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className={cn("flex-1", orientation === "vertical" && "ml-4")}>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            value={tab.id}
            className={cn(
              "transition-opacity duration-300 ease-in-out data-[state=inactive]:opacity-0 data-[state=active]:opacity-100",
              tabsContentClassName,
            )}
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}

