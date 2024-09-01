import { Import } from "iconsax-react";
import React from "react";
import { Button } from "../ui/button";
import { useWithdrawOverlay } from "@/stores/overlay";
import { useWithdrawStepper } from "@/stores/misc";
import { useMediaQuery } from "@react-hook/media-query";

const ConfirmWithdrawal = () => {
  const { setOpen } = useWithdrawOverlay();
  const { step, setStep, clearTransaction } = useWithdrawStepper();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleProceed = () => {
    if (isMobile) {
      setStep((prev: number) => prev + 1);
    } else {
      setStep(3);
    }
  };

  const handleClose = () => {
    setOpen(false);
    clearTransaction();
    setStep(0);
  };

  return (
    <>
      <div className="">
        <span className="relative z-20 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2994A14] text-[#F2994A]">
          <Import size={28} />
        </span>
        <h3 className="mb-3.5 mt-4 text-center text-base font-semibold text-black">
          Withdraw money
        </h3>
        <p className="text-center text-[#333333]">
          Are you sure you want to withdraw <strong>₦$32</strong> from your{" "}
          <br className="hidden sm:block" />
          wallet?
        </p>

        <div className="mt-10 grid w-full grid-cols-2 gap-6">
          <Button
            type="button"
            onClick={handleClose}
            variant="outline"
            className="h-12 rounded-full border-main-100 py-3 text-main-100 hover:border-current hover:text-current"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            // type="submit"
            className="h-12 rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
          >
            Proceed
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmWithdrawal;
