'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/admin-api';
import PostForm from '../../../../../components/admin/PostForm';

interface Props {
  params: { id: string; locale: string };
}

/**
 * Edit Post Page
 */
export default function AdminEditPostPage({ params }: Props) {
  const router = useRouter();
  const postId = parseInt(params.id, 10);
  const [post, setPost] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [postId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [postRes, categoriesRes, tagsRes] = await Promise.all([
        adminApi.getPostById(postId),
        adminApi.listCategories({ locale: 'en', kind: 'post' }),
        adminApi.listTags({ locale: 'en' }),
      ]);
      
      // API returns { post: {...}, tags: [...], categories: [...] }
      const postBundle = postRes.data as any;
      if (!postBundle || !postBundle.post) {
        throw new Error('Post not found');
      }
      
      // Merge post data with relations
      setPost({
        ...postBundle.post,
        tags: postBundle.tags || [],
        categories: postBundle.categories || [],
        related_posts: postBundle.related_posts || []
      });
      
      setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      setTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
    } catch (error) {
      console.error('Failed to load post:', error);
      alert('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await adminApi.updatePost(postId, data);
      alert('✅ Post updated successfully');
      router.push('/admin/en/posts');
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Post not found</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Post</h1>
        <p className="mt-1 text-gray-600">Update blog post information</p>
      </div>

      <PostForm
        initialData={post}
        categories={categories}
        tags={tags}
        onSubmit={handleSubmit}
        onCancel={() => router.push('/admin/en/posts')}
      />
    </div>
  );
}
