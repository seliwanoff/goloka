import React, { useState, useEffect } from "react";
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

interface LocationDropdownProps {
  questionId: string | number;
  onLocationSelect: (location: any, questionId: string | number) => void;
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
  const [currentLocation, setCurrentLocation] = useState<{
    address?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prefill location if default coordinates are provided
  useEffect(() => {
    const prefillDefaultLocation = async () => {
      if (defaultLatitude && defaultLongitude) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${defaultLatitude},${defaultLongitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
          );

          const data = await response.json();

          if (data.status === "OK" && data.results.length > 0) {
            const result = data.results[0];
            const locationDetails = {
              address: result.formatted_address,
              city:
                result.address_components.find((component: { types: string | string[]; }) =>
                  component.types.includes("locality"),
                )?.long_name || "",
              latitude: defaultLatitude,
              longitude: defaultLongitude,
              id: Date.now().toString(),
            };

            setCurrentLocation(locationDetails);
            onLocationSelect(locationDetails, questionId);
          }
        } catch (error) {
          console.error("Error fetching default location details:", error);

          // Fallback if geocoding fails
          const fallbackLocation = {
            address: "Default Location",
            city: "",
            latitude: defaultLatitude,
            longitude: defaultLongitude,
            id: Date.now().toString(),
          };

          setCurrentLocation(fallbackLocation);
          onLocationSelect(fallbackLocation, questionId);
        }
      }
    };

    prefillDefaultLocation();
  }, [defaultLatitude, defaultLongitude, questionId, onLocationSelect]);

  const getCurrentLocation = () => {
    setIsLoading(true);
    setCurrentLocation(null);

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
            );

            const data = await response.json();

            if (data.status === "OK" && data.results.length > 0) {
              const result = data.results[0];
              const locationDetails = {
                address: result.formatted_address,
                city:
                  result.address_components.find((component: { types: string | string[]; }) =>
                    component.types.includes("locality"),
                  )?.long_name || "",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                id: Date.now().toString(),
              };

              setCurrentLocation(locationDetails);
              onLocationSelect(locationDetails, questionId);
            } else {
              // Fallback if geocoding fails
              const fallbackLocation = {
                address: "Current Location",
                city: "",
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                id: Date.now().toString(),
              };

              setCurrentLocation(fallbackLocation);
              onLocationSelect(fallbackLocation, questionId);
            }
          } catch (error) {
            console.error("Error fetching location details:", error);
            const fallbackLocation = {
              address: "Current Location",
              city: "",
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              id: Date.now().toString(),
            };

            setCurrentLocation(fallbackLocation);
            onLocationSelect(fallbackLocation, questionId);
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
  };

  return (
    <div className="w-full max-w-2xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-left hover:bg-gray-100 focus:outline-none"
            onClick={() => setOpen(true)}
          >
            <MapPin className="mr-2 h-5 w-5 text-gray-500" />
            {currentLocation ? (
              <div>
                <div className="font-medium">{currentLocation.address}</div>
                <div className="text-sm text-gray-500">
                  {currentLocation.city}
                </div>
              </div>
            ) : (
              <span className="text-gray-500">
                {defaultLatitude && defaultLongitude
                  ? "Default Location"
                  : "Search for a location..."}
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
