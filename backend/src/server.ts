import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Types
export interface Player {
  id: string;
  name: string;
  sport: string;
  team: string;
  position: string;
  club: string;
  imageUrl: string;
  hasRealPhoto: boolean;
  stats: {
    points?: number;
    goals?: number;
    assists?: number;
    [key: string]: number | undefined;
  };
}

export interface SwipeData {
  playerId: string;
  direction: 'left' | 'right';
}

// Load complete Six Nations 2026 squads from generated data (237 players)
const playersData = JSON.parse(
  readFileSync(join(__dirname, 'players-data.json'), 'utf-8')
);

// Transform player data into the expected format
const players: Player[] = playersData.map((player: any, index: number) => ({
  id: (index + 1).toString(),
  name: player.name,
  sport: 'Rugby',
  team: player.team,
  position: player.position,
  club: player.club,
  imageUrl: player.image,
  hasRealPhoto: player.hasRealPhoto,
  stats: {}
}));

const userSwipes: Map<string, SwipeData[]> = new Map();

// Routes
app.get('/api/players', (req, res) => {
  const sport = req.query.sport as string;
  const filteredPlayers = sport 
    ? players.filter(p => p.sport.toLowerCase() === sport.toLowerCase())
    : players;
  res.json(filteredPlayers);
});

app.get('/api/players/:id', (req, res) => {
  const player = players.find(p => p.id === req.params.id);
  if (!player) {
    return res.status(404).json({ error: 'Player not found' });
  }
  res.json(player);
});

app.post('/api/swipes', (req, res) => {
  const { userId = 'default', playerId, direction } = req.body;
  
  if (!playerId || !direction) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const swipes = userSwipes.get(userId) || [];
  swipes.push({ playerId, direction });
  userSwipes.set(userId, swipes);

  res.json({ success: true, swipe: { playerId, direction } });
});

app.get('/api/swipes/:userId', (req, res) => {
  const swipes = userSwipes.get(req.params.userId) || [];
  res.json(swipes);
});

app.get('/api/team/:userId', (req, res) => {
  const swipes = userSwipes.get(req.params.userId) || [];
  const likedPlayerIds = swipes
    .filter(s => s.direction === 'right')
    .map(s => s.playerId);
  
  const team = players.filter(p => likedPlayerIds.includes(p.id));
  res.json(team);
});

app.listen(PORT, () => {
  console.log(`🔥 Hot Fantasy API running on http://localhost:${PORT}`);
});
