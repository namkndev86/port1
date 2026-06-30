import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import { LenisProvider } from "@/components/animations/lenis-provider"
import { ReactNode } from "react"

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <LenisProvider>
      <Navbar />
      <main className="flex-1 w-full pt-24">
        {children}
      </main>
      <Footer />
    </LenisProvider>
  )
}
