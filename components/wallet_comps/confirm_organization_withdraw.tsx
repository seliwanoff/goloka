import { Import } from "iconsax-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useWithdrawOverlay } from "@/stores/overlay";
import {
  useWithdrawStepper,
  useWithdrawStepperOrganization,
} from "@/stores/misc";
import { useMediaQuery } from "@react-hook/media-query";
import { walletFunding } from "@/services/organization/withdraw";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useTopUpStores } from "@/stores/topUpstore";

const ConfirmWithdrawalOrganization = () => {
  const { setOpen } = useWithdrawOverlay();
  const { step, setStep, amount } = useWithdrawStepperOrganization();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProceed = async () => {
    setIsSubmitting(true);

    try {
      const res = await walletFunding(amount);
      toast.success("Payment link generated");
      setIsSubmitting(false);

      setOpen(res.payment_url);
      setOpen(false);
      window.open(res.payment_url, "_blank");
    } catch (error) {
      toast.error("Failed to initialize payment. Please try again.");
      setIsSubmitting(false);

      //@ts-ignore
      console.error(error?.response?.data?.message);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    //  clearTransaction();
    setStep(0);
  };

  return (
    <>
      <div className="">
        <span className="relative z-20 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#F2994A14] text-[#F2994A]">
          <Import size={28} />
        </span>
        <h3 className="mb-3.5 mt-4 text-center text-base font-semibold text-black">
          Fund wallet
        </h3>
        <p className="text-center text-[#333333]">
          Are you sure you want to fund <strong>₦{amount}</strong> to your{" "}
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
            {isSubmitting ? (
              <Loader className="animate-spin text-[#fff]" />
            ) : (
              " Proceed"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmWithdrawalOrganization;
