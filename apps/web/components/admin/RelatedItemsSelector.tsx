/**
 * Related Items Selector Component
 * 
 * Multi-select interface for choosing related services or posts
 * Supports search and displays selected items with remove buttons
 */

'use client';

import { useState, useEffect } from 'react';
import { Search, X, ExternalLink } from 'lucide-react';

interface RelatedItem {
  id: number;
  title: string;
  locale: string;
  status?: string;
  slug?: string;
}

interface RelatedItemsSelectorProps {
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  availableItems: RelatedItem[];
  type: 'services' | 'posts';
  maxItems?: number;
  currentItemId?: number; // To exclude current item from selection
}

export function RelatedItemsSelector({
  selectedIds,
  onChange,
  availableItems,
  type,
  maxItems = 3,
  currentItemId,
}: RelatedItemsSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter out current item and already selected items from available list
  const filteredItems = availableItems.filter((item) => {
    // Exclude current item
    if (currentItemId && item.id === currentItemId) return false;
    
    // Search filter
    if (searchTerm) {
      return item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  const selectedItems = availableItems.filter((item) => {
    // CRITICAL: Ensure type safety - convert both to numbers for comparison
    const itemIdNum = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
    return selectedIds.includes(itemIdNum);
  });

  const unselectedItems = filteredItems.filter((item) => {
    const itemIdNum = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
    return !selectedIds.includes(itemIdNum);
  });

  const handleToggleItem = (id: number) => {
    if (selectedIds.includes(id)) {
      // Remove
      onChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      // Add (check max limit)
      if (selectedIds.length < maxItems) {
        onChange([...selectedIds, id]);
      }
    }
  };

  const handleRemoveItem = (id: number) => {
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  };

  const typeLabel = type === 'services' ? 'Services' : 'Posts';
  const typeLabelSingular = type === 'services' ? 'Service' : 'Post';

  return (
    <div className="space-y-4 border-t pt-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🔗 Related {typeLabel}
        </h3>
        <p className="text-sm text-gray-600">
          Select up to {maxItems} related {type} to display on the service detail page
        </p>
      </div>

      {/* Selected Items Display */}
      {selectedItems.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selected ({selectedItems.length}/{maxItems})
          </label>
          <div className="space-y-2">
            {selectedItems.map((item) => {
              const itemIdNum = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
              return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-500 uppercase flex-shrink-0">
                    {item.locale}
                  </span>
                  {item.status && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                        item.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(itemIdNum)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-100 p-1 rounded transition-colors flex-shrink-0"
                  title={`Remove ${typeLabelSingular}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
            })}
          </div>
        </div>
      )}

      {/* Add More Section */}
      {selectedIds.length < maxItems && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add {typeLabel}
          </label>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder={`Search ${type}...`}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Dropdown List */}
          {isOpen && (
            <div className="relative">
              <div className="absolute z-10 w-full max-h-64 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
                {unselectedItems.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    {searchTerm
                      ? `No ${type} found matching "${searchTerm}"`
                      : `No more ${type} available`}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {unselectedItems.map((item) => {
                      const itemIdNum = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
                      return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          handleToggleItem(itemIdNum);
                          if (selectedIds.length + 1 >= maxItems) {
                            setIsOpen(false);
                            setSearchTerm('');
                          }
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className="text-sm text-gray-900 truncate">
                            {item.title}
                          </span>
                          <span className="text-xs text-gray-500 uppercase flex-shrink-0">
                            {item.locale}
                          </span>
                          {item.status && (
                            <span
                              className={`text-xs px-2 py-0.5 rounded flex-shrink-0 ${
                                item.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          )}
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </button>
                    );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Close dropdown when clicking outside */}
          {isOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }}
            />
          )}
        </div>
      )}

      {/* Limit Warning */}
      {selectedIds.length >= maxItems && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⚠️ Maximum of {maxItems} {type} reached. Remove one to add another.
          </p>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">ℹ️ About Related {typeLabel}</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Related items appear at the bottom of the service detail page</li>
          <li>• Choose {type} that are relevant and complementary</li>
          <li>• Order doesn't matter (displayed in a grid)</li>
          <li>• Only published items will show on the public site</li>
        </ul>
      </div>
    </div>
  );
}
