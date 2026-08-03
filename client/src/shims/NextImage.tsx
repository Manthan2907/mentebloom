/**
 * Shim for `next/image` — used by landing page components.
 * Renders a plain <img> tag so Vite can consume Next.js components.
 */
import React from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fill?: boolean;
  priority?: boolean;
  width?: number;
  height?: number;
}

const Image = ({ src, alt, fill, priority, width, height, style, ...props }: ImageProps) => (
  <img
    src={src}
    alt={alt}
    width={fill ? undefined : width}
    height={fill ? undefined : height}
    style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", ...style } : style}
    loading={priority ? "eager" : "lazy"}
    {...props}
  />
);

export default Image;
