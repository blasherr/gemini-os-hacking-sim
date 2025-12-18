'use client';

interface DockProps {
  onOpenWindow: (window: string) => void;
}

export default function Dock({ onOpenWindow }: DockProps) {
  const apps = [
    {
      id: 'mission',
      name: 'Mission',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: '#3b82f6'
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: '#10b981'
    },
    {
      id: 'files',
      name: 'Fichiers',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: '#f59e0b'
    },
    {
      id: 'minigame',
      name: 'Outils',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      color: '#8b5cf6'
    },
  ];

  return (
    <div className="h-20 flex items-center justify-center pb-3">
      <div 
        className="rounded-2xl px-4 py-2.5 flex items-center gap-2"
        style={{
          background: 'rgba(30,32,40,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
        }}
      >
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenWindow(app.id)}
            className="relative group"
            title={app.name}
          >
            {/* Icon container - simple et sobre */}
            <div 
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-all duration-150 hover:scale-110 active:scale-95"
              style={{
                background: `linear-gradient(135deg, ${app.color}dd 0%, ${app.color}99 100%)`,
                boxShadow: `0 2px 8px ${app.color}40`
              }}
            >
              <div className="w-5 h-5">
                {app.icon}
              </div>
            </div>
            
            {/* Tooltip simple */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none">
              <div className="px-2 py-1 rounded text-[11px] font-medium text-white whitespace-nowrap bg-gray-900/95 border border-white/10">
                {app.name}
              </div>
            </div>
            
            {/* Dot indicator */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white/50" />
          </button>
        ))}
        
        {/* Separator */}
        <div className="w-px h-10 bg-white/10 mx-1" />
        
        {/* Status */}
        <div className="flex flex-col items-center gap-0.5 px-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[9px] text-gray-500 font-medium">ONLINE</span>
        </div>
      </div>
    </div>
  );
}
