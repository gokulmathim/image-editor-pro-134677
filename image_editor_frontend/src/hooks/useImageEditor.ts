import { useRef, useState } from "react";

/**
 * PUBLIC_INTERFACE
 * useImageEditor - Custom hook for main editor logic.
 * - Handles image state, basic editing, filters, brightness/contrast, undo/redo.
 * - Manages a simple canvas interface for drawing and exporting images.
 */
export default function useImageEditor() {
  // Canvas DOM ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // State: main image, tempImage (for operations-in-progress)
  const [image, setImage] = useState<string | null>(null);

  // Filters and adjustments (simple object)
  const [filters, setFilters] = useState<{ grayscale?: boolean; sepia?: boolean }>({});
  const [adjustment, setAdjustment] = useState<{ brightness: number; contrast: number }>({ brightness: 1, contrast: 1 });

  // History for undo/redo
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Load image from file input
  // PUBLIC_INTERFACE
  function loadImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setImage(url);
      setHistory([url]);
      setRedoStack([]);
      setIsDirty(false);
      setFilters({});
      setAdjustment({ brightness: 1, contrast: 1 });
    };
    reader.readAsDataURL(file);
    (document.getElementById("image-upload") as HTMLInputElement).value = "";
  }

  // PUBLIC_INTERFACE
  function triggerUpload() {
    (document.getElementById("image-upload") as HTMLInputElement).click();
  }

  // PUBLIC_INTERFACE
  function handleDownload() {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "edited-image.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setIsDirty(false);
  }

  // PUBLIC_INTERFACE
  function handleUndo() {
    if (history.length > 1) {
      setRedoStack((r) => [history[history.length - 1], ...r]);
      const newHist = history.slice(0, -1);
      setHistory(newHist);
      setImage(newHist[newHist.length - 1]);
      setIsDirty(true);
    }
  }

  // PUBLIC_INTERFACE
  function handleRedo() {
    if (redoStack.length > 0) {
      const redoImg = redoStack[0];
      setHistory((h) => [...h, redoImg]);
      setImage(redoImg);
      setRedoStack(redoStack.slice(1));
      setIsDirty(true);
    }
  }

  // --- TOOL LOGIC: crop/resize/rotate/filter/adjustment ---
  // Here, actual implementations for each edit tool:
  // for brevity, only rudimentary placeholder logic for demo

  // (In a real app you'd expand these to show dialogs/UI for crop/resize, etc)
  // Here: instantly apply simple demo effect

  // PUBLIC_INTERFACE
  function setCrop() {}
  // PUBLIC_INTERFACE
  function setResize() {}
  // PUBLIC_INTERFACE
  function setRotate() {}
  // PUBLIC_INTERFACE
  function setFilter() {}
  // (setAdjustment intentionally omitted)

  // PUBLIC_INTERFACE
  function applyCrop() {
    // Basic implementation: hardcoded crop example
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      const crop = { x: 0, y: 0, w: img.width * 0.7, h: img.height * 0.7 };
      canvasRef.current!.width = crop.w;
      canvasRef.current!.height = crop.h;
      ctx?.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);
      const url = canvasRef.current!.toDataURL();
      setImage(url);
      setHistory((h) => [...h, url]);
      setRedoStack([]);
      setIsDirty(true);
    };
    img.src = image;
  }

  // PUBLIC_INTERFACE
  function applyResize() {
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      // Resize: 80% scale for demo
      const w = Math.round(img.width * 0.8);
      const h = Math.round(img.height * 0.8);
      canvasRef.current!.width = w;
      canvasRef.current!.height = h;
      ctx?.drawImage(img, 0, 0, w, h);
      const url = canvasRef.current!.toDataURL();
      setImage(url);
      setHistory((h) => [...h, url]);
      setRedoStack([]);
      setIsDirty(true);
    };
    img.src = image;
  }

  // PUBLIC_INTERFACE
  function applyRotate() {
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvasRef.current!.width = img.height;
      canvasRef.current!.height = img.width;
      ctx?.translate(img.height / 2, img.width / 2);
      ctx?.rotate((90 * Math.PI) / 180);
      ctx?.drawImage(img, -img.width / 2, -img.height / 2);
      const url = canvasRef.current!.toDataURL();
      setImage(url);
      setHistory((h) => [...h, url]);
      setRedoStack([]);
      setIsDirty(true);
    };
    img.src = image;
  }

  // PUBLIC_INTERFACE
  function applyFilter(type: string) {
    // (for demo: only grayscale/sepia)
    setFilters((f) => ({
      ...f,
      [type]: !f[type as "grayscale" | "sepia"],
    }));
    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvasRef.current!.width = img.width;
      canvasRef.current!.height = img.height;
      ctx?.drawImage(img, 0, 0);
      // Canvas filter
      ctx!.filter =
        (type === "grayscale" && "grayscale(1)") ||
        (type === "sepia" && "sepia(1)") ||
        "none";
      ctx?.drawImage(img, 0, 0);
      const url = canvasRef.current!.toDataURL();
      setImage(url);
      setHistory((h) => [...h, url]);
      setRedoStack([]);
      setIsDirty(true);
      ctx!.filter = "none";
    };
    img.src = image;
  }

  // PUBLIC_INTERFACE
  function applyAdjustment(
    type: "brightness" | "contrast",
    delta: number
  ) {
    setAdjustment((adj) => ({
      ...adj,
      [type]: Math.max(0.1, Math.min((adj[type] || 1) + delta, 2.5)),
    }));

    if (!canvasRef.current || !image) return;
    const ctx = canvasRef.current.getContext("2d");
    const img = new window.Image();
    img.onload = () => {
      canvasRef.current!.width = img.width;
      canvasRef.current!.height = img.height;
      let brightness = type === "brightness" ? adjustment.brightness + delta : adjustment.brightness;
      let contrast = type === "contrast" ? adjustment.contrast + delta : adjustment.contrast;
      brightness = Math.max(0.1, Math.min(brightness, 2.5));
      contrast = Math.max(0.1, Math.min(contrast, 2.5));
      ctx!.filter = `brightness(${brightness}) contrast(${contrast})`;
      ctx?.drawImage(img, 0, 0);
      const url = canvasRef.current!.toDataURL();
      setImage(url);
      setHistory((h) => [...h, url]);
      setRedoStack([]);
      setIsDirty(true);
      ctx!.filter = "none";
    };
    img.src = image;
  }

  // Expose state & functions
  return {
    canvasRef,
    image,
    tempImage: null,
    filters,
    adjustment,
    history,
    canUndo: history.length > 1,
    canRedo: redoStack.length > 0,
    loadImage,
    triggerUpload,
    handleDownload,
    handleUndo,
    handleRedo,
    setCrop,
    setResize,
    setRotate,
    setFilter,
    // setAdjustment intentionally omitted due to duplication
    applyCrop,
    applyResize,
    applyRotate,
    applyFilter,
    applyAdjustment,
    isDirty,
  };
}
