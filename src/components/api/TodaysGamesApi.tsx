import React, { useEffect, useState } from "react";

interface Game {
  gameId: string;
  awayTeam: {
    teamCity: string;
    teamName: string;
    score: number;
  };
  homeTeam: {
    teamCity: string;
    teamName: string;
    score: number;
  };
  gameStatusText: string;
  gameTimeUTC: string;
  gameLeaders: {
    awayLeaders: {
      name: string;
      points: number;
      assists: number;
      rebounds: number;
    };
    homeLeaders: {
      name: string;
      points: number;
      assists: number;
      rebounds: number;
    };
  };
}

const TodaysGamesApi: React.FC = () => {
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
        const gamesData = data.full_json || []; // Extract the full_json array
        setGames(gamesData); // Ensure it's an array
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

  return (
    <div className="text-lg text-black dark:text-white p-6 space-y-6">
      <h2 className="font-bold text-2xl mb-4">Today's NBA Games</h2>
      {games.map((game) => (
        <div key={game.gameId} className="border p-4 rounded-lg shadow">
          <h3 className="font-semibold">
            {game.awayTeam.teamCity} {game.awayTeam.teamName} ({game.awayTeam.score}) @{" "}
            {game.homeTeam.teamCity} {game.homeTeam.teamName} ({game.homeTeam.score})
          </h3>
          <p className="text-sm text-gray-600">{game.gameStatusText}</p>
          <p className="text-sm text-gray-500">
            Game Time (UTC): {game.gameTimeUTC}
          </p>
          <div className="mt-4">
            <p className="font-medium">Top Performers:</p>
            <div className="ml-4">
              <p>
                <strong>Away Team Leader:</strong> {game.gameLeaders.awayLeaders.name} (
                {game.gameLeaders.awayLeaders.points} PTS,{" "}
                {game.gameLeaders.awayLeaders.assists} AST,{" "}
                {game.gameLeaders.awayLeaders.rebounds} REB)
              </p>
              <p>
                <strong>Home Team Leader:</strong> {game.gameLeaders.homeLeaders.name} (
                {game.gameLeaders.homeLeaders.points} PTS,{" "}
                {game.gameLeaders.homeLeaders.assists} AST,{" "}
                {game.gameLeaders.homeLeaders.rebounds} REB)
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodaysGamesApi;
