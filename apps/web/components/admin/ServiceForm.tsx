/**
 * Service Form Component
 * 
 * Reusable form for creating and editing services
 * Supports bilingual (EN/VI) with proper validation
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import { Save, X, Loader2, AlertCircle, Plus, ChevronDown } from 'lucide-react';
import ImageUploader from './ImageUploader';
import IconPicker from './IconPicker';
import { TranslationSyncModal } from './TranslationSyncModal';
import { BenefitsEditor, type Benefit } from './BenefitsEditor';
import { RelatedItemsSelector } from './RelatedItemsSelector';

interface ServiceFormProps {
  serviceId?: number;
  locale: 'en' | 'vi';
  mode: 'create' | 'edit';
}

interface ServiceFormData {
  title: string;
  slug: string;
  slug_group: string;
  description: string;
  short_description: string;
  locale: string;
  status: 'draft' | 'published' | 'archived';
  hero_image_url: string;
  icon_name: string;
  display_order: number;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
}

export function ServiceForm({ serviceId, locale, mode }: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [savedServiceId, setSavedServiceId] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [slugGroups, setSlugGroups] = useState<string[]>([]);
  const [isCreatingNewSlugGroup, setIsCreatingNewSlugGroup] = useState(false);
  const [showSlugGroupDropdown, setShowSlugGroupDropdown] = useState(false);
  const [slugGroupManuallyEdited, setSlugGroupManuallyEdited] = useState(false);
  
  // Benefits and related items state
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [benefitsSubtitle, setBenefitsSubtitle] = useState('');
  const [relatedServiceIds, setRelatedServiceIds] = useState<number[]>([]);
  const [relatedPostIds, setRelatedPostIds] = useState<number[]>([]);
  const [availableServices, setAvailableServices] = useState<any[]>([]);
  const [availablePosts, setAvailablePosts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    slug: '',
    slug_group: '',
    description: '',
    short_description: '',
    locale: locale,
    status: 'draft',
    hero_image_url: '',
    icon_name: 'wrench',
    display_order: 0,
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
  });

  useEffect(() => {
    if (mode === 'edit' && serviceId) {
      loadService();
    }
    // Load available slug groups for selection
    loadSlugGroups();
    
    // Load available services and posts for related items selection
    loadAvailableItems();
    
    // Default to "Create New" mode when creating a service
    if (mode === 'create') {
      setIsCreatingNewSlugGroup(true);
    }
  }, [serviceId, mode]);

  const loadAvailableItems = async () => {
    try {
      // Load services
      const servicesResponse = await adminApi.listServices({ locale, pageSize: 100 });
      const services = (servicesResponse.data as any[]) || [];
      setAvailableServices(services);
      
      // Load posts
      const postsResponse = await adminApi.listPosts({ locale, pageSize: 100 });
      const posts = (postsResponse.data as any[]) || [];
      setAvailablePosts(posts);
    } catch (err) {
      console.error('Failed to load available items:', err);
    }
  };

  const loadSlugGroups = async () => {
    try {
      // Fetch all services to extract unique slug groups
      const response = await adminApi.listServices({ locale, pageSize: 100 });
      // API returns { data: [...services], meta: {...} }
      const services = (response.data as any) || [];
      
      console.log('Loaded services for slug groups:', services.length);
      
      // Extract unique slug groups
      const uniqueSlugGroups = Array.from(
        new Set(
          services
            .map((s: any) => s.slug_group)
            .filter((sg: string) => sg && sg.trim() !== '')
        )
      ) as string[];
      
      console.log('Unique slug groups:', uniqueSlugGroups);
      setSlugGroups(uniqueSlugGroups.sort());
    } catch (err) {
      console.error('Failed to load slug groups:', err);
    }
  };

  const loadService = async () => {
    if (!serviceId) return;
    
    setLoading(true);
    try {
      const response = await adminApi.getServiceById(serviceId);
      // API returns {data: {service: {...}, tags: [...], categories: [...], benefits: [...], ...}}
      const responseData = response.data as any;
      const serviceData = responseData.service;
      
      const newFormData = {
        title: serviceData.title || '',
        slug: serviceData.slug || '',
        slug_group: serviceData.slug_group || '',
        description: serviceData.content_md || '', // DB field: content_md
        short_description: serviceData.excerpt || '', // DB field: excerpt
        locale: serviceData.locale || locale,
        status: serviceData.status || 'draft',
        hero_image_url: serviceData.hero_asset_id || '', // DB field: hero_asset_id
        icon_name: serviceData.icon_name || 'wrench',
        display_order: serviceData.sort_order || 0, // DB field: sort_order
        meta_title: serviceData.seo_title || '', // DB field: seo_title
        meta_description: serviceData.seo_description || '', // DB field: seo_description
        meta_keywords: serviceData.meta_keywords || '',
      };
      
      setFormData(newFormData);
      
      // Load benefits
      if (responseData.benefits) {
        setBenefits(responseData.benefits);
      }
      
      // Load benefits subtitle
      if (serviceData.benefits_subtitle) {
        setBenefitsSubtitle(serviceData.benefits_subtitle);
      }
      
      // Load related services
      if (responseData.related_services) {
        setRelatedServiceIds(responseData.related_services);
      }
      
      // Load related posts
      if (responseData.related_posts) {
        setRelatedPostIds(responseData.related_posts);
      }
      
    } catch (err: any) {
      setError(err.message || 'Failed to load service');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ServiceFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
    
    // Track if slug_group was manually edited
    if (field === 'slug_group') {
      setSlugGroupManuallyEdited(true);
    }
    
    // Auto-generate slug from title (only for new services)
    if (field === 'title' && mode === 'create') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      // Only auto-set slug_group if:
      // 1. User is creating new slug group
      // 2. AND hasn't manually edited slug_group yet
      // 3. OR slug_group is empty
      if (isCreatingNewSlugGroup && !slugGroupManuallyEdited) {
        setFormData(prev => ({ ...prev, slug, slug_group: slug }));
      } else if (!formData.slug_group) {
        setFormData(prev => ({ ...prev, slug, slug_group: slug }));
      } else {
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.slug.trim()) {
      setError('Slug is required');
      return false;
    }
    if (!formData.short_description.trim()) {
      setError('Short description is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    try {
      // Map form fields to API/DB fields
      const payload = {
        locale: formData.locale,
        title: formData.title,
        slug: formData.slug,
        slug_group: formData.slug_group,
        excerpt: formData.short_description, // form → DB
        content_md: formData.description, // form → DB
        hero_asset_id: formData.hero_image_url ? parseInt(formData.hero_image_url) : null, // form → DB
        icon_name: formData.icon_name,
        status: formData.status,
        sort_order: formData.display_order, // form → DB
        seo_title: formData.meta_title, // form → DB
        seo_description: formData.meta_description, // form → DB
        canonical_url: '', // TODO: Add this field if needed
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        // Benefits and related items
        benefits_subtitle: benefitsSubtitle.trim() || undefined,
        benefits: benefits.filter(b => b.title.trim() !== '').map((b, index) => ({
          title: b.title,
          description: b.description?.trim() || undefined,
          icon_name: b.icon_name || undefined,
          sort_order: index,
        })),
        related_services: relatedServiceIds.filter((id): id is number => 
          id !== null && id !== undefined && typeof id === 'number'
        ),
        related_posts: relatedPostIds.filter((id): id is number => 
          id !== null && id !== undefined && typeof id === 'number'
        ),
      };

      let resultId: number;
      
      if (mode === 'create') {
        const response = await adminApi.createService(payload);
        resultId = (response.data as any)?.id || serviceId!;
      } else if (serviceId) {
        await adminApi.updateService(serviceId, payload);
        resultId = serviceId;
        
        // Auto-sync images across locales when updating
        if (formData.hero_image_url) {
          try {
            await adminApi.syncServiceImages(serviceId);
          } catch (syncError) {
            console.error('Failed to sync images:', syncError);
            // Don't fail the whole operation if image sync fails
          }
        }
      }
      
      // Show translation sync modal after successful save
      setSavedServiceId(resultId!);
      setShowTranslationModal(true);
    } catch (err: any) {
      // Display detailed validation errors
      if (err.message && err.message.includes('Validation')) {
        setError(`❌ ${err.message}`);
      } else {
        setError(err.message || `Failed to ${mode} service`);
      }
      setSaving(false);
    }
  };
  
  const handleTranslationSync = async (mode: 'skip' | 'manual' | 'auto') => {
    if (mode === 'skip' || !savedServiceId) {
      // Close modal and redirect
      setShowTranslationModal(false);
      setSaving(false);
      router.push(`/admin/${locale}/services`);
      router.refresh();
      return;
    }
    
    setSyncing(true);
    
    try {
      const targetLocale = locale === 'en' ? 'vi' : 'en';
      await adminApi.translateService(savedServiceId, targetLocale, mode);
      
      // Success - close modal and redirect
      setShowTranslationModal(false);
      setSaving(false);
      router.push(`/admin/${locale}/services`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Failed to sync translation');
      setShowTranslationModal(false);
      setSaving(false);
    } finally {
      setSyncing(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/${locale}/services`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading service...</span>
        </div>
      </div>
    );
  }

  const t = locale === 'vi' ? {
    title: mode === 'create' ? 'Tạo Dịch Vụ Mới' : 'Chỉnh Sửa Dịch Vụ',
    subtitle: mode === 'create' ? 'Thêm dịch vụ mới vào hệ thống' : 'Cập nhật thông tin dịch vụ',
    basicInfo: 'Thông Tin Cơ Bản',
    titleLabel: 'Tiêu đề',
    titlePlaceholder: 'Nhập tiêu đề dịch vụ',
    slugLabel: 'Slug (URL)',
    slugPlaceholder: 'tu-dong-tao-tu-tieu-de',
    slugHelp: 'URL-friendly identifier (tự động tạo từ tiêu đề)',
    slugGroupLabel: 'Slug Group',
    slugGroupHelp: 'Dùng để liên kết các bản dịch. Chọn từ danh sách hoặc tạo mới.',
    slugGroupPlaceholder: 'Chọn hoặc tạo mới slug group',
    slugGroupEditableHint: 'Có thể chỉnh sửa thủ công. Tự động tạo từ title.',
    selectExisting: 'Chọn từ danh sách',
    createNew: 'Tạo mới',
    newSlugGroup: 'Slug group mới (từ title)',
    readOnlyField: 'chỉ đọc',
    slugGroupReadOnlyTitle: 'Trường này tự động quản lý bởi hệ thống để liên kết các bản dịch',
    slugGroupWarning: 'Không thay đổi trường này! Nó liên kết dịch vụ này với các bản dịch khác.',
    shortDescLabel: 'Mô tả ngắn',
    shortDescPlaceholder: 'Mô tả ngắn gọn về dịch vụ',
    descLabel: 'Mô tả chi tiết',
    descPlaceholder: 'Mô tả đầy đủ về dịch vụ',
    localeLabel: 'Ngôn ngữ',
    statusLabel: 'Trạng thái',
    draft: 'Bản nháp',
    published: 'Đã xuất bản',
    archived: 'Đã lưu trữ',
    mediaInfo: 'Hình Ảnh & Icon',
    heroImageLabel: 'Hero Image URL',
    heroImagePlaceholder: 'https://example.com/image.jpg',
    iconLabel: 'Icon (Lucide)',
    iconPlaceholder: 'wrench',
    displayOrderLabel: 'Thứ tự hiển thị',
    seoInfo: 'SEO Metadata',
    metaTitleLabel: 'Meta Title',
    metaDescLabel: 'Meta Description',
    metaKeywordsLabel: 'Meta Keywords',
    metaKeywordsPlaceholder: 'keyword1, keyword2, keyword3',
    saveButton: mode === 'create' ? 'Tạo Dịch Vụ' : 'Lưu Thay Đổi',
    savingButton: 'Đang lưu...',
    cancelButton: 'Hủy',
  } : {
    title: mode === 'create' ? 'Create New Service' : 'Edit Service',
    subtitle: mode === 'create' ? 'Add a new service to the system' : 'Update service information',
    basicInfo: 'Basic Information',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter service title',
    slugLabel: 'Slug (URL)',
    slugPlaceholder: 'auto-generated-from-title',
    slugHelp: 'URL-friendly identifier (auto-generated from title)',
    slugGroupLabel: 'Slug Group',
    slugGroupHelp: 'Used to link translations. Select from list or create new.',
    slugGroupPlaceholder: 'Select or create new slug group',
    slugGroupEditableHint: 'Can be edited manually. Auto-generated from title.',
    selectExisting: 'Select from list',
    createNew: 'Create new',
    newSlugGroup: 'New slug group (from title)',
    readOnlyField: 'read-only',
    slugGroupReadOnlyTitle: 'This field is automatically managed by the system to link translations',
    slugGroupWarning: 'Do not change this field! It links this service to other translations.',
    shortDescLabel: 'Short Description',
    shortDescPlaceholder: 'Brief description of the service',
    descLabel: 'Full Description',
    descPlaceholder: 'Detailed description of the service',
    localeLabel: 'Language',
    statusLabel: 'Status',
    draft: 'Draft',
    published: 'Published',
    archived: 'Archived',
    mediaInfo: 'Images & Icons',
    heroImageLabel: 'Hero Image URL',
    heroImagePlaceholder: 'https://example.com/image.jpg',
    iconLabel: 'Icon (Lucide)',
    iconPlaceholder: 'wrench',
    displayOrderLabel: 'Display Order',
    seoInfo: 'SEO Metadata',
    metaTitleLabel: 'Meta Title',
    metaDescLabel: 'Meta Description',
    metaKeywordsLabel: 'Meta Keywords',
    metaKeywordsPlaceholder: 'keyword1, keyword2, keyword3',
    saveButton: mode === 'create' ? 'Create Service' : 'Save Changes',
    savingButton: 'Saving...',
    cancelButton: 'Cancel',
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
        <p className="mt-2 text-gray-600">{t.subtitle}</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-600 hover:text-red-800">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.basicInfo}</h2>
          
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.titleLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={t.titlePlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.slugLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder={t.slugPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                required
              />
              <p className="mt-1 text-xs text-gray-500">{t.slugHelp}</p>
            </div>

            {/* Slug Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.slugGroupLabel}
                {mode === 'edit' && <span className="ml-2 text-xs font-normal text-gray-500">({t.readOnlyField})</span>}
              </label>
              
              {mode === 'create' ? (
                <div className="space-y-2">
                  {/* Toggle buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewSlugGroup(false);
                        setShowSlugGroupDropdown(!showSlugGroupDropdown);
                        setSlugGroupManuallyEdited(false); // Reset manual edit flag
                      }}
                      className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                        !isCreatingNewSlugGroup
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 inline mr-2" />
                      {t.selectExisting}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewSlugGroup(true);
                        setShowSlugGroupDropdown(false);
                        setSlugGroupManuallyEdited(false); // Reset manual edit flag
                        setFormData(prev => ({ ...prev, slug_group: prev.slug }));
                      }}
                      className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                        isCreatingNewSlugGroup
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      {t.createNew}
                    </button>
                  </div>

                  {/* Dropdown list for existing slug groups */}
                  {!isCreatingNewSlugGroup && showSlugGroupDropdown && (
                    <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto bg-white">
                      {slugGroups.length > 0 ? (
                        slugGroups.map((sg) => (
                          <button
                            key={sg}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, slug_group: sg }));
                              setShowSlugGroupDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors font-mono text-sm ${
                              formData.slug_group === sg ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
                            }`}
                          >
                            {sg}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                          {locale === 'vi' ? 'Không có slug group nào' : 'No slug groups available'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Display selected or new slug group */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.slug_group}
                      onChange={(e) => {
                        // Allow manual editing when creating new slug group
                        if (isCreatingNewSlugGroup) {
                          handleChange('slug_group', e.target.value);
                        }
                      }}
                      readOnly={!isCreatingNewSlugGroup}
                      placeholder={isCreatingNewSlugGroup ? t.newSlugGroup : t.slugGroupPlaceholder}
                      className={`w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm ${
                        isCreatingNewSlugGroup 
                          ? 'bg-white text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent' 
                          : 'bg-gray-50 text-gray-700'
                      }`}
                    />
                    {isCreatingNewSlugGroup && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-medium">
                          {locale === 'vi' ? 'Mới' : 'New'}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-gray-500">
                    {isCreatingNewSlugGroup ? t.slugGroupEditableHint : t.slugGroupHelp}
                  </p>
                </div>
              ) : (
                // Edit mode - read only
                <>
                  <input
                    type="text"
                    value={formData.slug_group}
                    readOnly
                    placeholder={formData.slug}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm cursor-not-allowed"
                    title={t.slugGroupReadOnlyTitle}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {t.slugGroupHelp}
                    {formData.slug_group && (
                      <span className="block mt-1 text-amber-600 font-medium">
                        ⚠️ {t.slugGroupWarning}
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.shortDescLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.short_description}
                onChange={(e) => handleChange('short_description', e.target.value)}
                placeholder={t.shortDescPlaceholder}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.descLabel} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder={t.descPlaceholder}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            {/* Locale and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.localeLabel}
                </label>
                <select
                  value={formData.locale}
                  onChange={(e) => handleChange('locale', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="vi">Tiếng Việt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.statusLabel}
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">{t.draft}</option>
                  <option value="published">{t.published}</option>
                  <option value="archived">{t.archived}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Media & Icons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {t.mediaInfo}
          </h2>
          
          <div className="space-y-5">
            {/* Hero Image with Upload */}
            <ImageUploader
              value={formData.hero_image_url}
              onChange={(assetId) => handleChange('hero_image_url', assetId)}
              label={t.heroImageLabel}
              accept="image/jpeg,image/png,image/webp"
              maxSizeMB={5}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Icon Picker */}
              <IconPicker
                value={formData.icon_name}
                onChange={(iconName) => handleChange('icon_name', iconName)}
                label={t.iconLabel}
              />

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.displayOrderLabel}
                </label>
                <input
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <BenefitsEditor
            benefits={benefits}
            onChange={setBenefits}
            subtitle={benefitsSubtitle}
            onSubtitleChange={setBenefitsSubtitle}
          />
        </div>

        {/* Related Services */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RelatedItemsSelector
            selectedIds={relatedServiceIds}
            onChange={setRelatedServiceIds}
            availableItems={availableServices}
            type="services"
            maxItems={3}
            currentItemId={serviceId}
          />
        </div>

        {/* Related Posts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <RelatedItemsSelector
            selectedIds={relatedPostIds}
            onChange={setRelatedPostIds}
            availableItems={availablePosts}
            type="posts"
            maxItems={3}
            currentItemId={serviceId}
          />
        </div>

        {/* SEO Metadata */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.seoInfo}</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.metaTitleLabel}
              </label>
              <input
                type="text"
                value={formData.meta_title}
                onChange={(e) => handleChange('meta_title', e.target.value)}
                placeholder={formData.title}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.metaDescLabel}
              </label>
              <textarea
                value={formData.meta_description}
                onChange={(e) => handleChange('meta_description', e.target.value)}
                placeholder={formData.short_description}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.metaKeywordsLabel}
              </label>
              <input
                type="text"
                value={formData.meta_keywords}
                onChange={(e) => handleChange('meta_keywords', e.target.value)}
                placeholder={t.metaKeywordsPlaceholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t.cancelButton}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t.savingButton}
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {t.saveButton}
              </>
            )}
          </button>
        </div>
      </form>
      
      {/* Translation Sync Modal */}
      <TranslationSyncModal
        isOpen={showTranslationModal}
        currentLocale={locale}
        serviceTitle={formData.title}
        onClose={() => {
          setShowTranslationModal(false);
          setSaving(false);
          router.push(`/admin/${locale}/services`);
          router.refresh();
        }}
        onConfirm={handleTranslationSync}
        loading={syncing}
      />
    </div>
  );
}
