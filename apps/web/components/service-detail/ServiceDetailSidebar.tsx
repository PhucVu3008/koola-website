/**
 * ServiceDetailSidebar Component
 *
 * Right sidebar with:
 * 1. Search widget
 * 2. Social links widget ("Stay in touch")
 *
 * Matches reference image exactly.
 */

'use client';

import { useState } from 'react';
import { Search, Send } from 'lucide-react';

export type SocialLink = {
  name: string;
  icon: React.ReactNode;
  href: string;
};

export type ServiceDetailSidebarData = {
  searchTitle: string;
  searchPlaceholder: string;
  socialTitle: string;
  socialLinks: SocialLink[];
};

export function ServiceDetailSidebar({ data }: { data: ServiceDetailSidebarData }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <aside className="space-y-6">
      {/* Search Widget - Enhanced */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <h3 className="mb-5 text-xl font-bold text-slate-900">{data.searchTitle}</h3>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={data.searchPlaceholder}
            className="w-full rounded-xl border-2 border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
          />
          <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        </form>
      </div>

      {/* Social Widget - Enhanced */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
        <h3 className="mb-5 text-xl font-bold text-slate-900">{data.socialTitle}</h3>
        <div className="flex flex-wrap gap-3">
          {data.socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-12 w-12 items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-600 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 hover:scale-110 hover:shadow-md"
              aria-label={link.name}
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
