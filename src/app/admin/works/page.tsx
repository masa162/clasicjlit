'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { WorkWithAuthor, Author } from '@/types/database';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default function WorksPage() {
  const [works, setWorks] = useState<WorkWithAuthor[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [titleJp, setTitleJp] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionJp, setDescriptionJp] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [authorId, setAuthorId] = useState('');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitleJp, setEditTitleJp] = useState('');
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editDescriptionJp, setEditDescriptionJp] = useState('');
  const [editDescriptionEn, setEditDescriptionEn] = useState('');
  const [editAuthorId, setEditAuthorId] = useState('');

  useEffect(() => {
    fetchWorks();
    fetchAuthors();
  }, []);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/works');
      const response: ApiResponse<WorkWithAuthor[]> = await res.json();
      
      if (response.success && response.data) {
        setWorks(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch works');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching works:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const res = await fetch('/api/authors');
      const response: ApiResponse<Author[]> = await res.json();
      
      if (response.success && response.data) {
        setAuthors(response.data);
      }
    } catch (err) {
      console.error('Error fetching authors:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titleJp.trim()) {
      setError('日本語タイトルは必須です (Japanese title is required)');
      return;
    }
    if (!authorId) {
      setError('著者を選択してください (Please select an author)');
      return;
    }

    try {
      setError(null);
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uuidv4(),
          author_id: authorId,
          title_jp: titleJp,
          title_en: titleEn || undefined,
          description_jp: descriptionJp || undefined,
          description_en: descriptionEn || undefined,
        }),
      });

      const response: ApiResponse<{ id: string }> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Work created successfully!');
        setTitleJp('');
        setTitleEn('');
        setDescriptionJp('');
        setDescriptionEn('');
        setAuthorId('');
        fetchWorks();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to create work');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error creating work:', err);
    }
  };

  const handleEdit = (work: WorkWithAuthor) => {
    setEditingId(work.id);
    setEditTitleJp(work.title_jp);
    setEditTitleEn(work.title_en || '');
    setEditDescriptionJp(work.description_jp || '');
    setEditDescriptionEn(work.description_en || '');
    setEditAuthorId(work.author_id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitleJp('');
    setEditTitleEn('');
    setEditDescriptionJp('');
    setEditDescriptionEn('');
    setEditAuthorId('');
  };

  const handleUpdate = async (workId: string) => {
    if (!editTitleJp.trim()) {
      setError('日本語タイトルは必須です (Japanese title is required)');
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/works/${workId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author_id: editAuthorId,
          title_jp: editTitleJp,
          title_en: editTitleEn || undefined,
          description_jp: editDescriptionJp || undefined,
          description_en: editDescriptionEn || undefined,
        }),
      });

      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Work updated successfully!');
        handleCancelEdit();
        fetchWorks();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to update work');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating work:', err);
    }
  };

  const handleDelete = async (workId: string) => {
    if (!window.confirm('Are you sure you want to delete this work?')) {
      return;
    }

    try {
      const res = await fetch(`/api/works/${workId}`, { method: 'DELETE' });
      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Work deleted successfully!');
        fetchWorks();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to delete work');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error deleting work:', err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Works Management</h1>

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
        <h2 className="text-xl font-semibold mb-4">Create New Work</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title (Japanese) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={titleJp}
              onChange={(e) => setTitleJp(e.target.value)}
              placeholder="源氏物語"
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
              placeholder="The Tale of Genji"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Author <span className="text-red-500">*</span>
          </label>
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Select an author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name_jp} {author.name_en ? `(${author.name_en})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (Japanese)</label>
          <textarea
            value={descriptionJp}
            onChange={(e) => setDescriptionJp(e.target.value)}
            placeholder="作品の説明を日本語で入力..."
            className="w-full px-3 py-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description (English)</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            placeholder="Enter work description in English..."
            className="w-full px-3 py-2 border rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Work
        </button>
      </form>

      {/* Works List */}
      <div className="bg-white border rounded shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Works List</h2>
        
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : works.length === 0 ? (
          <p className="p-4 text-gray-500">No works found</p>
        ) : (
          <ul className="divide-y">
            {works.map((work) => (
              <li key={work.id} className="p-4">
                {editingId === work.id ? (
                  /* Edit Form */
                  <div className="space-y-3">
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
                    <select
                      value={editAuthorId}
                      onChange={(e) => setEditAuthorId(e.target.value)}
                      className="w-full px-3 py-2 border rounded"
                    >
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name_jp} {author.name_en ? `(${author.name_en})` : ''}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={editDescriptionJp}
                      onChange={(e) => setEditDescriptionJp(e.target.value)}
                      placeholder="Description (Japanese)"
                      className="w-full px-3 py-2 border rounded"
                      rows={3}
                    />
                    <textarea
                      value={editDescriptionEn}
                      onChange={(e) => setEditDescriptionEn(e.target.value)}
                      placeholder="Description (English)"
                      className="w-full px-3 py-2 border rounded"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(work.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
                        {work.title_jp}
                        {work.title_en && (
                          <span className="text-gray-600 font-normal ml-2">({work.title_en})</span>
                        )}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        By: {work.author_name_jp} {work.author_name_en ? `(${work.author_name_en})` : ''}
                      </p>
                      {(work.description_jp || work.description_en) && (
                        <p className="text-sm text-gray-700 mt-2">
                          {work.description_jp || work.description_en}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">ID: {work.id}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(work)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(work.id)}
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
