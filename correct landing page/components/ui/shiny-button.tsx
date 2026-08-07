import React from "react";
import "./shiny-button.css";

interface ShinyButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ShinyButton({ children, onClick, className = "" }: ShinyButtonProps) {
  return (
    <button className={`shiny-cta ${className}`} onClick={onClick}>
      <div className="shiny-border" />
      <span>{children}</span>
    </button>
  );
}
