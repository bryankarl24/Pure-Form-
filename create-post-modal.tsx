"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Upload, X, Video, Pause, RotateCcw } from "lucide-react"

interface CreatePostModalProps {
  onClose: () => void
  onPost: (data: { video: Blob; caption: string }) => void
}

export default function CreatePostModal({ onClose, onPost }: CreatePostModalProps) {
  const [mode, setMode] = useState<"select" | "record" | "upload" | "preview">("select")
  const [recording, setRecording] = useState(false)
  const [caption, setCaption] = useState("")
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [permissionError, setPermissionError] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const startCamera = async () => {
    try {
      setPermissionError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: true,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/mp4" })
        setVideoBlob(blob)
        setPreviewUrl(URL.createObjectURL(blob))
        setMode("preview")
      }

      mediaRecorderRef.current = mediaRecorder
      setMode("record")
    } catch (err) {
      console.error("Error accessing camera:", err)
      setPermissionError("Please allow camera access to record a video")
    }
  }

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      chunksRef.current = []
      mediaRecorderRef.current.start()
      setRecording(true)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop()
      setRecording(false)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type.startsWith("video/")) {
        setVideoBlob(file)
        setPreviewUrl(URL.createObjectURL(file))
        setMode("preview")
      } else {
        setPermissionError("Please select a valid video file")
      }
    }
  }

  const handlePost = () => {
    if (videoBlob) {
      onPost({ video: videoBlob, caption })
    }
  }

  const resetRecording = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    setVideoBlob(null)
    setPreviewUrl(null)
    setMode("select")
    setPermissionError(null)
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
        <h2 className="text-black text-lg font-semibold">Create New Post</h2>
        {mode === "preview" ? (
          <Button
            variant="ghost"
            className="font-semibold text-blue-500 hover:text-blue-600"
            disabled={!videoBlob || !caption.trim()}
            onClick={handlePost}
          >
            Share
          </Button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {mode === "select" && (
          <div className="flex-1 flex flex-col">
            {/* Camera Access Button */}
            <button
              onClick={startCamera}
              className="flex-1 flex flex-col items-center justify-center gap-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Camera className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Create New Post</h3>
                <p className="text-gray-500 text-sm">Record a video using your camera</p>
              </div>
            </button>

            {/* Upload Button */}
            <label className="flex-1 flex flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">Upload a Video</h3>
                <p className="text-gray-500 text-sm">Choose from your camera roll</p>
              </div>
              <Input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
            </label>

            {permissionError && <div className="p-4 text-red-500 text-center bg-red-50">{permissionError}</div>}
          </div>
        )}

        {mode === "record" && (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 bg-black">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className={`w-16 h-16 rounded-full border-4 ${
                    recording
                      ? "border-red-500 bg-red-500 hover:bg-red-600 hover:border-red-600"
                      : "border-white bg-white/20 hover:bg-white/30"
                  }`}
                  onClick={recording ? stopRecording : startRecording}
                >
                  {recording ? <Pause className="h-8 w-8 text-white" /> : <Video className="h-8 w-8 text-white" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {mode === "preview" && (
          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 bg-black">
              <video src={previewUrl || undefined} controls className="w-full h-full object-cover" />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                onClick={resetRecording}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Textarea
                placeholder="Write a caption..."
                className="min-h-[100px] resize-none border-0 focus-visible:ring-0 text-lg p-0"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

