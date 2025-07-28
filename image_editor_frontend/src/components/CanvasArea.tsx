import React, { forwardRef, useEffect, useRef } from "react";

interface CanvasAreaProps {
  image: string | null;
  filters: { grayscale?: boolean; sepia?: boolean };
  adjustment: { brightness: number; contrast: number };
}

const CanvasArea = forwardRef<HTMLCanvasElement, CanvasAreaProps>(
  ({ image, filters, adjustment }, ref) => {
    const localCanvas = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      // The ref will be used by editor logic for direct manipulation.
      // Also rerender image when props change.
      const canvas = (ref as React.MutableRefObject<HTMLCanvasElement | null>)
        ?.current
        ? (ref as React.MutableRefObject<HTMLCanvasElement | null>).current
        : localCanvas.current;
      if (!canvas || !image) return;
      const ctx = canvas.getContext("2d");
      const img = typeof image === "string" ? new window.Image() : image;
      if (typeof image === "string") {
        img.src = image;
      }
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        // Filters handled in useImageEditor via canvas manipulation!
      };
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
