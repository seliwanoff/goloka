"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWithdrawalfundsOverlay } from "@/stores/overlay";
import { cn } from "@/lib/utils";

import { ArrowLeft } from "iconsax-react";
import WithdrawFunds from "../widgets/withdraw_fund";
import ConfirmWithdrawalOrganization from "@/components/wallet_comps/confirm_organization_withdraw";
import TopUpSuccessful from "@/components/wallet_comps/top_up_success";
import { useWithdrawStepperOrganization } from "@/stores/misc";
import ConfirmFunding from "@/components/wallet_comps/confirm_funding";

const WithdrawFund = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const { open, setOpen } = useWithdrawalfundsOverlay();
  const { step, setStep } = useWithdrawStepperOrganization();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setIsDesktop(window.matchMedia("(min-width: 640px)").matches);
  }, []);

  if (!hydrated) return null;

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="overflow-hidden rounded-lg border-0 focus-visible:outline-none">
            <DialogHeader
              className={cn(
                "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
              )}
            >
              <DialogTitle className="text-lg font-medium text-[#333]">
                {step === 0 && "Fund Wallet"}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {step === 0 && "Fund Wallet"}
              </DialogDescription>
              <span
                onClick={() => setOpen(false)}
                className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
              >
                <X size={20} />
              </span>
            </DialogHeader>
            <div className="mt-16">
              {step === 0 && <WithdrawFunds />}
              {step === 1 && <ConfirmWithdrawalOrganization />}
              {step === 2 && <ConfirmFunding />}
              {step === 3 && <TopUpSuccessful />}
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div
          className={cn(
            "fixed left-0 top-0 h-svh w-full overflow-y-auto bg-white px-4 pb-8 pt-24",
            open ? "block" : "hidden",
          )}
        >
          <div className="h-min">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-4">
                <span className="cursor-pointer" onClick={() => setOpen(false)}>
                  <ArrowLeft size="24" />
                </span>
                <h3 className="text-lg font-medium text-[#333333]">
                  Withdraw fund
                </h3>
              </div>
              <span
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
              >
                <X size={20} />
              </span>
            </div>
            <div className="mt-11">
              {step === 0 && <WithdrawFunds />}
              {step === 1 && <ConfirmWithdrawalOrganization />}
              {step === 2 && <TopUpSuccessful />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrawFund;
