import { Player } from '../App';
import './Team.css';

interface TeamProps {
  team: Player[];
  onBack: () => void;
}

export default function Team({ team, onBack }: TeamProps) {
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
                style={{ backgroundImage: `url(${player.imageUrl})` }}
              >
                <div className="team-badge">❤️</div>
              </div>
              <div className="team-card-info">
                <h3>{player.name}</h3>
                <div className="team-meta">
                  <span className="team-flag">{player.team}</span>
                  <span className="team-position">{player.position}</span>
                </div>
                <div className="player-stats-compact">
                  {Object.entries(player.stats).slice(0, 3).map(([key, value]) => (
                    <div key={key} className="stat-compact">
                      <span className="stat-compact-value">{value}</span>
                      <span className="stat-compact-label">{key}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
