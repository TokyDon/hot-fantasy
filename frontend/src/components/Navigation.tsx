import { useState } from 'react';
import * as XLSX from 'xlsx';
import './Navigation.css';

interface Player {
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

interface NavigationProps {
  onReset: () => void;
  teamCount: number;
  team: Player[];
}

export default function Navigation({ onReset, teamCount, team }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your entire Hot Squad? This cannot be undone.')) {
      onReset();
      setMenuOpen(false);
    }
  };

  const handleExportTeam = () => {
    if (team.length === 0) {
      alert('Your team is empty. Add some players first!');
      return;
    }

    // Prepare data for Excel
    const exportData = team.map(player => ({
      Name: player.name,
      Country: player.team,
      Position: player.position
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hot Squad');

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `Hot_Fantasy_Team_${date}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);
    
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="top-nav">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🔥</span>
            <span className="logo-text">Hot Fantasy</span>
          </div>
          <button 
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <>
          <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
          <div className="menu-panel">
            <div className="menu-header">
              <h2>Menu</h2>
              <button 
                className="menu-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="menu-content">
              <div className="menu-stats">
                <div className="stat-item">
                  <span className="stat-icon">❤️</span>
                  <div>
                    <div className="stat-value">{teamCount}</div>
                    <div className="stat-label">Players in Squad</div>
                  </div>
                </div>
              </div>
              <div className="menu-actions">
                <button className="menu-action-button export" onClick={handleExportTeam}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export Team
                </button>
                <button className="menu-action-button reset" onClick={handleReset}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="1 4 1 10 7 10"></polyline>
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                  </svg>
                  Reset Team
                </button>
              </div>
              <div className="menu-footer">
                <p>Hot Fantasy v1.0</p>
                <p>Build your dream team based on attractiveness</p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
