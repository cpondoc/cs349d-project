import Link from "next/link";
import { PersonStanding } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-6 min-h-screen">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <PersonStanding className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors" />
          <span className="text-2xl font-extrabold tracking-tight text-blue-400 group-hover:text-blue-300 transition-colors">a11y</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-2">
        <Link href="/" className="block py-2 px-3 rounded hover:bg-gray-800 font-medium">
          Home
        </Link>
        <Link href="/logs" className="block py-2 px-3 rounded hover:bg-gray-800 font-medium">
          Logs
        </Link>
        {/* Add more links/tools here */}
      </nav>
      <div className="mt-auto text-xs text-gray-500">© 2024 Your Project</div>
    </aside>
  );
} 