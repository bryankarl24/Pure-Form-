import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronLeft, Heart, MessageCircle } from "lucide-react"
import Image from "next/image"

export function LikedPosts() {
  const likedPosts = [
    {
      id: 1,
      username: "@fitnesscoach",
      timestamp: "2d",
      likes: "12.4K",
      comments: "234",
      thumbnail: "/placeholder.svg",
      caption: "Perfect form for deadlifts 💪 #fitness #workout",
    },
    {
      id: 2,
      username: "@healthychef",
      timestamp: "4d",
      likes: "8.2K",
      comments: "156",
      thumbnail: "/placeholder.svg",
      caption: "15-minute healthy meal prep 🥗 #mealprep #healthy",
    },
    {
      id: 3,
      username: "@yogamaster",
      timestamp: "1w",
      likes: "15.7K",
      comments: "342",
      thumbnail: "/placeholder.svg",
      caption: "Morning yoga routine for beginners 🧘‍♀️ #yoga #wellness",
    },
  ]

  return (
    <div className="fixed inset-0 bg-black text-white z-50">
      <div className="flex items-center p-4 border-b border-gray-800">
        <Button variant="ghost" size="icon" className="text-white mr-2" onClick={() => window.history.back()}>
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-semibold">Liked Posts</h1>
      </div>

      <ScrollArea className="h-[calc(100vh-60px)]">
        <div className="p-4 space-y-4">
          {likedPosts.map((post) => (
            <div key={post.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-800" />
                  <div>
                    <p className="text-sm font-medium">{post.username}</p>
                    <p className="text-xs text-gray-400">{post.timestamp}</p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden">
                <Image src={post.thumbnail || "/placeholder.svg"} alt="Post thumbnail" fill className="object-cover" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Heart className="w-12 h-12 fill-red-500 text-red-500" />
                  <span className="text-sm">{post.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">{post.comments}</span>
                </div>
              </div>
              <p className="text-sm">{post.caption}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

