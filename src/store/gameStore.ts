import { create } from 'zustand';
import { UserSession, Notification, Objective, SessionType, PsychoTestResults } from '@/types';
import { GAME_OBJECTIVES, generateSuccessCode } from '@/data/objectives';
import { generatePsychoSuccessCode } from '@/data/psychoGames';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, getDocs, where, writeBatch, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface GameStore {
  // User session
  session: UserSession | null;
  isOwner: boolean;
  
  // Game state
  currentObjective: Objective | null;
  completedObjectives: number[];
  notifications: Notification[];
  terminalOutput: string[];
  currentDirectory: string;
  
  // UI state
  isLoading: boolean;
  showNotification: boolean;
  activeWindow: string | null;
  
  // Actions
  initializeSession: (username: string) => Promise<void>;
  loadSession: (userId: string) => Promise<void>;
  setOwnerMode: (username: string, password: string) => boolean;
  createUserSession: (username: string, sessionType?: SessionType) => Promise<string | null>;
  completeObjective: (objectiveId: number) => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  removeNotification: (id: string) => void;
  addTerminalOutput: (output: string) => void;
  clearTerminal: () => void;
  setCurrentDirectory: (dir: string) => void;
  setActiveWindow: (window: string | null) => void;
  createMultipleSessions: (usernames: string[], sessionType?: SessionType) => Promise<string[]>;
  resetSession: (userId: string) => Promise<void>;
  deleteSession: (userId: string) => Promise<void>;
  updateProgress: (key: string, value: any) => Promise<void>;
  // Nouvelles actions pour tests psychotechniques
  completePsychoGame: (gameId: string, score: number) => Promise<void>;
  updatePsychoResults: (results: Partial<PsychoTestResults>) => Promise<void>;
  // Déconnexion
  logout: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  session: null,
  isOwner: false,
  currentObjective: null,
  completedObjectives: [],
  notifications: [],
  terminalOutput: [],
  currentDirectory: '~',
  isLoading: false,
  showNotification: false,
  activeWindow: null,

  initializeSession: async (username: string) => {
    set({ isLoading: true });
    console.log('🔍 initializeSession called for:', username);
    
    // ⚡ Retry logic: Tente 3x avec délai (pour sessions fraîchement créées)
    let attempts = 0;
    const maxAttempts = 3;
    const retryDelay = 800; // 800ms entre chaque tentative
    
    while (attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Attempt ${attempts}/${maxAttempts} to find session...`);
      
      try {
        const sessionsRef = collection(db, 'sessions');
        const q = query(sessionsRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);
        
        console.log(`📊 Query result: ${querySnapshot.size} document(s) found`);
        
        if (querySnapshot.empty) {
          if (attempts < maxAttempts) {
            console.log(`⏳ Session not found, waiting ${retryDelay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          }
          // Après 3 tentatives, session n'existe vraiment pas
          console.error('❌ Session not found after all retries');
          set({ isLoading: false });
          throw new Error('SESSION_NOT_FOUND');
        }

        // Session trouvée! Charger immédiatement
        const docSnapshot = querySnapshot.docs[0];
        const sessionData = docSnapshot.data() as UserSession;
        const userId = docSnapshot.id;
        const session: UserSession = { ...sessionData, userId };
        
        console.log('📦 Session found in Firebase:', { userId, username: session.username, objective: session.currentObjective });
        
        // Save userId to localStorage for auto-reconnect
        if (typeof window !== 'undefined') {
          localStorage.setItem('os_hack_userId', userId);
        }

        const currentObj = GAME_OBJECTIVES.find(
          obj => obj.id === session.currentObjective
        );
        
        // ⚡ Set session IMMÉDIATEMENT (UI réactive)
        set({
          session: session,
          currentObjective: currentObj || GAME_OBJECTIVES[0],
          completedObjectives: session.completedObjectives,
          isLoading: false
        });
        
        console.log('✅ Store updated with session, isLoading=false');

        // Update last activity en arrière-plan (non-bloquant)
        updateDoc(doc(db, 'sessions', userId), {
          lastActivity: Date.now()
        }).catch(err => console.warn('Failed to update lastActivity:', err));

        // Notification en arrière-plan
        setTimeout(() => {
          get().addNotification({
            type: 'info',
            title: 'Session restaurée',
            message: `Bon retour ${username}! Reprise de votre mission...`,
            duration: 5000
          });
        }, 100);
        
        return; // Succès, sortir de la boucle
      } catch (error) {
        console.error(`❌ Error on attempt ${attempts}:`, error);
        if (attempts >= maxAttempts) {
          console.error('💥 All retries exhausted');
          set({ isLoading: false });
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }
  },

  loadSession: async (userId: string) => {
    set({ isLoading: true });
    try {
      const sessionDoc = await getDoc(doc(db, 'sessions', userId));
      
      if (sessionDoc.exists()) {
        const sessionData = sessionDoc.data() as UserSession;
        
        // Update last activity
        await updateDoc(doc(db, 'sessions', userId), {
          lastActivity: Date.now()
        });

        const currentObj = GAME_OBJECTIVES.find(
          obj => obj.id === sessionData.currentObjective
        );

        set({
          session: sessionData,
          currentObjective: currentObj || null,
          completedObjectives: sessionData.completedObjectives,
          isLoading: false
        });

        get().addNotification({
          type: 'info',
          title: 'Session restaurée',
          message: 'Reprise de votre progression...',
          duration: 3000
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading session:', error);
      set({ isLoading: false });
    }
  },

  setOwnerMode: (username: string, password: string) => {
    const correctUsername = process.env.NEXT_PUBLIC_OWNER_USERNAME || 'Blasher';
    const correctPassword = process.env.NEXT_PUBLIC_OWNER_PASSWORD || '123456';
    if (username === correctUsername && password === correctPassword) {
      set({ isOwner: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('isOwner', 'true');
      }
      return true;
    }
    return false;
  },

  createUserSession: async (username: string, sessionType: SessionType = 'scenario') => {
    try {
      console.log('💾 Creating session for:', username, 'type:', sessionType);
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const baseSession = {
        userId,
        username,
        sessionType,
        startedAt: Date.now(),
        lastActivity: Date.now(),
        isCompleted: false,
        progress: {}
      };

      const newSession: UserSession = sessionType === 'scenario' 
        ? {
            ...baseSession,
            currentObjective: 1,
            completedObjectives: [],
          }
        : {
            ...baseSession,
            currentObjective: 0,
            completedObjectives: [],
            psychoResults: {
              completedGames: 0,
              totalGames: 11,
              scores: {},
              totalScore: 0,
              averageScore: 0
            }
          };

      console.log('📝 Session data:', newSession);
      
      // ⚡ Écriture Firebase - ATTENDRE la confirmation
      await setDoc(doc(db, 'sessions', userId), {
        ...newSession,
        createdAt: serverTimestamp()
      });

      console.log('✅ Session created in Firebase:', userId);
      return userId;
    } catch (error: any) {
      console.error('❌ Error creating user session:', error);
      console.error('❌ Error code:', error?.code);
      console.error('❌ Error message:', error?.message);
      // Afficher l'erreur détaillée dans une alerte pour debug
      if (typeof window !== 'undefined') {
        console.error('🔥 Firebase Error Details:', JSON.stringify({
          code: error?.code,
          message: error?.message,
          name: error?.name
        }, null, 2));
      }
      return null;
    }
  },

  createMultipleSessions: async (usernames: string[], sessionType: SessionType = 'scenario') => {
    try {
      console.log('💾 Creating bulk sessions:', usernames, 'type:', sessionType);
      const createdIds: string[] = [];
      
      // Create batch writes (max 500 per batch)
      let batch = writeBatch(db);
      let batchCount = 0;
      
      for (const username of usernames) {
        const userId = `user_${Date.now()}_${batchCount}_${Math.random().toString(36).substr(2, 9)}`;
        
        const baseSession = {
          userId,
          username,
          sessionType,
          startedAt: Date.now(),
          lastActivity: Date.now(),
          isCompleted: false,
          progress: {}
        };

        const newSession: UserSession = sessionType === 'scenario'
          ? {
              ...baseSession,
              currentObjective: 1,
              completedObjectives: [],
            }
          : {
              ...baseSession,
              currentObjective: 0,
              completedObjectives: [],
              psychoResults: {
                completedGames: 0,
                totalGames: 11,
                scores: {},
                totalScore: 0,
                averageScore: 0
              }
            };

        console.log(`📝 Adding to batch: ${username} → ${userId}`);

        batch.set(doc(db, 'sessions', userId), {
          ...newSession,
          createdAt: serverTimestamp()
        });
        
        createdIds.push(userId);
        batchCount++;

        // Commit batch if we reach 500 (Firestore limit)
        if (batchCount >= 500) {
          console.log('🚀 Committing batch (500 operations)...');
          await batch.commit();
          console.log('✅ Batch committed');
          batch = writeBatch(db); // Create new batch
          batchCount = 0;
        }
      }

      // Commit remaining
      if (batchCount > 0) {
        console.log(`🚀 Committing final batch (${batchCount} operations)...`);
        await batch.commit();
        console.log('✅ All sessions created in Firebase!');
      }

      return createdIds;
    } catch (error) {
      console.error('Error creating multiple sessions:', error);
      return [];
    }
  },

  completeObjective: async (objectiveId: number) => {
    const { session, completedObjectives } = get();
    if (!session) return;

    const newCompleted = [...completedObjectives, objectiveId];
    const currentObj = GAME_OBJECTIVES.find(obj => obj.id === objectiveId);
    const nextObjId = currentObj?.nextObjective;
    const nextObj = nextObjId ? GAME_OBJECTIVES.find(obj => obj.id === nextObjId) : null;

    let isCompleted = false;
    let successCode = session.successCode;

    // Si c'est le dernier objectif
    if (!nextObjId) {
      isCompleted = true;
      successCode = generateSuccessCode(session.userId);
    }

    try {
      // Update Firebase
      await updateDoc(doc(db, 'sessions', session.userId), {
        completedObjectives: newCompleted,
        currentObjective: nextObjId || objectiveId,
        lastActivity: Date.now(),
        isCompleted,
        successCode: successCode || null
      });

      set({
        completedObjectives: newCompleted,
        currentObjective: nextObj || null,
        session: {
          ...session,
          completedObjectives: newCompleted,
          currentObjective: nextObjId || objectiveId,
          isCompleted,
          successCode
        }
      });

      get().addNotification({
        type: 'success',
        title: '✓ Objectif complété!',
        message: currentObj?.title || 'Objectif terminé',
        duration: 5000
      });

      if (isCompleted && successCode) {
        setTimeout(() => {
          get().addNotification({
            type: 'success',
            title: '🎉 MISSION ACCOMPLIE!',
            message: `Code de réussite: ${successCode}`,
            duration: 0 // Ne disparaît pas automatiquement
          });
        }, 1000);
      }
    } catch (error) {
      console.error('Error completing objective:', error);
    }
  },

  addNotification: (notification) => {
    const id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotif: Notification = {
      ...notification,
      id,
      timestamp: Date.now()
    };

    set(state => ({
      notifications: [...state.notifications, newNotif],
      showNotification: true
    }));

    // Auto-remove après duration si spécifié
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        get().removeNotification(id);
      }, notification.duration);
    }
  },

  removeNotification: (id) => {
    set(state => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },

  addTerminalOutput: (output) => {
    set(state => ({
      terminalOutput: [...state.terminalOutput, output]
    }));
  },

  clearTerminal: () => {
    set({ terminalOutput: [] });
  },

  setCurrentDirectory: (dir) => {
    set({ currentDirectory: dir });
  },

  setActiveWindow: (window) => {
    set({ activeWindow: window });
  },

  resetSession: async (userId: string) => {
    try {
      // COMPLETE RESET: Reset to initial state
      await updateDoc(doc(db, 'sessions', userId), {
        currentObjective: 1,
        completedObjectives: [],
        isCompleted: false,
        successCode: null,
        progress: {},
        lastActivity: Date.now(),
        startedAt: Date.now() // Reset start time too
      });

      console.log(`Session ${userId} completely reset`);
    } catch (error) {
      console.error('Error resetting session:', error);
      throw error;
    }
  },

  deleteSession: async (userId: string) => {
    try {
      // PERMANENT DELETE: Remove session from Firebase
      await deleteDoc(doc(db, 'sessions', userId));
      console.log(`Session ${userId} permanently deleted`);
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  },

  updateProgress: async (key: string, value: any) => {
    const { session } = get();
    if (!session) return;

    const newProgress = { ...session.progress, [key]: value };

    try {
      await updateDoc(doc(db, 'sessions', session.userId), {
        progress: newProgress,
        lastActivity: Date.now()
      });

      set({
        session: {
          ...session,
          progress: newProgress
        }
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  },

  // === FONCTIONS POUR TESTS PSYCHOTECHNIQUES ===
  
  completePsychoGame: async (gameId: string, score: number) => {
    const { session, addNotification } = get();
    if (!session || session.sessionType !== 'psychotest') return;

    const currentResults = session.psychoResults || {
      completedGames: 0,
      totalGames: 11,
      scores: {},
      totalScore: 0,
      averageScore: 0
    };

    // Créer le nouveau score pour ce jeu
    const gameScore = {
      score,
      maxScore: 100,
      percentage: score,
      completedAt: Date.now()
    };

    // Mettre à jour les scores
    const newScores = { ...currentResults.scores, [gameId]: gameScore };
    const completedGames = Object.keys(newScores).length;
    
    // Calculer le score moyen
    const scoresArray = Object.values(newScores);
    const averageScore = Math.round(scoresArray.reduce((a, b) => a + b.percentage, 0) / scoresArray.length);

    const newResults: PsychoTestResults = {
      ...currentResults,
      completedGames,
      totalGames: 11,
      scores: newScores,
      totalScore: scoresArray.reduce((a, b) => a + b.score, 0),
      averageScore
    };

    // Vérifier si tous les jeux sont complétés (11 jeux)
    const isCompleted = completedGames >= 11;
    const successCode = isCompleted ? generatePsychoSuccessCode() : undefined;

    try {
      await updateDoc(doc(db, 'sessions', session.userId), {
        psychoResults: newResults,
        isCompleted,
        successCode: successCode || null,
        lastActivity: Date.now()
      });

      set({
        session: {
          ...session,
          psychoResults: newResults,
          isCompleted,
          successCode
        }
      });

      addNotification({
        type: 'success',
        title: '🎮 Jeu terminé!',
        message: `Score: ${score}/100`,
        duration: 3000
      });

      if (isCompleted) {
        addNotification({
          type: 'success',
          title: '🏆 Tests terminés!',
          message: `Votre code: ${successCode}`,
          duration: 10000
        });
      }
    } catch (error) {
      console.error('Error completing psycho game:', error);
    }
  },

  updatePsychoResults: async (results: Partial<PsychoTestResults>) => {
    const { session } = get();
    if (!session || session.sessionType !== 'psychotest') return;

    const currentResults = session.psychoResults || {
      completedGames: 0,
      totalGames: 11,
      scores: {},
      totalScore: 0,
      averageScore: 0
    };

    const newResults = { ...currentResults, ...results };

    try {
      await updateDoc(doc(db, 'sessions', session.userId), {
        psychoResults: newResults,
        lastActivity: Date.now()
      });

      set({
        session: {
          ...session,
          psychoResults: newResults
        }
      });
    } catch (error) {
      console.error('Error updating psycho results:', error);
    }
  },

  logout: () => {
    // Clear localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('os_hack_userId');
      sessionStorage.removeItem('lastBootTime');
    }
    
    // Reset store state
    set({
      session: null,
      isOwner: false,
      currentObjective: null,
      completedObjectives: [],
      notifications: [],
      terminalOutput: [],
      currentDirectory: '~',
      isLoading: false,
      showNotification: false,
      activeWindow: null
    });
    
    console.log('🚪 User logged out successfully');
  }
}));
