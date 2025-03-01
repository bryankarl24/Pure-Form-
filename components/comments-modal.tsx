"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Heart, X } from "lucide-react"

interface Comment {
  id: number
  username: string
  avatar: string
  text: string
  likes: number
  timestamp: string
  isLiked: boolean
  isFollowing: boolean
}

interface CommentsModalProps {
  comments: Comment[]
  onClose: () => void
  onLikeComment: (commentId: number) => void
}

export function CommentsModal({ comments, onClose, onLikeComment }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("")

  // Sort comments: following first, then by likes
  const sortedComments = [...comments].sort((a, b) => {
    if (a.isFollowing && !b.isFollowing) return -1
    if (!a.isFollowing && b.isFollowing) return 1
    return b.likes - a.likes
  })

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-end sm:items-center justify-center">
      <div className="bg-black w-full sm:max-w-lg sm:rounded-lg border border-gray-800 h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white text-lg font-semibold">Comments</h2>
          <Button variant="ghost" size="icon" className="text-white" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Comments list */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {sortedComments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={comment.avatar} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-semibold">@{comment.username}</span>
                    {comment.isFollowing && <span className="text-xs text-gray-400">Following</span>}
                    <span className="text-xs text-gray-400">{comment.timestamp}</span>
                  </div>
                  <p className="text-white text-sm mt-1">{comment.text}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onLikeComment(comment.id)}>
                      <Heart className={`h-4 w-4 ${comment.isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                    </Button>
                    <span className="text-xs text-gray-400">{comment.likes.toLocaleString()} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Comment input */}
        <div className="p-4 border-t border-gray-800">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              // Handle comment submission
              setNewComment("")
            }}
            className="flex gap-2"
          >
            <Input
              className="flex-1 bg-gray-800 border-0 text-white placeholder:text-gray-400"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              className="text-white hover:bg-gray-800"
              disabled={!newComment.trim()}
            >
              Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

