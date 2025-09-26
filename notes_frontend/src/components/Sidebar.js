import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * A vertical navigation panel with actions and filtering for notes.
 */
export default function Sidebar({ onNew, search, onSearchChange }) {
  /** This is a public function. */
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">📝</div>
        <div className="brand-text">
          <div className="brand-title">Ocean Notes</div>
          <div className="brand-sub">Personal Notebook</div>
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={onNew}>
        + New Note
      </button>

      <div className="search">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notes"
        />
      </div>

      <div className="sidebar-footer">
        <div className="tip">
          Pro tip: Use search to quickly filter notes by title or content.
        </div>
      </div>
    </aside>
  );
}
