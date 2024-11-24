import React, { useEffect, useState } from "react";

interface PlayerStat {
  personId: number;
  firstName: string;
  familyName: string;
  position: string;
  minutes: string;
  points: number;
  assists: number;
  rebounds: number;
  comment: string;
}

interface TeamStat {
  teamId: number;
  teamName: string;
  offensiveRating: number;
  defensiveRating: number;
  netRating: number;
}

interface GameStatsProps {
  gameId: string;
}

const GameStats: React.FC<GameStatsProps> = ({ gameId }) => {
  const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch game stats using the provided gameId
    fetch(`http://127.0.0.1:5000/api/game_stats?gameId=${gameId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch game stats");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched game stats data:", data); // Detailed logging

        // Update state based on data keys - PlayerStats and TeamStats
        setPlayerStats(data.PlayerStats || []);
        setTeamStats(data.TeamStats || []);
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

  if (playerStats.length === 0 && teamStats.length === 0) {
    return <p>No stats available for this game.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Game Stats</h2>
      <div className="mb-6">
        <h3 className="text-xl font-bold">Team Stats</h3>
        {teamStats.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {teamStats.map((team) => (
              <div key={team.teamId} className="border p-4 rounded-md shadow-sm">
                <h4 className="font-bold">{team.teamName}</h4>
                <p>Offensive Rating: {team.offensiveRating}</p>
                <p>Defensive Rating: {team.defensiveRating}</p>
                <p>Net Rating: {team.netRating}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No team stats available.</p>
        )}
      </div>
      <div>
        <h3 className="text-xl font-bold">Player Stats</h3>
        {playerStats.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {playerStats.map((player) => (
              <div key={player.personId} className="border p-4 rounded-md shadow-sm">
                <h4 className="font-bold">
                  {player.firstName} {player.familyName} ({player.position})
                </h4>
                <p>Minutes Played: {player.minutes}</p>
                <p>Points: {player.points}</p>
                <p>Assists: {player.assists}</p>
                <p>Rebounds: {player.rebounds}</p>
                <p>{player.comment && `Comment: ${player.comment}`}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No player stats available.</p>
        )}
      </div>
    </div>
  );
};

export default GameStats;
