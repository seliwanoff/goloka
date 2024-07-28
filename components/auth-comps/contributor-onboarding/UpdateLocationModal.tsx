import { Button } from "@/components/ui/button";
import Image from "next/image";
import Location from "@/public/assets/images/location.svg";
import { X } from "lucide-react";
import useShowOverlay from "@/stores/overlay";
import { cn } from "@/lib/utils";

const UpdateLocationModal = () => {
  const { open, setOpen } = useShowOverlay();

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
              onClick={() => {
                console.log("hhhe;;");
                setOpen(false);
              }}
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
              We wants to access your location only to provide a better
              experience by providing you tasks related to your location
            </p>

            <Button className="mt-5 h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700">
              Update location
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateLocationModal;
