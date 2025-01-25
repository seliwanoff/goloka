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
import { validateTopUp } from "@/services/organization";
import { useSearchParams } from "next/navigation";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";

const ConfirmFunding = () => {
  const { setOpen } = useWithdrawOverlay();
  const { step, setStep } = useWithdrawStepperOrganization();
  const amount = localStorage.getItem("amount");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const searchParams = useSearchParams();
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const USER_CURRENCY_SYMBOL =
    currentOrganization && currentOrganization["symbol"];

  const handleProceed = async () => {
    const ref = searchParams.get("reference");
    const trxref = searchParams.get("trxref");
    setIsSubmitting(true);

    try {
      const response = await validateTopUp(amount, trxref, ref);

      if (response) {
        setStep((prev: number) => prev + 1);
      }
    } catch (err: any) {
      console.error("Error during validation:", err);
      toast.error(err.message || "An error occurred during validation.");
    } finally {
      setIsSubmitting(false);
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
          <Import size={28} onClick={handleClose} />
        </span>
        <h3 className="mb-3.5 mt-4 text-center text-base font-semibold text-black">
          Fund wallet
        </h3>
        <p className="text-center text-[#333333]">
          Kindly confirm your{" "}
          <strong>
            {USER_CURRENCY_SYMBOL}
            {amount}
          </strong>
          <br className="hidden sm:block" />
          deposit.
        </p>

        <div className="mt-10 grid w-full gap-6">
          <Button
            onClick={handleProceed}
            // type="submit"
            className="h-12 rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
          >
            {isSubmitting ? (
              <Loader className="animate-spin text-[#fff]" />
            ) : (
              " Confirm fund"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ConfirmFunding;
