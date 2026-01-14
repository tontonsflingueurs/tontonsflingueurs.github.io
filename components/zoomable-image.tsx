"use client";

import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Fullscreen } from "lucide-react";
import { useEffect, useState } from "react";

// File d'attente globale pour le préchargement séquentiel
const imageQueue: Array<{ src: string; resolve: () => void }> = [];
let isProcessing = false;

function processQueue() {
  if (isProcessing || imageQueue.length === 0) return;

  isProcessing = true;
  const { src, resolve } = imageQueue.shift()!;

  const img = new Image();
  img.onload = () => {
    resolve();
    isProcessing = false;
    processQueue(); // Passe à l'image suivante
  };
  img.onerror = () => {
    resolve(); // Continue même en cas d'erreur
    isProcessing = false;
    processQueue();
  };
  img.src = src;
}

function queueImagePreload(src: string): Promise<void> {
  return new Promise((resolve) => {
    imageQueue.push({ src, resolve });
    processQueue();
  });
}

interface ZoomableImageProps {
  src: string;
  alt: string;
  variant?: "centered" | "banner" | "wide-banner";
}

export function ZoomableImage({ src, alt, variant = "centered" }: ZoomableImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const isBanner = variant === "banner";
  const isWideBanner = variant === "wide-banner";

  // Précharge l'image via la file d'attente globale
  useEffect(() => {
    queueImagePreload(src).then(() => {
      setIsLoaded(true);
    });
  }, [src]);

  const getSkeletonClassName = () => {
    if (isWideBanner) return "w-full aspect-[21/9] rounded-lg";
    if (isBanner) return "w-full aspect-video rounded-lg";
    return "w-full aspect-[4/3] rounded-lg";
  };

  const getClassName = () => {
    if (isWideBanner) {
      return "w-full h-auto object-cover aspect-[21/9] rounded-lg";
    }
    if (isBanner) {
      return "w-full h-auto object-cover aspect-video rounded-lg";
    }
    return "rounded-lg w-auto h-auto max-w-full mt-0 mb-0";
  };

  const skeleton = !isLoaded && <div className={`animate-pulse bg-fd-muted ${getSkeletonClassName()}`} />;

  const imageElement = isLoaded && (
    <ImageZoom
      src={src}
      alt={alt}
      width={isBanner || isWideBanner ? 20 : 800}
      height={isBanner || isWideBanner ? 10 : 600}
      className={getClassName()}
    />
  );

  const zoomIndicator = (
    <div className="absolute bottom-2 right-2 bg-fd-accent text-fd-accent-foreground px-1 py-1 rounded text-sm pointer-events-none">
      <Fullscreen className="size-4 group-hover:hidden" />
      <span className="hidden group-hover:inline">Cliquer pour agrandir</span>
    </div>
  );

  if (isBanner || isWideBanner) {
    return (
      <div className="relative group">
        {skeleton}
        {imageElement}
        {isLoaded && zoomIndicator}
      </div>
    );
  }

  return (
    <div className="flex justify-center mb-4">
      <div className="relative group md:max-w-[70%]">
        {skeleton}
        {imageElement}
        {isLoaded && zoomIndicator}
      </div>
    </div>
  );
}
