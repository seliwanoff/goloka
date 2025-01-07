import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { useTransferStepper, useWithdrawStepper } from "@/stores/misc";
import { useTransferOverlay } from "@/stores/overlay";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "iconsax-react";
import TransferStepper from "@/components/wallet_comps/transfer_stepper";

const CreateTransfer = () => {
  const { openTransfer, setOpenTransfer } = useTransferOverlay();
  const { step, setStep, clearTransaction } = useTransferStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const handleCancel = () => {
    setOpenTransfer(false);
    setStep(0);
    clearTransaction();
  };

  return (
    <>
      {isDesktop ? (
        <>
          {/* DESTOP */}

          <Dialog open={openTransfer} onOpenChange={setOpenTransfer}>
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
                  {step === 2 ? "Initiate Payment" : "Transfer money"}
                </DialogTitle>
                <DialogDescription className="sr-only text-white">
                  Transaction ID
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
              <TransferStepper />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          {/* MOBILE */}

          <div
            className={cn(
              "fixed left-0 top-0 h-svh w-full overflow-y-auto bg-white px-4 pb-8 pt-24",
              openTransfer ? "block" : "hidden",
            )}
          >
            <div className="h-min">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-4">
                  <span
                    className="cursor-pointer"
                    onClick={() => setOpenTransfer(false)}
                  >
                    <ArrowLeft size="24" />
                  </span>
                  <h3 className="text-lg font-medium text-[#333333]">
                    {step === 1 ? "Initiate Payment" : "Transfer money"}
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
                <TransferStepper />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateTransfer;
