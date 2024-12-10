import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@react-hook/media-query";
import {
  useShowPin,
  useTransferStepper,
  useWithdrawStepper,
} from "@/stores/misc";
import { useTransferOverlay } from "@/stores/overlay";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "iconsax-react";
import TransferStepper from "@/components/wallet_comps/transfer_stepper";
import CreatePinStepper from "./createPinStepper";
import { useUserStore } from "@/stores/currentUserStore";

const CreatePinComponent = () => {
  const { user: currentUser } = useUserStore();
  const { openTransfer, setOpenTransfer } = useTransferOverlay();
  const { step, setStep, clearTransaction } = useTransferStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const { showPin, setShowPin } = useShowPin();

  useEffect(() => {
    if (currentUser?.pin_status === false) {
      setShowPin(true);
    }
  }, [currentUser?.pin_status]);

  const handleCancel = () => {
    setShowPin(false);
    setShowPin(false);
    setStep(0);
    clearTransaction();
  };
  return (
    <>
      {isDesktop ? (
        <>
          {/* DESkTOP */}

          <Dialog open={showPin} onOpenChange={setShowPin}>
            <DialogContent className="overflow-hidden border-0 focus-visible:outline-none">
              <DialogHeader
                className={cn(
                  "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
                  step === 1 && "border-0",
                )}
              >
                <DialogTitle
                  className={cn(
                    "text-lg font-medium text-[#333]",
                    step === 1 && "text-opacity-0",
                  )}
                >
                  {step === 0 ? "Create Pin" : "Payment successful"}
                </DialogTitle>
                <DialogDescription className="sr-only text-white">
                  Create_Pin
                </DialogDescription>
                <span
                  onClick={handleCancel}
                  className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
                >
                  <X size={20} />
                </span>
              </DialogHeader>
              <div
                className={cn(
                  "mt-16",
                  step === 1 && "mt-0",
                  step === 2 && "mt-8",
                )}
              />
              <CreatePinStepper />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          {/* MOBILE */}

          <div
            className={cn(
              "fixed left-0 top-0 h-svh w-full overflow-y-auto bg-white px-4 pb-8 pt-24",
              showPin ? "block" : "hidden",
            )}
          >
            <div className="h-min">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-4">
                  <span
                    className="cursor-pointer"
                    onClick={() => setShowPin(false)}
                  >
                    <ArrowLeft size="24" />
                  </span>
                  <h3 className="text-lg font-medium text-[#333333]">
                    {step === 1 ? "Payment successful" : "Transfer money"}
                  </h3>
                </div>
                <span
                  onClick={handleCancel}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
                >
                  <X size={20} />
                </span>
              </div>

              <div className="mt-11">
                <CreatePinStepper />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreatePinComponent;
