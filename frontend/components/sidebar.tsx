import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col p-6 min-h-screen">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          {/* Accessibility icon (SVG) */}
          <span className="inline-block">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 group-hover:text-blue-300 transition-colors"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="8" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
          </span>
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