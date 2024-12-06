import React from "react";
import { Badge } from "./ui/badge";

export function GameLegend() {
  return (
    <div className="flex flex-wrap gap-4 mt-4">
      <div className="flex items-center gap-2">
        <Badge className="bg-blue-500 text-white">Preseason</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-red-500 text-white">Playoff</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-purple-500 text-white">Cup</Badge>
      </div>
      <div className="flex items-center gap-2">
        <Badge className="bg-green-500 text-white">Regular</Badge>
      </div>
    </div>
  );
}

export default GameLegend;
