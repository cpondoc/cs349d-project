"use client";
import { usePageTitle } from "./page-title-context";

export default function Header() {
  const { title } = usePageTitle();
  return (
    <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-900">
      <span className="text-xl font-bold tracking-tight">{title}</span>
      <div className="flex items-center gap-4">{/* User info, settings, etc. */}</div>
    </header>
  );
} 