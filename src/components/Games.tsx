import * as React from "react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { Button } from "./ui/button";
import GameStats from "./GameStats";
import { motion, AnimatePresence } from "framer-motion";

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

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameStatsLoaded, setGameStatsLoaded] = useState(false);

  const COLUMNS_DISPLAYED = 3;
  const ROWS_DISPLAYED = 2;
  const GAMES_PER_PAGE = COLUMNS_DISPLAYED * ROWS_DISPLAYED;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/today_games")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch NBA games");
        }
        return response.json();
      })
      .then((data) => {
        const gamesData = data.full_json || [];
        setGames(gamesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (gameId: string) => {
    setSelectedGameId(gameId);
    setGameStatsLoaded(false); // reset game stats loaded state

    // Fetch the game stats when the card is selected
    fetch(`http://127.0.0.1:5000/api/game_stats/${gameId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch game stats");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Game stats loaded", data);
        setGameStatsLoaded(true); // Set loaded flag once data is successfully fetched
      })
      .catch((err) => {
        console.error("Error fetching game stats:", err);
      });
  };

  if (loading) {
    return <p>Loading games...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (games.length === 0) {
    return <p>No games scheduled for today.</p>;
  }

  const calculateCountdown = (gameEt: string): string => {
    const now = new Date();
    const gameTime = parseISO(gameEt);
    const seconds = differenceInSeconds(gameTime, now);

    if (seconds <= 0) {
      return "Game is starting soon!";
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleNext = () => {
    console.log("Next button pressed");
    if ((currentIndex + 1) * COLUMNS_DISPLAYED < games.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    console.log("Previous button pressed");
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const startIndex = currentIndex * COLUMNS_DISPLAYED;
  const endIndex = startIndex + GAMES_PER_PAGE;
  const displayedGames = games.slice(startIndex, endIndex);

  return (
    <div className="relative p-6 max-w-4xl mx-auto" style={{ minHeight: "500px" }}>
      {selectedGameId && gameStatsLoaded ? (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-full h-full"
        >
          <GameStats gameId={selectedGameId} />
        </motion.div>
      ) : (
        <div>
          <div className="grid grid-cols-3 gap-6">
            <AnimatePresence>
              {displayedGames.map((game) => (
                <motion.div
                  key={game.gameId}
                  layout
                  initial={{ opacity: 1, x: 0 }}
                  animate={
                    selectedGameId
                      ? gameStatsLoaded
                        ? game.gameId === selectedGameId
                          ? { scale: 1.2, x: 0, y: 0, opacity: 1 }
                          : { x: 1000, opacity: 0 }
                        : { opacity: 1 }
                      : { opacity: 1, x: 0 }
                  }
                  transition={{ type: "spring", stiffness: 200, damping: 25, duration: 2 }}
                  exit={{ x: 1000, opacity: 0, transition: { duration: 2 } }}
                  className="h-full"
                >
                  <Card
                    className="border shadow-md h-48 w-30 cursor-pointer"
                    onClick={() => handleCardClick(game.gameId)}
                  >
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <div className="text-left">
                          <div className="text-lg font-bold">{game.awayTeam.teamTricode}</div>
                          <div className="text-sm">{`${game.awayTeam.wins}-${game.awayTeam.losses}`}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{game.homeTeam.teamTricode}</div>
                          <div className="text-sm">{`${game.homeTeam.wins}-${game.homeTeam.losses}`}</div>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {game.awayTeam.score !== null && game.homeTeam.score !== null ? (
                        <div className="text-center text-xl font-bold">
                          {game.awayTeam.score} - {game.homeTeam.score}
                        </div>
                      ) : (
                        <div className="text-center text-sm">
                          Starts in: <span className="font-semibold">{calculateCountdown(game.gameEt)}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <Button variant="outline">View Game Details</Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              variant="outline"
              className="mr-2"
            >
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={(currentIndex + 1) * COLUMNS_DISPLAYED >= games.length}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Games;
