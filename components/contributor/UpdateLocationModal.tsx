import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Location from "@/public/assets/images/location.svg";
import { X } from "lucide-react";
import useShowOverlay from "@/stores/overlay";
import { cn } from "@/lib/utils";

const OPEN_CAGE_API_KEY = "527e67fe29404253869bc02ad6b77332";
interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
}

const UpdateLocationModal = () => {
  const { open, setOpen } = useShowOverlay();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationData: LocationData = { latitude, longitude };

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPEN_CAGE_API_KEY}`,
            );
            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const components = data.results[0].components;
              locationData.country = components.country;
              locationData.state = components.state || components.province; 
            }

            setLocation(locationData);
            setError(null);
          } catch (err) {
            setError("Failed to get location details.");
          }
        },
        (err) => {
          setError(err.message);
        },
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <div
        className={cn(
          "pointer-events-none fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-6 opacity-0 duration-300",
          open && "pointer-events-auto opacity-100",
        )}
      >
        <div className="max-w-[450px] rounded-xl bg-white">
          <div className="flex items-center justify-between p-4 font-semibold">
            <h3>Update location</h3>
            <span
              onClick={() => setOpen(false)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2]"
            >
              <X size={18} />
            </span>
          </div>
          <hr className="border-0 border-t" />

          <div className="p-4 text-center">
            <Image
              src={Location}
              alt="Map illustration"
              width={125}
              height={125}
              className="mx-auto w-[125px]"
            />
            <h3 className="mb-2 mt-7 font-bold text-[#101828]">
              Update your location
            </h3>
            <p className="text-sm text-[#667085]">
              We want to access your location only to provide a better
              experience by providing you tasks related to your location.
            </p>

            <Button
              className="mt-5 h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
              onClick={getLocation}
            >
              Update location
            </Button>
            {location && (
              <div className="mt-4 text-center">
                <p className="text-sm text-[#101828]">
                  Latitude: {location.latitude}
                </p>
                <p className="text-sm text-[#101828]">
                  Longitude: {location.longitude}
                </p>
                {location.country && (
                  <p className="text-sm text-[#101828]">
                    Country: {location.country}
                  </p>
                )}
                {location.state && (
                  <p className="text-sm text-[#101828]">
                    State: {location.state}
                  </p>
                )}
              </div>
            )}
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateLocationModal;
