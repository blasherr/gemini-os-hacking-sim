'use client';

import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { UserSession, SessionType } from '@/types';
import { useGameStore } from '@/store/gameStore';
import { useRouter } from 'next/navigation';
import { PSYCHO_GAMES, GAME_CATEGORIES } from '@/data/psychoGames';

export default function OwnerPanel() {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [bulkCreateCount, setBulkCreateCount] = useState(1);
  const [bulkCreatePrefix, setBulkCreatePrefix] = useState('Agent');
  const [sessionType, setSessionType] = useState<SessionType>('scenario');
  const [isCreating, setIsCreating] = useState(false);
  const [filterType, setFilterType] = useState<'all' | SessionType>('all');
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const { createUserSession, createMultipleSessions } = useGameStore();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isOwnerStored = localStorage.getItem('isOwner') === 'true';
      console.log('🔐 Owner check:', { isOwnerStored });
      if (!isOwnerStored) {
        console.log('❌ Not owner, redirecting...');
        router.push('/');
        return;
      }
    }

    console.log('👂 Setting up Firebase listener for sessions...');
    const q = query(collection(db, 'sessions'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const sessionsData: UserSession[] = [];
      snapshot.forEach((docSnap) => {
        sessionsData.push({ ...docSnap.data() as UserSession, userId: docSnap.id });
      });
      console.log(`📊 Received ${sessionsData.length} sessions from Firebase`);
      setSessions(sessionsData.sort((a, b) => b.lastActivity - a.lastActivity));
    });

    return () => {
      console.log('🔌 Unsubscribing from Firebase listener');
      unsubscribe();
    };
  }, [router]);

  const filteredSessions = sessions.filter(s => {
    if (filterType === 'all') return true;
    return s.sessionType === filterType;
  });

  const scenarioCount = sessions.filter(s => s.sessionType === 'scenario' || !s.sessionType).length;
  const psychotestCount = sessions.filter(s => s.sessionType === 'psychotest').length;

  const handleCreateSession = async () => {
    if (!newUsername.trim()) return;
    
    const username = newUsername.trim();
    setIsCreating(true);
    
    try {
      const userId = await createUserSession(username, sessionType);
      if (userId) {
        console.log(`✅ Session ${sessionType} créée: ${username} (${userId})`);
        setNewUsername('');
        setShowCreateModal(false);
      } else {
        alert('❌ Erreur lors de la création');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert(`⚠️ Erreur création ${username}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBulkCreate = async () => {
    if (bulkCreateCount < 1 || bulkCreateCount > 50) {
      alert('Nombre invalide (1-50)');
      return;
    }

    const usernames = [];
    for (let i = 1; i <= bulkCreateCount; i++) {
      usernames.push(`${bulkCreatePrefix}_${String(i).padStart(2, '0')}`);
    }

    setIsCreating(true);
    
    try {
      const createdIds = await createMultipleSessions(usernames, sessionType);
      if (createdIds.length > 0) {
        console.log(`✅ ${createdIds.length} sessions ${sessionType} créées`);
        setBulkCreateCount(1);
        setShowCreateModal(false);
      } else {
        alert('❌ Aucune session créée');
      }
    } catch (error) {
      console.error('Error bulk creating:', error);
      alert(`⚠️ Erreur création masse`);
    } finally {
      setIsCreating(false);
    }
  };

  const sendNotification = async (userId: string) => {
    if (!notificationMessage.trim()) return;

    try {
      await updateDoc(doc(db, 'sessions', userId), {
        ownerNotification: {
          message: notificationMessage,
          timestamp: Date.now()
        }
      });

      alert('✅ Notification envoyée!');
      setNotificationMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const skipObjective = async (userId: string, currentObjective: number) => {
    try {
      const session = sessions.find(s => s.userId === userId);
      if (!session) return;

      const nextObjective = currentObjective + 1;
      await updateDoc(doc(db, 'sessions', userId), {
        currentObjective: nextObjective,
        completedObjectives: [...session.completedObjectives, currentObjective]
      });

      alert(`✅ Objectif ${currentObjective} passé pour ${session.username}`);
    } catch (error) {
      console.error('Error skipping objective:', error);
    }
  };

  const skipPsychoGame = async (userId: string, gameId: string) => {
    try {
      const session = sessions.find(s => s.userId === userId);
      if (!session || !session.psychoResults) return;

      const updatedScores = {
        ...session.psychoResults.scores,
        [gameId]: { score: 100, maxScore: 100, percentage: 100, skipped: true }
      };

      const completedGames = Object.keys(updatedScores).filter(id => updatedScores[id].percentage > 0).length;
      const isCompleted = completedGames >= 11;

      await updateDoc(doc(db, 'sessions', userId), {
        'psychoResults.scores': updatedScores,
        'psychoResults.completedGames': completedGames,
        'psychoResults.totalGames': 11,
        isCompleted
      });

      alert(`✅ Jeu passé pour ${session.username}`);
    } catch (error) {
      console.error('Error skipping game:', error);
    }
  };

  const resetSession = async (userId: string) => {
    const session = sessions.find(s => s.userId === userId);
    if (!confirm(`Réinitialiser complètement la session de "${session?.username}"?\n\n⚠️ Toute la progression sera perdue!`)) return;

    try {
      const { resetSession: resetSessionStore } = useGameStore.getState();
      await resetSessionStore(userId);
      alert('✅ Session réinitialisée!');
    } catch (error) {
      console.error('Error resetting session:', error);
      alert('❌ Erreur lors de la réinitialisation');
    }
  };

  const deleteSession = async (userId: string) => {
    const session = sessions.find(s => s.userId === userId);
    if (!confirm(`Supprimer définitivement la session de "${session?.username}"?\n\nCette action est irréversible!`)) return;

    try {
      await deleteDoc(doc(db, 'sessions', userId));
      console.log(`🗑️ Session ${userId} supprimée de Firebase`);
      alert('✅ Session supprimée avec succès!');
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR');
  };

  const getTimeSince = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getPsychoProgress = (session: UserSession) => {
    if (!session.psychoResults) return { completed: 0, total: 11, percentage: 0 };
    const completed = session.psychoResults.completedGames || 0;
    return { completed, total: 11, percentage: Math.round((completed / 11) * 100) };
  };

  const renderScenarioCard = (session: UserSession) => (
    <>
      {/* Stats Scénario */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-hacker-primary/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Objectif</p>
          <p className="text-2xl font-bold text-hacker-primary">{session.currentObjective}/20</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-3">
          <p className="text-xs text-gray-400">Complétés</p>
          <p className="text-2xl font-bold text-purple-400">{session.completedObjectives.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progression</span>
          <span>{Math.round((session.completedObjectives.length / 20) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-hacker-primary to-purple-500 transition-all duration-500"
            style={{ width: `${(session.completedObjectives.length / 20) * 100}%` }}
          />
        </div>
      </div>

      {/* Actions Scénario */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button
          onClick={() => skipObjective(session.userId!, session.currentObjective)}
          className="px-3 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg hover:bg-yellow-500/30 transition-colors text-xs text-yellow-400"
        >
          Skip Obj.
        </button>
        <button
          onClick={() => resetSession(session.userId!)}
          className="px-3 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors text-xs text-blue-400"
        >
          Reset
        </button>
        <button
          onClick={() => deleteSession(session.userId!)}
          className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-xs text-red-400"
        >
          Suppr.
        </button>
      </div>
    </>
  );

  const renderPsychotestCard = (session: UserSession) => {
    const progress = getPsychoProgress(session);
    const isExpanded = expandedSession === session.userId;

    return (
      <>
        {/* Stats Psychotest */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-cyan-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400">Jeux terminés</p>
            <p className="text-2xl font-bold text-cyan-400">{progress.completed}/11</p>
          </div>
          <div className="bg-pink-500/10 rounded-lg p-3">
            <p className="text-xs text-gray-400">Score moyen</p>
            <p className="text-2xl font-bold text-pink-400">
              {session.psychoResults?.averageScore?.toFixed(0) || 0}%
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progression</span>
            <span>{progress.percentage}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>

        {/* Toggle détails */}
        <button
          onClick={() => setExpandedSession(isExpanded ? null : session.userId!)}
          className="w-full py-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center justify-center gap-2"
        >
          {isExpanded ? '▲ Masquer détails' : '▼ Voir détails des jeux'}
        </button>

        {/* Détails des jeux */}
        {isExpanded && session.psychoResults && (
          <div className="mt-4 space-y-2">
            {GAME_CATEGORIES.map(category => (
              <div key={category.id} className="bg-black/30 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-2 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.name}
                </p>
                <div className="space-y-1">
                  {PSYCHO_GAMES.filter(g => g.category === category.id).map(game => {
                    const score = session.psychoResults?.scores?.[game.id];
                    const isDone = score && score.percentage > 0;
                    const wasSkipped = score?.skipped;

                    return (
                      <div key={game.id} className="flex items-center justify-between text-xs">
                        <span className={isDone ? 'text-green-400' : 'text-gray-500'}>
                          {isDone ? '✓' : '○'} {game.name}
                        </span>
                        <div className="flex items-center gap-2">
                          {isDone ? (
                            <span className={wasSkipped ? 'text-yellow-400' : 'text-cyan-400'}>
                              {wasSkipped ? 'Passé' : `${score.percentage}%`}
                            </span>
                          ) : (
                            <button
                              onClick={() => skipPsychoGame(session.userId!, game.id)}
                              className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded hover:bg-yellow-500/30 transition-colors"
                            >
                              Skip
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Psychotest */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={() => resetSession(session.userId!)}
            className="px-3 py-2 bg-blue-500/20 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors text-xs text-blue-400"
          >
            Reset
          </button>
          <button
            onClick={() => deleteSession(session.userId!)}
            className="px-3 py-2 bg-red-500/20 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-xs text-red-400"
          >
            Supprimer
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="h-screen overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-hacker-primary via-purple-400 to-hacker-secondary bg-clip-text text-transparent">
              GEMINI ADMIN PANEL
            </h1>
            <p className="text-gray-400 mt-2">Gestion des sessions utilisateurs</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-hacker-primary to-hacker-secondary text-black font-bold rounded-lg hover:scale-105 transition-transform shadow-lg shadow-hacker-primary/50"
            >
              + Créer Session
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('isOwner');
                router.push('/');
              }}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Stats et Filtres */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterType === 'all'
                  ? 'bg-white/20 text-white border border-white/50'
                  : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-gray-500'
              }`}
            >
              Tous ({sessions.length})
            </button>
            <button
              onClick={() => setFilterType('scenario')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filterType === 'scenario'
                  ? 'bg-hacker-primary/20 text-hacker-primary border border-hacker-primary/50'
                  : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-hacker-primary/50'
              }`}
            >
              🎮 Scénario ({scenarioCount})
            </button>
            <button
              onClick={() => setFilterType('psychotest')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                filterType === 'psychotest'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-black/30 text-gray-400 border border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              🧠 Psychotest ({psychotestCount})
            </button>
          </div>
        </div>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions.map((session) => {
          const isScenario = session.sessionType === 'scenario' || !session.sessionType;
          const isPsychotest = session.sessionType === 'psychotest';

          return (
            <div
              key={session.userId}
              className={`backdrop-blur-xl bg-black/40 border rounded-2xl p-6 transition-all ${
                isPsychotest
                  ? 'border-cyan-500/30 hover:border-cyan-500/60'
                  : 'border-hacker-primary/30 hover:border-hacker-primary/60'
              }`}
            >
              {/* User Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white">{session.username}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      isPsychotest
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'bg-hacker-primary/20 text-hacker-primary'
                    }`}>
                      {isPsychotest ? '🧠 Psycho' : '🎮 Scénario'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-mono mt-1">{session.userId?.substring(0, 20)}...</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  Date.now() - session.lastActivity < 30000 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                }`} />
              </div>

              {/* Contenu selon le type */}
              {isScenario && renderScenarioCard(session)}
              {isPsychotest && renderPsychotestCard(session)}

              {/* Notification */}
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Envoyer un message..."
                    value={selectedUser === session.userId ? notificationMessage : ''}
                    onChange={(e) => {
                      setSelectedUser(session.userId!);
                      setNotificationMessage(e.target.value);
                    }}
                    className="flex-1 px-3 py-2 bg-black/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-hacker-primary"
                  />
                  <button
                    onClick={() => sendNotification(session.userId!)}
                    className="px-4 py-2 bg-hacker-primary/20 border border-hacker-primary/50 rounded-lg hover:bg-hacker-primary/30 transition-colors text-sm text-hacker-primary"
                  >
                    📤
                  </button>
                </div>
              </div>

              {/* Time Info */}
              <div className="mt-3 text-xs text-gray-500 flex justify-between">
                <span>Démarré: {formatTime(session.startedAt)}</span>
                <span>Actif il y a {getTimeSince(session.lastActivity)}</span>
              </div>

              {session.isCompleted && (
                <div className={`mt-3 p-2 rounded-lg text-center text-xs ${
                  isPsychotest
                    ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                    : 'bg-green-500/20 border border-green-500/50 text-green-400'
                }`}>
                  ✓ {isPsychotest ? 'Test terminé' : 'Mission complétée'}
                  {session.successCode && (
                    <span className="ml-2 font-mono bg-black/30 px-2 py-0.5 rounded">
                      {session.successCode}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredSessions.length === 0 && (
          <div className="col-span-full text-center py-20">
            <p className="text-gray-400 text-lg">
              {filterType === 'all' ? 'Aucune session active' : `Aucune session ${filterType}`}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-hacker-primary to-hacker-secondary text-black font-bold rounded-lg hover:scale-105 transition-transform"
            >
              Créer une session
            </button>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="backdrop-blur-xl bg-black/60 border border-hacker-primary/50 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Créer des sessions</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewUsername('');
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Type de session */}
            <div className="mb-6">
              <label className="block text-sm text-gray-400 mb-3">Type de session</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setSessionType('scenario')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    sessionType === 'scenario'
                      ? 'border-hacker-primary bg-hacker-primary/10'
                      : 'border-gray-700 bg-black/30 hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🎮</div>
                  <h3 className={`font-bold ${sessionType === 'scenario' ? 'text-hacker-primary' : 'text-white'}`}>
                    Scénario
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Simulation de hacking avec objectifs et mini-jeux intégrés
                  </p>
                </button>
                <button
                  onClick={() => setSessionType('psychotest')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    sessionType === 'psychotest'
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 bg-black/30 hover:border-gray-600'
                  }`}
                >
                  <div className="text-3xl mb-2">🧠</div>
                  <h3 className={`font-bold ${sessionType === 'psychotest' ? 'text-cyan-400' : 'text-white'}`}>
                    Test Psychotechnique
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    11 jeux cognitifs: mémoire, logique, attention, rapidité, spatial
                  </p>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Single Session */}
              <div className={`p-6 rounded-xl border ${
                sessionType === 'psychotest'
                  ? 'bg-cyan-500/5 border-cyan-500/30'
                  : 'bg-hacker-primary/5 border-hacker-primary/30'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  sessionType === 'psychotest' ? 'text-cyan-400' : 'text-hacker-primary'
                }`}>
                  Session unique
                </h3>
                <p className="text-xs text-gray-400 mb-3">Le code d&apos;agent créé sera utilisé pour la connexion</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Code d'agent (ex: Agent007)..."
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className={`flex-1 px-4 py-3 bg-black/50 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      sessionType === 'psychotest'
                        ? 'border-cyan-500/30 focus:ring-cyan-500'
                        : 'border-hacker-primary/30 focus:ring-hacker-primary'
                    }`}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
                  />
                  <button
                    onClick={handleCreateSession}
                    disabled={isCreating || !newUsername.trim()}
                    className={`px-6 py-3 font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed ${
                      sessionType === 'psychotest'
                        ? 'bg-gradient-to-r from-cyan-500 to-pink-500 text-white'
                        : 'bg-gradient-to-r from-hacker-primary to-hacker-secondary text-black'
                    }`}
                  >
                    {isCreating ? 'Création...' : 'Créer'}
                  </button>
                </div>
              </div>

              {/* Bulk Create */}
              <div className="p-6 bg-purple-500/5 border border-purple-500/30 rounded-xl">
                <h3 className="text-lg font-semibold text-purple-400 mb-4">Création en masse</h3>
                <p className="text-xs text-gray-400 mb-3">Les codes d&apos;agent seront générés automatiquement</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Préfixe du code</label>
                      <input
                        type="text"
                        placeholder="Agent"
                        value={bulkCreatePrefix}
                        onChange={(e) => setBulkCreatePrefix(e.target.value)}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Nombre (1-50)</label>
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={bulkCreateCount}
                        onChange={(e) => setBulkCreateCount(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div className="p-3 bg-black/30 rounded-lg">
                    <p className="text-xs text-gray-400">Aperçu:</p>
                    <p className="text-sm text-white font-mono mt-1">
                      {bulkCreatePrefix}_01, {bulkCreatePrefix}_02, {bulkCreatePrefix}_03...
                    </p>
                    <p className={`text-xs mt-1 ${
                      sessionType === 'psychotest' ? 'text-cyan-400' : 'text-hacker-primary'
                    }`}>
                      Type: {sessionType === 'psychotest' ? '🧠 Test Psychotechnique' : '🎮 Scénario'}
                    </p>
                  </div>
                  <button
                    onClick={handleBulkCreate}
                    disabled={isCreating}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Création en cours...' : `Créer ${bulkCreateCount} sessions`}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
