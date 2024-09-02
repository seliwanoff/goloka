import { Import } from "iconsax-react";
import React from "react";
import { Button } from "../ui/button";
import { useTransferOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { useTransferStepper } from "@/stores/misc";
import { useMediaQuery } from "@react-hook/media-query";

type ComponentProps = {
  setOpenModal?: (open: boolean) => void;
};

const ConfirmTransfer: React.FC<ComponentProps> = ({ setOpenModal }) => {
  const { setOpenTransfer } = useTransferOverlay();
  const { step, setStep, clearTransaction } = useTransferStepper();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleProceed = () => {
    if (isMobile) {
      setStep((prev: number) => prev + 1);
    } else {
      setStep(2);
    }
  };

  const handleClose = () => {
    // isMobile && setOpenModal(false);
    setOpenTransfer(false);
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
          Transfer money
        </h3>
        <p className="text-center text-[#333333]">
          Are you sure you want to transfer
          <strong> ₦$32</strong> to Jamiu&apos;s organisation wallet? You
          can&apos;t withdraw money from organisation wallet{" "}
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

export default ConfirmTransfer;
