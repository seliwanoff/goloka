"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { useWithdrawStepper } from "@/stores/misc";
import { useAddBeneficiaryOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { Add } from "iconsax-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getContributorsProfile } from "@/services/contributor";
import { useRouter, useSearchParams } from "next/navigation";
import { useBeneficiaryStore } from "@/stores/use-user-store";

interface Beneficiary {
  id: number;
  bank_code: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

const SelectBeneficiary = () => {
  const { setOpen } = useWithdrawOverlay();
  const { show, setShow } = useAddBeneficiaryOverlay();
  const { addBeneficiary } = useBeneficiaryStore();
  const { setStep, setTransaction, transaction } =
    useWithdrawStepper();
  const [selectedValue, setSelectedValue] = useState("");

  const { data: remoteUser, isLoading } = useQuery({
    queryKey: ["Get remote user"],
    queryFn: getContributorsProfile,
  });

  const beneficiaries = useMemo(
    //@ts-ignore
    () => remoteUser?.data?.bank_accounts,
    [remoteUser?.data],
  );

  // Handle selection change
  const handleSelectionChange = (value: string) => {
    setSelectedValue(value);
    const selected = beneficiaries?.find(
      (item: Beneficiary) => item.id.toString() === value,
    );
    if (selected) {
      setTransaction((prev) => ({
        ...prev,
        beneficiary: selected.account_name,
        accountNumber: selected.account_number,
        bank: selected.bank_name,
      }));
    }
  };

  const handleProceed = () => {
    const selected = beneficiaries?.find(
      (item: Beneficiary) => item.id.toString() === selectedValue,
    );

    if (selected) {
      addBeneficiary(selected);
      setStep(1);
    }
  };

  const handleAddBeneficiary = () => {
    setOpen(false);
    setShow(true);
  };

  console.log({remoteUser})

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Select beneficiary account before proceeding
        </h3>

        <div className="mt-12 h-[245px] overflow-y-auto">
          <div className="p-1">
            {isLoading ? (
              <BeneficiarySkeletonLoader count={3} />
            ) : (
              <RadioGroup
                value={selectedValue}
                onValueChange={handleSelectionChange}
                className="gap-6"
              >
                {beneficiaries?.map((item: Beneficiary) => (
                  <div className="flex w-full items-center" key={item.id}>
                    <RadioGroupItem
                      value={item.id.toString()}
                      id={item.id.toString()}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={item.id.toString()}
                      className={cn(
                        "grid w-full cursor-pointer grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3 transition-all duration-200 hover:bg-gray-50",
                        selectedValue === item.id.toString() &&
                          "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                      )}
                    >
                      <h4
                        className={cn(
                          "text-sm font-medium text-[#4F4F4F]",
                          selectedValue === item.id.toString() &&
                            "text-main-100",
                        )}
                      >
                        {item.account_name}
                      </h4>
                      <p
                        className={cn(
                          "justify-self-end text-right text-sm font-semibold text-[#333]",
                          selectedValue === item.id.toString() &&
                            "text-main-100",
                        )}
                      >
                        {item.account_number}
                      </p>
                      <p
                        className={cn(
                          "text-xs text-[#4F4F4F]",
                          selectedValue === item.id.toString() &&
                            "text-main-100",
                        )}
                      >
                        {item.bank_name}
                      </p>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}
          </div>
        </div>

        <Button
          onClick={handleAddBeneficiary}
          className="my-11 h-14 w-full items-center justify-start gap-3 rounded-full bg-[#F8F8F8] p-3 hover:bg-current"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-[#E0E0E0] bg-[#F4F4F4] text-[#333]">
            <Add size={24} />
          </span>
          <span className="text-base text-[#333]">Add new beneficiary</span>
        </Button>
      </div>

      <Button
        disabled={!selectedValue}
        onClick={handleProceed}
        className="mx-auto h-14 w-full rounded-full bg-main-100 p-3 text-base text-white hover:bg-blue-700 hover:text-white disabled:opacity-50"
      >
        Proceed
      </Button>
    </>
  );
};

export default SelectBeneficiary;

const BeneficiarySkeletonLoader = ({ count = 3 }) => {
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
