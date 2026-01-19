import { BlogCards } from "@/components/blog-cards";
import { ZoomableImage } from "@/components/zoomable-image";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    ...defaultMdxComponents,
    Accordion,
    Accordions,
    BlogCards,
    ZoomableImage,
    img: (props) => <ImageZoom {...(props as any)} />,
    strong: (props) => <strong className="text-fd-primary font-bold" {...props} />,
    ...components,
  };
}
