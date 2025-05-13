"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center space-x-4">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/logs"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/logs" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Logs
          </Link>
        </div>
      </div>
    </nav>
  )
} 