"use client";

import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Fullscreen } from "lucide-react";

interface ZoomableImageProps {
  src: string;
  alt: string;
  variant?: "centered" | "banner";
}

export function ZoomableImage({ src, alt, variant = "centered" }: ZoomableImageProps) {
  const isBanner = variant === "banner";

  const imageElement = (
    <ImageZoom
      src={src}
      alt={alt}
      width={isBanner ? 20 : 800}
      height={isBanner ? 10 : 600}
      className={
        isBanner
          ? "w-full h-auto object-cover aspect-video rounded-lg"
          : "rounded-lg w-auto h-auto max-w-full mt-0 mb-0"
      }
    />
  );

  const zoomIndicator = (
    <div className="absolute bottom-2 right-2 bg-fd-accent text-fd-accent-foreground px-1 py-1 rounded text-sm pointer-events-none">
      <Fullscreen className="size-4 group-hover:hidden" />
      <span className="hidden group-hover:inline">Cliquer pour agrandir</span>
    </div>
  );

  if (isBanner) {
    return (
      <div className="relative group">
        {imageElement}
        {zoomIndicator}
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-4">
      <div className="relative group md:max-w-[70%]">
        {imageElement}
        {zoomIndicator}
      </div>
    </div>
  );
}
