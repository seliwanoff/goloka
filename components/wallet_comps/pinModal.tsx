import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { Button } from "../ui/button";
import { useShowPin, useWithdrawStepper } from "@/stores/misc";
import { useWalletStore } from "@/stores/useWithdrawal";
import { useUserStore } from "@/stores/currentUserStore";
import CreatePinStepper from "./createPin/createPinStepper";
import CreatePinComponent from "./createPin/createPinComponent";

const WithdrawPin = () => {
  const { submitTransaction, loading, error, response, setPin } =
    useWalletStore();
  const { user: currentUser } = useUserStore();
  const { showPin, setShowPin } = useShowPin();
  const { setStep } = useWithdrawStepper();
  const [otp, setOtp] = useState("");

  const handleBack = () => {
    setPin("");
    setStep(1);
  };

  // useEffect(() => {
  //   if (currentUser?.pin_status === true) {
  //     setShowPin(true);
  //   }
  // }, [currentUser?.pin_status]);

  const handleProceed = async () => {
    setPin(otp);

    console.log("Entered PIN:", otp);
    await submitTransaction();
    // if (!loading && response) {
    //   console.log(response);
    //   setStep(3);
    // }
  };

  return (
    // <CreatePinComponent />
    <div>
      <h3 className="text-xl font-semibold"></h3>
      <div className="">
        <div className="mb-8 text-center">
          <h3 className="text-lg font-medium">Input cash withdraw PIN</h3>
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
            {loading ? "Processing..." : "Submit Transaction"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPin;
