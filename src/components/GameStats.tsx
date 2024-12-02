import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface GameStatsProps {
  gameId: string;
}

interface PlayerStats {
  playerId: string;
  playerName: string;
  points: number;
  assists: number;
  rebounds: number;
}

const GameStats: React.FC<GameStatsProps> = ({ gameId }) => {
  const [stats, setStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch game stats for the given gameId
    fetch(`http://127.0.0.1:5000/api/game_stats/${gameId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch game stats");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched game stats data:", data); // Debugging line

        // Update to properly extract the data
        const statsData = data.stats || []; // Adjust this line based on the response structure
        setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching game stats:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [gameId]);

  if (loading) {
    return <p>Loading game stats...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (stats.length === 0) {
    return <p>No stats available for this game.</p>;
  }

  return (
    <div className="p-6">
      <Card className="border shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Game Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.map((player) => (
              <div key={player.playerId} className="flex justify-between border-b pb-2">
                <div className="font-semibold">{player.playerName}</div>
                <div>Points: {player.points}</div>
                <div>Assists: {player.assists}</div>
                <div>Rebounds: {player.rebounds}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameStats;
