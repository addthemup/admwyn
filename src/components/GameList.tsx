import React from "react";
import { Button } from "./ui/button";
import GameCard from "./GameCard";

interface Game {
  gameId: string;
  awayTeam: {
    teamTricode: string;
    wins: number;
    losses: number;
    score: number | null;
  };
  homeTeam: {
    teamTricode: string;
    wins: number;
    losses: number;
    score: number | null;
  };
  gameEt: string;
}

interface GameStats {
  awayScore: number | null;
  homeScore: number | null;
  gameStatusText: string;
}

interface GameListProps {
  games: Game[];
  gameStats: { [key: string]: GameStats }; // Mapping gameId to its stats
  calculateCountdown: (gameEt: string) => string;
  apiStatuses: { [key: string]: string };
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const GameList: React.FC<GameListProps> = ({
  games,
  gameStats,
  calculateCountdown,
  apiStatuses,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
}) => (
  <div className="game-list-container">
    {/* Game Grid */}
    <div className="grid grid-cols-3 gap-6">
      {games.map((game) => (
        <GameCard
          key={game.gameId}
          game={game}
          countdown={calculateCountdown(game.gameEt)}
          apiStatus={apiStatuses?.[game.gameId] || "unknown"}
          gameStats={gameStats?.[game.gameId]} // Pass game stats if available
        />
      ))}
    </div>

    {/* Pagination Controls */}
    <div className="flex justify-between mt-4">
      <Button
        onClick={onPrevious}
        disabled={!canGoPrevious}
        variant="outline"
        className="mr-2"
      >
        Previous
      </Button>
      <Button onClick={onNext} disabled={!canGoNext} variant="outline">
        Next
      </Button>
    </div>
  </div>
);

export default GameList;
