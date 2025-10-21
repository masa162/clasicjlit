
'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    setName('');
    // Refetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEdit = (category: Category) => {
    setEditingCategoryId(category.id);
    setEditingName(category.name);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingName('');
  };

  const handleUpdate = async (categoryId: number) => {
    await fetch(`/api/categories/${categoryId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName }),
      }
    );
    setEditingCategoryId(null);
    setEditingName('');
    // Refetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data));
  };

  const handleDelete = async (categoryId: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
      // Refetch categories
      fetch('/api/categories')
        .then((res) => res.json())
        .then((data) => setCategories(data));
    }
  };

  return (
    <div>
      <h2>Categories</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
        />
        <button type="submit">Add Category</button>
      </form>
      <ul>
        {categories.map((category) => (
          <li key={category.id}>
            {editingCategoryId === category.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleUpdate(category.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {category.name}
                <button onClick={() => handleEdit(category)}>Edit</button>
                <button onClick={() => handleDelete(category.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
