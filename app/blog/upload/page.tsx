'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { OutputData } from '@editorjs/editorjs';

const Editor = dynamic(() => import('@/components/Editor'), { 
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] w-full rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse" />
  )
});

type BlogCategory = 'technology' | 'finance' | 'business' | 'lifestyle' | 'other';

interface BlogPost {
  title: string;
  content: OutputData | null;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  coverImage: string | null;
  status: 'draft' | 'published';
  publishDate?: Date;
}

export default function BlogUpload() {
  const [post, setPost] = useState<BlogPost>({
    title: '',
    content: null,
    excerpt: '',
    category: 'technology',
    tags: [],
    coverImage: null,
    status: 'draft'
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  type ErrorType = Partial<Record<keyof BlogPost, string>> & { submit?: string };
  const [errors, setErrors] = useState<ErrorType>({});

  const validateForm = useCallback(() => {
    const newErrors: ErrorType = {};
    
    if (!post.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!post.content) {
      newErrors.content = 'Content is required';
    }
    if (!post.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    if (post.excerpt.length > 300) {
      newErrors.excerpt = 'Excerpt must be less than 300 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [post]);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && currentTag.trim()) {
      e.preventDefault();
      if (!post.tags.includes(currentTag.trim())) {
        setPost(prev => ({
          ...prev,
          tags: [...prev.tags, currentTag.trim()]
        }));
      }
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          coverImage: 'Image size must be less than 10MB'
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPost(prev => ({
          ...prev,
          coverImage: reader.result as string
        }));
        setErrors(prev => ({
          ...prev,
          coverImage: undefined
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'published') => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement API call
      const submitData = {
        ...post,
        status,
        publishDate: status === 'published' ? new Date() : undefined
      };
      
      console.log('Submitting:', submitData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert(status === 'published' ? 'Post published successfully!' : 'Draft saved successfully!');
      
    } catch (error) {
      console.error('Error submitting post:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit post. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-teal-600">
                Remote Munshi
              </Link>
              <span className="px-2 py-1 text-xs font-semibold text-teal-600 bg-teal-100 rounded-md">
                Admin Panel
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-teal-600 focus:outline-none"
              >
                {previewMode ? 'Edit Mode' : 'Preview Mode'}
              </button>
              <span className="text-sm text-gray-500">Welcome, Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 bg-teal-600">
            <h1 className="text-xl font-semibold text-white">Create New Blog Post</h1>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="p-6 space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={post.title}
                onChange={(e) => setPost(prev => ({ ...prev, title: e.target.value }))}
                className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter an engaging title for your post"
                required
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-2">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={post.category}
                onChange={(e) => setPost(prev => ({ ...prev, category: e.target.value as BlogCategory }))}
                className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="business">Business</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Excerpt */}
            <div className="space-y-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Excerpt <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs ml-2">(Brief summary of your post)</span>
              </label>
              <textarea
                id="excerpt"
                value={post.excerpt}
                onChange={(e) => setPost(prev => ({ ...prev, excerpt: e.target.value }))}
                className={`w-full px-4 py-2 text-gray-900 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  ${errors.excerpt ? 'border-red-500' : 'border-gray-300'}`}
                rows={3}
                placeholder="Write a brief summary of your post (max 300 characters)"
                maxLength={300}
              />
              {errors.excerpt && (
                <p className="text-red-500 text-sm">{errors.excerpt}</p>
              )}
              <p className="text-gray-500 text-sm text-right">
                {post.excerpt.length}/300 characters
              </p>
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cover Image <span className="text-gray-500">(Optional)</span>
              </label>
              <div className={`mt-1 flex justify-center px-6 py-4 border-2 border-dashed rounded-lg 
                ${post.coverImage ? 'border-teal-300' : 'border-gray-300'} 
                hover:border-teal-500 transition-colors duration-200`}>
                <div className="space-y-2 text-center">
                  {post.coverImage ? (
                    <div className="relative inline-block">
                      <Image
                        src={post.coverImage}
                        alt="Cover preview"
                        width={400}
                        height={225}
                        className="rounded-lg object-cover"
                        style={{ maxWidth: '100%', height: 'auto' }}
                        unoptimized={post.coverImage.startsWith('data:')} // For data URLs
                      />
                      <button
                        aria-label="Remove cover image"
                        type="button"
                        onClick={() => setPost(prev => ({ ...prev, coverImage: null }))}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="mx-auto h-12 w-12 text-gray-400">
                        <svg className="h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
              {errors.coverImage && (
                <p className="text-red-500 text-sm">{errors.coverImage}</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Post Content <span className="text-red-500">*</span>
              </label>
              <div className={`prose-lg max-w-none ${errors.content ? 'ring-2 ring-red-500' : ''}`}>
                <Editor
                  onChange={(data) => {
                    setPost(prev => ({ ...prev, content: data }));
                    if (errors.content) {
                      setErrors(prev => ({ ...prev, content: undefined }));
                    }
                  }}
                  initialData={post.content}
                  readOnly={previewMode}
                />
              </div>
              {errors.content && (
                <p className="text-red-500 text-sm">{errors.content}</p>
              )}
            </div>

            {/* Tags Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags <span className="text-gray-500">(Press Enter to add)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleTagInput}
                  className="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Add relevant tags..."
                />
                {post.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-teal-600 hover:bg-teal-200 hover:text-teal-700 focus:outline-none"
                        >
                          <span className="sr-only">Remove tag</span>
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      {errors.submit}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
