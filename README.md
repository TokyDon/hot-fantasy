# Hot Fantasy 🔥

A fantasy sports team builder that works like Tinder! Swipe through sports players based on their attractiveness to build your dream team.

## Features

- 🔥 Tinder-style swipe interface
- 👥 Build your fantasy team by swiping right on hot players
- 📊 View player stats and information
- 🏉 Support for multiple sports (Rugby, Football, etc.)
- 💾 Track your swipes and team selections

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Styling**: CSS with gradient backgrounds
- **Animations**: react-spring for smooth swipe gestures

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

### Running the Application

Start both frontend and backend servers:
```bash
npm run dev
```

Or run them separately:

**Backend** (runs on http://localhost:5000):
```bash
npm run server
```

**Frontend** (runs on http://localhost:3000):
```bash
npm run client
```

## Project Structure

```
hot-fantasy/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── SwipeCard.tsx
│   │   │   └── Team.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
├── backend/               # Express backend
│   ├── src/
│   │   └── server.ts     # API server
│   └── package.json
└── package.json          # Root package.json
```

## API Endpoints

- `GET /api/players` - Get all players (optional ?sport= filter)
- `GET /api/players/:id` - Get specific player
- `POST /api/swipes` - Record a swipe (left/right)
- `GET /api/swipes/:userId` - Get user's swipe history
- `GET /api/team/:userId` - Get user's team (right-swiped players)

## How to Use

1. View player cards with photos and stats
2. Swipe right (🔥 Hot!) on players you find attractive
3. Swipe left (👎 Pass) on players you want to skip
4. Click "My Team" to see your selected players
5. Build the hottest fantasy team!

## Future Enhancements

- [ ] MongoDB integration for persistent storage
- [ ] User authentication
- [ ] Real player photos and stats from APIs
- [ ] Multiple sports leagues support
- [ ] Team performance predictions based on selections
- [ ] Social features (share your team)
- [ ] Match predictions based on "hotness" ratings

## License

MIT
