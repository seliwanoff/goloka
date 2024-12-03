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

interface Location {
  id: number;
  latitude?: number;
  longitude?: number;
}

interface DefaultLocation {
  latitude: number;
  longitude: number;
}

interface Props {
  apiKey: string;
  questionId: number | string;
  onLocationSelect: (locations: Location[]) => void;
  maxLocations?: number;
  defaultLocations?: DefaultLocation[];
}

const CustomAreaInput = ({
  apiKey,
  questionId,
  onLocationSelect,
  maxLocations = 2,
  defaultLocations = [],
}: Props) => {
  // Initial state with dynamic number of location inputs
  const [locations, setLocations] = useState<Location[]>(
    Array.from({ length: maxLocations }, (_, index) => {
      const defaultLocation = defaultLocations[index];
      return {
        id: index + 1,
        latitude: defaultLocation?.latitude,
        longitude: defaultLocation?.longitude,
      };
    }),
  );

  // State to control popover for each location
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  // Callback to update parent with selected locations
  const updateLocations = useCallback(
    (newLocations: Location[]) => {
      // Filter out locations with coordinates
      const locationsWithCoordinates = newLocations.filter(
        (loc) => loc.latitude !== undefined && loc.longitude !== undefined,
      );

      // Always call onLocationSelect with available locations
      onLocationSelect(
        locationsWithCoordinates.map((loc) => ({
          id: loc.id,
          latitude: loc.latitude!,
          longitude: loc.longitude!,
        })),
      );

      // Update local state
      setLocations(newLocations);
    },
    [onLocationSelect],
  );

  // Update location with selected place
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

  // Handle current location selection
  const handleCurrentLocation = useCallback(
    (
      locationIndex: number,
      currentPosition: { latitude: number; longitude: number },
    ) => {
      const updatedLocations = locations.map((loc) =>
        loc.id === locationIndex
          ? {
              ...loc,
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
            }
          : loc,
      );

      updateLocations(updatedLocations);
      setOpenPopoverIndex(null);
    },
    [locations, updateLocations],
  );

  // Function to get current location
  const getCurrentLocation = () => {
    return new Promise<{ latitude: number; longitude: number }>(
      (resolve, reject) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error("Error getting location:", error);
              reject(error);
            },
          );
        } else {
          reject(new Error("Geolocation is not supported by this browser."));
        }
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      {locations.map((location, index) => (
        <div key={location.id} className="relative flex items-center space-x-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 z-10 flex items-center">
              {location.latitude && location.longitude ? (
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
                className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-gray-700 placeholder-gray-400 shadow-sm placeholder:text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                options={{
                  types: ["geocode"],
                  componentRestrictions: { country: "ng" }, // adjust as needed
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
                          onSelect={async () => {
                            try {
                              const currentLocation =
                                await getCurrentLocation();
                              handleCurrentLocation(
                                location.id,
                                currentLocation,
                              );
                            } catch (error) {
                              console.error(
                                "Failed to get current location",
                                error,
                              );
                            }
                          }}
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
