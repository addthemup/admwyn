import React, { useEffect, useState, useRef } from "react";
import GameList from "./GameList";
import { parseISO, differenceInSeconds } from "date-fns";

const Games: React.FC = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatuses, setApiStatuses] = useState<{ [key: string]: string }>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  const COLUMNS_DISPLAYED = 3;
  const ROWS_DISPLAYED = 2;
  const GAMES_PER_PAGE = COLUMNS_DISPLAYED * ROWS_DISPLAYED;

  const statsFetchedRef = useRef(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/today_games")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch today's games");
        }
        return res.json();
      })
      .then((data) => {
        setGames(data.full_json || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching games:", err.message);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (games.length > 0 && !statsFetchedRef.current) {
      statsFetchedRef.current = true;

      const fetchGameStats = async () => {
        const statuses: { [key: string]: string } = {};

        await Promise.all(
          games.map(async (game) => {
            try {
              const response = await fetch(`http://127.0.0.1:5000/api/game_stats/${game.gameId}`);
              if (!response.ok) {
                throw new Error(`Failed to fetch stats for game ${game.gameId}`);
              }
              const data = await response.json();

              // Check if the game is usable
              const allPossessionsZero = data.every((player: any) => player.possessions === 0);
              if (allPossessionsZero) {
                statuses[game.gameId] = "not-usable";
              } else {
                statuses[game.gameId] = "usable";
              }
            } catch (error) {
              console.error(`Error fetching stats for game ${game.gameId}:`, error.message);
              statuses[game.gameId] = "error";
            }
          })
        );

        setApiStatuses(statuses);
      };

      fetchGameStats();
    }
  }, [games]);

  const calculateCountdown = (gameEt: string) => {
    const now = new Date();
    const gameTime = parseISO(gameEt);
    const seconds = differenceInSeconds(gameTime, now);
    if (seconds <= 0) return "Game is starting soon!";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1));

  const startIndex = currentIndex * GAMES_PER_PAGE;
  const displayedGames = games.slice(startIndex, startIndex + GAMES_PER_PAGE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log("Rendering GameList. Games:", games);
  console.log("API Statuses:", apiStatuses);

  return (
    <div>
      <GameList
        games={displayedGames}
        calculateCountdown={calculateCountdown}
        apiStatuses={apiStatuses}
        onNext={handleNext}
        onPrevious={handlePrevious}
        canGoNext={(currentIndex + 1) * GAMES_PER_PAGE < games.length}
        canGoPrevious={currentIndex > 0}
      />
    </div>
  );
};

export default Games;
