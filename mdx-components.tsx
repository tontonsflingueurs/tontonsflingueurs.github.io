import { BlogCards } from "@/features/blog";
import { ZoomableImage } from "@/features/images";
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
    em: (props) => <em className="text-(--color-fd-italic) italic" {...props} />,
    ...components,
  };
}
