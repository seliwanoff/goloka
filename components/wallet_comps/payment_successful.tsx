import React from "react";
import { Button } from "../ui/button";
import { cn, walletStatus } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import { useTransferOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { useTransferStepper, useWithdrawStepper } from "@/stores/misc";
import { useWalletStore } from "@/stores/useWithdrawal";
import { formatDate } from "@/helper";
import { useRemoteUserStore } from "@/stores/remoteUser";

type ComponentProps = {};

const PaymentSuccessful: React.FC<ComponentProps> = ({}) => {
  const { user, isAuthenticated } = useRemoteUserStore();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const { setOpen } = useWithdrawOverlay();
  const { setStep, clearTransaction } = useWithdrawStepper();
  const { response, error } = useWalletStore();

  const handleComplete = () => {
    clearTransaction();
    setStep(0);
    setOpen(false);
  };

  // Extract meta and transaction details
  const beneficiary = response?.meta?.beneficiary || {};
  const amount = Math.abs(response?.amount || 0);
  const createdAt = response?.created_at || new Date().toISOString();
  const reference = response?.reference || "N/A";
  const status = response?.status || "completed";

  return (
    <div>
      <span className="relative z-20 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#27AE60]">
        <TickCircle size="56" variant="Bold" />
      </span>
      <h3 className="mb-2 mt-3 text-center text-base font-semibold text-black">
        Withdrawal successful
      </h3>
      <p className="text-center text-[#333333]">
        The money will reflect in your bank after <br />
        few minutes
      </p>

      <div className="mt-6 grid grid-cols-2 items-center">
        <div className="">
          <h3 className="font-bold text-[#101828]">
            {USER_CURRENCY_SYMBOL}{" "}
            {Math.abs(
              parseFloat((amount as unknown as string) || "0"),
            ).toLocaleString()}
          </h3>
          <p className="text-sm text-[#828282]">Amount</p>
        </div>
        <span
          className={cn(
            "justify-self-end rounded-full px-4 py-2 text-xs capitalize",
            walletStatus(status),
          )}
        >
          {status}
        </span>

        <div className="col-span-2 mt-6 rounded-lg border border-[#F2F2F2] bg-[#f8f8f8] p-6">
          <span className="inline-block rounded-full border bg-white p-2 px-4 text-sm text-[#333]">
            Transaction summary
          </span>

          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Beneficiary</span>
              <span className="justify-self-end text-right text-sm font-medium text-[#333]">
                {beneficiary.account_name || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Bank</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {beneficiary.bank_name || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Account number</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {beneficiary.account_number || "N/A"}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Date</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {formatDate(createdAt, "DD/MM/YYYY")}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Reference</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {reference}
              </span>
            </div>
          </div>
        </div>

        <div className="col-span-2 mt-4 grid gap-4">
          <Button
            onClick={handleComplete}
            className="h-11 items-center gap-3 rounded-full bg-main-100 text-sm font-medium text-white hover:bg-blue-700 hover:text-blue-50"
          >
            Okay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
