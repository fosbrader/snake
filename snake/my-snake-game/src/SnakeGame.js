import React, { useState, useEffect } from 'react';

export default function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 300, y: 300 }]);
  const [food, setFood] = useState({ x: 400, y: 400 });
  const [direction, setDirection] = useState({ dx: 5, dy: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(30);
  const [foodSize, setFoodSize] = useState(20);
  const [enemySnake, setEnemySnake] = useState([]);
  const [boardSize, setBoardSize] = useState(600);
  const [touchStart, setTouchStart] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [snake, direction, isPlaying, gameOver, speed]);

  useEffect(() => {
    if (score >= 10) setFoodSize(15);
    if (score >= 15) setSpeed(20);
    if (score >= 20) setFoodSize(10);
    if (score >= 25) setSpeed(15);
    if (score >= 30 && enemySnake.length === 0) {
      setEnemySnake([{ x: 100, y: 100, dx: 5, dy: 0 }]);
    }
  }, [score]);

  // Update board size based on screen width
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobileDevice = width <= 768;
      setIsMobile(isMobileDevice);
      
      if (isMobileDevice) {
        // For mobile, make the board 90% of the smaller screen dimension
        const size = Math.min(width * 0.9, height * 0.5);
        setBoardSize(Math.floor(size));
      } else {
        setBoardSize(600); // Default size for desktop
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const startGame = () => {
    setSnake([{ x: boardSize / 2, y: boardSize / 2 }]);
    setFood({ x: Math.random() * (boardSize - 40) + 20, y: Math.random() * (boardSize - 40) + 20 });
    setDirection({ dx: 5, dy: 0 });
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setSpeed(30);
    setFoodSize(20);
    setEnemySnake([]);
  };

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.dx, y: newSnake[0].y + direction.dy };

    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    newSnake.unshift(head);
    if (Math.hypot(head.x - food.x, head.y - food.y) < foodSize) {
      setFood({ x: Math.random() * (boardSize - 40) + 20, y: Math.random() * (boardSize - 40) + 20 });
      setScore(score + 1);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const handleKeyDown = (e) => {
    // Prevent default scrolling behavior for arrow keys
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
    
    switch (e.key) {
      case 'ArrowUp': if (direction.dy === 0) setDirection({ dx: 0, dy: -5 }); break;
      case 'ArrowDown': if (direction.dy === 0) setDirection({ dx: 0, dy: 5 }); break;
      case 'ArrowLeft': if (direction.dx === 0) setDirection({ dx: -5, dy: 0 }); break;
      case 'ArrowRight': if (direction.dx === 0) setDirection({ dx: 5, dy: 0 }); break;
      default: break;
    }
  };

  // Handle touch events for swipe
  const handleTouchStart = (e) => {
    // Only prevent default if we're touching the game board
    if (e.target.tagName.toLowerCase() === 'svg') {
      e.preventDefault();
    }
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    // Only prevent default if we're touching the game board
    if (e.target.tagName.toLowerCase() === 'svg') {
      e.preventDefault();
    }
    if (!touchStart) return;

    const xDiff = touchStart.x - e.touches[0].clientX;
    const yDiff = touchStart.y - e.touches[0].clientY;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      // Horizontal swipe
      if (xDiff > 10 && direction.dx === 0) { // Left swipe
        setDirection({ dx: -5, dy: 0 });
      } else if (xDiff < -10 && direction.dx === 0) { // Right swipe
        setDirection({ dx: 5, dy: 0 });
      }
    } else {
      // Vertical swipe
      if (yDiff > 10 && direction.dy === 0) { // Up swipe
        setDirection({ dx: 0, dy: -5 });
      } else if (yDiff < -10 && direction.dy === 0) { // Down swipe
        setDirection({ dx: 0, dy: 5 });
      }
    }
  };

  const handleTouchEnd = (e) => {
    // Only prevent default if we're touching the game board
    if (e.target.tagName.toLowerCase() === 'svg') {
      e.preventDefault();
    }
    setTouchStart(null);
  };

  const handleMobileButton = (dir) => {
    switch (dir) {
      case 'up': if (direction.dy === 0) setDirection({ dx: 0, dy: -5 }); break;
      case 'down': if (direction.dy === 0) setDirection({ dx: 0, dy: 5 }); break;
      case 'left': if (direction.dx === 0) setDirection({ dx: -5, dy: 0 }); break;
      case 'right': if (direction.dx === 0) setDirection({ dx: 5, dy: 0 }); break;
      default: break;
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-between min-h-screen bg-black text-green-500 font-mono p-4 arcade-bg" 
      tabIndex="0" 
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
    >
      <div className="flex flex-col items-center w-full">
        <h1 className="text-2xl md:text-4xl font-bold text-green-500 mb-4 relative z-10">{isMobile ? "Snake!" : "Play Snake!"}</h1>
        
        {isMobile ? (
          // Mobile Layout
          <div className="flex flex-col items-center w-full relative z-10">
            <p className="text-2xl font-bold mb-2">Score: {score}</p>
            <div className="relative bg-gray-900 border-4 border-green-500 rounded-lg mb-4 game-board-glow" style={{ width: boardSize, height: boardSize }}>
              <svg width={boardSize} height={boardSize}>
                <circle cx={food.x * (boardSize/600)} cy={food.y * (boardSize/600)} r={foodSize * (boardSize/600)} fill="red" />
                {snake.map((segment, index) => (
                  <circle 
                    key={index} 
                    cx={segment.x * (boardSize/600)} 
                    cy={segment.y * (boardSize/600)} 
                    r={10 * (boardSize/600)} 
                    fill="lime" 
                  />
                ))}
                {enemySnake.map((segment, index) => (
                  <circle 
                    key={index} 
                    cx={segment.x * (boardSize/600)} 
                    cy={segment.y * (boardSize/600)} 
                    r={10 * (boardSize/600)} 
                    fill="purple" 
                  />
                ))}
              </svg>
            </div>
            
            <div className="flex flex-col items-center">
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-500 text-black rounded-lg shadow-md mb-4 text-lg"
              >
                {isPlaying ? 'Restart' : 'Start Game'}
              </button>
              
              <div className="grid grid-cols-3 gap-3 w-48 mb-4">
                <div></div>
                <button className="bg-green-500 text-black p-4 rounded-lg text-2xl" onClick={() => handleMobileButton('up')}>↑</button>
                <div></div>
                <button className="bg-green-500 text-black p-4 rounded-lg text-2xl" onClick={() => handleMobileButton('left')}>←</button>
                <div></div>
                <button className="bg-green-500 text-black p-4 rounded-lg text-2xl" onClick={() => handleMobileButton('right')}>→</button>
                <div></div>
                <button className="bg-green-500 text-black p-4 rounded-lg text-2xl" onClick={() => handleMobileButton('down')}>↓</button>
                <div></div>
              </div>
            </div>
          </div>
        ) : (
          // Desktop Layout
          <div className="flex items-center justify-center gap-8 relative z-10">
            <div className="flex flex-col">
              <p className="text-3xl font-bold mb-4">Score: {score}</p>
              <p className="text-lg mb-4">Upcoming Challenges:</p>
              <ul className="text-lg mb-4">
                <li>10: Food shrinks</li>
                <li>15: Speed increases</li>
                <li>20: Food shrinks again</li>
                <li>25: Speed increases</li>
                <li>30: Enemy snake appears</li>
              </ul>
              {gameOver && <p className="text-red-500 font-bold mb-4">Game Over!</p>}
              <button
                onClick={startGame}
                className="px-4 py-2 bg-green-500 text-black rounded-lg shadow-md"
              >
                {isPlaying ? 'Restart' : 'Start Game'}
              </button>
            </div>
            <div className="relative bg-gray-900 border-4 border-green-500 rounded-lg game-board-glow" style={{ width: boardSize, height: boardSize }}>
              <svg width={boardSize} height={boardSize}>
                <circle cx={food.x} cy={food.y} r={foodSize} fill="red" />
                {snake.map((segment, index) => (
                  <circle key={index} cx={segment.x} cy={segment.y} r="10" fill="lime" />
                ))}
                {enemySnake.map((segment, index) => (
                  <circle key={index} cx={segment.x} cy={segment.y} r="10" fill="purple" />
                ))}
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center flex items-center justify-center gap-3">
        <a 
          href="https://github.com/fosbrader/snake" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-500 hover:text-green-400 transition-colors duration-200"
          aria-label="GitHub Repository"
        >
          <svg 
            viewBox="0 0 24 24" 
            width="24" 
            height="24" 
            fill="currentColor" 
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
        </a>
        <div className="h-6 w-px bg-green-500"></div>
        <span className="text-green-500">v1.0.0</span>
      </div>
    </div>
  );
}
