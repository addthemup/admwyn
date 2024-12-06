import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, ClassNames, Matcher } from "react-day-picker";

import "./calendar.css"; // Ensure your custom CSS is imported last

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  showOutsideDays = true,
  modifiers = {}, // Accept modifiers
  ...props
}: CalendarProps) {
  const customClassNames: ClassNames = {
    day: "rdp-day", // Default day class
    day_today: "rdp-day_today", // Today's date
    day_outside: "rdp-day_outside", // Outside current month
    day_disabled: "rdp-day_disabled", // Disabled days
    day_selected: "rdp-day_selected", // Selected day
    day_regular: "rdp-day_regular", // Regular season
    day_preseason: "rdp-day_preseason", // Preseason
    day_cup: "rdp-day_cup", // Cup games
    day_playoff: "rdp-day_playoff", // Playoff games
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`rdp ${className}`}
      classNames={customClassNames}
      modifiers={modifiers} // Pass pre-computed modifiers
      components={{
        IconLeft: (props) => <ChevronLeft {...props} />,
        IconRight: (props) => <ChevronRight {...props} />,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
