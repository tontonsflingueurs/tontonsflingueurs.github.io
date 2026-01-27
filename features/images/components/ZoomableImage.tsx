"use client";

import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Fullscreen } from "lucide-react";
import { useEffect, useState } from "react";
import { getImage } from "../data";

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

// Props avec ID (pour les articles MDX)
interface ZoomableImagePropsWithId {
  id: string;
  src?: never;
  alt?: never;
  variant?: "centered" | "banner" | "wide-banner" | "compact";
}

// Props directes (pour les pages dynamiques comme la couverture d'article)
interface ZoomableImagePropsWithSrc {
  id?: never;
  src: string;
  alt: string;
  variant?: "centered" | "banner" | "wide-banner" | "compact";
}

type ZoomableImageProps = ZoomableImagePropsWithId | ZoomableImagePropsWithSrc;

export function ZoomableImage(props: ZoomableImageProps) {
  const { variant = "centered" } = props;

  // Résolution des métadonnées selon le mode
  let src: string;
  let alt: string;

  if ("id" in props && props.id) {
    const meta = getImage(props.id);
    src = meta.src;
    alt = meta.alt;
  } else {
    src = props.src ?? "";
    alt = props.alt ?? "";
  }
  const [isLoaded, setIsLoaded] = useState(false);

  const isBanner = variant === "banner";
  const isWideBanner = variant === "wide-banner";
  const isCompact = variant === "compact";

  // Précharge l'image via la file d'attente globale
  useEffect(() => {
    queueImagePreload(src).then(() => {
      setIsLoaded(true);
    });
  }, [src]);

  const getSkeletonClassName = () => {
    if (isWideBanner) return "w-full aspect-[21/9] rounded-lg";
    if (isBanner) return "w-full aspect-video rounded-lg";
    if (isCompact) return "w-full aspect-[4/3] rounded-lg";
    return "w-full aspect-[4/3] rounded-lg";
  };

  const getClassName = () => {
    if (isWideBanner) {
      return "w-full h-auto object-cover aspect-[21/9] rounded-lg";
    }
    if (isBanner) {
      return "w-full h-auto object-cover aspect-video rounded-lg";
    }
    if (isCompact) {
      return "rounded-lg w-auto h-auto max-w-full mt-0 mb-0";
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

  if (isCompact) {
    return (
      <div className="flex justify-center mb-4">
        <div className="relative group md:max-w-[50%]">
          {skeleton}
          {imageElement}
          {isLoaded && zoomIndicator}
        </div>
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
