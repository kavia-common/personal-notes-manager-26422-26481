import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';

import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import NotesList from './components/NotesList';
import NoteEditor from './components/NoteEditor';
import EmptyState from './components/EmptyState';

import { listNotes, createNote, getNote, updateNote, deleteNote } from './services/notesService';

// PUBLIC_INTERFACE
function App() {
  /** Main Notes application with Ocean Professional styling and Supabase CRUD integration. */
  const [theme] = useState('light'); // Static light theme per Ocean Professional
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Ready');

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Load notes
  const loadNotes = async (query = '') => {
    try {
      setLoading(true);
      setStatus('Loading notes…');
      const data = await listNotes({ search: query });
      setNotes(data);
      setStatus(`Loaded ${data.length} note${data.length === 1 ? '' : 's'}`);
      if (data.length && !activeId) {
        setActiveId(data[0].id);
      } else if (!data.length) {
        setActiveId(null);
        setActiveNote(null);
      }
    } catch (e) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Load active note details when activeId changes
  useEffect(() => {
    const loadActive = async () => {
      if (!activeId) return setActiveNote(null);
      try {
        setStatus('Loading note…');
        const n = await getNote(activeId);
        setActiveNote(n);
        setStatus('Ready');
      } catch (e) {
        console.error(e);
        setStatus(`Error: ${e.message}`);
      }
    };
    loadActive();
  }, [activeId]);

  const onNew = async () => {
    try {
      setStatus('Creating note…');
      const n = await createNote({ title: 'Untitled', content: '' });
      await loadNotes(search);
      setActiveId(n.id);
      setStatus('Note created');
    } catch (e) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    }
  };

  const onSave = async ({ id, title, content }) => {
    try {
      setStatus('Saving…');
      const saved = await updateNote(id, { title, content });
      setActiveNote(saved);
      await loadNotes(search);
      setActiveId(saved.id);
      setStatus('Saved');
    } catch (e) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    }
  };

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this note? This cannot be undone.');
    if (!ok) return;
    try {
      setStatus('Deleting…');
      await deleteNote(id);
      await loadNotes(search);
      setActiveId(notes[0]?.id || null);
      setStatus('Deleted');
    } catch (e) {
      console.error(e);
      setStatus(`Error: ${e.message}`);
    }
  };

  const rightTopbarContent = useMemo(
    () => (
      <div className="toolbar">
        <button className="btn ghost">{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
    ),
    [loading]
  );

  return (
    <div className="ocean-app">
      <div className="gradient-bg" />
      <Sidebar onNew={onNew} search={search} onSearchChange={setSearch} />
      <main className="content">
        <Topbar status={status} rightContent={rightTopbarContent} />
        <div className="content-body">
          <section className="panel left">
            <div className="panel-title">All Notes</div>
            <NotesList notes={notes} activeId={activeId} onSelect={setActiveId} />
          </section>
          <section className="panel right">
            {notes.length === 0 ? (
              <EmptyState onNew={onNew} />
            ) : (
              <NoteEditor note={activeNote} onSave={onSave} onDelete={onDelete} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;
