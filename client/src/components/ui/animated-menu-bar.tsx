import React from 'react';

export interface AnimatedMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface MenuBarProps {
  items: AnimatedMenuItem[];
  active?: string;
  onSelect?: (key: string) => void;
}

interface IconButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ icon, label, active, onClick }) => {
  const [hovered, setHovered] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const tooltipTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Calculate width based on label length (min 44px for icon, plus label)
  const expandedWidth = Math.max(44 + label.length * 9 + 32, 120);

  const isExpanded = hovered || active;

  const handleMobileTooltip = (e: React.MouseEvent) => {
    if (window.innerWidth < 640) {
      e.preventDefault();
      setShowTooltip(true);
      if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
      tooltipTimeout.current = setTimeout(() => setShowTooltip(false), 1200);
    }
    if (onClick) onClick();
  };

  React.useEffect(() => () => {
    if (tooltipTimeout.current) clearTimeout(tooltipTimeout.current);
  }, []);

  return (
    <button
      type="button"
      aria-label={label}
      className={`flex items-center rounded-xl border transition-colors focus:outline-none relative overflow-visible
        ${
          active
            ? 'border-[#c8f54e] bg-[#c8f54e] text-[#1a1a1a] font-semibold'
            : 'border-transparent text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#1a1a1a]/5'
        }
        duration-300
        w-11 sm:w-auto
        px-0 sm:px-4
        justify-center sm:justify-start
      `}
      style={{
        minWidth: 44,
        minHeight: 44,
        transition: 'background 0.2s, border 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleMobileTooltip}
    >
      <span
        className={`sm:hidden absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1a1a1a] text-white text-xs rounded px-2 py-1 shadow transition-opacity duration-200 pointer-events-none z-20
          ${showTooltip ? 'opacity-100' : 'opacity-0'}`}
      >
        {label}
      </span>
      <span className="flex items-center justify-center w-5 h-5">
        {icon}
      </span>
      <span
        className={`text-sm font-mono transition-all duration-300 whitespace-nowrap pointer-events-none ml-2
          hidden sm:inline
          ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}
        style={{
          transition: 'opacity 0.3s, width 0.35s cubic-bezier(0.4,0,0.2,1), margin 0.3s',
          width: isExpanded ? expandedWidth - 44 - 32 : 0,
        }}
      >
        {label}
      </span>
    </button>
  );
};

export const AnimatedMenuBar = ({ items, active, onSelect }: MenuBarProps) => {
  return (
    <nav className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-[#e8e4df] w-fit transition-all duration-300 shadow-sm">
      {items.map((item) => (
        <IconButton
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={active === item.id}
          onClick={() => onSelect?.(item.id)}
        />
      ))}
    </nav>
  );
};
