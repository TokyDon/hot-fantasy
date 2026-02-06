import { Player } from '../App';
import './Team.css';

interface TeamProps {
  team: Player[];
  onBack: () => void;
  onRemovePlayer: (playerId: string) => void;
}

export default function Team({ team, onBack, onRemovePlayer }: TeamProps) {
  return (
    <div className="team-view">
      <header className="team-header">
        <button className="btn-back" onClick={onBack}>
          <span className="back-icon">←</span>
        </button>
        <div className="team-header-content">
          <h1>🔥 Your Hot Squad</h1>
          <p className="team-count">{team.length} player{team.length !== 1 ? 's' : ''} selected</p>
        </div>
        <div className="spacer"></div>
      </header>

      {team.length === 0 ? (
        <div className="empty-team">
          <div className="empty-icon">💔</div>
          <h2>No players yet!</h2>
          <p>Go back and swipe right on players you find attractive to build your dream team</p>
          <button className="btn-primary" onClick={onBack}>
            Start Swiping
          </button>
        </div>
      ) : (
        <div className="team-grid">
          {team.map((player) => (
            <div key={player.id} className="team-card">
              <div 
                className="team-card-image" 
                style={player.hasRealPhoto ? { backgroundImage: `url(${player.imageUrl})` } : { backgroundColor: '#2a2a2a' }}
              >
                {!player.hasRealPhoto && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    fontSize: '0.9rem',
                    color: '#666',
                    fontWeight: '500'
                  }}>
                    No image available
                  </div>
                )}
                <button 
                  className="team-badge"
                  onClick={() => onRemovePlayer(player.id)}
                  title="Remove from team"
                >
                  ❤️
                </button>
              </div>
              <div className="team-card-info">
                <h3>{player.name}</h3>
                <div className="team-meta">
                  <span className="team-flag">{player.team}</span>
                  <span className="team-position">{player.position}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
