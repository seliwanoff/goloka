import React, { useState, useCallback, useEffect, useMemo } from "react";
import { MapPin, Map, Navigation } from "lucide-react";
import Autocomplete from "react-google-autocomplete";
import { Button } from "@/components/ui/button";
import {
  Command,
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
  address?: string;
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
  // Memoize default locations to prevent unnecessary re-renders
  const memoizedDefaultLocations = useMemo(
    () => defaultLocations || [],
    [defaultLocations],
  );

  // State to store locations with potential address resolution
  const [locations, setLocations] = useState<Location[]>(() =>
    Array.from({ length: maxLocations }, (_, index) => {
      const defaultLocation = memoizedDefaultLocations[index];
      return {
        id: index + 1,
        latitude: defaultLocation?.latitude,
        longitude: defaultLocation?.longitude,
      };
    }),
  );

  // State to track if addresses have been resolved
  const [isAddressResolved, setIsAddressResolved] = useState(false);

  // Effect to resolve addresses for default locations
  useEffect(() => {
    const resolveAddressesForDefaultLocations = async () => {
      // Prevent re-resolving if already done
      if (isAddressResolved) return;

      const updatedLocations = await Promise.all(
        locations.map(async (loc) => {
          if (loc.latitude && loc.longitude && !loc.address) {
            try {
              const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.latitude},${loc.longitude}&key=${apiKey}`,
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                return {
                  ...loc,
                  address: data.results[0].formatted_address,
                };
              }
            } catch (error) {
              console.error("Error resolving address:", error);
            }
          }
          return loc;
        }),
      );

      setLocations(updatedLocations);
      setIsAddressResolved(true);

      // Trigger initial location select
      const locationsWithCoordinates = updatedLocations.filter(
        (loc) => loc.latitude !== undefined && loc.longitude !== undefined,
      );
      onLocationSelect(
        locationsWithCoordinates.map((loc) => ({
          id: loc.id,
          latitude: loc.latitude!,
          longitude: loc.longitude!,
          address: loc.address,
        })),
      );
    };

    if (memoizedDefaultLocations.length > 0 && !isAddressResolved) {
      resolveAddressesForDefaultLocations();
    }
  }, [memoizedDefaultLocations, apiKey, isAddressResolved, onLocationSelect]);

  // Rest of the component remains the same as in the original implementation
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
          address: loc.address,
        })),
      );

      // Update local state
      setLocations(newLocations);
    },
    [onLocationSelect],
  );

  // Update location with selected place
  const updateLocation = useCallback(
    async (id: number, place: google.maps.places.PlaceResult) => {
      // Safely extract coordinates
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      const address = place.formatted_address;

      if (lat !== undefined && lng !== undefined) {
        const updatedLocations = locations.map((loc) =>
          loc.id === id
            ? {
                ...loc,
                latitude: lat,
                longitude: lng,
                address: address,
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
    async (
      locationIndex: number,
      currentPosition: { latitude: number; longitude: number },
    ) => {
      try {
        // Fetch address for current location
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentPosition.latitude},${currentPosition.longitude}&key=${apiKey}`,
        );
        const data = await response.json();

        const address = data.results[0]?.formatted_address;

        const updatedLocations = locations.map((loc) =>
          loc.id === locationIndex
            ? {
                ...loc,
                latitude: currentPosition.latitude,
                longitude: currentPosition.longitude,
                address: address,
              }
            : loc,
        );

        updateLocations(updatedLocations);
        setOpenPopoverIndex(null);
      } catch (error) {
        console.error("Error getting location details:", error);
      }
    },
    [locations, updateLocations, apiKey],
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

  // State to control popover for each location
  const [openPopoverIndex, setOpenPopoverIndex] = useState<number | null>(null);

  return (
    <div className="w-full space-y-4">
      {locations.map((location) => (
        <div key={location.id} className="relative flex items-center space-x-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-3 z-10 flex items-center">
              {location.latitude && location.longitude ? (
                <Map className="h-5 w-5 text-blue-500" />
              ) : (
                <MapPin className="h-5 w-5 text-blue-500" />
              )}
            </div>

            <div className="flex w-full items-center space-x-2">
              <Autocomplete
                apiKey={apiKey}
                defaultValue={location.address || ""}
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
                              await handleCurrentLocation(
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
