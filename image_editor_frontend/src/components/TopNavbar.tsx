import React from "react";

/**
 * Top navigation bar for global actions.
 * Props:
 * - onUpload: triggers file picker
 * - onDownload: initiates image download
 * - canDownload: image loaded
 * - onUndo, onRedo
 * - canUndo, canRedo
 * - isDirty: bool
 */
export default function TopNavbar({
  onUpload,
  onDownload,
  canDownload,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isDirty,
}: {
  onUpload: () => void;
  onDownload: () => void;
  canDownload: boolean;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
}) {
  return (
    <nav className="flex items-center gap-2 px-6 h-14 bg-primary shadow-md text-white z-20">
      <div className="font-bold text-xl tracking-tight flex-1">
        <span className="text-accent">✶</span> Image Editor
      </div>
      <button
        onClick={onUpload}
        className="px-3 py-1 rounded hover:bg-accent/80 active:bg-accent bg-accent text-white font-semibold mr-1 transition"
        tabIndex={0}
      >
        Open
      </button>
      <button
        onClick={onDownload}
        className={`px-3 py-1 rounded hover:bg-white/20 border border-white/30 ml-1 font-semibold transition ${
          !canDownload ? "opacity-50 pointer-events-none" : ""
        }`}
        tabIndex={0}
        disabled={!canDownload}
      >
        Download
      </button>
      <div className="border-l border-white/20 h-7 mx-4" />
      <button
        title="Undo"
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-2 py-1 rounded hover:bg-white/30 transition ${
          !canUndo ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        ↶
      </button>
      <button
        title="Redo"
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-2 py-1 rounded hover:bg-white/30 transition ${
          !canRedo ? "opacity-40 pointer-events-none" : ""
        }`}
      >
        ↷
      </button>
      {isDirty ? <div className="text-xs ml-3 text-accent">● unsaved</div> : null}
    </nav>
  );
}
