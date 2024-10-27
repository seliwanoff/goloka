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
import { useBeneficiaryStore } from "@/stores/use-user-store";
import { useRemoteUserStore } from "@/stores/contributors";

const schema = yup.object().shape({
  amount: yup.string().required(),
  amount_ngn: yup.string().required(),
});

const FundWithdraw = () => {
  const [showModal, setShowModal] = useState(false);
  const beneficiary = useBeneficiaryStore((state) => state.beneficiaries);
  const { user } = useRemoteUserStore();
  const [isLoading, setIsLoading] = useState(true);
  const { step, setStep, transaction, setTransaction } = useWithdrawStepper();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [usdAmount, setUsdAmount] = useState("");
  const [ngnAmount, setNgnAmount] = useState("");

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
  const watchUsdAmount = watch("amount");

  const beneficiaries = beneficiary?.[0] || null;

  // Conversion rate (update this with the current rate)
  const USD_TO_NGN_RATE = 1600;

  const formatUSD = (value: string) => {
    const number = parseFloat(value.replace(/[^0-9.]/g, ""));
    if (isNaN(number)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(number);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timeout); // Cleanup
  }, []);

  const formatNGN = (value: string) => {
    const number = parseFloat(value);
    if (isNaN(number)) return "₦0.00";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(number);
  };

  const convertUsdToNgn = (usd: string) => {
    const numericUsd = parseFloat(usd.replace(/[^0-9.]/g, ""));
    if (!isNaN(numericUsd)) {
      const ngn = numericUsd * USD_TO_NGN_RATE;
      return ngn.toFixed(2);
    }
    return "";
  };

  useEffect(() => {
    if (watchUsdAmount) {
      const numericUsd = parseFloat(watchUsdAmount.replace(/[^0-9.]/g, ""));
      const convertedNgn = convertUsdToNgn(watchUsdAmount);
      setValue("amount", formatUSD(watchUsdAmount));
      setValue("amount_ngn", formatNGN(convertedNgn));
      setUsdAmount(numericUsd.toString());
      setNgnAmount(convertedNgn);
    } else {
      setValue("amount", "");
      setValue("amount_ngn", "");
      setUsdAmount("");
      setNgnAmount("");
    }
  }, [watchUsdAmount, setValue]);

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

  const showLoader = !beneficiaries || isLoading;

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
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2 11.1498V6.52985C2 4.48985 3.65 2.83984 5.69 2.83984H11.31C13.35 2.83984 15 4.10984 15 6.14984"
                    stroke="#3365E3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M17.48 12.2004C16.98 12.6804 16.74 13.4204 16.94 14.1804C17.19 15.1104 18.11 15.7004 19.07 15.7004H20V17.1504C20 19.3604 18.21 21.1504 16 21.1504H6C3.79 21.1504 2 19.3604 2 17.1504V10.1504C2 7.94039 3.79 6.15039 6 6.15039H16C18.2 6.15039 20 7.95039 20 10.1504V11.6003H18.92C18.36 11.6003 17.85 11.8204 17.48 12.2004Z"
                    stroke="#3365E3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M22.0002 12.6196V14.6796C22.0002 15.2396 21.5402 15.6996 20.9702 15.6996H19.0402C17.9602 15.6996 16.9702 14.9097 16.8802 13.8297C16.8202 13.1997 17.0602 12.6096 17.4802 12.1996C17.8502 11.8196 18.3602 11.5996 18.9202 11.5996H20.9702C21.5402 11.5996 22.0002 12.0596 22.0002 12.6196Z"
                    stroke="#3365E3"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-[#fff]">Wallet balance</p>
                <p className="font-bold text-[#fff]">$10,00</p>
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
            <div>
              <Input
                {...register("amount")}
                id="amount"
                placeholder="$ "
                aria-label="amount"
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9.]/g, "");
                  setUsdAmount(value);
                  setValue("amount", formatUSD(value));
                }}
                className={cn(
                  "form-input flex h-20 items-center justify-center rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-center text-[2rem] font-bold text-[#09091A] focus-visible:border-main-100 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.amount && "border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>

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
                type="submit"
                disabled={!ngnAmount}
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
