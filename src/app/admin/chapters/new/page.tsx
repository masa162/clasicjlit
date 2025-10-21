'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { WorkWithAuthor, Category } from '@/types/database';
import 'easymde/dist/easymde.min.css';

const SimpleMdeEditor = dynamic(() => import('react-simplemde-editor'), { ssr: false });

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default function NewChapterPage() {
  const router = useRouter();
  const [works, setWorks] = useState<WorkWithAuthor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [titleJp, setTitleJp] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [workId, setWorkId] = useState('');
  const [chapterOrder, setChapterOrder] = useState('1');
  const [contentJp, setContentJp] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [durationSeconds, setDurationSeconds] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchWorks();
    fetchCategories();
  }, []);

  const fetchWorks = async () => {
    try {
      const res = await fetch('/api/works');
      const response: ApiResponse<WorkWithAuthor[]> = await res.json();
      
      if (response.success && response.data) {
        setWorks(response.data);
      }
    } catch (err) {
      console.error('Error fetching works:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const response: ApiResponse<Category[]> = await res.json();
      
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('File selected:', { name: file.name, size: file.size, type: file.type });

    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/x-m4a'];
    
    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type: ${file.type}. Allowed: AAC, MP3, WAV, M4A`);
      console.error('Invalid file type:', file.type);
      return;
    }
    
    if (file.size > maxSize) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 10MB limit`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading to /api/upload...');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', res.status);
      const response: ApiResponse<{ url: string; key: string }> = await res.json();
      console.log('Upload response:', response);
      
      if (response.success && response.data) {
        setAudioUrl(response.data.url);
        setSuccessMessage(`File uploaded successfully! URL: ${response.data.url}`);
        console.log('Upload success:', response.data);
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        const errorMsg = response.error || 'Upload failed';
        setError(errorMsg);
        console.error('Upload failed:', errorMsg);
      }
    } catch (err) {
      const errorMsg = 'Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error');
      setError(errorMsg);
      console.error('Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleJp.trim()) {
      setError('日本語タイトルは必須です (Japanese title is required)');
      return;
    }
    if (!workId) {
      setError('作品を選択してください (Please select a work)');
      return;
    }
    if (!audioUrl) {
      setError('音声ファイルをアップロードしてください (Please upload an audio file)');
      return;
    }

    try {
      setError(null);
      const res = await fetch('/api/chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uuidv4(),
          work_id: workId,
          chapter_order: parseInt(chapterOrder),
          title_jp: titleJp,
          title_en: titleEn || undefined,
          audio_url: audioUrl,
          content_jp: contentJp || undefined,
          content_en: contentEn || undefined,
          duration_seconds: durationSeconds ? parseInt(durationSeconds) : undefined,
          category_ids: selectedCategories.length > 0 ? selectedCategories : undefined,
        }),
      });

      const response: ApiResponse<{ id: string }> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Chapter created successfully! Redirecting...');
        setTimeout(() => {
          router.push('/admin/chapters');
        }, 1500);
      } else {
        setError(response.error || 'Failed to create chapter');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error creating chapter:', err);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-white border rounded shadow max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Create New Chapter</h2>
          <button
            type="button"
            onClick={() => router.push('/admin/chapters')}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to List
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Work <span className="text-red-500">*</span>
            </label>
            <select
              value={workId}
              onChange={(e) => setWorkId(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="">Select a work</option>
              {works.map((work) => (
                <option key={work.id} value={work.id}>
                  {work.title_jp} {work.title_en ? `(${work.title_en})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Chapter Order <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={chapterOrder}
              onChange={(e) => setChapterOrder(e.target.value)}
              min="1"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title (Japanese) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titleJp}
              onChange={(e) => setTitleJp(e.target.value)}
              placeholder="桐壺"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Title (English)</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Kiritsubo"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Audio File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="audio/*"
            className="w-full px-3 py-2 border rounded"
            disabled={uploading}
          />
          {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
          {audioUrl && (
            <p className="text-sm text-green-600 mt-1 break-all">
              ✓ Uploaded: {audioUrl}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Max 10MB. Allowed: AAC, MP3, WAV, M4A
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
          <input
            type="number"
            value={durationSeconds}
            onChange={(e) => setDurationSeconds(e.target.value)}
            placeholder="180"
            min="0"
            className="w-full px-3 py-2 border rounded"
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional. Audio file duration in seconds.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (Japanese)</label>
          <SimpleMdeEditor
            value={contentJp}
            onChange={(value) => setContentJp(value)}
            options={{
              spellChecker: false,
              placeholder: 'チャプターの内容を日本語で入力...',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Content (English)</label>
          <SimpleMdeEditor
            value={contentEn}
            onChange={(value) => setContentEn(value)}
            options={{
              spellChecker: false,
              placeholder: 'Enter chapter content in English...',
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryToggle(category.id)}
                  className="rounded"
                />
                <span className="text-sm">{category.name_jp}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={uploading || !audioUrl}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
          >
            Create Chapter
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/chapters')}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

