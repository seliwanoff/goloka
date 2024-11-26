import React, { useState, useEffect, useCallback } from "react";
import { MapPin, Navigation } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocationAddress } from "@/stores/useLocation";

interface LocationDropdownProps {
  questionId: string | number;
  onLocationSelect: (location: any, questionId: string | number) => void;
}

const LocationDropdown: React.FC<LocationDropdownProps> = ({
  questionId,
  onLocationSelect,
}) => {
  const { latitude, longitude, location, error, loading } =
    useLocationAddress();
  const [open, setOpen] = useState(false);
  const [hasNotifiedLocation, setHasNotifiedLocation] = useState(false);

  const handleLocationSelect = useCallback(() => {
    if (location && !hasNotifiedLocation) {
      onLocationSelect(
        {
          // address: location.address,
          // city: location.city,
          latitude,
          longitude,
          // id: location.id || Date.now().toString(),
        },
        questionId,
      );
      setHasNotifiedLocation(true);
    }
  }, [
    location,
    latitude,
    longitude,
    questionId,
    onLocationSelect,
    hasNotifiedLocation,
  ]);

  useEffect(() => {
    handleLocationSelect();
  }, [handleLocationSelect]);

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const currentLocation = {
          address: location?.address || "Current Location",
          city: location?.city || "",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          id: Date.now().toString(),
        };

        onLocationSelect(currentLocation, questionId);
        setOpen(false);
      });
    } else {
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
            {location ? (
              <div>
                <div className="font-medium">{location.address}</div>
                <div className="text-sm text-gray-500">{location.city}</div>
              </div>
            ) : (
              <span className="text-gray-500">Search for a location...</span>
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
                    className="flex w-full items-center rounded-md p-2 text-sm text-purple-600 hover:bg-gray-100"
                  >
                    <Navigation className="mr-2 h-4 w-4" />
                    Use my current location
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
