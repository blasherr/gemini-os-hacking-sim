'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export default function PortForwardGame() {
  const [localPort, setLocalPort] = useState('');
  const [remotePort, setRemotePort] = useState('');
  const [remoteHost, setRemoteHost] = useState('');
  const [tunnelEstablished, setTunnelEstablished] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { completeObjective, currentObjective, addNotification } = useGameStore();

  const correctConfig = {
    localPort: '8080',
    remotePort: '80',
    host: '192.168.1.100'
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (localPort === correctConfig.localPort && 
        remotePort === correctConfig.remotePort && 
        remoteHost === correctConfig.host) {
      setTunnelEstablished(true);
      addNotification({
        type: 'success',
        title: 'Tunnel Established!',
        message: 'SSH port forwarding successful. Firewall bypassed!',
        duration: 5000
      });

      if (currentObjective?.id === 9) {
        setTimeout(() => completeObjective(9), 1000);
      }
    } else {
      addNotification({
        type: 'error',
        title: 'Connection Failed',
        message: 'Check your port forwarding configuration.',
        duration: 3000
      });
    }
    
    setIsConnecting(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-hacker-primary mb-2">SSH Port Forwarding</h2>
        <p className="text-sm text-macos-text-secondary">
          Create a tunnel to bypass the firewall on port 8080
        </p>
      </div>

      <div className="bg-terminal-bg p-4 rounded-xl font-mono text-sm">
        <div className="text-macos-yellow mb-2">Firewall Status:</div>
        <div className="text-macos-red">Port 8080 - FILTERED (Blocked by firewall)</div>
        <div className="text-macos-text-secondary mt-2 text-xs">
          Create an SSH tunnel to forward local port to remote port 80
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-2 text-macos-text-secondary">Local Port</label>
          <input
            type="text"
            value={localPort}
            onChange={(e) => setLocalPort(e.target.value)}
            className="w-full px-4 py-3 bg-macos-window border border-macos-text-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary text-macos-text font-mono"
            placeholder="e.g., 8080"
            disabled={tunnelEstablished}
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-macos-text-secondary">Remote Host</label>
          <input
            type="text"
            value={remoteHost}
            onChange={(e) => setRemoteHost(e.target.value)}
            className="w-full px-4 py-3 bg-macos-window border border-macos-text-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary text-macos-text font-mono"
            placeholder="e.g., 192.168.1.100"
            disabled={tunnelEstablished}
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-macos-text-secondary">Remote Port</label>
          <input
            type="text"
            value={remotePort}
            onChange={(e) => setRemotePort(e.target.value)}
            className="w-full px-4 py-3 bg-macos-window border border-macos-text-secondary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-hacker-primary text-macos-text font-mono"
            placeholder="e.g., 80"
            disabled={tunnelEstablished}
          />
        </div>
      </div>

      <div className="bg-terminal-bg p-3 rounded-xl font-mono text-xs text-macos-text-secondary">
        <span className="text-hacker-primary">$</span> ssh -L {localPort || '????'}:localhost:{remotePort || '????'} admin@{remoteHost || '?????????'}
      </div>

      <button
        onClick={handleConnect}
        disabled={isConnecting || tunnelEstablished || !localPort || !remotePort || !remoteHost}
        className="w-full py-3 bg-hacker-primary hover:bg-hacker-secondary text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isConnecting ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            Establishing Tunnel...
          </span>
        ) : tunnelEstablished ? (
          '✓ Tunnel Active'
        ) : (
          'Establish Tunnel'
        )}
      </button>

      {tunnelEstablished && (
        <div className="bg-hacker-primary/20 border border-hacker-primary rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">✓</div>
          <div className="font-bold text-hacker-primary">TUNNEL ESTABLISHED!</div>
          <div className="text-sm text-macos-text-secondary mt-2">
            Port {localPort} → {remoteHost}:{remotePort}
          </div>
          <div className="text-xs text-hacker-primary mt-2">
            Firewall successfully bypassed!
          </div>
        </div>
      )}

      <div className="bg-macos-window p-4 rounded-xl">
        <div className="text-xs text-macos-text-secondary space-y-2">
          <p>💡 <strong>Hint:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>The filtered port is 8080</li>
            <li>The target server is 192.168.1.100</li>
            <li>The web service runs on port 80</li>
            <li>Forward your local port to the remote web service</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
