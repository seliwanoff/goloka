import React from "react";
import { Button } from "../ui/button";
import { cn, walletStatus } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import { useTransferOverlay } from "@/stores/overlay";
import { useTransferStepper } from "@/stores/misc";
import { useTransactionStore } from "@/stores/useTransferStore";
import { useUserStore } from "@/stores/currentUserStore";
import { useRemoteUserStore } from "@/stores/remoteUser";
import moment from "moment";

type ComponentProps = {};

const TransferSuccessful: React.FC<ComponentProps> = ({}) => {
  const { user: currentUser } = useUserStore();

    const { user, isAuthenticated } = useRemoteUserStore();
  const { setOpenTransfer } = useTransferOverlay();
  const { step, setStep, clearTransaction, transaction } = useTransferStepper();
   const { amount, wallet_id } = useTransactionStore();
    const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const handleComplete = () => {
    clearTransaction();
    setStep(0);
    setOpenTransfer(false);
  };

  console.log(step, "step transfer");
  console.log(transaction, "transaction transfer");
  return (
    <div>
      <span className="relative z-20 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#27AE60]">
        <TickCircle size="56" variant="Bold" />
      </span>
      <h3 className="mb-2 mt-3 text-center text-base font-semibold text-black">
        Transfer successful
      </h3>
      <p className="text-center text-[#333333]">
        The money will reflect in your bank after <br />
        few minutes
      </p>

      <div className="mt-6 grid grid-cols-2 items-center">
        <div className="">
          <h3 className="font-bold text-[#101828]">
            {USER_CURRENCY_SYMBOL}
            {amount}
          </h3>
          <p className="text-sm text-[#828282]">Amount</p>
        </div>
        <span
          className={cn(
            "justify-self-end rounded-full px-4 py-2 text-xs capitalize",
            walletStatus("pending"),
          )}
        >
          Pending
        </span>

        <div className="col-span-2 mt-6 rounded-lg border border-[#F2F2F2] bg-[#f8f8f8] p-6">
          <span className="inline-block rounded-full border bg-white p-2 px-4 text-sm text-[#333]">
            Transaction summary
          </span>

          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Beneficiary</span>
              <span className="justify-self-end text-right text-sm font-medium text-[#333]">
                {currentUser?.name || "Unknown"}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">User type</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                Organisation
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Wallet ID</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {wallet_id}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Date</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
             {   moment().format('D/M/YYYY')};
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

export default TransferSuccessful;
