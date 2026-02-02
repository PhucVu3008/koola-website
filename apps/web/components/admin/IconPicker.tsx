'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  required?: boolean;
}

// Popular icons for quick access
const POPULAR_ICONS = [
  'Wrench', 'Shield', 'Cloud', 'Database', 'Smartphone', 'Monitor',
  'Server', 'Lock', 'Zap', 'Globe', 'Code', 'Settings',
  'Users', 'CheckCircle', 'Star', 'Heart', 'TrendingUp', 'Package',
];

/**
 * IconPicker Component
 * 
 * Allows admin to select Lucide icons with:
 * - Visual preview of icons
 * - Search functionality
 * - Popular icons quick access
 * - Dropdown interface
 */
export default function IconPicker({
  value,
  onChange,
  label = 'Icon',
  required = false,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredIcons, setFilteredIcons] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all available icons
  const allIcons = Object.keys(LucideIcons).filter(
    key => key !== 'createLucideIcon' && key !== 'default' && /^[A-Z]/.test(key)
  );

  useEffect(() => {
    // Filter icons based on search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = allIcons.filter(icon =>
        icon.toLowerCase().includes(query)
      );
      setFilteredIcons(filtered.slice(0, 50)); // Limit to 50 results
    } else {
      setFilteredIcons(POPULAR_ICONS);
    }
  }, [searchQuery]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
    setSearchQuery('');
  };

  const renderIcon = (iconName: string, size = 20) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent size={size} />;
  };

  const capitalizeIconName = (name: string) => {
    // Convert camelCase to Title Case
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <div className="space-y-2 relative" ref={dropdownRef}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Selected Icon Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
      >
        <div className="flex items-center gap-3">
          {value && renderIcon(value, 24)}
          <span className="text-gray-700">
            {value ? capitalizeIconName(value) : 'Select an icon'}
          </span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-w-md">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search icons..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {searchQuery ? `${filteredIcons.length} results` : 'Popular icons'}
            </p>
          </div>

          {/* Icon Grid */}
          <div className="p-3 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-4 gap-2">
              {filteredIcons.map((iconName) => (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => handleSelect(iconName)}
                  className={`
                    p-3 rounded-lg border-2 flex flex-col items-center gap-2 transition-all
                    hover:border-blue-500 hover:bg-blue-50
                    ${value === iconName ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  `}
                  title={capitalizeIconName(iconName)}
                >
                  {renderIcon(iconName, 24)}
                  <span className="text-xs text-gray-600 text-center truncate w-full">
                    {iconName}
                  </span>
                </button>
              ))}
            </div>

            {filteredIcons.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">No icons found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 text-xs text-gray-500 text-center">
            <a
              href="https://lucide.dev/icons"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Browse all {allIcons.length} Lucide icons →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
