import { cn } from "@/lib/utils";
import { useState } from "react";
import OTPInput from "react-otp-input";
import { Button } from "../ui/button";
import { useTransferStepper } from "@/stores/misc";
import { useTransactionStore } from "@/stores/useTransferStore";

const TransferPin = () => {
  const { submitTransaction, loading, error, response, setPin } =
    useTransactionStore();
  const { setStep } = useTransferStepper();
  const [otp, setOtp] = useState("");

  const handleBack = () => {};

  const handleProceed = async () => {
    setPin(otp);

    console.log("Entered PIN:", otp);
    await submitTransaction();
    if (!loading && response) {
      console.log(response);
      setStep(3);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold"></h3>
      <div className="">
        <div className="mb-8 text-center">
          <h3 className="text-lg font-medium">Input Transfer PIN</h3>
          <p className="text-sm text-gray-500">
            Input your PIN to confirm this transaction.
            <br />
            Click forgot pin to reset your pin.
          </p>
        </div>
        <div className="mx-auto my-10 flex justify-center md:max-w-96">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            // isInputNum
            shouldAutoFocus
            inputStyle={cn(
              "w-[100%_!important] rounded border border-[#E7E7E7] caret-main-100 h-[55px] bg-[#F9F9F9] outline-0 focus:border focus:border-[#C0CFF6] focus:border-opacity-55 focus:bg-[#F5F8FF]",
            )}
            containerStyle={{
              width: "100%",
              display: "grid",
              columnGap: "10px",
              gridTemplateColumns: "repeat(4, 1fr)",
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        <div className="mb-8 text-center">
          <button className="text-main-100 hover:underline">Forgot PIN</button>
        </div>

        <div className="mt-10 grid w-full grid-cols-2 gap-6">
          <Button
            type="button"
            onClick={handleBack}
            variant="outline"
            className="h-12 rounded-full border-main-100 py-3 text-main-100 hover:border-current hover:text-current"
          >
            Cancel
          </Button>
          <Button
            onClick={handleProceed}
            disabled={!otp}
            className="h-12 rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
          >
            Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransferPin;
