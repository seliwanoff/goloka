"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  selected: string | null;
  onSelect: (selectedTime: string | null) => void;
  className?: string;
}

function TimePicker({ selected, onSelect, className }: TimePickerProps) {
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        for (let second = 0; second < 60; second += 15) {
          // Added seconds loop with 15-second intervals
          const formattedTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
          options.push(formattedTime);
        }
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <div
      className={cn(
        "flex max-h-48 w-full flex-col rounded-md bg-white p-4", // Reduced max height for the container
        className,
      )}
      style={{
        overflowY: "auto",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
      }}
    >
      {timeOptions.map((time) => (
        <button
          key={time}
          className={cn(
            "w-full rounded-md px-4 py-2 text-left text-sm hover:bg-gray-100",
            selected === time ? "bg-gray-200 font-medium" : "",
          )}
          onClick={() => onSelect(time)}
        >
          {time}
        </button>
      ))}
      <div className="flex justify-center py-2">
        <span className="text-gray-500">↓</span> {/* Downward arrow */}
      </div>
    </div>
  );
}

TimePicker.displayName = "TimePicker";

export { TimePicker };
