"use client"

import type React from "react"

import { useState } from "react"
import { X, Heart, MessageCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"

interface VideoModalProps {
  video: {
    id: number
    username: string
    caption: string
    likes: number
    comments: number
  }
  onClose: () => void
}

// Mock comments data
const mockComments = [
  {
    id: 1,
    username: "fitness_pro",
    avatar: "/placeholder.svg",
    comment: "Great form! Keep up the amazing work 💪",
    likes: 245,
    time: "2h",
    isLiked: false,
  },
  {
    id: 2,
    username: "workout_queen",
    avatar: "/placeholder.svg",
    comment: "This is exactly what I needed! Thanks for sharing 🙏",
    likes: 189,
    time: "4h",
    isLiked: true,
  },
  {
    id: 3,
    username: "health_guru",
    avatar: "/placeholder.svg",
    comment: "Love the energy in this video! Can you share your playlist?",
    likes: 156,
    time: "6h",
    isLiked: false,
  },
  // Add more mock comments...
  ...Array.from({ length: 10 }, (_, i) => ({
    id: i + 4,
    username: `user_${i + 1}`,
    avatar: "/placeholder.svg",
    comment: `This is amazing! ${i % 2 === 0 ? "🔥" : "💪"}`,
    likes: Math.floor(Math.random() * 200),
    time: `${Math.floor(Math.random() * 24)}h`,
    isLiked: Math.random() > 0.5,
  })),
]

export function VideoModal({ video, onClose }: VideoModalProps) {
  const [comments, setComments] = useState(mockComments)
  const [newComment, setNewComment] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const handleLikeComment = (commentId: number) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        return comment
      }),
    )
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newCommentObj = {
      id: comments.length + 1,
      username: "current_user",
      avatar: "/placeholder.svg",
      comment: newComment,
      likes: 0,
      time: "now",
      isLiked: false,
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className="relative bg-black rounded-xl overflow-hidden flex max-w-6xl w-full max-h-[85vh]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Video Section */}
        <div className="w-[55%] relative bg-black p-4">
          <div className="aspect-[9/16] relative border-2 border-white/10 rounded-lg overflow-hidden">
            <video src="/placeholder.mp4" className="w-full h-full object-contain" controls autoPlay />
          </div>
        </div>

        {/* Comments Section */}
        <div className="w-[40%] bg-white flex flex-col">
          {/* Video Info */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{video.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">@{video.username}</h3>
                  <p className="text-sm text-gray-500">{video.caption}</p>
                </div>
              </div>
              <Button
                variant={isFollowing ? "outline" : "default"}
                className="h-8"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{formatNumber(video.likes)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>{formatNumber(video.comments)}</span>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">@{comment.username}</span>
                      <span className="text-xs text-gray-500">{comment.time}</span>
                    </div>
                    <p className="text-sm mt-0.5">{comment.comment}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <button
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <Heart className={`h-3.5 w-3.5 ${comment.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{formatNumber(comment.likes)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Comment Input */}
          <form onSubmit={handleSubmitComment} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newComment.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

