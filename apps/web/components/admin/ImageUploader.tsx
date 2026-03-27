'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { logger } from '@/lib/logger';

interface ImageUploaderProps {
  /** Numeric asset ID (string) from DB, or empty string for no image. */
  value: string;
  onChange: (assetId: string) => void;
  label?: string;
  required?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

/**
 * Resolve a backend storage_path to a full public URL via nginx.
 *
 * NEXT_PUBLIC_API_BASE_URL = "https://koola.vn/api"
 * → we strip "/api" to get "https://koola.vn"
 * → final URL = "https://koola.vn/uploads/media/xxx.jpg"
 *
 * Locally: "http://localhost:4000" → no strip needed (no /api suffix)
 */
function resolveImageUrl(storagePath: string): string {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';
  const base = raw.replace(/\/$/, '').replace(/\/api$/, '');
  return `${base}/uploads/${storagePath}`;
}

/**
 * ImageUploader — drag-and-drop image upload with preview.
 *
 * On upload:
 * - POSTs multipart form to /v1/admin/media
 * - Calls onChange(assetId) with the numeric ID as string
 * - Shows preview immediately (no page reload needed)
 *
 * On edit (value already set):
 * - Fetches media metadata by ID to build preview URL
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
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When value (asset ID) changes from outside (e.g. edit mode), load preview
  useEffect(() => {
    if (!value) {
      setPreview('');
      return;
    }
    // Only fetch if value is a numeric ID and preview not yet set for this ID
    if (/^\d+$/.test(value)) {
      loadPreviewById(parseInt(value, 10));
    } else {
      setPreview(value);
    }
  }, [value]);

  const loadPreviewById = async (assetId: number) => {
    setLoadingPreview(true);
    try {
      const response = await adminApi.getMediaById(assetId);
      const media = response.data as any;
      const storagePath = media.storage_path ?? media.url?.replace('/uploads/', '');
      if (storagePath) setPreview(resolveImageUrl(storagePath));
    } catch (err: any) {
      logger.error('ImageUploader: failed to load preview', err, { assetId });
      setPreview('');
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleFileSelect = async (file: File) => {
    setError('');

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    const acceptedTypes = accept.split(',').map(t => t.trim());
    if (!acceptedTypes.some(t => file.type === t || file.type.startsWith(t.replace('*', '')))) {
      setError('Invalid file type. Accepted: ' + acceptedTypes.join(', '));
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

      const response = await adminApi.uploadMedia(fd);
      const asset = response.data as any;

      // asset.storage_path = "media/timestamp-random.jpg"
      const storagePath = asset.storage_path ?? asset.url?.replace('/uploads/', '');
      if (storagePath) setPreview(resolveImageUrl(storagePath));

      onChange(String(asset.id));
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    onChange('');
    setPreview('');
    setError('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Preview state */}
      {loadingPreview ? (
        <div className="flex items-center justify-center h-48 border-2 border-gray-200 rounded-lg bg-gray-50">
          <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
        </div>
      ) : preview ? (
        <div className="relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              setError('Could not load image preview. The file may have been moved.');
            }}
          />
          {/* Change / Remove actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-gray-800 rounded-md text-sm font-medium shadow hover:bg-gray-100"
            >
              Change
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-red-500 text-white rounded-md text-sm font-medium shadow hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        /* Upload drop zone */
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors select-none
            ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
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
                <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-400">
                JPG, PNG, WEBP — max {maxSizeMB}MB
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
      />

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <X className="w-4 h-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
