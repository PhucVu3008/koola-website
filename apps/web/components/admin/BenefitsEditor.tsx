/**
 * Benefits Editor Component
 * 
 * Manages service benefits with add/edit/remove/reorder functionality
 * Supports drag-and-drop reordering
 */

'use client';

import { useState } from 'react';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';
import IconPicker from './IconPicker';

export interface Benefit {
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
}

interface BenefitsEditorProps {
  benefits: Benefit[];
  onChange: (benefits: Benefit[]) => void;
  subtitle: string;
  onSubtitleChange: (subtitle: string) => void;
}

export function BenefitsEditor({ 
  benefits, 
  onChange, 
  subtitle, 
  onSubtitleChange 
}: BenefitsEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addBenefit = () => {
    const newBenefit: Benefit = {
      title: '',
      description: '',
      icon_name: 'check-circle',
      sort_order: benefits.length,
    };
    onChange([...benefits, newBenefit]);
  };

  const removeBenefit = (index: number) => {
    const updated = benefits.filter((_, i) => i !== index);
    // Recalculate sort_order
    const reordered = updated.map((b, i) => ({ ...b, sort_order: i }));
    onChange(reordered);
  };

  const updateBenefit = (index: number, field: keyof Benefit, value: string) => {
    const updated = [...benefits];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const moveBenefit = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const updated = [...benefits];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);
    
    // Recalculate sort_order
    const reordered = updated.map((b, i) => ({ ...b, sort_order: i }));
    onChange(reordered);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    
    // Visual feedback
    const target = e.currentTarget as HTMLElement;
    target.style.borderTop = draggedIndex < index ? '2px solid #3b82f6' : '';
    target.style.borderBottom = draggedIndex > index ? '2px solid #3b82f6' : '';
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement;
    target.style.borderTop = '';
    target.style.borderBottom = '';
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    target.style.borderTop = '';
    target.style.borderBottom = '';
    
    if (draggedIndex !== null) {
      moveBenefit(draggedIndex, toIndex);
      setDraggedIndex(null);
    }
  };

  return (
    <div className="space-y-6 border-t pt-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🎯 Key Benefits
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Highlight the main advantages and value propositions of this service
        </p>
      </div>

      {/* Benefits Subtitle */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Benefits Section Subtitle
        </label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          placeholder="e.g., Why Choose Our Service?"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional subtitle displayed above benefits section
        </p>
      </div>

      {/* Benefits List */}
      <div className="space-y-4">
        {benefits.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No benefits added yet</p>
            <button
              type="button"
              onClick={addBenefit}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add First Benefit
            </button>
          </div>
        ) : (
          <>
            {benefits.map((benefit, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-move"
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 mt-2 text-gray-400 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  {/* Benefit Content */}
                  <div className="flex-1 space-y-3">
                    {/* Header with index and delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500">
                        Benefit #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeBenefit(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded transition-colors"
                        title="Remove benefit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={benefit.title}
                        onChange={(e) => updateBenefit(index, 'title', e.target.value)}
                        placeholder="e.g., Enhanced Security"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={benefit.description}
                        onChange={(e) => updateBenefit(index, 'description', e.target.value)}
                        placeholder="Describe this benefit in detail..."
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>

                    {/* Icon Picker */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Icon
                      </label>
                      <IconPicker
                        value={benefit.icon_name}
                        onChange={(icon) => updateBenefit(index, 'icon_name', icon)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <button
              type="button"
              onClick={addBenefit}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Another Benefit
            </button>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Drag and drop to reorder benefits</li>
          <li>• Use clear, benefit-focused titles (not feature descriptions)</li>
          <li>• Keep descriptions concise (1-2 sentences)</li>
          <li>• Choose meaningful icons that represent each benefit</li>
          <li>• Aim for 3-6 benefits for best impact</li>
        </ul>
      </div>
    </div>
  );
}
