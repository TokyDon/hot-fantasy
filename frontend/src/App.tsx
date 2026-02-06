import { useState, useEffect } from 'react'
import './App.css'
import SwipeCard from './components/SwipeCard'
import Team from './components/Team'
import Navigation from './components/Navigation'

export interface Player {
  id: string;
  name: string;
  sport: string;
  team: string;
  position: string;
  imageUrl: string;
  hasRealPhoto: boolean;
  stats: {
    points?: number;
    goals?: number;
    assists?: number;
    [key: string]: number | undefined;
  };
}

interface SwipeHistory {
  player: Player;
  direction: 'left' | 'right';
  index: number;
}

function App() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTeam, setShowTeam] = useState(false);
  const [team, setTeam] = useState<Player[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistory[]>([]);
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    fetchPlayers();
    
    // Fix iOS viewport height issue
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
    
    return () => {
      window.removeEventListener('resize', setViewportHeight);
      window.removeEventListener('orientationchange', setViewportHeight);
    };
  }, []);

  const fetchPlayers = async () => {
    try {
      const apiUrl = 'https://hot-fantasy-1.onrender.com/api/players';
      console.log('Fetching from:', apiUrl);
      const response = await fetch(apiUrl);
      const data = await response.json();
      console.log('Received players:', data.length);
      setPlayers(data);
      
      // Load saved progress from localStorage
      const savedIndex = localStorage.getItem('currentIndex');
      const savedTeam = localStorage.getItem('team');
      const savedHistory = localStorage.getItem('swipeHistory');
      
      if (savedIndex) setCurrentIndex(parseInt(savedIndex));
      if (savedTeam) setTeam(JSON.parse(savedTeam));
      if (savedHistory) setSwipeHistory(JSON.parse(savedHistory));
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const player = players[currentIndex];
    
    // Hide hint after first swipe
    if (showHint) setShowHint(false);
    
    const newIndex = currentIndex + 1;
    const newHistory = [...swipeHistory, { player, direction, index: currentIndex }];
    
    // Prevent duplicate players in team
    const isAlreadyInTeam = team.some(p => p.id === player.id);
    const newTeam = direction === 'right' && !isAlreadyInTeam 
      ? [...team, player] 
      : team;
    
    // Update state
    setSwipeHistory(newHistory);
    if (direction === 'right' && !isAlreadyInTeam) {
      setTeam(newTeam);
    }
    setCurrentIndex(newIndex);
    
    // Save to localStorage
    localStorage.setItem('currentIndex', newIndex.toString());
    localStorage.setItem('team', JSON.stringify(newTeam));
    localStorage.setItem('swipeHistory', JSON.stringify(newHistory));
    
    try {
      const apiUrl = 'https://hot-fantasy-1.onrender.com/api/swipes';
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default',
          playerId: player.id,
          direction
        })
      });
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    
    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    const newHistory = swipeHistory.slice(0, -1);
    const newTeam = lastSwipe.direction === 'right' 
      ? team.filter(p => p.id !== lastSwipe.player.id)
      : team;
    
    // Update state
    setSwipeHistory(newHistory);
    if (lastSwipe.direction === 'right') {
      setTeam(newTeam);
    }
    setCurrentIndex(lastSwipe.index);
    
    // Save to localStorage
    localStorage.setItem('currentIndex', lastSwipe.index.toString());
    localStorage.setItem('team', JSON.stringify(newTeam));
    localStorage.setItem('swipeHistory', JSON.stringify(newHistory));
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setTeam([]);
    setSwipeHistory([]);
    setShowHint(true);
    localStorage.removeItem('currentIndex');
    localStorage.removeItem('team');
    localStorage.removeItem('swipeHistory');
  };

  const handleRemoveFromTeam = (playerId: string) => {
    const newTeam = team.filter(p => p.id !== playerId);
    setTeam(newTeam);
    localStorage.setItem('team', JSON.stringify(newTeam));
    
    // Remove player from swipe history so they can be swiped again
    const removedSwipe = swipeHistory.find(swipe => swipe.player.id === playerId);
    const newHistory = swipeHistory.filter(swipe => swipe.player.id !== playerId);
    setSwipeHistory(newHistory);
    localStorage.setItem('swipeHistory', JSON.stringify(newHistory));
    
    // If the removed player was swiped before the current index,
    // move current index back by 1 so they appear in the deck again
    if (removedSwipe && removedSwipe.index < currentIndex) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      localStorage.setItem('currentIndex', newIndex.toString());
    }
  };

  const currentPlayer = players[currentIndex];

  if (showTeam) {
    return (
      <div className="app">
        <Navigation onReset={handleReset} teamCount={team.length} team={team} />
        <Team 
          team={team} 
          onBack={() => setShowTeam(false)}
          onRemovePlayer={handleRemoveFromTeam}
        />
        <div className="bottom-nav">
          <button 
            className={`nav-btn ${!showTeam ? 'active' : ''}`}
            onClick={() => setShowTeam(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="nav-label">Swipe</span>
          </button>
          <button 
            className={`nav-btn ${showTeam ? 'active' : ''}`}
            onClick={() => setShowTeam(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="nav-label">Hot Squad</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Navigation onReset={handleReset} teamCount={team.length} team={team} />
      
      <div className="main-content">
        <div className="swipe-container">
          {showHint && currentIndex === 0 && (
            <div className="swipe-hint">
              <div className="hint-arrow hint-left">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </div>
              <div className="hint-text">Swipe to choose</div>
              <div className="hint-arrow hint-right">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          )}
          
          {currentPlayer ? (
            <>
              <div className="card-header">
                <div className="card-counter">
                  {currentIndex < players.length ? `${currentIndex + 1} of ${players.length}` : 'Complete!'}
                </div>
                {swipeHistory.length > 0 && (
                  <button 
                    className="header-undo-btn"
                    onClick={handleUndo}
                    title="Undo last swipe"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                    </svg>
                    Undo
                  </button>
                )}
              </div>
              <div className="card-wrapper">
                <SwipeCard 
                  player={currentPlayer} 
                  onSwipe={handleSwipe}
                />
              </div>
            </>
          ) : (
            <div className="no-more-cards">
              <div className="complete-icon">✨</div>
              <h2>All Done!</h2>
              <p>You've reviewed all {players.length} players</p>
              <button className="btn-primary" onClick={() => setShowTeam(true)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                View Your Squad ({team.length})
              </button>
            </div>
          )}
        </div>

        <div className="bottom-nav">
          <button 
            className={`nav-btn ${!showTeam ? 'active' : ''}`}
            onClick={() => setShowTeam(false)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span className="nav-label">Swipe</span>
          </button>
          <button 
            className={`nav-btn ${showTeam ? 'active' : ''}`}
            onClick={() => setShowTeam(true)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span className="nav-label">Hot Squad</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
