'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function PortScanGame() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [targetIp, setTargetIp] = useState('192.168.1.100');
  const { addNotification } = useGameStore();

  const ports = [
    { port: 21, service: 'FTP', status: 'closed', vulnerability: null },
    { port: 22, service: 'SSH', status: 'open', vulnerability: 'Weak password' },
    { port: 80, service: 'HTTP', status: 'open', vulnerability: null },
    { port: 443, service: 'HTTPS', status: 'open', vulnerability: null },
    { port: 3306, service: 'MySQL', status: 'open', vulnerability: 'Default credentials' },
    { port: 8080, service: 'HTTP-Proxy', status: 'filtered', vulnerability: 'Firewall bypass possible' },
  ];

  const startScan = async () => {
    setScanning(true);
    setResults([]);

    for (let i = 0; i < ports.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setResults(prev => [...prev, ports[i]]);
    }

    setScanning(false);
    addNotification({
      type: 'success',
      title: 'Scan Complete',
      message: `Found ${ports.filter(p => p.status === 'open').length} open ports`,
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-hacker-primary mb-2">Port Scanner</h2>
        <p className="text-sm text-macos-text-secondary">
          Advanced network reconnaissance tool
        </p>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={targetIp}
          onChange={(e) => setTargetIp(e.target.value)}
          className="flex-1 px-4 py-2 bg-macos-window border border-macos-text-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary text-macos-text font-mono"
          placeholder="Target IP..."
        />
        <button
          onClick={startScan}
          disabled={scanning}
          className="px-6 py-2 bg-hacker-primary hover:bg-hacker-secondary text-black font-semibold rounded-xl transition-all disabled:opacity-50"
        >
          {scanning ? 'Scanning...' : 'Scan'}
        </button>
      </div>

      {scanning && (
        <div className="flex items-center gap-3 text-hacker-primary">
          <div className="w-4 h-4 border-2 border-hacker-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="font-mono text-sm">Scanning ports on {targetIp}...</span>
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-terminal-bg p-4 rounded-xl">
          <div className="text-hacker-primary font-mono text-xs mb-3">
            Nmap scan report for {targetIp}
          </div>
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  result.status === 'open' 
                    ? 'bg-hacker-primary/10 border border-hacker-primary/30' 
                    : result.status === 'filtered'
                    ? 'bg-macos-yellow/10 border border-macos-yellow/30'
                    : 'bg-macos-window'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className={`font-mono font-bold ${
                      result.status === 'open' ? 'text-hacker-primary' :
                      result.status === 'filtered' ? 'text-macos-yellow' :
                      'text-macos-text-secondary'
                    }`}>
                      {result.port}/tcp
                    </span>
                    <span className="text-sm text-macos-text">{result.service}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    result.status === 'open' ? 'bg-hacker-primary/20 text-hacker-primary' :
                    result.status === 'filtered' ? 'bg-macos-yellow/20 text-macos-yellow' :
                    'bg-macos-window text-macos-text-secondary'
                  }`}>
                    {result.status.toUpperCase()}
                  </span>
                </div>
                {result.vulnerability && (
                  <div className="text-xs text-macos-red flex items-center gap-2 mt-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>⚠ {result.vulnerability}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-macos-text-secondary/20">
            <div className="text-xs text-macos-text-secondary">
              <div className="flex justify-between">
                <span>Open ports:</span>
                <span className="text-hacker-primary font-bold">
                  {results.filter(r => r.status === 'open').length}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Vulnerabilities found:</span>
                <span className="text-macos-red font-bold">
                  {results.filter(r => r.vulnerability).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-macos-window p-4 rounded-xl">
        <div className="text-xs text-macos-text-secondary space-y-2">
          <p className="font-semibold">Common Ports:</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>21 - FTP</div>
            <div>22 - SSH</div>
            <div>80 - HTTP</div>
            <div>443 - HTTPS</div>
            <div>3306 - MySQL</div>
            <div>8080 - HTTP-Proxy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
