'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import PostForm from '../../../../../components/admin/PostForm';

/**
 * Create New Post Page
 */
export default function AdminNewPostPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTaxonomies();
  }, []);

  const loadTaxonomies = async () => {
    setLoading(true);
    try {
      const [categoriesRes, tagsRes] = await Promise.all([
        adminApi.listCategories({ locale: 'en', kind: 'post' }),
        adminApi.listTags({ locale: 'en' }),
      ]);
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
    } catch (error) {
      console.error('Failed to load taxonomies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await adminApi.createPost(data);
      alert('✅ Post created successfully');
      router.push('/admin/en/posts');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="mt-1 text-gray-600">Add a new blog post to your website</p>
      </div>

      <PostForm
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/en/posts')}
      />
    </div>
  );
}
