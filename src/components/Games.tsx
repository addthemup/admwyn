import React, { useEffect, useState, useRef } from "react";
import GameList from "./GameList";
import { parseISO, differenceInSeconds, format } from "date-fns";

interface GamesProps {
  selectedDate: Date | null; // Date selected from the calendar
}

const Games: React.FC<GamesProps> = ({ selectedDate }) => {
  const [games, setGames] = useState<any[]>([]);
  const [gameStats, setGameStats] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatuses, setApiStatuses] = useState<{ [key: string]: string }>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const COLUMNS_DISPLAYED = 3;
  const ROWS_DISPLAYED = 2;
  const GAMES_PER_PAGE = COLUMNS_DISPLAYED * ROWS_DISPLAYED;

  const statsFetchedRef = useRef(false);
  const LOCAL_STORAGE_KEY = "queriedGameStats";

  // Reset local storage and fetch games when the component is rendered
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!selectedDate) {
      setGames([]);
      setLoading(false);
      return;
    }

    const fetchGamesForDate = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://127.0.0.1:5000/api/schedule");
        if (!response.ok) throw new Error("Failed to fetch games");

        const data = await response.json();
        const gameDates = data?.leagueSchedule?.gameDates || [];
        const gameDateStr = selectedDate.toDateString();

        const gamesForDate = gameDates
          .find((dateEntry: any) => new Date(dateEntry.gameDate).toDateString() === gameDateStr)
          ?.games;

        setGames(gamesForDate || []);
      } catch (err: any) {
        console.error("Error fetching games:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGamesForDate();
  }, [selectedDate]);

  useEffect(() => {
    if (games.length > 0 && !statsFetchedRef.current) {
      statsFetchedRef.current = true;

      const fetchGameStats = async () => {
        const statuses: { [key: string]: string } = {};
        const stats: { [key: string]: any } = {};

        await Promise.all(
          games.map(async (game) => {
            try {
              const response = await fetch(`http://127.0.0.1:5000/api/game_stats/${game.gameId}`);
              if (!response.ok) throw new Error(`Failed to fetch stats for game ${game.gameId}`);

              const data = await response.json();
              const awayScore = data.TeamStats.find(
                (team: any) => team.teamId === game.awayTeam.teamId
              )?.offensiveRating;
              const homeScore = data.TeamStats.find(
                (team: any) => team.teamId === game.homeTeam.teamId
              )?.offensiveRating;

              stats[game.gameId] = {
                awayScore,
                homeScore,
              };

              const allPossessionsZero = data.PlayerStats.every((player: any) => player.possessions === 0);
              statuses[game.gameId] = allPossessionsZero ? "not-usable" : "usable";
            } catch (error) {
              console.error(`Error fetching stats for game ${game.gameId}:`, error.message);
              statuses[game.gameId] = "error";
            }
          })
        );

        setGameStats(stats);
        setApiStatuses(statuses);

        // Save stats to local storage
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({ date: selectedDate?.toDateString(), stats })
        );
      };

      fetchGameStats();
    }
  }, [games]);

  const calculateCountdown = (gameEt: string) => {
    if (!gameEt) return "Game time unavailable";

    try {
      const now = new Date();
      const gameTime = parseISO(gameEt);
      const seconds = differenceInSeconds(gameTime, now);
      if (seconds <= 0) return "Game is starting soon!";
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    } catch (error) {
      console.error(`Error parsing game time: ${gameEt}`, error);
      return "Invalid game time";
    }
  };

  const handleNext = () => setCurrentIndex((prev) => prev + 1);
  const handlePrevious = () => setCurrentIndex((prev) => Math.max(0, prev - 1));

  const startIndex = currentIndex * GAMES_PER_PAGE;
  const displayedGames = games.slice(startIndex, startIndex + GAMES_PER_PAGE);

  if (!selectedDate) return <p>Please select a date to view games.</p>;
  if (loading) return <p>Loading games...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (games.length === 0) return <p>No games scheduled for {format(selectedDate, "PP")}.</p>;

  return (
    <div>
      <h2 className="font-bold">Games on {format(selectedDate, "PP")}</h2>
      <GameList
        games={displayedGames}
        gameStats={gameStats}
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
