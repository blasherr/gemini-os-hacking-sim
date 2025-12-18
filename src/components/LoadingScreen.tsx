'use client';

export default function LoadingScreen() {
  return (
    <div className="h-screen w-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-hacker-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-hacker-primary font-mono text-xl">Initialisation du système...</p>
      </div>
    </div>
  );
}
