import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans, Space_Mono } 
  from "next/font/google"
import { Providers } from "./providers"
import { SearchOverlay } from "@/components/layout/SearchOverlay"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-cormorant",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
})

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MAISON — Luxury Fashion",
  description: 
    "Clothes, Handbags & Accessories. Crafted with intention.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${cormorant.variable} 
          ${dmSans.variable} 
          ${spaceMono.variable}
          font-dm-sans antialiased
        `}
        suppressHydrationWarning={true}
      >
        <Providers>
          <SearchOverlay />
          {children}
        </Providers>
      </body>
    </html>
  )
}
