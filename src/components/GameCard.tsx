import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import NumberTicker from "./ui/number-ticker";

interface TeamStats {
  teamTricode: string;
  offensiveRating: number | null;
}

interface GameCardProps {
  game: {
    gameId: string;
    awayTeam: { teamTricode: string; wins: number; losses: number; score: number | null };
    homeTeam: { teamTricode: string; wins: number; losses: number; score: number | null };
    gameEt: string;
  };
  countdown: string; // Time remaining until tip or "Game is starting soon!"
  apiStatus: string; // "usable", "not-usable", or "error"
  gameStats?: {
    TeamStats?: TeamStats[]; // Team stats from JSON
    gameStatusText?: string;
  };
}

const GameCard: React.FC<GameCardProps> = ({ game, countdown, apiStatus, gameStats }) => {
  const { awayTeam, homeTeam } = game;

  const extractScore = (teamTricode: string): number | null => {
    if (gameStats?.TeamStats) {
      const teamStats = gameStats.TeamStats.find((stats) => stats.teamTricode === teamTricode);
      return teamStats?.offensiveRating ?? null; // Return null if score is unavailable
    }
    return null;
  };

  const renderScore = () => {
    const awayScore = extractScore(awayTeam.teamTricode);
    const homeScore = extractScore(homeTeam.teamTricode);

    if (awayScore !== null && homeScore !== null) {
      return (
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="text-xl font-bold">{awayTeam.teamTricode}:</div>
            <NumberTicker value={awayScore} />
          </div>
          <Separator className="my-1" />
          <div className="flex items-center justify-center space-x-2">
            <div className="text-xl font-bold">{homeTeam.teamTricode}:</div>
            <NumberTicker value={homeScore} />
          </div>
        </div>
      );
    }

    return (
      <div className="text-center text-sm">
        {countdown}
      </div>
    );
  };

  return (
    <Card className="border shadow-md h-48 w-30">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="text-left">
            <div className="text-lg font-bold">{awayTeam.teamTricode}</div>
            <div className="text-sm">{`${awayTeam.wins}-${awayTeam.losses}`}</div>
          </div>
          <Separator orientation="vertical" className="h-12 mx-2" />
          <div className="text-right">
            <div className="text-lg font-bold">{homeTeam.teamTricode}</div>
            <div className="text-sm">{`${homeTeam.wins}-${homeTeam.losses}`}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>{renderScore()}</CardContent>
    </Card>
  );
};

export default GameCard;
