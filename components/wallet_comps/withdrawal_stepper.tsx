import { useWithdrawStepper } from "@/stores/misc";
import ConfirmWithdrawal from "./confirm_withdraw";
import FundWithdraw from "./fund_withdrawal";
import SelectBeneficiary from "./select_beneficiary";
import PaymentSuccessful from "./payment_successful";
import { useMediaQuery } from "@react-hook/media-query";
import WithdrawPin from "./pinModal";

const WithdrawalStepper = () => {
  const { step } = useWithdrawStepper();
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const stepper = () => {
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
