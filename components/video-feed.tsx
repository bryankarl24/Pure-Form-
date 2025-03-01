"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Bookmark, ChevronUp, Share2 } from "lucide-react"
import { RecipeCard } from "./recipe-card"
import { CommentsModal } from "./comments-modal"
import { SharePostModal } from "./share-post-modal"

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

interface Post {
  id: number
  username: string
  avatar: string
  videoUrl: string
  likes: number
  isLiked: boolean
  isSaved: boolean
  comments: Comment[]
  description: string
  recipe?: {
    title: string
    ingredients: string[]
    instructions: string
    nutrition: {
      calories: number
      protein: string
      carbs: string
      fat: string
    }
  }
}

// Add this interface at the top with other interfaces
interface SuggestedAccount {
  id: number
  username: string
  avatar: string
  followers: number
  isFollowing: boolean
}

const generateComments = (postId: number): Comment[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: postId * 100 + i,
    username: `user_${Math.floor(Math.random() * 1000)}`,
    avatar: "/placeholder.svg",
    text:
      i === 0
        ? "This is exactly what I needed! 🙌"
        : i === 1
          ? "Great form! Keep it up 💪"
          : "Thanks for sharing! Very helpful",
    likes: Math.floor(Math.random() * 1000),
    timestamp: `${Math.floor(Math.random() * 24)}h ago`,
    isLiked: false,
    isFollowing: i < 3, // First 3 comments are from followed users
  }))
}

const generatePost = (id: number): Post => ({
  id,
  username: `fitness_user_${id}`,
  avatar: "/placeholder.svg",
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  likes: Math.floor(Math.random() * 10000),
  isLiked: false,
  isSaved: false,
  comments: generateComments(id),
  description:
    id % 2 === 0
      ? "💪 Perfect form check for deadlifts! Remember to keep your back straight and engage your core. #fitness #workout #form"
      : "🥗 Quick and healthy meal prep idea! High protein, low carb option for busy days. #mealprep #healthy #nutrition",
  recipe:
    id % 2 === 0
      ? undefined
      : {
          title: `Healthy Meal Prep ${id}`,
          ingredients: ["Chicken breast", "Quinoa", "Mixed vegetables", "Olive oil", "Herbs and spices"],
          instructions:
            "1. Cook quinoa according to package\n2. Grill chicken\n3. Steam vegetables\n4. Combine and season",
          nutrition: {
            calories: 450,
            protein: "35g",
            carbs: "42g",
            fat: "15g",
          },
        },
})

export function VideoFeed() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [activeComments, setActiveComments] = useState<number | null>(null)
  const [expandedCaptions, setExpandedCaptions] = useState<Set<number>>(new Set())
  const observerRef = useRef<IntersectionObserver>()
  const lastPostRef = useRef<HTMLDivElement>(null)
  const [sharePostId, setSharePostId] = useState<number | null>(null)

  // Add this inside the VideoFeed component, before the return statement
  const [suggestedAccounts, setSuggestedAccounts] = useState<SuggestedAccount[]>([
    {
      id: 1,
      username: "fitness_coach",
      avatar: "/placeholder.svg",
      followers: 125000,
      isFollowing: false,
    },
    {
      id: 2,
      username: "yoga_master",
      avatar: "/placeholder.svg",
      followers: 89000,
      isFollowing: false,
    },
    {
      id: 3,
      username: "nutrition_expert",
      avatar: "/placeholder.svg",
      followers: 234000,
      isFollowing: false,
    },
    {
      id: 4,
      username: "workout_tips",
      avatar: "/placeholder.svg",
      followers: 67000,
      isFollowing: false,
    },
    {
      id: 5,
      username: "healthy_recipes",
      avatar: "/placeholder.svg",
      followers: 156000,
      isFollowing: false,
    },
  ])

  const toggleFollow = (accountId: number) => {
    setSuggestedAccounts((prev) =>
      prev.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            isFollowing: !account.isFollowing,
          }
        }
        return account
      }),
    )
  }

  const loadMorePosts = useCallback(() => {
    setLoading(true)
    setTimeout(() => {
      const newPosts = Array.from({ length: 5 }, (_, i) => generatePost(posts.length + i))
      setPosts((prev) => [...prev, ...newPosts])
      setLoading(false)
    }, 500)
  }, [posts.length])

  useEffect(() => {
    if (posts.length === 0) {
      loadMorePosts()
    }
  }, [loadMorePosts, posts.length])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMorePosts()
        }
      },
      { threshold: 0.5 },
    )
    observerRef.current = observer

    return () => observer.disconnect()
  }, [loading, loadMorePosts])

  useEffect(() => {
    const observer = observerRef.current
    const lastPost = lastPostRef.current

    if (observer && lastPost) {
      observer.observe(lastPost)
    }

    return () => {
      if (observer && lastPost) {
        observer.unobserve(lastPost)
      }
    }
  }, [])

  useEffect(() => {
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement
          const index = Number(video.dataset.index)

          if (entry.isIntersecting) {
            video.play()
          } else {
            video.pause()
            video.currentTime = 0
          }
        })
      },
      { threshold: 0.5 },
    )

    const videos = document.querySelectorAll("video")
    videos.forEach((video) => videoObserver.observe(video))

    return () => videoObserver.disconnect()
  }, [])

  const toggleLike = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          }
        }
        return post
      }),
    )
  }

  const toggleSave = (postId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isSaved: !post.isSaved,
          }
        }
        return post
      }),
    )
  }

  const toggleCommentLike = (postId: number, commentId: number) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            comments: post.comments.map((comment) => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  isLiked: !comment.isLiked,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                }
              }
              return comment
            }),
          }
        }
        return post
      }),
    )
  }

  const toggleCaption = (postId: number) => {
    setExpandedCaptions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  // Modify the return statement to wrap the content in a flex container
  return (
    <div className="flex">
      <div className="flex-1 h-screen snap-y snap-mandatory overflow-y-auto">
        {/* Existing video feed content */}
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : undefined}
            className="snap-start h-[85vh] relative"
          >
            <video
              className="w-full h-full object-cover"
              src={post.videoUrl}
              loop
              muted
              playsInline
              data-index={index}
            />

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60">
              {/* Right side buttons */}
              <div className="absolute bottom-24 right-4 flex flex-col gap-4 items-center">
                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 h-12 w-12 rounded-full"
                    onClick={() => toggleLike(post.id)}
                  >
                    <Heart
                      className={`h-8 w-8 transition-all duration-200 ${
                        post.isLiked ? "fill-red-500 text-red-500 scale-110" : "hover:fill-red-500/20"
                      }`}
                    />
                  </Button>
                  <span className="text-white text-lg font-medium">{post.likes.toLocaleString()}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 h-12 w-12 rounded-full"
                    onClick={() => setActiveComments(post.id)}
                  >
                    <MessageCircle className="h-8 w-8 hover:fill-white/20 transition-all duration-200" />
                  </Button>
                  <span className="text-white text-lg font-medium">{post.comments.length}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 h-12 w-12 rounded-full"
                    onClick={() => toggleSave(post.id)}
                  >
                    <Bookmark
                      className={`h-8 w-8 transition-all duration-200 ${
                        post.isSaved ? "fill-white text-white scale-110" : "hover:fill-white/20"
                      }`}
                    />
                  </Button>
                  <span className="text-white text-lg font-medium">{post.isSaved ? "Saved" : "Save"}</span>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 h-12 w-12 rounded-full"
                    onClick={() => setSharePostId(post.id)}
                  >
                    <Share2 className="h-8 w-8 hover:fill-white/20 transition-all duration-200" />
                  </Button>
                  <span className="text-white text-lg font-medium">Share</span>
                </div>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-24 left-4 right-16 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar className="w-6 h-6 border border-white">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback>FT</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-sm">@{post.username}</span>
                </div>
                <div className="space-y-1">
                  <div>
                    {expandedCaptions.has(post.id) ? (
                      <p className="text-sm whitespace-pre-wrap">{post.description}</p>
                    ) : (
                      <p className="text-sm">
                        {(() => {
                          const words = post.description.split(" ")
                          let firstLine = ""
                          let secondLine = ""
                          let currentLength = 0
                          let isFirstLine = true

                          for (const word of words) {
                            if (isFirstLine) {
                              if (currentLength + word.length + 1 <= 50) {
                                firstLine += (firstLine ? " " : "") + word
                                currentLength += word.length + 1
                              } else {
                                isFirstLine = false
                                secondLine = word
                                currentLength = word.length
                              }
                            } else {
                              if (currentLength + word.length + 1 <= 50) {
                                secondLine += (secondLine ? " " : "") + word
                                currentLength += word.length + 1
                              } else {
                                secondLine = secondLine.trim() + "..."
                                break
                              }
                            }
                          }

                          return (
                            <>
                              <span>{firstLine}</span>
                              {secondLine && (
                                <>
                                  <br />
                                  <span>
                                    {secondLine}
                                    {post.description.length > 100 && (
                                      <button
                                        onClick={() => toggleCaption(post.id)}
                                        className="ml-1 text-gray-400 hover:text-white transition-colors"
                                      >
                                        more
                                      </button>
                                    )}
                                  </span>
                                </>
                              )}
                            </>
                          )
                        })()}
                      </p>
                    )}
                    {expandedCaptions.has(post.id) && (
                      <button
                        onClick={() => toggleCaption(post.id)}
                        className="text-gray-400 text-sm hover:text-white transition-colors mt-1"
                      >
                        Show less
                      </button>
                    )}
                  </div>

                  {post.recipe && (
                    <>
                      <Button
                        variant="ghost"
                        className="w-full text-white hover:bg-white/20 mt-4"
                        onClick={() => {
                          const recipeEl = document.getElementById(`recipe-${post.id}`)
                          recipeEl?.classList.toggle("hidden")
                        }}
                      >
                        <ChevronUp className="h-4 w-4 mr-2" />
                        View Recipe
                      </Button>

                      <div id={`recipe-${post.id}`} className="hidden mt-2">
                        <RecipeCard
                          title={post.recipe.title}
                          ingredients={post.recipe.ingredients}
                          instructions={post.recipe.instructions}
                          nutrition={post.recipe.nutrition}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="snap-start h-[85vh] flex items-center justify-center bg-black text-white">
            <div className="animate-pulse">Loading more content...</div>
          </div>
        )}

        {/* Comments Modal */}
        {activeComments !== null && (
          <CommentsModal
            postId={activeComments}
            comments={posts.find((p) => p.id === activeComments)?.comments || []}
            onClose={() => setActiveComments(null)}
            onLikeComment={(commentId) => toggleCommentLike(activeComments, commentId)}
          />
        )}

        {sharePostId !== null && (
          <SharePostModal
            postId={sharePostId}
            postPreview={posts.find((p) => p.id === sharePostId)?.description || ""}
            onClose={() => setSharePostId(null)}
            onShare={(userId, message) => {
              // Handle the share action here
              setSharePostId(null)
            }}
          />
        )}
      </div>

      {/* Suggested Accounts Column */}
      <div className="hidden lg:block w-[300px] h-screen bg-white border-l border-gray-200 p-4 overflow-y-auto">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Suggested for you</h2>
          {suggestedAccounts.map((account) => (
            <div key={account.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={account.avatar} />
                  <AvatarFallback>{account.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900">@{account.username}</p>
                  <p className="text-xs text-gray-500">{(account.followers / 1000).toFixed(1)}K followers</p>
                </div>
              </div>
              <Button
                variant={account.isFollowing ? "outline" : "default"}
                className="h-8"
                onClick={() => toggleFollow(account.id)}
              >
                {account.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

