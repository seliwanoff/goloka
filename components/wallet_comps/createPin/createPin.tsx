import { cn } from "@/lib/utils";
import { useState } from "react";
import OTPInput from "react-otp-input";

import { useShowPin, useTransferStepper } from "@/stores/misc";
import { useTransactionStore } from "@/stores/useTransferStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updatePin } from "@/services/misc";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
interface PinStepContent {
  title: string;
  description: string;
  value: string;
  onChange: (value: string) => void;
}
const CreatePin = () => {
  const { submitTransaction, error, response, setPin } = useTransactionStore();
  const { showPin, setShowPin, onPinCreated } = useShowPin();
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<number>(0);
  const [currentPin, setCurrentPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [resMessage, setResMessage] = useState<string>("");

  const handleBack = () => {
    if (step === 0) {
      setShowPin(false);
      return;
    } else {
      console.log("back clicked");
      setPin("");
      setStep(1);
    }
  };

  const handleProceed = async () => {
    setPin(otp);
    console.log(response, "response");
    console.log(error, "error");
    console.log("Entered PIN:", otp);
    await submitTransaction();
    if (!loading && response) {
      console.log(response);
      setStep(3);
    }
    if (error) {
      toast.error(error);
    }
  };

  const handleCancel = (): void => {
    setStep(0);
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };
  const validateAndProceed = async (): Promise<void> => {
    setLoading(true);
    try {
      switch (step) {
        // case 0: {
        //   const response = await verifyCurrentPin(currentPin);
        //   if (response) {
        //     setStep(1);
        //   } else {
        //     toast.error("Invalid current PIN");
        //   }
        //   break;
        // }
        case 0: {
          // Validate new PIN requirements
          if (!isValidPin(newPin)) {
            toast.error("PIN must be 4 digits and contain only numbers");
            return;
          }
          setStep(1);
          break;
        }
        case 1: {
          if (newPin !== confirmPin) {
            toast.error("PINs do not match");
            return;
          }
          const response = await updatePin({
            pin: newPin,
            pin_confirmation: confirmPin,
          });
          console.log(response, "response");
          //@ts-ignore
          setResMessage(response?.message);
          if (response) {
            toast.success(
              response?.data?.message || "PIN updated successfully",
            );
            setShowSuccess(true);
            handleCancel();
          } else {
            toast.error("Failed to update PIN");
          }
          break;
        }
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const isValidPin = (pin: string): boolean => {
    const pinRegex = /^\d{4}$/;
    return pinRegex.test(pin);
  };

  const handleSuccessContinue = () => {
    // setShowSuccess(false);
    handleCancel();
    setShowPin(false);

    // Call the callback
    onPinCreated();

    setShowSuccess(false);
    setStep(0);
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  const getStepContent = (): PinStepContent => {
    switch (step) {
      //   case 0:
      //     return {
      //       title: "Enter Current PIN",
      //       description: "Please enter your current PIN to proceed",
      //       value: currentPin,
      //       onChange: setCurrentPin,
      //     };
      case 0:
        return {
          title: "Create New PIN",
          description: "Enter a new 4-digit PIN",
          value: newPin,
          onChange: setNewPin,
        };
      case 1:
        return {
          title: "Confirm New PIN",
          description: "Re-enter your new PIN to confirm",
          value: confirmPin,
          onChange: setConfirmPin,
        };
      default:
        throw new Error("Unknown step");
    }
  };
  const stepContent = getStepContent();

  // If success, show only success view
  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        <div className="flex h-40 w-40 items-center justify-center rounded-full">
          <svg
            width="218"
            height="218"
            viewBox="0 0 118 118"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="59" cy="59" r="59" fill="#3365E3" fill-opacity="0.06" />
            <circle cx="58.9998" cy="59.2943" r="35.8997" fill="#EBF0FC" />
            <circle
              cx="58.9998"
              cy="59.2937"
              r="39.9814"
              fill="#EBF0FC"
              stroke="white"
              stroke-width="2.22634"
            />
            <mask
              id="mask0_1996_177062"
              //   style="mask-type:alpha"
              maskUnits="userSpaceOnUse"
              x="20"
              y="20"
              width="78"
              height="78"
            >
              <circle cx="59" cy="59.294" r="38.6827" fill="white" />
            </mask>
            <g mask="url(#mask0_1996_177062)">
              <path
                d="M58.9976 68.8107C60.648 68.8107 61.9859 67.4727 61.9859 65.8223C61.9859 64.1719 60.648 62.834 58.9976 62.834C57.3472 62.834 56.0093 64.1719 56.0093 65.8223C56.0093 67.4727 57.3472 68.8107 58.9976 68.8107Z"
                fill="#3365E3"
              />
              <path
                d="M70.5122 54.473V52.1813C70.5122 47.2313 69.3205 40.668 58.9989 40.668C48.6772 40.668 47.4855 47.2313 47.4855 52.1813V54.473C42.3522 55.1146 40.6655 57.718 40.6655 64.1163V67.5263C40.6655 75.043 42.9572 77.3346 50.4739 77.3346H67.5239C75.0405 77.3346 77.3322 75.043 77.3322 67.5263V64.1163C77.3322 57.718 75.6455 55.1146 70.5122 54.473ZM58.9989 71.358C55.9372 71.358 53.4622 68.8646 53.4622 65.8213C53.4622 62.7596 55.9555 60.2846 58.9989 60.2846C62.0422 60.2846 64.5355 62.778 64.5355 65.8213C64.5355 68.883 62.0605 71.358 58.9989 71.358ZM50.4739 54.308C50.3272 54.308 50.1989 54.308 50.0522 54.308V52.1813C50.0522 46.8096 51.5739 43.2346 58.9989 43.2346C66.4239 43.2346 67.9455 46.8096 67.9455 52.1813V54.3263C67.7989 54.3263 67.6705 54.3263 67.5239 54.3263H50.4739V54.308Z"
                fill="#3365E3"
              />
            </g>
            <path
              d="M50.552 84.256L48.648 84.96L49.96 86.448L49.032 87.248L47.752 85.568L46.488 87.232L45.576 86.432L46.888 84.944L45 84.24L45.48 83.12L47.224 83.952L47.176 82H48.36L48.312 83.968L50.072 83.12L50.552 84.256Z"
              fill="#3365E3"
            />
            <path
              d="M57.8914 84.256L55.9874 84.96L57.2994 86.448L56.3714 87.248L55.0914 85.568L53.8274 87.232L52.9154 86.432L54.2274 84.944L52.3394 84.24L52.8194 83.12L54.5634 83.952L54.5154 82H55.6994L55.6514 83.968L57.4114 83.12L57.8914 84.256Z"
              fill="#3365E3"
            />
            <path
              d="M65.2308 84.256L63.3267 84.96L64.6388 86.448L63.7108 87.248L62.4307 85.568L61.1667 87.232L60.2548 86.432L61.5667 84.944L59.6788 84.24L60.1588 83.12L61.9028 83.952L61.8547 82H63.0387L62.9907 83.968L64.7507 83.12L65.2308 84.256Z"
              fill="#3365E3"
            />
            <path
              d="M72.5701 84.256L70.6661 84.96L71.9781 86.448L71.0501 87.248L69.7701 85.568L68.5061 87.232L67.5941 86.432L68.9061 84.944L67.0181 84.24L67.4981 83.12L69.2421 83.952L69.1941 82H70.3781L70.3301 83.968L72.0901 83.12L72.5701 84.256Z"
              fill="#3365E3"
            />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900">
            {resMessage.toUpperCase()}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            You can now proceed to perform transactions from your <br /> wallet
            with this pin created
          </p>
        </div>
        <Button
          className="h-12 w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700"
          onClick={handleSuccessContinue}
        >
          Continue
        </Button>
      </div>
    );
  }

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold"></h3>
        <div className="">
          <div className="mb-8 text-center">
            <h2 className="text-lg font-semibold">{stepContent.title}</h2>
            <p className="text-sm text-gray-500">{stepContent.description}</p>
          </div>
          <div className="mx-auto my-10 flex justify-center md:max-w-96">
            <OTPInput
              value={stepContent.value}
              onChange={stepContent.onChange}
              numInputs={4}
              // isInputNum
              shouldAutoFocus
              inputStyle={cn(
                "w-[100%_!important] rounded border border-[#E7E7E7] caret-main-100 h-[55px] bg-[#F9F9F9] outline-0 focus:border focus:border-[#C0CFF6] focus:border-opacity-55 focus:bg-[#F5F8FF]",
              )}
              containerStyle={{
                width: "70%",
                display: "grid",
                columnGap: "10px",
                gridTemplateColumns: "repeat(4, 1fr)",
              }}
              renderInput={(props) => <input {...props} />}
            />
          </div>

          <div className="mt-16 grid w-full grid-cols-2 gap-6">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              className="h-12 rounded-full border-main-100 py-3 text-main-100 hover:border-current hover:text-current"
            >
              Cancel
            </Button>
            <Button
              className="h-12 rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
              onClick={validateAndProceed}
              disabled={stepContent.value.length !== 4}
            >
              {loading
                ? "Processing..."
                : step === 2
                  ? "Update PIN"
                  : "Continue"}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {/* <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <div className="flex flex-col items-center justify-center space-y-6 py-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  PIN Updated Successfully
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Your PIN has been successfully updated. You can now use your
                  new PIN for transactions.
                </p>
              </div>
              <Button
                className="h-12 w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700"
                onClick={handleSuccessContinue}
              >
                Continue
              </Button>
            </div>
          </DialogContent>
        </Dialog> */}
    </>
  );
};

export default CreatePin;

const verifyCurrentPin = async (pin: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // assume PIN "1234" is valid
  return pin === "1234";
};

const mockUpdatePin = async (pin: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return true;
};
