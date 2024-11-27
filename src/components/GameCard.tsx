import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

interface GameCardProps {
  game: {
    gameId: string;
    awayTeam: { teamTricode: string; wins: number; losses: number; score: number | null };
    homeTeam: { teamTricode: string; wins: number; losses: number; score: number | null };
    gameEt: string;
  };
  countdown: string;
  apiStatus: string; // "usable", "not-usable", or "error"
}

const GameCard: React.FC<GameCardProps> = ({ game, countdown, apiStatus }) => {
  return (
    <Card className="border shadow-md h-48 w-30">
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
        <div className="text-center text-sm">
          Starts in: <span className="font-semibold">{countdown}</span>
        </div>
        {apiStatus === "usable" && <AiOutlineCheck className="text-green-500 w-6 h-6 mt-2" />}
        {apiStatus === "not-usable" && <AiOutlineClose className="text-red-500 w-6 h-6 mt-2" />}
      </CardContent>
      <CardFooter className="flex justify-center">
        {apiStatus === "usable" && <button className="btn-primary">Stats</button>}
      </CardFooter>
    </Card>
  );
};

export default GameCard;
