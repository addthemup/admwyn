import React, { useEffect, useState } from "react";
import { Calendar } from "./ui/calendar";
import GameLegend from "./GameLegend";

interface GameCalendarProps {
  onDateSelect: (date: Date | null) => void; // Callback to pass selected date
}

export function GameCalendar({ onDateSelect }: GameCalendarProps) {
  const [games, setGames] = useState<{ [key: string]: { count: number; type: string }[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const savedDate = localStorage.getItem("selectedDate");
    return savedDate ? new Date(savedDate) : null;
  });

  // Fetch games when the calendar component loads
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://127.0.0.1:5000/api/schedule");
        if (!response.ok) throw new Error("Failed to fetch schedule");

        const data = await response.json();
        const gamesByDate: { [key: string]: { count: number; type: string }[] } = {};

        if (data?.leagueSchedule?.gameDates) {
          data.leagueSchedule.gameDates.forEach((dateEntry: any) => {
            const gameDate = new Date(dateEntry.gameDate).toDateString();
            const gameTypes = dateEntry.games.map((game: any) => {
              let type = "regular";
              if (game.gameLabel) {
                if (game.gameLabel.toLowerCase().includes("preseason")) type = "preseason";
                else if (game.gameLabel.toLowerCase().includes("playoffs")) type = "playoff";
                else if (game.gameLabel.toLowerCase().includes("cup")) type = "cup";
              }
              return { count: 1, type };
            });

            const groupedByType = gameTypes.reduce((acc: any, { count, type }: any) => {
              const existing = acc.find((item: any) => item.type === type);
              if (existing) {
                existing.count += count;
              } else {
                acc.push({ count, type });
              }
              return acc;
            }, []);

            gamesByDate[gameDate] = groupedByType;
          });
        }

        setGames(gamesByDate);
      } catch (err: any) {
        console.error("Error fetching schedule:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Handle date selection
  const handleDateSelect = (date: Date | null) => {
    if (date?.toDateString() === selectedDate?.toDateString()) return; // Avoid unnecessary state updates
    setSelectedDate(date);
    onDateSelect(date);

    // Save to local storage
    if (date) {
      localStorage.setItem("selectedDate", date.toISOString());
    } else {
      localStorage.removeItem("selectedDate");
    }
  };

  // Highlight calendar days based on game types
  const modifiersClassNames = {
    playoff: "rdp-day_playoff",
    preseason: "rdp-day_preseason",
    cup: "rdp-day_cup",
    regular: "rdp-day_regular",
  };

  const modifiers = {
    playoff: (day: Date) => games[day.toDateString()]?.some((game) => game.type === "playoff"),
    preseason: (day: Date) => games[day.toDateString()]?.some((game) => game.type === "preseason"),
    cup: (day: Date) => games[day.toDateString()]?.some((game) => game.type === "cup"),
    regular: (day: Date) => {
      const gameDate = day.toDateString();
      return (
        games[gameDate]?.some((game) => game.type === "regular") &&
        !games[gameDate]?.some((game) => ["preseason", "playoff", "cup"].includes(game.type))
      );
    },
  };

  if (loading) return <p>Loading games...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        className="rounded-md border shadow"
      />
      <GameLegend />
    </div>
  );
}

export default GameCalendar;
