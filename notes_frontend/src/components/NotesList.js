import React from 'react';

/**
 * PUBLIC_INTERFACE
 * NotesList
 * Renders a list of notes with active selection.
 */
export default function NotesList({ notes, activeId, onSelect }) {
  /** This is a public function. */
  return (
    <div className="notes-list">
      {notes.map((n) => (
        <div
          key={n.id}
          className={`note-item ${activeId === n.id ? 'active' : ''}`}
          onClick={() => onSelect(n.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(n.id)}
        >
          <div className="note-title">{n.title || 'Untitled'}</div>
          <div className="note-snippet">
            {(n.content || '').slice(0, 80) || 'No content yet'}
          </div>
          <div className="note-meta">
            {new Date(n.updated_at || n.created_at || Date.now()).toLocaleString()}
          </div>
        </div>
      ))}
      {notes.length === 0 && (
        <div className="note-empty">No notes found. Try creating a new one.</div>
      )}
    </div>
  );
}
