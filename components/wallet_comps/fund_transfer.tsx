import React, { useState, useEffect } from "react";
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
import { X, Loader } from "lucide-react";
import { getOrganizationInfo } from "@/services/wallets";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRemoteUserStore } from "@/stores/remoteUser";
import { useTransactionStore } from "@/stores/useWithdrawal";

interface FormData {
  walletID: string;
  organisation: string;
  amount: string;
}

const schema = yup.object().shape({
  walletID: yup
    .string()
    .matches(/^\d{10}$/, "Wallet ID must be 10 digits")
    .required("Wallet ID is required"),
  organisation: yup.string().required("Organisation name is required"),
  amount: yup.string().required("Amount is required"),
});

const FundTransfer = () => {
  const { setAmount } = useTransactionStore();
  const { user, isAuthenticated } = useRemoteUserStore();
  const [openModal, setOpenModal] = useState(false);
  const { step, setStep, setTransaction } = useTransferStepper();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const USER_CURRENCY_SYMBOL = user?.country?.["currency-symbol"];
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      walletID: "",
      organisation: "",
      amount: "",
    },
  });

  // Watch the walletID field
  const walletID = watch("walletID");

  // Query for organization info
  const {
    data: orgData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["Get organization info", walletID],
    queryFn: async () =>
      walletID && walletID.length === 10
        ? await getOrganizationInfo(walletID)
        : null,
    enabled: walletID?.length === 10,
  });

  // Update organisation name when data is fetched
  useEffect(() => {
    //@ts-ignore
    if (orgData?.data?.name) {
      //@ts-ignore
      setValue("organisation", orgData.data.name);
    } else if (isError) {
      toast.error("Failed to fetch organization Wallet");
      console.log(isError, "isError");
    }
  }, [orgData, setValue]);

  // Handle amount input with proper formatting
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, "");
    if (value) {
      // Format with $ and handle decimals
      value = parseFloat(value).toFixed(2);
      setValue("amount", `${USER_CURRENCY_SYMBOL}${value}`);
    } else {
      setValue("amount", "");
    }
  };

  const onTransferMoney = (data: any) => {
    const formattedData = {
      ...data,
      amount: data.amount,
      //@ts-ignore
      organisationName: orgData?.data?.name || data.organisation,
      //@ts-ignore
      walletId: orgData?.data?.wallet_id || data.walletID,
    };

    console.log("Transfer data:", formattedData);

    setTransaction((prev: ITransfer) => ({
      ...prev,
      ...formattedData,
    }));

    if (isMobile) {
      setOpenModal(true);
    } else {
      setStep(1);
    }
  };

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
            onSubmit={handleSubmit(onTransferMoney)}
            className="space-y-6"
          >
            {/* Wallet ID */}
            <div>
              <Label
                htmlFor="walletID"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Wallet ID
              </Label>
              <Input
                {...register("walletID")}
                id="walletID"
                placeholder="Input 10-digit wallet ID"
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors?.walletID &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
              {errors.walletID && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.walletID.message}
                </p>
              )}
            </div>

            {/* Organisation */}
            <div>
              <Label
                htmlFor="organisation"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Organisation name
              </Label>
              <div className="relative">
                <Input
                  {...register("organisation")}
                  id="organisation"
                  placeholder="Organization name"
                  //@ts-ignore
                  readOnly={!!orgData?.data?.name}
                  className={cn(
                    "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                    errors.organisation &&
                      "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                    isLoading && "bg-gray-100",
                    //@ts-ignore
                    orgData?.data?.name && "bg-gray-50",
                  )}
                />
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <Loader className="animate-spin text-gray-400" size={20} />
                  </div>
                )}
              </div>
              {errors.organisation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.organisation.message}
                </p>
              )}
              {isError && (
                <p className="mt-1 text-sm text-red-600">
                  {"Failed to fetch organization Wallet"}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <Label
                htmlFor="amount"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Amount
              </Label>
              <Input
                {...register("amount")}
                onChange={handleAmountChange}
                id="amount"
                placeholder={`${USER_CURRENCY_SYMBOL} 0.00`}
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] font-semibold outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.amount &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
              {errors.amount && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
                disabled={!isValid}
              >
                Transfer money
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm Transfer Mobile Dialog */}
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
                Confirm Transfer
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
