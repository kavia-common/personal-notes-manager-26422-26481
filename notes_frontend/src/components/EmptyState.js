import React from 'react';

/**
 * PUBLIC_INTERFACE
 * EmptyState
 * Shown when there are no notes to display.
 */
export default function EmptyState({ onNew }) {
  /** This is a public function. */
  return (
    <div className="empty-state">
      <div className="empty-card">
        <div className="empty-icon">🌊</div>
        <div className="empty-title">Welcome to Ocean Notes</div>
        <div className="empty-desc">
          Create your first note to get started. Your ideas are safe and
          searchable.
        </div>
        <button className="btn btn-primary btn-large" onClick={onNew}>
          Create a Note
        </button>
      </div>
    </div>
  );
}
