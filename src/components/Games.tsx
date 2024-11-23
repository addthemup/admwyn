import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { format, parseISO, differenceInSeconds } from "date-fns";


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

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-6">
      {games.map((game) => (
        <Card key={game.gameId} className="border shadow-md">
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
          <CardFooter className="text-center text-xs text-gray-500">
            {format(parseISO(game.gameEt), "yyyy-MM-dd hh:mm a zzz")}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Games;
