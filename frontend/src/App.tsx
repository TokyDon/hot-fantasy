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
      const response = await fetch('/api/players');
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right') => {
    const player = players[currentIndex];
    
    // Hide hint after first swipe
    if (showHint) setShowHint(false);
    
    try {
      await fetch('/api/swipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'default',
          playerId: player.id,
          direction
        })
      });

      // Add to swipe history
      setSwipeHistory(prev => [...prev, { player, direction, index: currentIndex }]);

      if (direction === 'right') {
        setTeam(prev => [...prev, player]);
      }

      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error recording swipe:', error);
    }
  };

  const handleUndo = () => {
    if (swipeHistory.length === 0) return;
    
    const lastSwipe = swipeHistory[swipeHistory.length - 1];
    
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
