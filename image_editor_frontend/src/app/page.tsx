"use client";

import EditorSidebar from "@/components/EditorSidebar";
import TopNavbar from "@/components/TopNavbar";
import CanvasArea from "@/components/CanvasArea";
import useImageEditor from "@/hooks/useImageEditor";

export default function Home() {
  // Custom hook manages image data and editor state.
  const {
    canvasRef,
    image,
    tempImage,
    filters,
    adjustment,
    canUndo,
    canRedo,
    loadImage,
    triggerUpload,
    handleDownload,
    handleUndo,
    handleRedo,
    applyCrop,
    applyResize,
    applyRotate,
    applyFilter,
    applyAdjustment,
    isDirty,
  } = useImageEditor();

  return (
    <div className="min-h-screen flex flex-col bg-secondary text-[#222]">
      {/* Top Navigation Bar */}
      <TopNavbar
        onUpload={triggerUpload}
        onDownload={handleDownload}
        canDownload={Boolean(image)}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        isDirty={isDirty}
      />

      <div className="flex-1 flex w-full items-stretch max-h-[calc(100vh-56px)]">
        {/* Sidebar */}
        <EditorSidebar
          onCrop={applyCrop}
          onResize={applyResize}
          onRotate={applyRotate}
          onFilter={applyFilter}
          onAdjustment={applyAdjustment}
          disableTools={!image}
        />
        {/* Central Canvas */}
        <CanvasArea
          ref={canvasRef}
          image={tempImage || image}
          filters={filters}
          adjustment={adjustment}
        />
        {/* Hidden input for image upload */}
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          className="hidden"
          onChange={loadImage}
        />
      </div>
      {/* Minimal footer */}
      <footer className="text-xs text-gray-400 text-center py-2 bg-white border-t">
        Modern Image Editor &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
