import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface LocationDetails {
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  id?: string;
}

interface LocationDropdownProps {
  questionId: string | number;
  onLocationSelect: (
    location: LocationDetails,
    questionId: string | number,
  ) => void;
  defaultLatitude?: number;
  defaultLongitude?: number;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  questionId,
  onLocationSelect,
  defaultLatitude,
  defaultLongitude,
}) => {
  const [open, setOpen] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<LocationDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Memoize the geocoding API call to prevent unnecessary re-renders
  const fetchLocationDetails = useCallback(async (lat: number, lon: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const result = data.results[0];
        return {
          address: result.formatted_address,
          city:
            result.address_components.find(
              (component: { types: string | string[] }) =>
                component.types.includes("locality"),
            )?.long_name || "",
          latitude: lat,
          longitude: lon,
          id: Date.now().toString(),
        };
      }

      // Fallback if geocoding fails
      return {
        address: "Location",
        city: "",
        latitude: lat,
        longitude: lon,
        id: Date.now().toString(),
      };
    } catch (error) {
      // console.error("Error fetching location details:", error);
      return {
        address: "Location",
        city: "",
        latitude: lat,
        longitude: lon,
        id: Date.now().toString(),
      };
    }
  }, []);

  // Use a stable effect for default location
  useEffect(() => {
    let isMounted = true;

    const prefillDefaultLocation = async () => {
      // Only set default location if no current location exists
      if (
        defaultLatitude &&
        defaultLongitude &&
        (!currentLocation ||
          currentLocation.latitude !== defaultLatitude ||
          currentLocation.longitude !== defaultLongitude)
      ) {
        try {
          const locationDetails = await fetchLocationDetails(
            defaultLatitude,
            defaultLongitude,
          );
          console.log(currentLocation);
          console.log(locationDetails);

          if (isMounted) {
            // Avoid calling onLocationSelect if location is the same
            if (
              !currentLocation ||
              currentLocation.latitude !== locationDetails.latitude ||
              currentLocation.longitude !== locationDetails.longitude
            ) {
              setCurrentLocation(locationDetails);
              //  onLocationSelect(locationDetails, questionId);
            }
          }
        } catch (error) {
          console.error("Error prefilling default location:", error);
        }
      }
    };

    prefillDefaultLocation();

    return () => {
      isMounted = false;
    };
  }, [
    defaultLatitude,
    defaultLongitude,
    questionId,
    fetchLocationDetails,
    // onLocationSelect,
    currentLocation,
  ]);

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const locationDetails = await fetchLocationDetails(
              position.coords.latitude,
              position.coords.longitude,
            );

            const fullLocationDetails = {
              ...locationDetails,
              accuracy: position.coords.accuracy,
            };

            // Only update and call onLocationSelect if location is different
            if (
              !currentLocation ||
              currentLocation.latitude !== fullLocationDetails.latitude ||
              currentLocation.longitude !== fullLocationDetails.longitude
            ) {
              setCurrentLocation(fullLocationDetails);
              onLocationSelect(fullLocationDetails, questionId);
            }
          } catch (error) {
            console.error("Error getting location:", error);
            alert(
              "Unable to retrieve your location. Please check your permissions.",
            );
          } finally {
            setIsLoading(false);
            setOpen(false);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);
          alert(
            "Unable to retrieve your location. Please check your permissions.",
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      setIsLoading(false);
      alert("Geolocation is not supported by your browser");
    }
  }, [fetchLocationDetails, onLocationSelect, questionId, currentLocation]);

  // Memoize the location display text
  const locationDisplayText = useMemo(() => {
    if (currentLocation) {
      return {
        primary: currentLocation.address,
        secondary: currentLocation.city,
      };
    }
    return {
      primary:
        defaultLatitude && defaultLongitude
          ? "Default Location"
          : "Search for a location...",
      secondary: "",
    };
  }, [currentLocation, defaultLatitude, defaultLongitude]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-left hover:bg-gray-100 focus:outline-none"
            onClick={() => setOpen(true)}
          >
            <MapPin className="mr-2 h-5 w-5 text-gray-500" />
            {currentLocation ? (
              <div>
                <div className="font-medium">{locationDisplayText.primary}</div>
                {locationDisplayText.secondary && (
                  <div className="text-sm text-gray-500">
                    {locationDisplayText.secondary}
                  </div>
                )}
              </div>
            ) : (
              <span className="text-gray-500">
                {locationDisplayText.primary}
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Search location..." />
            <CommandList>
              <CommandGroup>
                <div className="px-2 py-1.5">
                  <button
                    onClick={getCurrentLocation}
                    disabled={isLoading}
                    className="flex w-full items-center rounded-md p-2 text-sm text-purple-600 hover:bg-gray-100 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="mr-2 h-4 w-4" />
                    )}
                    {isLoading
                      ? "Fetching location..."
                      : "Use my current location"}
                  </button>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationDropdown;
