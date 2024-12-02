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

interface GameListProps {
  games: Game[];
  calculateCountdown: (gameEt: string) => string;
  apiStatuses: { [key: string]: string }; // Updated to ensure defined keys
  onPrevious: () => void;
  onNext: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const GameList: React.FC<GameListProps> = ({
  games,
  calculateCountdown,
  apiStatuses,
  onPrevious,
  onNext,
  canGoNext,
  canGoPrevious,
}) => {
  console.log("Rendering GameList. Games:", games);
  console.log("API Statuses:", apiStatuses);

  return (
    <div className="game-list-container">
      {/* Game Grid */}
      <div className="grid grid-cols-3 gap-6">
        {games.map((game) => (
          <GameCard
            key={game.gameId}
            game={game}
            countdown={calculateCountdown(game.gameEt)}
            apiStatus={apiStatuses?.[game.gameId] || "unknown"} // Safe fallback
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
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          variant="outline"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default GameList;
