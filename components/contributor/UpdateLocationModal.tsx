import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Location from "@/public/assets/images/location.svg";
import { X } from "lucide-react";
import { useShowOverlay } from "@/stores/overlay";
import { cn } from "@/lib/utils";
import {
  createContributor,
  createContributorLocation,
} from "@/services/contributor";
import { FaSpinner } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const OPEN_CAGE_API_KEY = "527e67fe29404253869bc02ad6b77332";

interface LocationData {
  latitude: number;
  longitude: number;
  country?: string;
  state?: string;
}

const UpdateLocationModal = () => {
  const router = useRouter();
  const { open, setOpen } = useShowOverlay();
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getLocation = () => {
    setIsSubmitting(true);
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
            await updateContributorsLocation(locationData);
            setError(null);
          } catch (err) {
            setIsSubmitting(false);
            setError("Failed to get location details.");
          }
        },
        (err) => {
          setIsSubmitting(false);
          setError(err.message);
        },
      );
    } else {
      setIsSubmitting(false);
      setError("Geolocation is not supported by this browser.");
    }
  };

  const updateContributorsLocation = async (locationData: LocationData) => {
    try {
      const res = await createContributorLocation({
        longitude: locationData.longitude,
        latitude: locationData.latitude,
      });

      if (res) {
        console.log(res, "Location updated successfully.");
        setIsSubmitting(false);
        setOpen(false);
        router.push("/dashboard/root");
      }
    } catch (error) {
      //@ts-ignore
      toast.warning(error?.response?.data?.message);
      setError("Failed to update location.");
      setIsSubmitting(false);
    }
  };

  // console.log(error, "error");

  return (
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
            We want to access your location only to provide a better experience
            by providing you tasks related to your location.
          </p>

          <Button
            className="mt-5 h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
            onClick={getLocation}
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin" />
            ) : (
              "Update location"
            )}
          </Button>
          {/* <Button
            className="hover:bg-white-700 mt-5 h-12 w-full rounded-full bg-white text-base font-light text-blue-500"
            onClick={() => router.push("/dashboard/root")}
          >
            { "Skip"}
          </Button> */}
          {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default UpdateLocationModal;
