import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import { PageTitleProvider } from "@/components/page-title-context"
import Header from "@/components/Header"
import "./globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Agent o11y: Browser Agent Observability",
  description: "Dashboard for analyzing browser agent observability data",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦸</text></svg>",
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
    <html lang="en" suppressHydrationWarning={true} className={inter.className}>
      <body className="bg-gray-950 text-gray-100" suppressHydrationWarning={true}>
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
