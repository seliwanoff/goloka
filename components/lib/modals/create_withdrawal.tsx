import React, { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@react-hook/media-query";
import { useShowPin, useWithdrawStepper } from "@/stores/misc";
import { useAddBeneficiaryOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { cn } from "@/lib/utils";
import WithdrawalStepper from "@/components/wallet_comps/withdrawal_stepper";
import { ArrowLeft } from "iconsax-react";
import { useUserStore } from "@/stores/currentUserStore";
import CreatePinComponent from "@/components/wallet_comps/createPin/createPinComponent";

const CreateWithdrawal = () => {
  const { open, setOpen } = useWithdrawOverlay();
  const { step, setStep } = useWithdrawStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { user: currentUser } = useUserStore();
  const { showPin, setShowPin } = useShowPin();

  useEffect(() => {
    if (currentUser?.pin_status === false) {
      setShowPin(true);
    }
  }, [currentUser?.pin_status, setShowPin]);

  return (
    <>
      {isDesktop ? (
        <>
          {/* DESTOP */}

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="overflow-hidden border-0 focus-visible:outline-none">
              <DialogHeader
                className={cn(
                  "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
                  step === 2 && "border-0",
                )}
              >
                <DialogTitle
                  className={cn(
                    "text-lg font-medium text-[#333]",
                    step === 2 && "text-opacity-0",
                  )}
                >
                  {step === 3 && "Payment successful"}
                  {step === 2 && "Withdraw Cash"}
                  {step === 1 && "Withdraw fund"}
                  {step === 0 && "Withdraw fund"}
                </DialogTitle>
                <DialogDescription className="sr-only text-white">
                  Transaction ID
                </DialogDescription>
                <span
                  onClick={() => {
                    setOpen(false);
                    setStep(0);
                  }}
                  className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
                >
                  <X size={20} />
                </span>
              </DialogHeader>
              <div
                className={cn(
                  "mt-16",
                  step === 2 && "mt-0",
                  step === 3 && "mt-8",
                )}
              />

              <WithdrawalStepper />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          {/* MOBILE */}

          <div
            className={cn(
              "fixed left-0 top-0 h-svh w-full overflow-y-auto bg-white px-4 pb-8 pt-24",
              open ? "block" : "hidden",
            )}
          >
            <div className="h-min">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-4">
                  <span
                    className="cursor-pointer"
                    onClick={() =>
                      setStep((prev: number) => (prev >= 1 ? prev - 1 : prev))
                    }
                  >
                    <ArrowLeft size="24" />
                  </span>
                  <h3 className="text-lg font-medium text-[#333333]">
                    {step === 2 ? "Payment successful" : "Withdraw"}
                  </h3>
                </div>
                <span
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
                >
                  <X size={20} />
                </span>
              </div>

              <div className="mt-11">
                <WithdrawalStepper />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateWithdrawal;
