import React, { forwardRef, useEffect, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * CanvasArea - Renders the image on a canvas with filters and adjustment applied.
 *
 * Props:
 * - image: string | null (the base64 or url of image)
 * - filters: { grayscale?: boolean; sepia?: boolean }
 * - adjustment: { brightness: number; contrast: number }
 */
interface CanvasAreaProps {
  image: string | null;
  filters: { grayscale?: boolean; sepia?: boolean };
  adjustment: { brightness: number; contrast: number };
}

const CanvasArea = forwardRef<HTMLCanvasElement, CanvasAreaProps>(
  ({ image, filters, adjustment }, ref) => {
    const localCanvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      // Choose which canvas ref to use (external if provided, otherwise own)
      const canvas = (ref && typeof ref !== "function" && "current" in ref && ref.current)
        ? ref.current
        : localCanvas.current;
      if (!canvas || !image) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const img = new window.Image();
      img.src = image;
      img.onload = () => {
        // Adjust canvas size to image
        canvas.width = img.width;
        canvas.height = img.height;

        // Build up filter string
        const filterParts = [];
        if (filters?.grayscale) filterParts.push("grayscale(1)");
        if (filters?.sepia) filterParts.push("sepia(1)");
        filterParts.push(`brightness(${adjustment.brightness ?? 1})`);
        filterParts.push(`contrast(${adjustment.contrast ?? 1})`);
        ctx.filter = filterParts.join(" ");

        // Draw with filters
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        ctx.filter = "none";
      };
      // If image changes rapidly, ensure it's cleared (to avoid flicker)
      if (!image) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, [image, filters, adjustment, ref]);

    return (
      <main className="flex-1 flex flex-col justify-center items-center bg-gray-50/80">
        {image ? (
          <canvas
            ref={ref || localCanvas}
            className="border bg-white rounded shadow-md max-w-[90vw] max-h-[82vh] transition"
            style={{ background: "#fff" }}
            tabIndex={0}
          />
        ) : (
          <div className="text-gray-400 text-base italic mt-10">
            No image loaded. Click <span className="font-semibold text-primary">Open</span> to upload.
          </div>
        )}
      </main>
    );
  }
);

CanvasArea.displayName = "CanvasArea";

export default CanvasArea;
