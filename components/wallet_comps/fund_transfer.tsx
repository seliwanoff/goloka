import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAddBeneficiaryOverlay } from "@/stores/overlay";
import { useMediaQuery } from "@react-hook/media-query";
import { ITransfer, useTransferStepper } from "@/stores/misc";
import ConfirmTransfer from "./confirm_transfer";
import { X } from "lucide-react";

const schema = yup.object().shape({
  walletID: yup.string().required(),
  organisation: yup.string().required(),
  amount: yup.string().required(),
});

const FundTransfer = () => {
  const [openModal, setOpenModal] = useState(false);
  const { step, setStep, setTransaction } = useTransferStepper();

  const [amt, setAmt] = useState("$0");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange = (val: any) => {
    const inputVal = val;
    const formattedVal = inputVal.replace(/\$/g, "");
    setAmt(`$${formattedVal}`);
  };

  const onTransferMonday = (data: any) => {
    setTransaction((prev: ITransfer) => {
      return {
        ...prev,
        ...data,
        amount: amt,
      };
    });

    if (isMobile) {
      setOpenModal(true);
    } else {
      setStep(1);
    }
    console.log(data, "New Transfer funds");
    // setShow(false);
    // reset();
  };
  console.log(step, "fund");

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Input the wallet ID of the organisation
          <br /> wallet
        </h3>

        <div className="mt-12">
          <form
            id="transfer-funds"
            onSubmit={handleSubmit(onTransferMonday)}
            className="space-y-6"
          >
            {/* Wallet ID */}
            <div>
              <Label
                htmlFor="accountNumber"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Wallet ID
              </Label>
              <Input
                {...register("walletID")}
                id="walletID"
                name="walletID"
                placeholder="Input number"
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors?.walletID &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>
            {/* ORGANISATION */}
            <div>
              <Label
                htmlFor="organisation"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Organisation name
              </Label>
              <Input
                {...register("organisation")}
                id="organisation"
                name="organisation"
                placeholder="Input name"
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.organisation &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>

            {/* AMOUNT */}
            <div>
              <Label
                htmlFor="amount"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Amount
              </Label>
              <Input
                {...register("amount")}
                id="amount"
                name="amount"
                value={amt}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Input name"
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] font-semibold outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.amount &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>

            <div>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
              >
                Transfer money
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* CONFIRM TRANSFER MOBILE */}
      {isMobile && (
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogContent className="overflow-hidden rounded-lg border-0 focus-visible:outline-none">
            <DialogHeader
              className={cn(
                "absolute left-0 top-0 z-10 w-full space-y-0 border-0 border-[#F2F2F2] bg-white p-5 text-left",
              )}
            >
              <DialogTitle
                className={cn("text-lg font-medium text-[#333] text-opacity-0")}
              >
                Confirm Withdraw
              </DialogTitle>
              <DialogDescription className="sr-only text-white">
                Transaction ID
              </DialogDescription>
              <span
                onClick={() => setOpenModal(false)}
                className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
              >
                <X size={20} />
              </span>
            </DialogHeader>
            <div className={cn("mt-0")} />
            <ConfirmTransfer />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default FundTransfer;
