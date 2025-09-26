import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * NoteEditor
 * Editor for a single note with title and content fields.
 */
export default function NoteEditor({ note, onSave, onDelete }) {
  /** This is a public function. */
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isDirty, setDirty] = useState(false);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setDirty(false);
  }, [note?.id]);

  useEffect(() => {
    setDirty(true);
  }, [title, content]);

  if (!note) {
    return (
      <div className="editor-empty">
        Select a note from the list, or create a new one to begin.
      </div>
    );
  }

  return (
    <div className="note-editor">
      <div className="editor-header">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          aria-label="Note title"
        />
        <div className="editor-actions">
          <button
            className="btn btn-danger ghost"
            onClick={() => onDelete(note.id)}
            aria-label="Delete note"
            title="Delete"
          >
            Delete
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onSave({ id: note.id, title, content })}
            disabled={!isDirty}
            aria-label="Save note"
            title="Save"
          >
            {isDirty ? 'Save' : 'Saved'}
          </button>
        </div>
      </div>
      <textarea
        className="content-input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your note..."
        aria-label="Note content"
      />
    </div>
  );
}
