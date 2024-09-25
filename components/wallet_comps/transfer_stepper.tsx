import { useTransferStepper } from "@/stores/misc";
import FundWithdraw from "./fund_withdrawal";
import PaymentSuccessful from "./payment_successful";
import { useMediaQuery } from "@react-hook/media-query";
import ConfirmTransfer from "./confirm_transfer";
import FundTransfer from "./fund_transfer";
import TransferSuccessful from "./transfer_successful";

const TransferStepper = () => {
  const { step } = useTransferStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const stepper = () => {
    switch (step) {
      case 0:
        return <FundTransfer />;
      case 1:
        return <ConfirmTransfer />;
      case 2:
        return <TransferSuccessful />;
    }
  };

  const stepperMobile = () => {
    switch (step) {
      case 0:
        return <FundTransfer />;
      case 1:
        return <TransferSuccessful />;
    }
  };

  return <>{isDesktop ? stepper() : stepperMobile()}</>;
};

export default TransferStepper;
