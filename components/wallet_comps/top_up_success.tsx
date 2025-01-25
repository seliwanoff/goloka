import React from "react";
import { Button } from "../ui/button";
import { cn, walletStatus } from "@/lib/utils";
import { TickCircle } from "iconsax-react";
import {
  useTransferOverlay,
  useWithdrawalfundsOverlay,
} from "@/stores/overlay";
import {
  useTransferStepper,
  useWithdrawStepperOrganization,
} from "@/stores/misc";
import { useTransactionStore } from "@/stores/useTransferStore";
import { useUserStore } from "@/stores/currentUserStore";
import { useRemoteUserStore } from "@/stores/remoteUser";
import moment from "moment";
import { useTopUpStores } from "@/stores/topUpstore";

type ComponentProps = {};

const TopUpSuccessful: React.FC<ComponentProps> = ({}) => {
  const { user: currentUser } = useUserStore();

  const { user, isAuthenticated } = useRemoteUserStore();
  const { setOpenTransfer } = useTransferOverlay();
  const { step, setStep, clearTransaction, transaction } = useTransferStepper();
  const { wallet_id, reference, date } = useTopUpStores();
  const { amount } = useWithdrawStepperOrganization();
  const { setOpen } = useWithdrawalfundsOverlay();
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const handleComplete = () => {
    setOpen(false);
    const url = new URL(window.location.href);
    url.search = ""; // Clear the query string
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div>
      <span className="relative z-20 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-[#27AE60]">
        <TickCircle size="56" variant="Bold" />
      </span>
      <h3 className="mb-2 mt-3 text-center text-base font-semibold text-black">
        Payment successful!
      </h3>
      <p className="text-center text-[#333333]">
        You have successfully deposited {amount} to
        <br />
        your wallet
      </p>

      <div className="mt-6 grid grid-cols-2 items-center">
        <div className="col-span-2 mt-6 rounded-lg border border-[#F2F2F2] bg-[#f8f8f8] p-6">
          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Reference</span>
              <span className="justify-self-end text-right text-sm font-medium text-[#333]">
                {reference || "Unknown"}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Date</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {moment(date).format("D/M/YYYY")};
              </span>
            </div>
            {/***
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Wallet ID</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {wallet_id}
              </span>
            </div>
            */}
            <div className="grid grid-cols-2">
              <span className="text-sm text-[#4F4F4F]">Amount Deposited</span>
              <span className="justify-self-end text-sm font-medium text-[#333]">
                {amount}
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

export default TopUpSuccessful;
