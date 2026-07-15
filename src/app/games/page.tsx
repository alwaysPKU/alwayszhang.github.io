import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games',
  description: '在线小游戏合集',
};

interface Game {
  name: string;
  file: string;
  emoji: string;
  desc: string;
}

const games: Game[] = [
  { name: '2048', file: '2048.html', emoji: '🟧', desc: '经典数字合并游戏' },
  { name: 'Sudoku', file: 'sudoku.html', emoji: '🔢', desc: '数独挑战' },
  { name: 'Game of Life', file: 'game-of-life.html', emoji: '🧬', desc: '康威生命游戏' },
  { name: 'Snake', file: 'snake.html', emoji: '🐍', desc: '贪吃蛇' },
  { name: 'Tetris', file: 'tetris.html', emoji: '🧱', desc: '俄罗斯方块' },
  { name: 'Minesweeper', file: 'minesweeper.html', emoji: '💣', desc: '扫雷' },
  { name: 'Memory', file: 'memory.html', emoji: '🃏', desc: '记忆翻牌' },
  { name: 'Flappy Bird', file: 'flappy-bird.html', emoji: '🐦', desc: '像素鸟' },
  { name: 'Breakout', file: 'breakout.html', emoji: '🧲', desc: '打砖块' },
  { name: 'Blackjack', file: 'blackjack.html', emoji: '🃏', desc: '21点' },
  { name: 'Gomoku', file: 'gomoku.html', emoji: '⚫', desc: '五子棋' },
  { name: 'Space Shooter', file: 'space-shooter.html', emoji: '🚀', desc: '太空射击' },
  { name: 'Endless Runner', file: 'endless-runner.html', emoji: '🏃', desc: '无尽跑酷' },
  { name: 'Music Piano', file: 'music-piano.html', emoji: '🎹', desc: '音乐钢琴' },
  { name: 'Particle Sandbox', file: 'particle-sandbox.html', emoji: '✨', desc: '粒子沙盒' },
  { name: "Rubik's Cube", file: 'rubiks-cube.html', emoji: '🎲', desc: '魔方' },
  { name: 'MBTI', file: 'mbti.html', emoji: '🧠', desc: 'MBTI 性格测试' },
  { name: 'Interleaved Simulator', file: 'interleaved-simulator.html', emoji: '📚', desc: '交错学习模拟器' },
];

export default function GamesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold text-foreground mb-2">Games</h1>
      <p className="text-sm text-muted-foreground mb-8">
        在线小游戏合集，点击即可游玩，无需安装。
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {games.map((game) => (
          <a
            key={game.file}
            href={`/games/${game.file}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all hover:shadow-sm"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {game.emoji}
            </span>
            <span className="text-sm font-medium text-foreground text-center">
              {game.name}
            </span>
            <span className="text-xs text-muted-foreground text-center">
              {game.desc}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
