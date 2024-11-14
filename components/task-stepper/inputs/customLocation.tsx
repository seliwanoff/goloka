import React, { useState } from "react";
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

interface Location {
  address: string;
  city: string;
  id: string;
}

const LocationDropdown = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );

  const locations: Location[] = [
    { id: "1", address: "221B Baker Street, NW1 6XE", city: "London" },
    { id: "2", address: "10 Downing Street, SW1A 2AA", city: "London" },
    { id: "3", address: "48 Leicester Square, WC2H 7LU", city: "London" },
    { id: "4", address: "165 Oxford Street, W1D 2JR", city: "London" },
    { id: "5", address: "1 Tower Bridge Road, SE1 2UP", city: "London" },
  ];

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
    setOpen(false);
  };

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const defaultLocation = locations[0];
        setSelectedLocation(defaultLocation);
        setOpen(false);
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  console.log("Selected location:", selectedLocation);

  return (
    <div className="w-full max-w-2xl">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            className="flex w-full items-center rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-left hover:bg-gray-100 focus:outline-none"
            onClick={() => setOpen(true)}
          >
            <MapPin className="mr-2 h-5 w-5 text-gray-500" />
            {selectedLocation ? (
              <div>
                <div className="font-medium">{selectedLocation.address}</div>
                <div className="text-sm text-gray-500">
                  {selectedLocation.city}
                </div>
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
            <CommandInput
              placeholder="Search location..."
              onValueChange={(value) => {
                // Implement search functionality
              }}
            />
            <CommandList>
              {/* <CommandEmpty>No location found.</CommandEmpty> */}
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
                {/* {locations.map((location) => (
                  <div
                    onClick={() => handleLocationSelect(location)}
                    key={location.id}
                    // onSelect={() => handleLocationSelect(location)}
                    className="flex cursor-pointer items-center overflow-auto border-y p-1 hover:bg-gray-100"
                  >
                    <span className="mr-2 mt-1 flex h-8 w-8 items-center justify-center self-start rounded-full bg-[#F8F8F8]">
                      <MapPin className="h-4 w-6 text-[#828282]" />
                    </span>
                    <div>
                      <div className="text-[#333333] ">{location.address}</div>
                      <div className="text-sm text-[#ADADAD]">
                        {location.city}
                      </div>
                    </div>
                  </div>
                ))} */}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationDropdown;
