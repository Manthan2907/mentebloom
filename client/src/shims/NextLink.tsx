/**
 * Shim for `next/link` — used by landing page components.
 * Renders a plain <a> tag so Vite can consume Next.js components.
 */
import React from "react";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

const Link = ({ href, children, ...props }: LinkProps) => (
  <a href={href} {...props}>
    {children}
  </a>
);

export default Link;
