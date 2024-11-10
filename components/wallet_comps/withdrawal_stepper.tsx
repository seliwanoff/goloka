import { useShowPin, useWithdrawStepper } from "@/stores/misc";
import ConfirmWithdrawal from "./confirm_withdraw";
import FundWithdraw from "./fund_withdrawal";
import SelectBeneficiary from "./select_beneficiary";
import PaymentSuccessful from "./payment_successful";
import { useMediaQuery } from "@react-hook/media-query";
import WithdrawPin from "./pinModal";
import CreatePinComponent from "./createPin/createPinComponent";
import { useUserStore } from "@/stores/currentUserStore";
import { useEffect } from "react";
import { toast } from "sonner";

const WithdrawalStepper = () => {
  const { step, setStep } = useWithdrawStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");
    const { user: currentUser } = useUserStore();
  const { showPin, setShowPin, setOnPinCreated } = useShowPin();
  const refetchUser = useUserStore((state) => state.refetchUser);

    useEffect(() => {
      if (currentUser?.pin_status === true) {
        setShowPin(true);
      }
  }, [currentUser?.pin_status, setShowPin]);

useEffect(() => {
  if (step === 2 && currentUser?.pin_status) {
    setOnPinCreated(async () => {
      try {

        await refetchUser();
        setStep(2);
      } catch (error) {
        console.error("Error refreshing user data:", error);
        toast.error("Something went wrong. Please try again.");
      }
    });
  }
}, [step, currentUser?.pin_status, setOnPinCreated, refetchUser, setStep]);


  const stepper = () => {
    switch (step) {
      case 0:
        return <SelectBeneficiary />;
      case 1:
        return <FundWithdraw />;
      case 2:
        return showPin ? (
          <CreatePinComponent
          />
        ) : (
          <WithdrawPin />
        );
      case 3:
        return <PaymentSuccessful />;
    }
  };

  const stepperMobile = () => {
    switch (step) {
      case 0:
        return <SelectBeneficiary />;
      case 1:
        return <FundWithdraw />;
      case 2:
        return <WithdrawPin />;
      case 3:
        return <PaymentSuccessful />;
    }
  };

  return <>{isDesktop ? stepper() : stepperMobile()}</>;
};

export default WithdrawalStepper;
