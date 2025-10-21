'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Category } from '@/types/database';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [nameJp, setNameJp] = useState('');
  const [nameEn, setNameEn] = useState('');

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNameJp, setEditNameJp] = useState('');
  const [editNameEn, setEditNameEn] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const response: ApiResponse<Category[]> = await res.json();
      
      if (response.success && response.data) {
        setCategories(response.data);
        setError(null);
      } else {
        setError(response.error || 'Failed to fetch categories');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameJp.trim()) {
      setError('日本語名は必須です (Japanese name is required)');
      return;
    }

    try {
      setError(null);
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uuidv4(),
          name_jp: nameJp,
          name_en: nameEn || undefined,
        }),
      });

      const response: ApiResponse<{ id: string }> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Category created successfully!');
        setNameJp('');
        setNameEn('');
        fetchCategories();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to create category');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error creating category:', err);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setEditNameJp(category.name_jp);
    setEditNameEn(category.name_en || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNameJp('');
    setEditNameEn('');
  };

  const handleUpdate = async (categoryId: string) => {
    if (!editNameJp.trim()) {
      setError('日本語名は必須です (Japanese name is required)');
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name_jp: editNameJp,
          name_en: editNameEn || undefined,
        }),
      });

      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Category updated successfully!');
        handleCancelEdit();
        fetchCategories();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error updating category:', err);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
      const response: ApiResponse<unknown> = await res.json();
      
      if (response.success) {
        setSuccessMessage('Category deleted successfully!');
        fetchCategories();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        setError(response.error || 'Failed to delete category');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error deleting category:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Categories Management</h1>

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
        <h2 className="text-xl font-semibold mb-4">Create New Category</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Name (Japanese) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nameJp}
              onChange={(e) => setNameJp(e.target.value)}
              placeholder="物語"
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
              placeholder="Tales"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Category
        </button>
      </form>

      {/* Categories List */}
      <div className="bg-white border rounded shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Categories List</h2>
        
        {loading ? (
          <p className="p-4 text-gray-500">Loading...</p>
        ) : categories.length === 0 ? (
          <p className="p-4 text-gray-500">No categories found</p>
        ) : (
          <ul className="divide-y">
            {categories.map((category) => (
              <li key={category.id} className="p-4">
                {editingId === category.id ? (
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdate(category.id)}
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
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">
                        {category.name_jp}
                        {category.name_en && (
                          <span className="text-gray-600 font-normal ml-2">({category.name_en})</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">ID: {category.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
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
