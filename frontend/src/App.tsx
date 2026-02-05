import { useState, useEffect } from 'react'
import './App.css'
import SwipeCard from './components/SwipeCard'
import Team from './components/Team'

export interface Player {
  id: string;
  name: string;
  sport: string;
  team: string;
  position: string;
  imageUrl: string;
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
  }, []);

  const fetchPlayers = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://hot-fantasy-1.onrender.com/api/players'
        : '/api/players';
      const response = await fetch(apiUrl);
      const data = await response.json();
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
    const newTeam = direction === 'right' ? [...team, player] : team;
    
    // Update state
    setSwipeHistory(newHistory);
    if (direction === 'right') {
      setTeam(newTeam);
    }
    setCurrentIndex(newIndex);
    
    // Save to localStorage
    localStorage.setItem('currentIndex', newIndex.toString());
    localStorage.setItem('team', JSON.stringify(newTeam));
    localStorage.setItem('swipeHistory', JSON.stringify(newHistory));
    
    try {
      const apiUrl = import.meta.env.PROD 
        ? 'https://hot-fantasy-1.onrender.com/api/swipes'
        : '/api/swipes';
      await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default',
          playerId: player.id,
          direction
        })
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
    localStorage.setItem('swipeHistory', JSON.stringify(newHistory)
    // Remove from history
    setSwipeHistory(prev => prev.slice(0, -1));
    
    // Remove from team if it was a right swipe
    if (lastSwipe.direction === 'right') {
      setTeam(prev => prev.filter(p => p.id !== lastSwipe.player.id));
    }
    
    // Go back to previous index
    setCurrentIndex(lastSwipe.index);
  };

  const currentPlayer = players[currentIndex];

  if (showTeam) {
    return (
      <div className="app">
        <Team team={team} onBack={() => setShowTeam(false)} />
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>🔥 Hot Fantasy</h1>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(currentIndex / players.length) * 100}%` }}
          />
        </div>
        <p className="progress-text">
          {currentIndex < players.length ? `${currentIndex + 1} of ${players.length}` : 'Complete!'}
        </p>
      </header>

      <div className="swipe-container">
        {showHint && currentIndex === 0 && (
          <div className="swipe-hint">
            <div className="hint-arrow hint-left">←</div>
            <div className="hint-text">Swipe to choose</div>
            <div className="hint-arrow hint-right">→</div>
          </div>
        )}
        
        {currentPlayer ? (
          <SwipeCard 
            player={currentPlayer} 
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="no-more-cards">
            <div className="empty-icon">✨</div>
            <h2>All done!</h2>
            <p>You've reviewed all {players.length} players</p>
            <button className="btn-primary" onClick={() => setShowTeam(true)}>
              View Your Team ({team.length} players)
            </button>
            <button className="btn-primary" onClick={handleReset} style={{ marginTop: '1rem', background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)' }}>
              Start Over
            </button>
          </div>
        )}
      </div>

      <div className="bottom-nav">
        <button 
          className="nav-btn"
          onClick={handleUndo}
          disabled={swipeHistory.length === 0}
        >
          <span className="nav-icon">↶</span>
          <span className="nav-label">Undo</span>
        </button>
        <button 
          className="nav-btn"
          onClick={() => setShowTeam(true)}
        >
          <span className="nav-icon">👥</span>
          <span className="nav-label">Team ({team.length})</span>
        </button>
      </div>
    </div>
  )
}

export default App
