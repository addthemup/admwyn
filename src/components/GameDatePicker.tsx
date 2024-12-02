import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function GameDatePicker() {
  const [date, setDate] = useState<Date>();
  const [games, setGames] = useState([]);

  const fetchGamesByDate = async (selectedDate: Date) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/games_by_date/${formattedDate}`);
      const data = await response.json();
      setGames(data.games_list || []);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    fetchGamesByDate(selectedDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          {date ? format(date, "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
      </PopoverContent>
      {games.length > 0 && (
        <div>
          <h3>Games:</h3>
          <ul>
            {games.map((game) => (
              <li key={game.game_id}>
                {game.away_team} vs. {game.home_team} at {game.game_time}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Popover>
  );
}
