"use client"

import { useActionState } from "react"
import { loginAction } from "@/app/[locale]/admin/actions"
import { Loader2, Lock, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#02050b] px-6 relative">
      {/* Background visual effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-md w-full flex flex-col gap-6">
        {/* Return Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs text-muted hover:text-white transition-colors group font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Return to site
          </Link>
        </div>

        {/* Login Card */}
        <div className="glass rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight">
              Control Panel
            </h1>
            <p className="text-muted text-xs">
              Provide encrypted administrator credentials to gain access.
            </p>
          </div>

          <form action={formAction} className="flex flex-col gap-4">
            {state?.error && (
              <div className="p-3.5 bg-red-950/30 border border-red-500/20 text-red-200 text-xs rounded-xl text-center">
                {state.error}
              </div>
            )}

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-gray-400">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isPending}
                  placeholder="admin@portfolio.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  disabled={isPending}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#050811] border border-card-border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-hover text-white font-semibold rounded-xl transition-all disabled:opacity-50 cursor-pointer text-sm shadow-lg shadow-primary/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Authenticate Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
