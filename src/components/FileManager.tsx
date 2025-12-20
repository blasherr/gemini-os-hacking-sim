'use client';

import { useState } from 'react';
import Window from './Window';
import { FILE_SYSTEM, findFileByPath } from '@/data/filesystem';
import { FileNode } from '@/types';
import { useGameStore } from '@/store/gameStore';

interface FileManagerProps {
  onClose: () => void;
  isActive: boolean;
  onFocus: () => void;
}

export default function FileManager({ onClose, isActive, onFocus }: FileManagerProps) {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [viewingFile, setViewingFile] = useState<FileNode | null>(null);
  const { session, updateProgress } = useGameStore();

  const getCurrentFolder = (): FileNode => {
    if (currentPath === '/') return FILE_SYSTEM[0];
    return findFileByPath(currentPath) || FILE_SYSTEM[0];
  };

  const currentFolder = getCurrentFolder();
  const files = currentFolder.children || [];

  const handleFileClick = (file: FileNode) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
  };

  const handleFileDoubleClick = (file: FileNode) => {
    if (file.type === 'file') {
      setViewingFile(file);
      
      // Track file views for objectives
      if (file.path.includes('employees.txt')) {
        updateProgress('viewedEmployees', true);
        // Complete objective 5 when viewing employees.txt ("Trouver les identifiants")
        const { currentObjective, completeObjective, completedObjectives } = useGameStore.getState();
        if (currentObjective?.id === 5 && !completedObjectives.includes(5)) {
          completeObjective(5);
        }
      } else if (file.path.includes('master.key')) {
        updateProgress('hasDecryptionKey', true);
        // Complete objective 6 when viewing master.key ("Trouver la clé secrète")
        const { currentObjective, completeObjective, completedObjectives } = useGameStore.getState();
        if (currentObjective?.id === 6 && !completedObjectives.includes(6)) {
          completeObjective(6);
        }
      }
    }
  };

  const goUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length > 0 ? '/' + parts.join('/') : '/');
  };

  return (
    <Window
      title="📁 File Manager"
      onClose={onClose}
      isActive={isActive}
      onFocus={onFocus}
      initialPosition={{ x: 280, y: 140 }}
      initialSize={{ width: 750, height: 520 }}
    >
      <div className="h-full flex flex-col">
        {/* Toolbar amélioré */}
        <div 
          className="h-14 flex items-center px-4 gap-3 border-b border-white/10"
          style={{
            background: 'linear-gradient(180deg, rgba(40,42,50,0.9) 0%, rgba(30,32,40,0.9) 100%)'
          }}
        >
          <button
            onClick={goUp}
            disabled={currentPath === '/'}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
          >
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={() => setCurrentPath('/')}
            className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          <div 
            className="flex-1 px-4 py-2 rounded-lg text-sm font-mono text-gray-300 flex items-center gap-2"
            style={{
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <span className="text-hacker-primary">{currentPath}</span>
          </div>
          
          <span className="text-xs text-gray-500 px-2">
            {files.length} élément{files.length > 1 ? 's' : ''}
          </span>
        </div>

        {/* File list avec animations */}
        <div 
          className="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          style={{
            background: 'linear-gradient(180deg, rgba(15,17,23,0.95) 0%, rgba(10,12,18,0.98) 100%)'
          }}
        >
          <div className="grid grid-cols-4 gap-4">
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => handleFileClick(file)}
                onDoubleClick={() => handleFileDoubleClick(file)}
                className={`p-4 rounded-xl hover:bg-white/5 transition-colors text-center group relative ${
                  selectedFile?.id === file.id 
                    ? 'bg-hacker-primary/10 border-hacker-primary/50' 
                    : 'border-transparent'
                } ${file.hidden ? 'opacity-60' : ''} border`}
              >
                <div className={`w-14 h-14 mx-auto mb-3 transition-transform group-hover:scale-110 ${
                  file.type === 'folder' 
                    ? 'text-blue-400' 
                    : file.encrypted 
                    ? 'text-red-400' 
                    : 'text-gray-400'
                }`}>
                  {file.type === 'folder' ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 8px rgba(59,130,246,0.4))' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                  ) : file.encrypted ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 8px rgba(239,68,68,0.4))' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )}
                </div>
                <div className="text-xs truncate text-gray-300 font-medium">{file.name}</div>
                {file.hidden && (
                  <div className="text-[10px] text-amber-400/80 mt-1 font-medium">Caché</div>
                )}
                {file.encrypted && (
                  <div className="text-[10px] text-red-400 mt-1 flex items-center justify-center gap-1">
                    <span>🔒</span> Chiffré
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {files.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <p className="text-sm">Dossier vide</p>
            </div>
          )}
        </div>

        {/* File viewer modal */}
        {viewingFile && (
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-8 z-50"
            onClick={() => setViewingFile(null)}
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full max-h-full overflow-auto rounded-xl bg-gray-900/98 border border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 ${viewingFile.encrypted ? 'text-red-400' : 'text-gray-400'}`}>
                    {viewingFile.encrypted ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="font-semibold text-white">{viewingFile.name}</h3>
                </div>
                <button
                  onClick={() => setViewingFile(null)}
                  className="w-7 h-7 flex items-center justify-center rounded bg-white/5 hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 font-mono text-sm whitespace-pre-wrap max-h-80 overflow-y-auto bg-black/30">
                {viewingFile.encrypted ? (
                  <div className="text-red-400">
                    <div className="flex items-center gap-2 mb-3 text-red-500 font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      [FICHIER CHIFFRÉ]
                    </div>
                    <div className="text-gray-500 mb-3 text-xs p-2 bg-red-500/10 rounded border border-red-500/20">
                      {viewingFile.content}
                    </div>
                    <div className="text-amber-400/80 text-xs">
                      💡 Utilisez <span className="text-blue-400 font-bold">decrypt {viewingFile.name}</span> dans le terminal.
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-300 leading-relaxed">
                    {viewingFile.content || 'Fichier vide'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Window>
  );
}
