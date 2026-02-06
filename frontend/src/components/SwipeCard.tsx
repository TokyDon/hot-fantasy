import { useSpring, animated } from 'react-spring';
import { useState, useRef } from 'react';
import { Player } from '../App';
import './SwipeCard.css';

interface SwipeCardProps {
  player: Player;
  onSwipe: (direction: 'left' | 'right') => void;
}

export default function SwipeCard({ player, onSwipe }: SwipeCardProps) {
  const [{ x, rotate }, api] = useSpring(() => ({
    x: 0,
    rotate: 0,
  }));

  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startX.current;
    api.start({
      x: deltaX,
      rotate: deltaX / 10,
      immediate: true,
    });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const currentX = x.get();
    const threshold = 150;

    if (Math.abs(currentX) > threshold) {
      // Swipe detected
      const dir = currentX > 0 ? 'right' : 'left';
      api.start({
        x: dir === 'right' ? 1000 : -1000,
        rotate: dir === 'right' ? 45 : -45,
        config: { duration: 300 }
      });
      setTimeout(() => {
        api.set({ x: 0, rotate: 0 });
        onSwipe(dir);
      }, 300);
    } else {
      // Return to center
      api.start({
        x: 0,
        rotate: 0,
        config: { tension: 300, friction: 30 }
      });
    }
  };

  return (
    <animated.div
      className="swipe-card"
      style={{ x, rotate }}
      onMouseDown={(e) => {
        e.preventDefault();
        handleStart(e.clientX);
      }}
      onMouseMove={(e) => {
        if (isDragging) {
          e.preventDefault();
          handleMove(e.clientX);
        }
      }}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => {
        handleStart(e.touches[0].clientX);
      }}
      onTouchMove={(e) => {
        handleMove(e.touches[0].clientX);
      }}
      onTouchEnd={handleEnd}
    >
      <div className="card-image" style={player.hasRealPhoto ? { backgroundImage: `url(${player.imageUrl})` } : { backgroundColor: '#2a2a2a' }}>
        {!player.hasRealPhoto && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            fontSize: '1.2rem',
            color: '#666',
            fontWeight: '500'
          }}>
            No image available
          </div>
        )}
        <div className="card-overlay">
          <div className="card-content">
            <h2>{player.name}</h2>
            <p className="team">{player.team}</p>
            <p className="position">{player.position}</p>
          </div>
        </div>
      </div>
      
      <animated.div
        className="swipe-indicator swipe-left"
        style={{
          opacity: x.to((x) => (x < 0 ? Math.min(Math.abs(x) / 100, 1) : 0))
        }}
      >
        PASS
      </animated.div>
      
      <animated.div
        className="swipe-indicator swipe-right"
        style={{
          opacity: x.to((x) => (x > 0 ? Math.min(x / 100, 1) : 0))
        }}
      >
        HOT!
      </animated.div>
    </animated.div>
  );
}
