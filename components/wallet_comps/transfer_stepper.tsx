import { useShowPin, useTransferStepper } from "@/stores/misc";
import FundWithdraw from "./fund_withdrawal";
import PaymentSuccessful from "./payment_successful";
import { useMediaQuery } from "@react-hook/media-query";
import ConfirmTransfer from "./confirm_transfer";
import FundTransfer from "./fund_transfer";
import TransferSuccessful from "./transfer_successful";
import TransferPin from "./transferPinModal";
import { useUserStore } from "@/stores/currentUserStore";
import { useEffect } from "react";
import { toast } from "sonner";
import CreatePinComponent from "./createPin/createPinComponent";

const TransferStepper = () => {
  const { step, setStep } = useTransferStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");
      const { user: currentUser } = useUserStore();
      const { showPin, setShowPin, setOnPinCreated } = useShowPin();
  const refetchUser = useUserStore((state) => state.refetchUser);

  console.log(showPin, "showPin");
  console.log(currentUser, "currentUser");

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
      }, [
        step,
        currentUser?.pin_status,
        setOnPinCreated,
        refetchUser,
        setStep,
      ]);

  const stepper = () => {
    switch (step) {
      case 0:
        return <FundTransfer />;
      case 1:
        return showPin ? <CreatePinComponent /> : <TransferPin />;
      case 2:
        return <ConfirmTransfer />;
      case 3:
        return <TransferSuccessful />;
    }
  };

  const stepperMobile = () => {
    switch (step) {
      case 0:
        return <FundTransfer />;
      case 1:
   return showPin ? <CreatePinComponent /> : <TransferPin />;
      case 2:
        return <ConfirmTransfer />;
      case 3:
        return <TransferSuccessful />;
    }
  };

  return <>{isDesktop ? stepper() : stepperMobile()}</>;
};

export default TransferStepper;
