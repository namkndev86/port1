"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactMessageSchema, ContactMessageInput } from "@/lib/validation"
import { useState } from "react"
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: ContactMessageInput) => {
    setStatus("submitting")
    setErrorMessage("")
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to submit message")
      }

      setStatus("success")
      reset()
    } catch (err: any) {
      console.error(err)
      setStatus("error")
      setErrorMessage(err.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <div className="w-full glass rounded-2xl p-6 md:p-8 shadow-xl">
      {status === "success" ? (
        <div className="flex flex-col items-center text-center py-10 gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-accent animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-2xl text-white">Message Transmitted!</h3>
          <p className="text-muted max-w-sm">
            Thank you for reaching out. Your message has been saved in the system, and I will get back to you shortly.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-4 px-6 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-full transition-colors"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-950/30 border border-red-500/20 text-red-200 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Name & Email Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-semibold text-gray-300">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                disabled={status === "submitting"}
                placeholder="John Doe"
                {...register("name")}
                className="w-full px-4 py-3 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
              />
              {errors.name && <span className="text-xs text-red-400 font-medium">{errors.name.message}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                disabled={status === "submitting"}
                placeholder="john@example.com"
                {...register("email")}
                className="w-full px-4 py-3 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
              />
              {errors.email && <span className="text-xs text-red-400 font-medium">{errors.email.message}</span>}
            </div>
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject" className="text-sm font-semibold text-gray-300">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              disabled={status === "submitting"}
              placeholder="Collaboration proposal..."
              {...register("subject")}
              className="w-full px-4 py-3 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
            />
            {errors.subject && <span className="text-xs text-red-400 font-medium">{errors.subject.message}</span>}
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-semibold text-gray-300">
              Message Body
            </label>
            <textarea
              id="message"
              disabled={status === "submitting"}
              rows={5}
              placeholder="Tell me about your project context and technical challenges..."
              {...register("message")}
              className="w-full px-4 py-3 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm resize-none"
            />
            {errors.message && <span className="text-xs text-red-400 font-medium">{errors.message.message}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full mt-2 flex items-center justify-center gap-2 py-4 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Encrypting & Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Transmit Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  )
}
