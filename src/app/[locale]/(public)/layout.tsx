import { type ReactNode } from "react"

import { LenisProvider } from "@/components/animations/lenis-provider"
import ReadingProgress from "@/components/blog/ReadingProgress"
import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <ReadingProgress />
      {/* Dynamic Background Grid & Ambient Glows */}
      <div className="fixed inset-0 -z-50 w-full h-full bg-background overflow-hidden pointer-events-none">
        {/* Subtle primary-colored grid pattern */}
        <div className="absolute inset-0 bg-grid-primary opacity-100" />
        
        {/* Glowing Ambient Blobs */}
        {/* Glow 1: Top-Center Indigo */}
        <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/10 blur-[130px] animate-pulse-slow" />
        
        {/* Glow 2: Middle-Right Teal */}
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full bg-accent/5 blur-[120px]" />

        {/* Glow 3: Middle-Left Indigo/Purple */}
        <div className="absolute top-[60%] left-[-10%] w-[55vw] h-[55vw] max-w-[550px] max-h-[550px] rounded-full bg-primary/5 blur-[140px]" />

        {/* Glow 4: Bottom-Right Teal */}
        <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[450px] max-h-[450px] rounded-full bg-accent/5 blur-[110px]" />
      </div>

      <Navbar />
      <main className="flex-1 w-full pt-24 relative">
        {children}
      </main>
      <Footer />
    </LenisProvider>
  )
}
