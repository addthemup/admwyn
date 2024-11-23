import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { format, parseISO, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "./ui/button"; // Importing shadcn button
import GameStats from "./GameStats"; // Import the GameStats component

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

  // This handles when a card is clicked
  const handleCardClick = (gameId: string) => {
    console.log(`Card clicked: ${gameId}`);
    setSelectedGameId(gameId);
  };

  return (
    <div className="relative p-6">
      {selectedGameId ? (
        // Render the GameStats component when a game is selected
        <GameStats gameId={selectedGameId} />
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-all duration-500"
        >
          {games.map((game) => (
            <motion.div
              key={game.gameId}
              layout
              initial={{ opacity: 1 }}
              animate={
                selectedGameId
                  ? game.gameId === selectedGameId
                    ? { scale: 1.2, x: 0, opacity: 1 }
                    : { x: 1000, opacity: 0 }
                  : { scale: 1, x: 0, opacity: 1 }
              }
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="border shadow-md">
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
                  {game.awayTeam.score && game.homeTeam.score ? (
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
                  <Button onClick={() => handleCardClick(game.gameId)} variant="outline">
                    View Game Details
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Games;
