import React, { useEffect, useState } from 'react';

export const DetailingCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hoveredType, setHoveredType] = useState<'default' | 'card' | 'gallery'>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if device supports fine hover
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mediaQuery.matches) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('[data-cursor="gallery"]')) {
        setHoveredType('gallery');
      } else if (target.closest('button, a, input, select, textarea, [data-cursor="card"]')) {
        setHoveredType('card');
      } else {
        setHoveredType('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  const size = hoveredType === 'gallery' ? 64 : hoveredType === 'card' ? 44 : 26;
  const borderColor = hoveredType === 'gallery' 
    ? 'rgba(198, 154, 114, 0.9)' 
    : hoveredType === 'card' 
    ? 'rgba(198, 154, 114, 0.7)' 
    : 'rgba(198, 154, 114, 0.4)';
  const bgColor = hoveredType === 'gallery'
    ? 'rgba(32, 30, 27, 0.85)'
    : hoveredType === 'card'
    ? 'rgba(198, 154, 114, 0.12)'
    : 'transparent';

  return (
    <div
      className="custom-cursor flex items-center justify-center font-sans pointer-events-none select-none text-[10px] tracking-wider font-semibold text-[#C69A72] backdrop-blur-[2px]"
      style={{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        border: `1.5px solid ${borderColor}`,
        backgroundColor: bgColor,
        transition: 'width 0.18s ease-out, height 0.18s ease-out, border-color 0.18s ease-out, background-color 0.18s ease-out',
      }}
    >
      {hoveredType === 'gallery' && <span>VIEW</span>}
    </div>
  );
};
