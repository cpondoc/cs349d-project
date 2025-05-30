import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import { PageTitleProvider } from "@/components/page-title-context"
import Header from "@/components/Header"
import "./globals.css"

export const metadata: Metadata = {
  description: "Dashboard for analyzing browser agent telemetry data",
  generator: "v0.dev",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PageTitleProvider>
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-8 bg-gray-950">{children}</main>
              </div>
            </div>
          </PageTitleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
