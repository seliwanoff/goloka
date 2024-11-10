import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ITransaction, useWithdrawStepper } from "@/stores/misc";
import { useMediaQuery } from "@react-hook/media-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ConfirmWithdrawal from "./confirm_withdraw";
import { X } from "lucide-react";

import { useRemoteUserStore } from "@/stores/contributors";
import { getContributorsProfile } from "@/services/contributor";
import { useQuery } from "@tanstack/react-query";

import { useBeneficiaryStore } from "@/stores/currentUserStore";
import { useWalletStore } from "@/stores/useWithdrawal";

const schema = yup.object().shape({
  amount: yup.string().required(),
  amount_ngn: yup.string().required(),
});

const FundWithdraw = () => {
  const { setAmount } = useWalletStore();
  const [showModal, setShowModal] = useState(false);
  const beneficiary = useBeneficiaryStore((state) => state.beneficiaries);
  const { data: remoteUser } = useQuery({
    queryKey: ["Get remote user"],
    queryFn: getContributorsProfile,
  });
  const { user } = useRemoteUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const { step, setStep, transaction, setTransaction } = useWithdrawStepper();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [inputValue, setInputValue] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  console.log(user, "user");
  console.log(remoteUser, "remoteUser");
  const watchAmount = watch("amount");
  //@ts-ignore
  const USER_CURRENCY_SYMBOL = remoteUser?.data?.country?.["currency-symbol"];
  //@ts-ignore
  const USER_CURRENCY_CODE = remoteUser?.data?.country?.["currency-code"];
  //@ts-ignore
  const USER_BALANCE = remoteUser?.data?.wallet_balance;

  const beneficiaries = beneficiary?.[0] || null;

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout); // Cleanup
  }, []);

  const formatCurrency = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return `${USER_CURRENCY_SYMBOL} 0.00`;
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: USER_CURRENCY_CODE,
    }).format(number);
  };

  // const formatNumber = (value: string) => {
  //   const number = parseFloat(value.replace(/[^0-9.-]+/g, ""));
  //   if (isNaN(number)) return "0";
  //   return number.toLocaleString("en-US", {
  //     minimumFractionDigits: 2,
  //     maximumFractionDigits: 2,
  //   });
  // };

  const onWithdrawal = (data: any) => {
    setTransaction((prev) => ({
      ...prev,
      ...data,
    }));

    if (isMobile) {
      setShowModal(true);
    } else {
      setStep((prev) => prev + 1);
    }
    console.log(data, transaction, "Withdrawal");
  };

  console.log(watchAmount, "ccc");
  const showLoader = !beneficiaries || isLoading;
  console.log(parseFloat(watchAmount) > USER_BALANCE, "USER_CURRENCY");

  const handleWithdraw = () => {
    setAmount(parseFloat(inputValue));
    console.log(parseFloat(inputValue), "parseFloat(inputValue)");
    // if (parseFloat(inputValue)) {
    setStep(2);
    // }
  };
  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          How much do you want to
          <br /> withdraw?
        </h3>

        <div className="mt-12">
          <form
            id="fund-withdrawal"
            onSubmit={handleSubmit(onWithdrawal)}
            className="space-y-8"
          >
            <div className="align-center flex w-full items-center gap-4 rounded-full bg-gradient-to-l from-[#3365E3] to-[#1C387D] p-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 11.1504H7"
                    stroke="#3365E3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 11.1498V6.52985C2 4.48985 3.65 2.83984 5.69 2.83984H11.31C13.35 2.83984 15 4.10984 15 6.14984"
                    stroke="#3365E3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17.48 12.2004C16.98 12.6804 16.74 13.4204 16.94 14.1804C17.19 15.1104 18.11 15.7004 19.07 15.7004H20V17.1504C20 19.3604 18.21 21.1504 16 21.1504H6C3.79 21.1504 2 19.3604 2 17.1504V10.1504C2 7.94039 3.79 6.15039 6 6.15039H16C18.2 6.15039 20 7.95039 20 10.1504V11.6003H18.92C18.36 11.6003 17.85 11.8204 17.48 12.2004Z"
                    stroke="#3365E3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22.0002 12.6196V14.6796C22.0002 15.2396 21.5402 15.6996 20.9702 15.6996H19.0402C17.9602 15.6996 16.9702 14.9097 16.8802 13.8297C16.8202 13.1997 17.0602 12.6096 17.4802 12.1996C17.8502 11.8196 18.3602 11.5996 18.9202 11.5996H20.9702C21.5402 11.5996 22.0002 12.0596 22.0002 12.6196Z"
                    stroke="#3365E3"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#fff]">Wallet balance</p>
                <p className="font-bold text-[#fff]">
                  {formatCurrency(USER_BALANCE)}
                </p>
              </div>
            </div>
            <div className="p-1">
              {showLoader ? (
                <BeneficiarySkeletonLoader count={1} />
              ) : (
                <div>
                  <div
                    className="flex w-full items-center"
                    key={beneficiaries?.id}
                  >
                    <div />
                    <Label
                      htmlFor={beneficiaries.id.toString()}
                      className={cn(
                        "grid w-full cursor-pointer grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3 transition-all duration-200 hover:bg-gray-50",
                        beneficiaries.id.toString() &&
                          "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                      )}
                    >
                      <h4
                        className={cn(
                          "text-sm font-medium text-[#4F4F4F]",
                          beneficiaries.id.toString() && "text-main-100",
                        )}
                      >
                        {beneficiaries.account_name}
                      </h4>
                      <p
                        className={cn(
                          "justify-self-end text-right text-sm font-semibold text-[#333]",
                          beneficiaries.id.toString() && "text-main-100",
                        )}
                      >
                        {beneficiaries.account_number}
                      </p>
                      <p
                        className={cn(
                          "text-xs text-[#4F4F4F]",
                          beneficiaries.id.toString() && "text-main-100",
                        )}
                      >
                        {beneficiaries.bank_name}
                      </p>
                    </Label>
                  </div>
                </div>
              )}
            </div>
            {USER_BALANCE === 0 ? (
              <div className="flex flex-col items-center space-y-6">
                <div>
                  <svg
                    width="118"
                    height="118"
                    viewBox="0 0 118 118"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="59"
                      cy="59"
                      r="59"
                      fill="#3365E3"
                      fill-opacity="0.06"
                    />
                    <circle
                      cx="59.0001"
                      cy="59.2943"
                      r="35.8997"
                      fill="#EBF0FC"
                    />
                    <circle
                      cx="59"
                      cy="59.2937"
                      r="39.9814"
                      fill="#EBF0FC"
                      stroke="white"
                      strokeWidth="2.22634"
                    />
                    <path
                      d="M64.2249 44.2411V51.2078H61.4749V44.2411C61.4749 43.7461 61.0349 43.5078 60.7416 43.5078C60.6499 43.5078 60.5583 43.5261 60.4666 43.5628L45.9283 49.0445C44.9566 49.4111 44.3333 50.3278 44.3333 51.3728V52.6011C42.6649 53.8478 41.5833 55.8461 41.5833 58.1011V51.3728C41.5833 49.1911 42.9216 47.2478 44.9566 46.4778L59.5133 40.9778C59.9166 40.8311 60.3383 40.7578 60.7416 40.7578C62.5749 40.7578 64.2249 42.2428 64.2249 44.2411Z"
                      fill="#3365E3"
                    />
                    <path
                      d="M76.4166 63.5827V65.416C76.4166 65.911 76.0316 66.3143 75.5183 66.3327H72.8416C71.8699 66.3327 70.9899 65.6177 70.9166 64.6643C70.8616 64.096 71.0816 63.5643 71.4483 63.1977C71.7783 62.8493 72.2366 62.666 72.7316 62.666H75.4999C76.0316 62.6843 76.4166 63.0877 76.4166 63.5827Z"
                      fill="#3365E3"
                    />
                    <path
                      d="M46.1666 64.5C44.4433 64.5 42.8483 65.105 41.5833 66.1133C39.8966 67.4517 38.8333 69.5233 38.8333 71.8333C38.8333 73.2083 39.2183 74.51 39.8966 75.61C41.1616 77.7367 43.4899 79.1667 46.1666 79.1667C48.0183 79.1667 49.7049 78.4883 50.9883 77.3333C51.5566 76.8567 52.0516 76.27 52.4366 75.61C53.1149 74.51 53.4999 73.2083 53.4999 71.8333C53.4999 67.7817 50.2183 64.5 46.1666 64.5ZM43.2699 70.8433C42.7383 70.3117 42.7383 69.4317 43.2699 68.9C43.8199 68.3683 44.6816 68.3683 45.2316 68.9L46.1849 69.8717L47.1016 68.9367C47.6516 68.405 48.5133 68.405 49.0633 68.9367C49.5949 69.4867 49.5949 70.3483 49.0633 70.8983L48.1283 71.815L49.0999 72.7683C49.6316 73.3183 49.6316 74.18 49.0999 74.73C48.8249 74.9867 48.4766 75.115 48.1283 75.115C47.7799 75.115 47.4316 74.9867 47.1566 74.73L46.1849 73.7583L45.1766 74.7667C44.9016 75.0417 44.5533 75.17 44.2049 75.17C43.8566 75.17 43.5083 75.0417 43.2333 74.7667C42.7016 74.235 42.7016 73.355 43.2333 72.8233L44.2416 71.815L43.2699 70.8433Z"
                      fill="#3365E3"
                    />
                    <path
                      d="M72.7132 60.7423H74.5833C75.5916 60.7423 76.4166 59.9173 76.4166 58.909V58.1023C76.4166 54.3073 73.3183 51.209 69.5233 51.209H48.4766C46.9183 51.209 45.4883 51.7223 44.3333 52.6023C42.6649 53.849 41.5833 55.8473 41.5833 58.1023V61.3657C41.5833 62.0623 42.3166 62.5023 42.9766 62.2823C44.0033 61.934 45.0849 61.7507 46.1666 61.7507C51.7216 61.7507 56.2499 66.279 56.2499 71.834C56.2499 73.154 55.9016 74.6023 55.3516 75.8857C55.0583 76.5457 55.5166 77.334 56.2316 77.334H69.5233C73.3183 77.334 76.4166 74.2357 76.4166 70.4407V70.0923C76.4166 69.084 75.5916 68.259 74.5833 68.259H72.9882C71.2282 68.259 69.5416 67.1773 69.0833 65.4723C68.7166 64.079 69.1566 62.7223 70.0733 61.8423C70.7516 61.1457 71.6866 60.7423 72.7132 60.7423ZM62.6666 60.3757H53.4999C52.7483 60.3757 52.1249 59.7523 52.1249 59.0007C52.1249 58.249 52.7483 57.6257 53.4999 57.6257H62.6666C63.4183 57.6257 64.0416 58.249 64.0416 59.0007C64.0416 59.7523 63.4183 60.3757 62.6666 60.3757Z"
                      fill="#3365E3"
                    />
                  </svg>
                </div>
                <div className="space-y-4">
                  <h3 className="text-center font-bold text-main-100">
                    Insufficient balance
                  </h3>
                  <p className="text-center font-medium text-[#4F4F4F]">
                    The limited amount you can withdraw is ₦500,
                    <br /> contribute on task to increase account balance
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <Input
                  {...register("amount", {
                    onChange: (e) => {
                      let value = e.target.value.replace(/[^0-9.-]+/g, "");
                      setValue("amount", `${USER_CURRENCY_SYMBOL} ${value}`);
                      setInputValue(value);
                    },
                    valueAsNumber: true,
                  })}
                  placeholder={`${USER_CURRENCY_SYMBOL} 0.00`}
                  id="amount"
                  aria-label="amount"
                  className={cn(
                    "form-input flex h-20 items-center justify-center rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-center text-[2rem] font-bold text-[#09091A] focus-visible:border-main-100 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                    errors.amount &&
                      "border-red-600 focus-visible:ring-red-600",
                  )}
                />
                
              </div>
            )}

            <div className="mt-14 grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                variant="outline"
                className="h-12 rounded-full border-main-100 py-3 text-main-100 hover:border-current hover:text-current"
              >
                Back
              </Button>
              <Button
                onClick={handleWithdraw}
                type="submit"
                disabled={!inputValue || parseFloat(inputValue) > USER_BALANCE}
                className="h-12 rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white disabled:opacity-50"
              >
                Withdraw money
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* CONFIRM WITHDRAW MOBILE */}
      {isMobile && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="overflow-hidden rounded-lg border-0 focus-visible:outline-none">
            <DialogHeader
              className={cn(
                "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
                step === 1 && "border-0",
              )}
            >
              <DialogTitle
                className={cn(
                  "text-lg font-medium text-[#333]",
                  step === 1 && "text-opacity-0",
                )}
              >
                Confirm Withdraw
              </DialogTitle>
              <DialogDescription className="sr-only text-white">
                Transaction ID
              </DialogDescription>
              <span
                onClick={() => setShowModal(false)}
                className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
              >
                <X size={20} />
              </span>
            </DialogHeader>
            <div className={cn("mt-16", step === 1 && "mt-0")} />
            <ConfirmWithdrawal />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FundWithdraw;
const BeneficiarySkeletonLoader = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-gray-200 bg-gray-100 p-3">
            <div className="h-4 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 justify-self-end rounded bg-gray-300"></div>
            <div className="h-3 w-1/2 rounded bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
