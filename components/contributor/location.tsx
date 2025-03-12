import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Location from "@/public/assets/images/location.svg";
import { X } from "lucide-react";
import { useShowOverlay } from "@/stores/location";
import { cn } from "@/lib/utils";
import {
  createContributor,
  createContributorLocation,
} from "@/services/contributor";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
  city?: string;
  formatted_address?: string;
}

const OPEN_CAGE_API_KEY = "527e67fe29404253869bc02ad6b77332";

const UpdateLocationModal = () => {
  const router = useRouter();
  const { open, setOpen } = useShowOverlay();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get location immediately when modal opens
  useEffect(() => {
    if (open) {
      getLocation();
    }
  }, [open]);

  const getLocation = () => {
    setIsSubmitting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsSubmitting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const locationData: LocationData = { latitude, longitude };

          // Fetch address details
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${OPEN_CAGE_API_KEY}`,
          );

          const data = await response.json();

          if (data.results && data.results.length > 0) {
            const result = data.results[0];
            const components = result.components;

            locationData.country = components.country;
            locationData.state = components.state || components.province;
            locationData.city =
              components.city || components.town || components.village;
            locationData.formatted_address = result.formatted;

            setLocation(locationData);
            await updateContributorsLocation(locationData);
          } else {
            throw new Error("No location details found");
          }
        } catch (err) {
          setError("Failed to get location details. Please try again.");
          setIsSubmitting(false);
        }
      },
      (err) => {
        let errorMessage = "Failed to get location.";
        if (err.code === 1) {
          errorMessage =
            "Location access denied. Please enable location access in your browser settings.";
        } else if (err.code === 2) {
          errorMessage = "Location unavailable. Please try again.";
        }
        setError(errorMessage);
        setIsSubmitting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    );
  };

  const updateContributorsLocation = async (locationData: LocationData) => {
    try {
      const res = await createContributorLocation({
        longitude: locationData.longitude,
        latitude: locationData.latitude,
        // country: locationData.country,
        // state: locationData.state,
        // city: locationData.city,
      });

      if (res) {
        toast.success("Location updated successfully!");
        setIsSubmitting(false);
        setOpen(false);
        router.refresh(); // Refresh the page to update any location-dependent content
      }
    } catch (error) {
      toast.error(
        //@ts-ignore
        error?.response?.data?.message || "Failed to update location",
      );
      setError("Failed to update location. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-black bg-opacity-50 p-6 transition-all duration-300",
        open
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      )}
    >
      <div className="max-w-[450px] rounded-xl bg-white">
        <div className="flex items-center justify-between p-4 font-semibold">
          <h3>Update location</h3>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#F2F2F2] transition-colors hover:bg-[#E5E5E5]"
          >
            <X size={18} />
          </button>
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
            {location ? "Confirm Your Location" : "Detecting Your Location..."}
          </h3>

          {location && (
            <p className="mb-4 text-sm text-[#667085]">
              {location.formatted_address}
            </p>
          )}

          <p className="text-sm text-[#667085]">
            We use your location to provide relevant tasks and better experience
          </p>

          <Button
            className="mt-5 h-12 w-full rounded-full bg-blue-600 text-base font-light text-white hover:bg-blue-700 disabled:bg-blue-300"
            onClick={getLocation}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : location ? (
              "Update Location"
            ) : (
              "Detect Location"
            )}
          </Button>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpdateLocationModal;
