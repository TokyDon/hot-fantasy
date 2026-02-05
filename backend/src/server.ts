import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

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
  imageUrl: string;
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

// In-memory storage - Six Nations Rugby Players with high-res images
const players: Player[] = [
  {
    id: '1',
    name: 'Antoine Dupont',
    sport: 'Rugby',
    team: 'France',
    position: 'Scrum-half',
    imageUrl: 'https://i.pravatar.cc/800?img=12',
    stats: { points: 145, tries: 18, assists: 24 }
  },
  {
    id: '2',
    name: 'Maro Itoje',
    sport: 'Rugby',
    team: 'England',
    position: 'Lock',
    imageUrl: 'https://i.pravatar.cc/800?img=13',
    stats: { points: 35, tackles: 156, lineouts: 89 }
  },
  {
    id: '3',
    name: 'Tadhg Furlong',
    sport: 'Rugby',
    team: 'Ireland',
    position: 'Prop',
    imageUrl: 'https://i.pravatar.cc/800?img=14',
    stats: { points: 25, tackles: 98, carries: 67 }
  },
  {
    id: '4',
    name: 'Finn Russell',
    sport: 'Rugby',
    team: 'Scotland',
    position: 'Fly-half',
    imageUrl: 'https://i.pravatar.cc/800?img=15',
    stats: { points: 187, assists: 32, conversions: 45 }
  },
  {
    id: '5',
    name: 'Dan Biggar',
    sport: 'Rugby',
    team: 'Wales',
    position: 'Fly-half',
    imageUrl: 'https://i.pravatar.cc/800?img=33',
    stats: { points: 198, penalties: 56, conversions: 48 }
  },
  {
    id: '6',
    name: 'Gael Fickou',
    sport: 'Rugby',
    team: 'France',
    position: 'Centre',
    imageUrl: 'https://i.pravatar.cc/800?img=52',
    stats: { points: 95, tries: 19, tackles: 112 }
  },
  {
    id: '7',
    name: 'Owen Farrell',
    sport: 'Rugby',
    team: 'England',
    position: 'Fly-half',
    imageUrl: 'https://i.pravatar.cc/800?img=53',
    stats: { points: 235, penalties: 78, conversions: 67 }
  },
  {
    id: '8',
    name: 'Johnny Sexton',
    sport: 'Rugby',
    team: 'Ireland',
    position: 'Fly-half',
    imageUrl: 'https://i.pravatar.cc/800?img=59',
    stats: { points: 312, penalties: 89, conversions: 98 }
  },
  {
    id: '9',
    name: 'Stuart Hogg',
    sport: 'Rugby',
    team: 'Scotland',
    position: 'Fullback',
    imageUrl: 'https://i.pravatar.cc/800?img=60',
    stats: { points: 165, tries: 33, metres: 2450 }
  },
  {
    id: '10',
    name: 'Josh Adams',
    sport: 'Rugby',
    team: 'Wales',
    position: 'Wing',
    imageUrl: 'https://i.pravatar.cc/800?img=11',
    stats: { points: 120, tries: 24, metres: 1876 }
  },
  {
    id: '11',
    name: 'Gregory Alldritt',
    sport: 'Rugby',
    team: 'France',
    position: 'Number 8',
    imageUrl: 'https://i.pravatar.cc/800?img=17',
    stats: { points: 45, carries: 178, tackles: 134 }
  },
  {
    id: '12',
    name: 'Marcus Smith',
    sport: 'Rugby',
    team: 'England',
    position: 'Fly-half',
    imageUrl: 'https://i.pravatar.cc/800?img=31',
    stats: { points: 124, assists: 18, conversions: 34 }
  },
  {
    id: '13',
    name: 'Bundee Aki',
    sport: 'Rugby',
    team: 'Ireland',
    position: 'Centre',
    imageUrl: 'https://i.pravatar.cc/800?img=56',
    stats: { points: 65, tries: 13, tackles: 145 }
  },
  {
    id: '14',
    name: 'Duhan van der Merwe',
    sport: 'Rugby',
    team: 'Scotland',
    position: 'Wing',
    imageUrl: 'https://i.pravatar.cc/800?img=57',
    stats: { points: 110, tries: 22, metres: 1965 }
  },
  {
    id: '15',
    name: 'Louis Rees-Zammit',
    sport: 'Rugby',
    team: 'Wales',
    position: 'Wing',
    imageUrl: 'https://i.pravatar.cc/800?img=58',
    stats: { points: 85, tries: 17, metres: 1543 }
  },
  {
    id: '16',
    name: 'Romain Ntamack',
    sport: 'Rugby',
    team: 'France',
    position: 'Fly-half',
    imageUrl: 'https://i.pravatar.cc/800?img=68',
    stats: { points: 156, assists: 21, conversions: 42 }
  },
  {
    id: '17',
    name: 'Jamie George',
    sport: 'Rugby',
    team: 'England',
    position: 'Hooker',
    imageUrl: 'https://i.pravatar.cc/800?img=69',
    stats: { points: 30, lineouts: 95, tackles: 167 }
  },
  {
    id: '18',
    name: 'Caelan Doris',
    sport: 'Rugby',
    team: 'Ireland',
    position: 'Number 8',
    imageUrl: 'https://i.pravatar.cc/800?img=51',
    stats: { points: 55, carries: 156, tackles: 123 }
  },
  {
    id: '19',
    name: 'Hamish Watson',
    sport: 'Rugby',
    team: 'Scotland',
    position: 'Flanker',
    imageUrl: 'https://i.pravatar.cc/800?img=32',
    stats: { points: 35, tackles: 189, turnovers: 34 }
  },
  {
    id: '20',
    name: 'Taulupe Faletau',
    sport: 'Rugby',
    team: 'Wales',
    position: 'Number 8',
    imageUrl: 'https://i.pravatar.cc/800?img=54',
    stats: { points: 65, carries: 198, tackles: 145 }
  },
  {
    id: '21',
    name: 'Damian Penaud',
    sport: 'Rugby',
    team: 'France',
    position: 'Wing',
    imageUrl: 'https://i.pravatar.cc/800?img=66',
    stats: { points: 130, tries: 26, metres: 2103 }
  },
  {
    id: '22',
    name: 'Cameron Woki',
    sport: 'Rugby',
    team: 'France',
    position: 'Flanker',
    imageUrl: 'https://i.pravatar.cc/800?img=67',
    stats: { points: 40, tackles: 142, turnovers: 28 }
  },
  {
    id: '23',
    name: 'Tom Curry',
    sport: 'Rugby',
    team: 'England',
    position: 'Flanker',
    imageUrl: 'https://i.pravatar.cc/800?img=16',
    stats: { points: 45, tackles: 198, turnovers: 41 }
  },
  {
    id: '24',
    name: 'James Lowe',
    sport: 'Rugby',
    team: 'Ireland',
    position: 'Wing',
    imageUrl: 'https://i.pravatar.cc/800?img=18',
    stats: { points: 95, tries: 19, metres: 1654 }
  },
  {
    id: '25',
    name: 'Darcy Graham',
    sport: 'Rugby',
    team: 'Scotland',
    position: 'Wing',
    imageUrl: 'https://i.pravatar.cc/800?img=19',
    stats: { points: 105, tries: 21, metres: 1432 }
  },
  {
    id: '26',
    name: 'George North',
    sport: 'Rugby',
    team: 'Wales',
    position: 'Centre',
    imageUrl: 'https://i.pravatar.cc/800?img=70',
    stats: { points: 215, tries: 43, metres: 3421 }
  },
  {
    id: '27',
    name: 'Julien Marchand',
    sport: 'Rugby',
    team: 'France',
    position: 'Hooker',
    imageUrl: 'https://i.pravatar.cc/800?img=61',
    stats: { points: 35, lineouts: 87, tries: 7 }
  },
  {
    id: '28',
    name: 'Ellis Genge',
    sport: 'Rugby',
    team: 'England',
    position: 'Prop',
    imageUrl: 'https://i.pravatar.cc/800?img=62',
    stats: { points: 20, carries: 134, tackles: 76 }
  },
  {
    id: '29',
    name: 'Andrew Porter',
    sport: 'Rugby',
    team: 'Ireland',
    position: 'Prop',
    imageUrl: 'https://i.pravatar.cc/800?img=63',
    stats: { points: 25, carries: 98, tackles: 89 }
  },
  {
    id: '30',
    name: 'Zander Fagerson',
    sport: 'Rugby',
    team: 'Scotland',
    position: 'Prop',
    imageUrl: 'https://i.pravatar.cc/800?img=64',
    stats: { points: 15, carries: 76, tackles: 65 }
  }
];

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
