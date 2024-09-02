import { useWithdrawStepper } from "@/stores/misc";
import ConfirmWithdrawal from "./confirm_withdraw";
import FundWithdraw from "./fund_withdrawal";
import SelectBeneficiary from "./select_beneficiary";
import PaymentSuccessful from "./payment_successful";

const WithdrawalStepper = () => {
  const { step } = useWithdrawStepper();
  const stepper = () => {
    switch (step) {
      case 0:
        return <SelectBeneficiary />;
      case 1:
        return <FundWithdraw />;
      case 2:
        return <ConfirmWithdrawal />;
      case 3:
        return <PaymentSuccessful />;
    }
  };

  return <>{stepper()}</>;
};

export default WithdrawalStepper;
