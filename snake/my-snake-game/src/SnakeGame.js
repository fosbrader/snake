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
  const boardSize = 600;

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
    switch (e.key) {
      case 'ArrowUp': if (direction.dy === 0) setDirection({ dx: 0, dy: -5 }); break;
      case 'ArrowDown': if (direction.dy === 0) setDirection({ dx: 0, dy: 5 }); break;
      case 'ArrowLeft': if (direction.dx === 0) setDirection({ dx: -5, dy: 0 }); break;
      case 'ArrowRight': if (direction.dx === 0) setDirection({ dx: 5, dy: 0 }); break;
      default: break;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-green-500 overflow-hidden font-mono" tabIndex="0" onKeyDown={handleKeyDown}>
      <div className="absolute top-0 left-0 w-full text-center mt-4">
        <h1 className="text-4xl font-bold text-green-500">Play with Brad's Big Snake</h1>
      </div>
      <div className="mr-8">
        <p className="text-lg mb-2">Score: {score}</p>
        <p className="text-lg mb-4">Upcoming Challenges:</p>
        <ul className="text-lg">
          <li>10: Food shrinks</li>
          <li>15: Speed increases</li>
          <li>20: Food shrinks again</li>
          <li>25: Speed increases</li>
          <li>30: Enemy snake appears</li>
        </ul>
        {gameOver && <p className="text-red-500 font-bold mb-4">Game Over!</p>}
        <button
          onClick={startGame}
          className="px-4 py-2 bg-green-500 text-black rounded-lg shadow-md mb-4"
        >
          {isPlaying ? 'Restart' : 'Start Game'}
        </button>
      </div>
      <div className="relative bg-gray-900 border-4 border-green-500 rounded-lg" style={{ width: boardSize, height: boardSize }}>
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
  );
}
