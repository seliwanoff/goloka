import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ITransaction, useWithdrawStepper } from "@/stores/misc";
import { useWithdrawOverlay } from "@/stores/overlay";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMediaQuery } from "@react-hook/media-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ConfirmWithdrawal from "./confirm_withdraw";
import { X } from "lucide-react";

const schema = yup.object().shape({
  amount_usd: yup.string().required(),
  amount_ngn: yup.string().required(),
});

const FundWithdraw = () => {
  const [showModal, setShowModal] = useState(false);
  const { step, setStep, transaction, setTransaction } = useWithdrawStepper();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onWithdrawal = (data: any) => {
    setTransaction((prev: ITransaction) => {
      return {
        ...prev,
        ...data,
      };
    });

    if (isMobile) {
      setShowModal(true);
    } else {
      setStep((prev: number) => prev + 1);
    }
    console.log(data, transaction, "Withdrawal");
  };

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          How much do you want to
          <br /> withdraw?
        </h3>

        <div className="mt-12">
          <form id="fund-withdrawal" onSubmit={handleSubmit(onWithdrawal)}>
            <Input
              {...register("amount_usd")}
              id="amount_usd"
              defaultValue="$32"
              aria-label="amount_usd"
              className={cn(
                "form-input flex h-20 items-center justify-center rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-center text-[2rem] font-bold text-[#09091A] focus-visible:border-main-100 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                errors.amount_usd &&
                  "border-red-600 focus-visible:ring-red-600",
              )}
            />
            <div className="mt-6">
              <Label
                htmlFor="amount_ngn"
                className="mb-2 block text-base text-[#4F4F4F]"
              >
                Amount you will get in Naira (<strong>₦</strong>)
              </Label>
              <Input
                {...register("amount_ngn")}
                id="amount_ngn"
                name="amount_ngn"
                defaultValue={"₦120,057"}
                className={cn(
                  "form-input h-12 rounded-lg border border-[#D9DCE0] px-4 py-[18px] text-base font-semibold text-[#071E3B] focus-visible:border-main-100 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.amount_usd &&
                    "border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>
            <div className="mt-14 grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => setStep((prev: number) => prev - 1)}
                variant="outline"
                className="h-12 rounded-full border-main-100 py-3 text-main-100 hover:border-current hover:text-current"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="h-12 rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
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
