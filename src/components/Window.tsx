'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface WindowProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
  initialPosition?: { x: number; y: number };
  initialSize?: { width: number; height: number };
}

export default function Window({
  title,
  children,
  onClose,
  isActive,
  onFocus,
  initialPosition = { x: 50, y: 50 },
  initialSize = { width: 800, height: 600 }
}: WindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState(initialSize);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    onFocus();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isMaximized) return;
      // Mise à jour instantanée sans animation
      setPosition({
        x: e.clientX - dragStartRef.current.x,
        y: Math.max(0, e.clientY - dragStartRef.current.y)
      });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isMaximized]);

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const windowStyle = isMaximized
    ? { left: 0, top: 0, right: 0, bottom: 80, width: '100%', height: 'calc(100vh - 112px)' }
    : { left: position.x, top: position.y, width: size.width, height: size.height };

  return (
    <div
      className={`absolute rounded-xl overflow-hidden flex flex-col transition-shadow duration-150 ${
        isActive ? 'z-50' : 'z-40'
      } ${isDragging ? 'cursor-grabbing' : ''}`}
      style={{
        ...windowStyle,
        background: 'linear-gradient(145deg, rgba(25,27,35,0.95) 0%, rgba(18,20,28,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isActive 
          ? '1px solid rgba(255,255,255,0.12)' 
          : '1px solid rgba(255,255,255,0.06)',
        boxShadow: isActive
          ? '0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)'
          : '0 10px 30px rgba(0,0,0,0.4)'
      }}
      onClick={onFocus}
    >
      {/* Title Bar - Style macOS simple */}
      <div
        className={`h-10 border-b flex items-center justify-between px-3 cursor-grab select-none ${
          isActive ? 'border-white/10' : 'border-white/5'
        } ${isDragging ? 'cursor-grabbing' : ''}`}
        style={{
          background: isActive 
            ? 'rgba(40,42,50,0.9)'
            : 'rgba(35,37,45,0.7)'
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Traffic lights - Boutons macOS simples */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 transition-colors"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMaximize();
            }}
            className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 transition-colors"
          />
        </div>
        
        {/* Titre centré */}
        <span className={`text-sm font-medium absolute left-1/2 -translate-x-1/2 ${
          isActive ? 'text-white/80' : 'text-white/40'
        }`}>
          {title}
        </span>

        <div className="w-14" />
      </div>

      {/* Content */}
      <div 
        className="flex-1 overflow-hidden"
        style={{
          background: 'rgba(12,14,20,0.95)'
        }}
      >
        {children}
      </div>
    </div>
  );
}
