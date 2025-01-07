import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React from "react";
import { Dog, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Location from "@/public/assets/images/svg/location.svg";
import Image from "next/image";

type ComponentProps = {
  open: boolean;
  action: () => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
const UpdateLocationDialog: React.FC<ComponentProps> = ({
  open,
  action,
  setOpen,
}) => {
  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center overflow-hidden p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg bg-white pb-4 pt-4 text-left shadow-xl transition-all sm:w-[500px]">
                <div className="flex items-center justify-between px-4 md:px-8">
                  <h3 className="text-lg font-medium text-[#333333]">
                    Update location
                  </h3>
                  <span
                    onClick={() => setOpen(false)}
                    className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#4F4F4F]"
                  >
                    <X />
                  </span>
                </div>
                <hr className="mt-4 border-0 border-b border-[#F2F2F2]" />
                <div className="mt-10 flex w-full flex-col items-center px-4 md:px-8">
                  <Image src={Location} alt="No task illustrations" />
                  <h3 className="mb-4 mt-11 text-center text-2xl font-semibold text-neutral-900">
                    Update your location
                  </h3>
                  <p className="text-center text-base text-[#4F4F4F]">
                    We wants to access your location only to provide a better
                    experience by providing you tasks related to your location
                  </p>
                </div>
                <div className="mt-5 px-4 sm:mt-6 md:px-8">
                  <Button
                    className="h-auto w-full rounded-full bg-main-100 py-3 hover:bg-blue-700"
                    onClick={action}
                  >
                    Update location
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UpdateLocationDialog;
