'use client';

import { useState, useRef, useEffect } from 'react';
import Window from './Window';
import { useGameStore } from '@/store/gameStore';
import { processCommand } from '@/lib/terminalCommands';

interface TerminalProps {
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

export default function Terminal({ onClose, isActive, onFocus }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output' | 'error', content: string }>>([
    { type: 'output', content: 'HackSim Terminal v2.0.1' },
    { type: 'output', content: 'Type "help" for available commands\n' }
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const { currentDirectory, setCurrentDirectory, session } = useGameStore();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    // Add command to history
    setHistory(prev => [...prev, { type: 'input', content: `${currentDirectory} $ ${cmd}` }]);
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    // Process command
    const result = await processCommand(cmd, currentDirectory, session);
    
    if (result.output) {
      setHistory(prev => [...prev, { type: result.error ? 'error' : 'output', content: result.output }]);
    }

    if (result.newDirectory) {
      setCurrentDirectory(result.newDirectory);
    }

    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete could be implemented here
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setInput('');
      setHistory(prev => [...prev, { type: 'output', content: '^C' }]);
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    }
  };

  return (
    <Window
      title="Terminal"
      onClose={onClose}
      isActive={isActive}
      onFocus={onFocus}
      initialPosition={{ x: 200, y: 120 }}
      initialSize={{ width: 850, height: 520 }}
    >
      <div 
        className="h-full flex flex-col p-4 font-mono text-sm"
        style={{
          background: 'linear-gradient(180deg, rgba(10,12,16,0.98) 0%, rgba(5,8,12,0.99) 100%)'
        }}
      >
        {/* Scanlines overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
          }}
        />
        
        {/* Terminal output */}
        <div 
          ref={terminalRef} 
          className="flex-1 overflow-y-auto space-y-1.5 mb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent relative"
        >
          {history.map((item, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap leading-relaxed ${
                item.type === 'input'
                  ? 'text-gray-200'
                  : item.type === 'error'
                  ? 'text-red-400'
                  : 'text-gray-400'
              }`}
              style={{
                textShadow: item.type === 'input' 
                  ? '0 0 10px rgba(255,255,255,0.1)' 
                  : item.type === 'error'
                  ? '0 0 10px rgba(239,68,68,0.3)'
                  : 'none'
              }}
            >
              {item.content}
            </div>
          ))}
        </div>

        {/* Input line with glow */}
        <div 
          className="flex items-center gap-2 py-2 px-3 rounded-lg relative"
          style={{
            background: 'rgba(0,255,136,0.03)',
            border: '1px solid rgba(0,255,136,0.15)'
          }}
        >
          <span 
            className="text-hacker-primary font-semibold"
            style={{ textShadow: '0 0 10px rgba(0,255,136,0.5)' }}
          >
            {currentDirectory} $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white caret-hacker-primary"
            style={{ textShadow: '0 0 5px rgba(255,255,255,0.2)' }}
            autoFocus={isActive}
            spellCheck={false}
          />
          {/* Cursor blink indicator */}
          <div className="w-2 h-5 bg-hacker-primary/60 animate-pulse rounded-sm" />
        </div>
      </div>
    </Window>
  );
}
