'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Author } from '@/types/database';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states for creating
  const [nameJp, setNameJp] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [bioJp, setBioJp] = useState('');
  const [bioEn, setBioEn] = useState('');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameJp, setEditNameJp] = useState('');
  const [editNameEn, setEditNameEn] = useState('');
  const [editBioJp, setEditBioJp] = useState('');
  const [editBioEn, setEditBioEn] = useState('');

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/authors');
      const response: ApiResponse<Author[]> = await res.json();
      
      if (response.success && response.data) {
        setAuthors(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch authors');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching authors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!nameJp.trim()) {
      setError('日本語名は必須です (Japanese name is required)');
      return;
    }

    try {
      setError(null);
      const res = await fetch('/api/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uuidv4(),
          name_jp: nameJp,
          name_en: nameEn || undefined,
          bio_jp: bioJp || undefined,
          bio_en: bioEn || undefined,
        }),
      });

      const response: ApiResponse<{ id: string }> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Author created successfully!');
        setNameJp('');
        setNameEn('');
        setBioJp('');
        setBioEn('');
        fetchAuthors();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to create author');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error creating author:', err);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingId(author.id);
    setEditNameJp(author.name_jp);
    setEditNameEn(author.name_en || '');
    setEditBioJp(author.bio_jp || '');
    setEditBioEn(author.bio_en || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNameJp('');
    setEditNameEn('');
    setEditBioJp('');
    setEditBioEn('');
  };

  const handleUpdate = async (authorId: string) => {
    if (!editNameJp.trim()) {
      setError('日本語名は必須です (Japanese name is required)');
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/authors/${authorId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_jp: editNameJp,
          name_en: editNameEn || undefined,
          bio_jp: editBioJp || undefined,
          bio_en: editBioEn || undefined,
        }),
      });

      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Author updated successfully!');
        handleCancelEdit();
        fetchAuthors();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to update author');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating author:', err);
    }
  };

  const handleDelete = async (authorId: string) => {
    if (!window.confirm('Are you sure you want to delete this author?')) {
      return;
    }

    try {
      const res = await fetch(`/api/authors/${authorId}`, { method: 'DELETE' });
      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Author deleted successfully!');
        fetchAuthors();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to delete author');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error deleting author:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Authors Management</h1>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-6 bg-white border rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Author</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name (Japanese) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameJp}
              onChange={(e) => setNameJp(e.target.value)}
              placeholder="紫式部"
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Name (English)</label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="Murasaki Shikibu"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Biography (Japanese)</label>
          <textarea
            value={bioJp}
            onChange={(e) => setBioJp(e.target.value)}
            placeholder="著者の略歴を日本語で入力..."
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Biography (English)</label>
          <textarea
            value={bioEn}
            onChange={(e) => setBioEn(e.target.value)}
            placeholder="Enter author biography in English..."
            className="w-full px-3 py-2 border rounded"
            rows={3}
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Author
        </button>
      </form>

      {/* Authors List */}
      <div className="bg-white border rounded shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Authors List</h2>
        
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : authors.length === 0 ? (
          <p className="p-4 text-gray-500">No authors found</p>
        ) : (
          <ul className="divide-y">
            {authors.map((author) => (
              <li key={author.id} className="p-4">
                {editingId === author.id ? (
                  /* Edit Form */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editNameJp}
                        onChange={(e) => setEditNameJp(e.target.value)}
                        placeholder="Name (Japanese)"
                        className="px-3 py-2 border rounded"
                      />
                      <input
                        type="text"
                        value={editNameEn}
                        onChange={(e) => setEditNameEn(e.target.value)}
                        placeholder="Name (English)"
                        className="px-3 py-2 border rounded"
                      />
                    </div>
                    <textarea
                      value={editBioJp}
                      onChange={(e) => setEditBioJp(e.target.value)}
                      placeholder="Biography (Japanese)"
                      className="w-full px-3 py-2 border rounded"
                      rows={2}
                    />
                    <textarea
                      value={editBioEn}
                      onChange={(e) => setEditBioEn(e.target.value)}
                      placeholder="Biography (English)"
                      className="w-full px-3 py-2 border rounded"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(author.id)}
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
                        {author.name_jp}
                        {author.name_en && (
                          <span className="text-gray-600 font-normal ml-2">({author.name_en})</span>
                        )}
                      </h3>
                      {(author.bio_jp || author.bio_en) && (
                        <p className="text-sm text-gray-600 mt-1">
                          {author.bio_jp || author.bio_en}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">ID: {author.id}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleEdit(author)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(author.id)}
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
