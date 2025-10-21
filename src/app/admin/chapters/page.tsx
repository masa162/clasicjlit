'use client';

import { useState, useEffect } from 'react';
import SimpleMdeEditor from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

interface Chapter {
  id: number;
  title: string;
  work_title: string;
  chapter_order: number;
  content: string;
  audio_url: string;
}

interface Work {
  id: number;
  title: string;
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [works, setWorks] = useState<Work[]>([]);
  const [title, setTitle] = useState('');
  const [workId, setWorkId] = useState('');
  const [chapterOrder, setChapterOrder] = useState('');
  const [content, setContent] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/chapters')
      .then((res) => res.json())
      .then((data) => setChapters(data));
    fetch('/api/works')
      .then((res) => res.json())
      .then((data) => setWorks(data));
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const { url } = await res.json();
    setAudioUrl(url);
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/chapters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, work_id: workId, chapter_order: chapterOrder, content, audio_url: audioUrl }),
    });
    setTitle('');
    setWorkId('');
    setChapterOrder('');
    setContent('');
    setAudioUrl('');
    // Refetch chapters
    fetch('/api/chapters')
      .then((res) => res.json())
      .then((data) => setChapters(data));
  };

  const [editingChapterId, setEditingChapterId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingWorkId, setEditingWorkId] = useState('');
  const [editingChapterOrder, setEditingChapterOrder] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [editingAudioUrl, setEditingAudioUrl] = useState('');

  const handleEdit = (chapter: Chapter) => {
    setEditingChapterId(chapter.id);
    setEditingTitle(chapter.title);
    const work = works.find(work => work.title === chapter.work_title);
    if(work) {
      setEditingWorkId(work.id.toString());
    }
    setEditingChapterOrder(chapter.chapter_order.toString());
    setEditingContent(chapter.content);
    setEditingAudioUrl(chapter.audio_url);
  };

  const handleCancelEdit = () => {
    setEditingChapterId(null);
    setEditingTitle('');
    setEditingWorkId('');
    setEditingChapterOrder('');
    setEditingContent('');
    setEditingAudioUrl('');
  };

  const handleUpdate = async (chapterId: number) => {
    await fetch(`/api/chapters/${chapterId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: editingTitle, work_id: editingWorkId, chapter_order: editingChapterOrder, content: editingContent, audio_url: editingAudioUrl }),
      }
    );
    setEditingChapterId(null);
    setEditingTitle('');
    setEditingWorkId('');
    setEditingChapterOrder('');
    setEditingContent('');
    setEditingAudioUrl('');
    // Refetch chapters
    fetch('/api/chapters')
      .then((res) => res.json())
      .then((data) => setChapters(data));
  };

  const handleDelete = async (chapterId: number) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      await fetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
      // Refetch chapters
      fetch('/api/chapters')
        .then((res) => res.json())
        .then((data) => setChapters(data));
    }
  };

  return (
    <div>
      <h2>Chapters</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <select value={workId} onChange={(e) => setWorkId(e.target.value)}>
          <option value="">Select a work</option>
          {works.map((work) => (
            <option key={work.id} value={work.id}>
              {work.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={chapterOrder}
          onChange={(e) => setChapterOrder(e.target.value)}
          placeholder="Chapter Order"
        />
        <SimpleMdeEditor value={content} onChange={setContent} />
        <input type="file" onChange={handleFileChange} />
        {uploading && <p>Uploading...</p>}
        {audioUrl && <p>Audio uploaded: {audioUrl}</p>}
        <button type="submit">Add Chapter</button>
      </form>
      <ul>
        {chapters.map((chapter) => (
          <li key={chapter.id}>
            {editingChapterId === chapter.id ? (
              <>
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <select value={editingWorkId} onChange={(e) => setEditingWorkId(e.target.value)}>
                  {works.map((work) => (
                    <option key={work.id} value={work.id}>
                      {work.title}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={editingChapterOrder}
                  onChange={(e) => setEditingChapterOrder(e.target.value)}
                />
                <SimpleMdeEditor value={editingContent} onChange={setEditingContent} />
                <input type="file" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  setUploading(true);
                  const formData = new FormData();
                  formData.append('file', file);

                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  const { url } = await res.json();
                  setEditingAudioUrl(url);
                  setUploading(false);
                }} />
                {uploading && <p>Uploading...</p>}
                {editingAudioUrl && <p>Audio uploaded: {editingAudioUrl}</p>}
                <button onClick={() => handleUpdate(chapter.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                {chapter.work_title} - {chapter.title}
                <button onClick={() => handleEdit(chapter)}>Edit</button>
                <button onClick={() => handleDelete(chapter.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}