import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWithdrawalfundsOverlay } from "@/stores/overlay";
import { toast } from "sonner";
import { walletFunding } from "@/services/organization/withdraw";
import { resolveAccountInfo } from "@/services/contributor";
import { calculateTotalPrice, numberWithCommas } from "@/helper";
import { useOrganizationStore } from "@/stores/currenctOrganizationStore";

import {
  useWithdrawStepper,
  useWithdrawStepperOrganization,
} from "@/stores/misc";

const schema = yup.object().shape({
  amount: yup.string().required(),
});
const WithdrawFunds = () => {
  const { setOpen } = useWithdrawalfundsOverlay();
  const { setStep, setAmount, actualAmount, setAcrtualAmount } =
    useWithdrawStepperOrganization();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [difference, setDifference] = useState(0);
  const [numericValue, setNumericValue] = useState(0);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // const amount = watch("amount") || 0;
  const currentOrganization = useOrganizationStore(
    (state) => state.organization,
  );

  const onCreateWithdrawal = async (data: any) => {
    if (numericValue >= 500) {
      setStep((prev: number) => prev + 1);
      const { amount } = data;
      setAcrtualAmount(numericValue);
      setAmount(totalPayment);
    } else {
      toast.error("Minimum fund amount is 500");
    }

    /***
    setIsSubmitting(true);

    const { amount } = data;
    try {
      const res = await walletFunding(amount);
      toast.success("Payment link generated");
      setIsSubmitting(false);

      setOpen(res.payment_url);
      setOpen(false);
      window.open(res.payment_url, "_blank");

      reset();
    } catch (error) {
      toast.error("Failed to initialize payment. Please try again.");
      setIsSubmitting(false);

      //@ts-ignore
      console.error(error?.response?.data?.message);
      setOpen(true);
    }
      */
  };

  const USER_CURRENCY_SYMBOL =
    currentOrganization && currentOrganization["symbol"];

  const formatNumberWithCommas = (value: string) => {
    let numericValue = value.replace(/[^\d.]/g, "");

    numericValue = numericValue.replace(/^(\d*\.)(.*)\./g, "$1$2");

    const parts = numericValue.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
    return parts.join(".");
  };
  const calculateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawValue = e.target.value
      .replace(USER_CURRENCY_SYMBOL || "", "")
      .trim();

    rawValue = rawValue.replace(/[^\d.]/g, "");

    rawValue = rawValue.replace(/^(\d*\.)(.*)\./g, "$1$2");

    const formattedValue = formatNumberWithCommas(rawValue);

    setValue("amount", formattedValue, { shouldValidate: true });

    const numericValue = parseFloat(rawValue) || 0; // Default to 0 if NaN

    if (!isNaN(numericValue)) {
      const totalPrice = calculateTotalPrice(numericValue);
      // console.log(totalPrice, "totalPrice");

      setTotalPayment(totalPrice);
      setNumericValue(numericValue);

      const difference = totalPrice - numericValue;
      setDifference(difference);
    }
  };

  return (
    <>
      <div className="">
        <h3 className="text-center font-poppins font-medium text-[#09091A]">
          How much would you like to
          <br /> fund your wallet with?
        </h3>

        <div className="mt-12">
          <form
            id="add_beneficiary"
            onSubmit={handleSubmit(onCreateWithdrawal)}
            className="space-y-6"
          >
            <div>
              <div className="relative">
                <Input
                  {...register("amount")}
                  id="amount"
                  name="amount"
                  placeholder={`${USER_CURRENCY_SYMBOL}${watch("amount") || "0"}`}
                  autoComplete="off"
                  value={
                    watch("amount")
                      ? `${USER_CURRENCY_SYMBOL} ${watch("amount")}`
                      : `${USER_CURRENCY_SYMBOL} `
                  }
                  onChange={calculateAmount}
                  className={cn(
                    "form-input h-14 rounded-[6px] border border-[#E0E0E0] bg-[#F8F8F8] px-4 py-[22px] text-center text-[18px] leading-[38.41px] text-[#09091A] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                    errors.amount &&
                      "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                  )}
                />

                {loading && (
                  <Loader className="absolute right-2 top-2 animate-spin text-blue-700" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-left font-poppins font-medium text-[#09091A]">
                  {USER_CURRENCY_SYMBOL}
                  {numberWithCommas(difference)}
                </span>
                <span className="text-left font-poppins text-[12px] text-gray-600">
                  Transaction charges
                </span>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-right font-poppins font-medium text-[#09091A]">
                  {USER_CURRENCY_SYMBOL}
                  {numberWithCommas(totalPayment)}
                </span>
                <span className="text-right font-poppins text-[12px] text-gray-600">
                  Total payment
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Button
                className="mt-4 h-auto w-full rounded-full border border-main-100 bg-white py-3 text-main-100 hover:bg-blue-950 hover:text-white"
                type="button"
                onClick={() => setOpen(false)}
              >
                Back
              </Button>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
                //  disabled={watch("amount") !== undefined && true}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin text-[#fff]" />
                ) : (
                  " Proceed"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default WithdrawFunds;
