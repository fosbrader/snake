# Snake Game 🐍

A modern, responsive Snake game built with React and TailwindCSS. Features both desktop and mobile controls, with a retro arcade aesthetic.

## Features

- 🎮 Desktop keyboard controls
- 📱 Mobile-optimized with touch controls
- 🎯 Progressive difficulty
- 🌟 Retro arcade-style UI
- 💫 Responsive design
- 👾 Enemy snake at higher levels

## Live Demo

Play the game at: [https://fosbrader.github.io/snake](https://fosbrader.github.io/snake)

## Project Structure

The main game code is located in the `snake/my-snake-game` directory. This is where you'll need to run all npm commands.

## Development

### Local Development
1. Navigate to the game directory:
```bash
cd snake/my-snake-game
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The game will be available at [http://localhost:3030](http://localhost:3030)

### Deployment
To deploy updates to the live site:

1. Navigate to the game directory:
```bash
cd snake/my-snake-game
```

2. Run the deployment command:
```bash
npm run deploy
```

This will build the app and deploy it to GitHub Pages.

## Game Controls

### Desktop
- Use arrow keys to control snake direction
- Press any key to start

### Mobile
- Use on-screen arrow buttons
- Swipe in any direction
- Tap buttons to control snake direction

## Game Progression

The game becomes progressively more challenging as your score increases:

- Score 10: Food size decreases
- Score 15: Snake speed increases
- Score 20: Food shrinks again
- Score 25: Speed increases further
- Score 30: Enemy snake appears

## Technology Stack

This project was built with:
- React
- TailwindCSS
- Create React App
- GitHub Pages

## Repository Structure

- `/snake/my-snake-game/` - Main game directory containing all source code
  - `/src/` - React components and game logic
  - `/public/` - Static assets
  - `/build/` - Production build (generated)

## License

MIT License - Feel free to use this code for your own projects! 