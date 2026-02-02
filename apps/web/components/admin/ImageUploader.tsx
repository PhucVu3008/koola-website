'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';

interface ImageUploaderProps {
  value: string; // asset_id or URL
  onChange: (assetId: string) => void;
  label?: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

/**
 * ImageUploader Component
 * 
 * Allows admin to upload images with:
 * - Drag & drop support
 * - File size validation
 * - Image preview
 * - Upload progress
 */
export default function ImageUploader({
  value,
  onChange,
  label = 'Image',
  required = false,
  accept = 'image/jpeg,image/png,image/webp',
  maxSizeMB = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get API base URL from env (set in docker-compose.yml or .env.local)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  // Load existing image when value changes (for edit mode)
  useEffect(() => {
    if (value && value !== preview) {
      // If value is numeric, it's an asset_id - fetch the media
      if (/^\d+$/.test(value)) {
        loadExistingImage(parseInt(value));
      } else {
        // Otherwise treat as direct URL
        setPreview(value);
      }
    } else if (!value) {
      setPreview('');
    }
  }, [value]);

  const loadExistingImage = async (assetId: number) => {
    setLoading(true);
    try {
      const response = await adminApi.getMediaById(assetId);
      const media = response.data as any;
      
      // Construct full URL (backend returns relative URL)
      const imageUrl = media.url?.startsWith('http') 
        ? media.url 
        : `${apiBaseUrl}${media.url || `/uploads/${media.storage_path}`}`;
      
      setPreview(imageUrl);
    } catch (err: any) {
      console.error('Failed to load image:', err);
      setPreview('');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError('');

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!accept.split(',').some(type => file.type.includes(type.replace('image/', '')))) {
      setError('Invalid file type. Please upload an image.');
      return;
    }

    setUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

      // Upload to API
      const response = await adminApi.uploadMedia(formData);
      const uploadedAsset = response.data;

      console.log('[ImageUploader] Upload response:', uploadedAsset);

      // Update state
      onChange(uploadedAsset.id.toString());
      
      // Construct full URL for preview
      // Backend returns relative URL like "/uploads/media/123.jpg"
      // We need full URL like "http://localhost:4000/uploads/media/123.jpg"
      const imageUrl = uploadedAsset.url?.startsWith('http') 
        ? uploadedAsset.url 
        : `${apiBaseUrl}${uploadedAsset.url || ''}`;
      
      console.log('[ImageUploader] Preview URL:', imageUrl);
      setPreview(imageUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange('');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Upload Area or Preview */}
      {preview ? (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            onError={(e) => {
              console.error('[ImageUploader] Image failed to load:', preview);
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EError%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            {preview.substring(0, 50)}...
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600">
                <span className="text-blue-500 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                {accept.split(',').map(t => t.split('/')[1].toUpperCase()).join(', ')} (Max {maxSizeMB}MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
}
