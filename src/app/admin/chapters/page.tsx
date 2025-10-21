'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import type { Chapter, WorkWithAuthor, Category } from '@/types/database';
import 'easymde/dist/easymde.min.css';

// Dynamic import to avoid SSR issues
const SimpleMdeEditor = dynamic(() => import('react-simplemde-editor'), { ssr: false });

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface ChapterWithWorkTitle extends Chapter {
  work_title_jp?: string;
  work_title_en?: string | null;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<ChapterWithWorkTitle[]>([]);
  const [works, setWorks] = useState<WorkWithAuthor[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleJp, setEditTitleJp] = useState('');
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editWorkId, setEditWorkId] = useState('');
  const [editChapterOrder, setEditChapterOrder] = useState('');
  const [editContentJp, setEditContentJp] = useState('');
  const [editContentEn, setEditContentEn] = useState('');
  const [editAudioUrl, setEditAudioUrl] = useState('');
  const [editDurationSeconds, setEditDurationSeconds] = useState('');
  const [editSelectedCategories, setEditSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchChapters();
    fetchWorks();
    fetchCategories();
  }, []);

  const fetchChapters = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/chapters');
      const response: ApiResponse<ChapterWithWorkTitle[]> = await res.json();
      
      if (response.success && response.data) {
        setChapters(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch chapters');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching chapters:', err);
    } finally {
      setLoading(false);
    }
  };

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

    // Validate file
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

  const handleEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Edit - File selected:', { name: file.name, size: file.size, type: file.type });

    // Validate file
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
        setEditAudioUrl(response.data.url);
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
        setSuccessMessage('Chapter created successfully!');
        // Reset form
        setTitleJp('');
        setTitleEn('');
    setWorkId('');
        setChapterOrder('1');
        setContentJp('');
        setContentEn('');
    setAudioUrl('');
        setDurationSeconds('');
        setSelectedCategories([]);
        fetchChapters();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to create chapter');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error creating chapter:', err);
    }
  };

  const handleEdit = (chapter: ChapterWithWorkTitle) => {
    setEditingId(chapter.id);
    setEditTitleJp(chapter.title_jp);
    setEditTitleEn(chapter.title_en || '');
    setEditWorkId(chapter.work_id);
    setEditChapterOrder(chapter.chapter_order.toString());
    setEditContentJp(chapter.content_jp || '');
    setEditContentEn(chapter.content_en || '');
    setEditAudioUrl(chapter.audio_url);
    setEditDurationSeconds(chapter.duration_seconds?.toString() || '');
    // TODO: Fetch and set categories for this chapter
    setEditSelectedCategories([]);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitleJp('');
    setEditTitleEn('');
    setEditWorkId('');
    setEditChapterOrder('');
    setEditContentJp('');
    setEditContentEn('');
    setEditAudioUrl('');
    setEditDurationSeconds('');
    setEditSelectedCategories([]);
  };

  const handleUpdate = async (chapterId: string) => {
    if (!editTitleJp.trim()) {
      setError('日本語タイトルは必須です (Japanese title is required)');
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          work_id: editWorkId,
          chapter_order: parseInt(editChapterOrder),
          title_jp: editTitleJp,
          title_en: editTitleEn || undefined,
          audio_url: editAudioUrl,
          content_jp: editContentJp || undefined,
          content_en: editContentEn || undefined,
          duration_seconds: editDurationSeconds ? parseInt(editDurationSeconds) : undefined,
          category_ids: editSelectedCategories.length > 0 ? editSelectedCategories : undefined,
        }),
      });

      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Chapter updated successfully!');
        handleCancelEdit();
        fetchChapters();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to update chapter');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating chapter:', err);
    }
  };

  const handleDelete = async (chapterId: string) => {
    if (!window.confirm('Are you sure you want to delete this chapter?')) {
      return;
    }

    try {
      const res = await fetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Chapter deleted successfully!');
        fetchChapters();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to delete chapter');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error deleting chapter:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Chapters Management</h1>

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
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 bg-white border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Chapter</h2>
        
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
            <p className="text-sm text-green-600 mt-1">
              ✓ Uploaded: {audioUrl}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Max 10MB. Allowed: AAC, MP3, WAV
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

        <button
          type="submit"
          disabled={uploading || !audioUrl}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create Chapter
        </button>
      </form>

      {/* Chapters List */}
      <div className="bg-white border rounded shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Chapters List</h2>
        
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : chapters.length === 0 ? (
          <p className="p-4 text-gray-500">No chapters found</p>
        ) : (
          <ul className="divide-y">
            {chapters.map((chapter) => (
              <li key={chapter.id} className="p-4">
                {editingId === chapter.id ? (
                  /* Edit Form - Similar to create form but with editing states */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <select
                        value={editWorkId}
                        onChange={(e) => setEditWorkId(e.target.value)}
                        className="px-3 py-2 border rounded"
                      >
                  {works.map((work) => (
                    <option key={work.id} value={work.id}>
                            {work.title_jp}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                        value={editChapterOrder}
                        onChange={(e) => setEditChapterOrder(e.target.value)}
                        placeholder="Chapter Order"
                        className="px-3 py-2 border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editTitleJp}
                        onChange={(e) => setEditTitleJp(e.target.value)}
                        placeholder="Title (Japanese)"
                        className="px-3 py-2 border rounded"
                      />
                      <input
                        type="text"
                        value={editTitleEn}
                        onChange={(e) => setEditTitleEn(e.target.value)}
                        placeholder="Title (English)"
                        className="px-3 py-2 border rounded"
                      />
                    </div>
                    
                    {/* Audio Upload for Edit */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Audio File</label>
                      <input
                        type="file"
                        onChange={handleEditFileChange}
                        accept="audio/*"
                        className="w-full px-3 py-2 border rounded"
                        disabled={uploading}
                      />
                      {uploading && <p className="text-sm text-blue-600 mt-1">Uploading...</p>}
                      {editAudioUrl && (
                        <p className="text-sm text-green-600 mt-1">
                          ✓ Current: {editAudioUrl}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Upload new file to replace current audio. Max 10MB.
                      </p>
                    </div>
                    
                    <input
                      type="number"
                      value={editDurationSeconds}
                      onChange={(e) => setEditDurationSeconds(e.target.value)}
                      placeholder="Duration (seconds)"
                      className="w-full px-3 py-2 border rounded"
                    />

                    {/* Markdown Editor - Japanese */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Content (Japanese)</label>
                      <SimpleMdeEditor
                        value={editContentJp}
                        onChange={(value) => setEditContentJp(value)}
                        options={{
                          spellChecker: false,
                          placeholder: 'チャプターの内容を日本語で入力...',
                        }}
                      />
                    </div>

                    {/* Markdown Editor - English */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Content (English)</label>
                      <SimpleMdeEditor
                        value={editContentEn}
                        onChange={(value) => setEditContentEn(value)}
                        options={{
                          spellChecker: false,
                          placeholder: 'Enter chapter content in English...',
                        }}
                      />
                    </div>

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Categories</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {categories.map((category) => (
                          <label key={category.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={editSelectedCategories.includes(category.id)}
                              onChange={() => {
                                setEditSelectedCategories(prev =>
                                  prev.includes(category.id)
                                    ? prev.filter(id => id !== category.id)
                                    : [...prev, category.id]
                                );
                              }}
                              className="rounded"
                            />
                            <span className="text-sm">{category.name_jp}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(chapter.id)}
                        disabled={uploading}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Display Mode */
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        #{chapter.chapter_order} - {chapter.title_jp}
                        {chapter.title_en && (
                          <span className="text-gray-600 font-normal ml-2">({chapter.title_en})</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Work: {chapter.work_title_jp || 'N/A'}
                      </p>
                      {chapter.duration_seconds && (
                        <p className="text-sm text-gray-500 mt-1">
                          Duration: {Math.floor(chapter.duration_seconds / 60)}:{(chapter.duration_seconds % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Audio: {chapter.audio_url}
                      </p>
                      <p className="text-xs text-gray-400">ID: {chapter.id}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(chapter)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(chapter.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
            )}
          </li>
        ))}
      </ul>
        )}
      </div>
    </div>
  );
}
