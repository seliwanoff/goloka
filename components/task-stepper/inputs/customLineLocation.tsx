import React, { useState, useCallback, useMemo } from "react";
import { MapPin, Map } from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";

interface Location {
  id: number;
  name: string;
  placeId?: string;
  latitude?: number;
  longitude?: number;
}

interface CoordinateLocation {
  latitude: number;
  longitude: number;
}

interface Props {
  apiKey: string;
  questionId: number | string;
  onLocationSelect: (locations: CoordinateLocation[]) => void;
}

const LocationSelector = ({ apiKey, questionId, onLocationSelect }: Props) => {
  const [locations, setLocations] = useState<Location[]>([{ id: 1, name: "" }]);

  const updateLocations = useCallback(
    (newLocations: Location[]) => {
      // Filter out locations with no coordinates
      const filteredLocations = newLocations.filter(
        (loc) => loc.latitude !== undefined && loc.longitude !== undefined,
      );

      // Transform to coordinate objects
      const coordinateLocations = filteredLocations.map((loc) => ({
        latitude: loc.latitude!,
        longitude: loc.longitude!,
      }));

      // Call onLocationSelect only with locations having coordinates
      onLocationSelect(coordinateLocations);

      // Update local state
      setLocations(
        newLocations.length > 0 ? newLocations : [{ id: 1, name: "" }],
      );
    },
    [onLocationSelect],
  );

  const addNewLocation = useCallback(() => {
    const newLocation = { id: Date.now(), name: "" };
    updateLocations([...locations, newLocation]);
  }, [locations, updateLocations]);

  const removeLocation = useCallback(
    (id: number) => {
      const updatedLocations = locations.filter((loc) => loc.id !== id);

      // Ensure at least one location input remains
      updateLocations(
        updatedLocations.length > 0 ? updatedLocations : [{ id: 1, name: "" }],
      );
    },
    [locations, updateLocations],
  );

  const updateLocation = useCallback(
    (id: number, place: google.maps.places.PlaceResult) => {
      // Safely extract coordinates
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      if (lat !== undefined && lng !== undefined) {
        const updatedLocations = locations.map((loc) =>
          loc.id === id
            ? {
                ...loc,
                name: place.formatted_address || "",
                placeId: place.place_id,
                latitude: lat,
                longitude: lng,
              }
            : loc,
        );

        updateLocations(updatedLocations);
      } else {
        console.warn("Could not extract coordinates for the selected location");
      }
    },
    [locations, updateLocations],
  );

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
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-700 placeholder-gray-400 shadow-sm placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              options={{
                types: ["geocode"],
                componentRestrictions: { country: "ng" },
              }}
              onPlaceSelected={(place) => {
                updateLocation(location.id, place);
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
