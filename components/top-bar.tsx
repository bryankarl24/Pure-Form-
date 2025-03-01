import { Logo } from "@/components/ui/logo"
import { Menu } from "lucide-react"

interface TopBarProps {
  onOpen: () => void
}

export const TopBar = ({ onOpen }: TopBarProps) => {
  return (
    <div className="border-b border-border/10 px-4 py-2 md:hidden">
      <div className="flex items-center justify-between">
        <button onClick={onOpen} className="p-2">
          <Menu />
        </button>
        <div className="md:hidden">
          <Logo className="text-white" />
        </div>
        <div className="w-8"></div>
      </div>
    </div>
  )
}

