import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Topbar
 * Displays current status and secondary actions on the main content area.
 */
export default function Topbar({ status, rightContent }) {
  /** This is a public function. */
  return (
    <div className="topbar">
      <div className="status">{status}</div>
      <div className="actions">{rightContent}</div>
    </div>
  );
}
