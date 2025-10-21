
'use client';

import { useState, useEffect } from 'react';

interface Work {
  id: number;
  title: string;
  description: string;
  author_name: string;
}

interface Author {
  id: number;
  name: string;
}

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [authorId, setAuthorId] = useState('');

  useEffect(() => {
    fetch('/api/works')
      .then((res) => res.json())
      .then((data) => setWorks(data));
    fetch('/api/authors')
      .then((res) => res.json())
      .then((data) => setAuthors(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/works', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, author_id: authorId }),
    });
    setTitle('');
    setDescription('');
    setAuthorId('');
    // Refetch works
    fetch('/api/works')
      .then((res) => res.json())
      .then((data) => setWorks(data));
  };

  const [editingWorkId, setEditingWorkId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDescription, setEditingDescription] = useState('');
  const [editingAuthorId, setEditingAuthorId] = useState('');

  const handleEdit = (work: Work) => {
    setEditingWorkId(work.id);
    setEditingTitle(work.title);
    setEditingDescription(work.description);
    const author = authors.find(author => author.name === work.author_name);
    if(author) {
      setEditingAuthorId(author.id.toString());
    }
  };

  const handleCancelEdit = () => {
    setEditingWorkId(null);
    setEditingTitle('');
    setEditingDescription('');
    setEditingAuthorId('');
  };

  const handleUpdate = async (workId: number) => {
    await fetch(`/api/works/${workId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTitle, description: editingDescription, author_id: editingAuthorId }),
      }
    );
    setEditingWorkId(null);
    setEditingTitle('');
    setEditingDescription('');
    setEditingAuthorId('');
    // Refetch works
    fetch('/api/works')
      .then((res) => res.json())
      .then((data) => setWorks(data));
  };

  const handleDelete = async (workId: number) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      await fetch(`/api/works/${workId}`, { method: 'DELETE' });
      // Refetch works
      fetch('/api/works')
        .then((res) => res.json())
        .then((data) => setWorks(data));
    }
  };

  return (
    <div>
      <h2>Works</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        ></textarea>
        <select value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
          <option value="">Select an author</option>
          {authors.map((author) => (
            <option key={author.id} value={author.id}>
              {author.name}
            </option>
          ))}
        </select>
        <button type="submit">Add Work</button>
      </form>
      <ul>
        {works.map((work) => (
          <li key={work.id}>
            {editingWorkId === work.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <textarea
                  value={editingDescription}
                  onChange={(e) => setEditingDescription(e.target.value)}
                ></textarea>
                <select value={editingAuthorId} onChange={(e) => setEditingAuthorId(e.target.value)}>
                  {authors.map((author) => (
                    <option key={author.id} value={author.id}>
                      {author.name}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleUpdate(work.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {work.title} - {work.author_name}
                <button onClick={() => handleEdit(work)}>Edit</button>
                <button onClick={() => handleDelete(work.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
