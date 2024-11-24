import React, { useState, useEffect } from "react";
import { MapPin, Map } from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";

interface Location {
  id: number;
  name: string;
  placeId?: string;
}

interface Props {
  apiKey: string;
}

const LocationSelector = ({ apiKey }: Props) => {
  const [locations, setLocations] = useState<Location[]>([{ id: 1, name: "" }]);
  const [logs, setLogs] = useState<Location[]>([]);

  const addNewLocation = () => {
    const newLocation = { id: Date.now(), name: "" };
    setLocations([...locations, newLocation]);
  };

  const removeLocation = (id: number) => {
    setLocations(locations.filter((loc) => loc.id !== id));
    setLogs(logs.filter((log) => log.id !== id)); // Remove from logs
  };

  const updateLocation = (id: number, name: string, placeId?: string) => {
    setLocations(
      locations.map((loc) => (loc.id === id ? { ...loc, name, placeId } : loc)),
    );
    setLogs((prevLogs) => {
      const updatedLogs = prevLogs.filter((log) => log.id !== id);
      return [...updatedLogs, { id, name, placeId }];
    });
  };

  // Log changes to the console
  useEffect(() => {
    console.log("Location Logs:", logs);
  }, [logs]);

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {locations.map((location) => (
        <div key={location.id} className="relative flex items-center space-x-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 flex items-center">
              {location.name ? (
                <Map className="h-5 w-5 text-blue-500" />
              ) : (
                <MapPin className="h-5 w-5 text-blue-500" />
              )}
            </div>
            <Autocomplete
              apiKey={apiKey}
              placeholder="Search for a location"
              defaultValue={location.name}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-700 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-sm"
              options={{
                types: ["geocode"],
                componentRestrictions: { country: "ng" },
              }}
              onPlaceSelected={(place) => {
                if (place.formatted_address) {
                  updateLocation(
                    location.id,
                    place.formatted_address,
                    place.place_id,
                  );
                }
              }}
            />
          </div>
          {locations.length > 1 && (
            <div className="group relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full hover:bg-red-50"
                onClick={() => removeLocation(location.id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-map-pin-x-inside h-4 w-4 text-red-500"
                >
                  <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                  <path d="m14.5 7.5-5 5" />
                  <path d="m9.5 7.5 5 5" />
                </svg>
              </Button>
              {/* Tooltip */}
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 scale-0 rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 shadow-lg transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
                Remove
              </span>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="ghost"
        className="flex items-center space-x-2 place-self-end rounded-xl px-3 text-blue-500 hover:bg-blue-50 hover:text-blue-600"
        onClick={addNewLocation}
      >
        <MapPin className="mr-2 h-4 w-4" />
        Add new location
      </Button>
    </div>
  );
};

export default LocationSelector;
