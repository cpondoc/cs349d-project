import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Nav } from "@/components/nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Browser Agent Telemetry Dashboard",
  description: "Dashboard for analyzing browser agent telemetry data",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Nav />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
