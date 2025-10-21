
'use client';

import { useState, useEffect } from 'react';

interface Author {
  id: number;
  name: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/authors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    setName('');
    // Refetch authors
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data));
  };

  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleEdit = (author: Author) => {
    setEditingAuthorId(author.id);
    setEditingName(author.name);
  };

  const handleCancelEdit = () => {
    setEditingAuthorId(null);
    setEditingName('');
  };

  const handleUpdate = async (authorId: number) => {
    await fetch(`/api/authors/${authorId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editingName }),
      }
    );
    setEditingAuthorId(null);
    setEditingName('');
    // Refetch authors
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data));
  };

  const handleDelete = async (authorId: number) => {
    if (window.confirm('Are you sure you want to delete this author?')) {
      await fetch(`/api/authors/${authorId}`, { method: 'DELETE' });
      // Refetch authors
      fetch('/api/authors')
        .then((res) => res.json())
        .then((data) => setAuthors(data));
    }
  };

  return (
    <div>
      <h2>Authors</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New author name"
        />
        <button type="submit">Add Author</button>
      </form>
      <ul>
        {authors.map((author) => (
          <li key={author.id}>
            {editingAuthorId === author.id ? (
              <>
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                />
                <button onClick={() => handleUpdate(author.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {author.name}
                <button onClick={() => handleEdit(author)}>Edit</button>
                <button onClick={() => handleDelete(author.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
