import React, { useState, useCallback, useEffect } from "react";
import { MapPin, Map, Navigation } from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocationAddress } from "@/stores/useLocation";

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

const CustomAreaInput = ({ apiKey, questionId, onLocationSelect }: Props) => {
  // Initial state with two location inputs
  const [locations, setLocations] = useState<Location[]>([
    { id: 1, name: "" },
    { id: 2, name: "" },
  ]);

  // State to control popover for each location
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  // Hook for current location
  const { latitude, longitude, location, error, loading } =
    useLocationAddress();

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
      setLocations(newLocations);
    },
    [onLocationSelect],
  );

  // Handle current location selection
  const handleCurrentLocation = useCallback(
    (locationIndex: number) => {
      if (latitude && longitude) {
        // Construct a detailed location name
        const locationName = location?.address
          ? `${location?.address}${location?.city ? `, ${location?.city}` : ""}`
          : location || "Current Location";

        const updatedLocations = locations.map((loc) =>
          loc.id === locationIndex
            ? {
                ...loc,
                name: locationName,
                // placeId: placeId,
                latitude,
                longitude,
              }
            : loc,
        );
        //@ts-ignore
        updateLocations(updatedLocations);

        // Close the popover
        setOpenPopoverIndex(null);
      } else {
        console.warn("Current location not available");
      }
    },
    [locations, updateLocations, latitude, longitude, location],
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
      {locations.map((location, index) => (
        <div key={location.id} className="relative flex items-center space-x-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 z-10 flex items-center">
              {location.name ? (
                <Map className="h-5 w-5 text-blue-500" />
              ) : (
                <MapPin className="h-5 w-5 text-blue-500" />
              )}
            </div>

            {/* Autocomplete with Current Location Popover */}
            <div className="flex w-full items-center space-x-2">
              <Autocomplete
                apiKey={apiKey}
                placeholder="Search for a location"
                value={location.name}
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-700 placeholder-gray-400 shadow-sm placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                options={{
                  types: ["geocode"],
                  componentRestrictions: { country: "ng" },
                }}
                onPlaceSelected={(place) => {
                  updateLocation(location.id, place);
                }}
              />

              {/* Current Location Popover */}
              <Popover
                open={openPopoverIndex === location.id}
                onOpenChange={(open) =>
                  setOpenPopoverIndex(open ? location.id : null)
                }
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="group relative h-10 w-10 rounded-full hover:bg-blue-50"
                  >
                    <Navigation className="h-5 w-5 text-blue-500" />
                    {/* Tooltip */}
                    <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-700 px-2 py-1 text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                      Use Current Location
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          onSelect={() => handleCurrentLocation(location.id)}
                          className="flex items-center"
                        >
                          <Navigation className="mr-2 h-4 w-4" />
                          Use my current location
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomAreaInput;
