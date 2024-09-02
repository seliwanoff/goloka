import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ITransaction, useWithdrawStepper } from "@/stores/misc";
import { useAddBeneficiaryOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { myBeneficiaries } from "@/utils";
import { Add } from "iconsax-react";
import { useEffect, useState } from "react";
import AddBeneficiary from "../lib/widgets/add_beneficiary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { X } from "lucide-react";

const SelectBeneficiary = () => {
  const { setOpen } = useWithdrawOverlay();
  const { show, setShow } = useAddBeneficiaryOverlay();
  const [beneficiaries, setBeneficiaries] = useState(myBeneficiaries);
  const { setStep, setTransaction, transaction } = useWithdrawStepper();
  const [selectedValue, setSelectedValue] = useState("");

  const handleProceed = () => {
    if (selectedValue) {
      setStep(1);
    } else {
      return;
    }
  };

  const handleAddBeneficiary = () => {
    setOpen(false); // close withdraw modal
    setShow(true); // open add beneficiary modal
  };

  useEffect(() => {
    const selected = beneficiaries?.find(
      (item) => item?.value === selectedValue,
    );

    if (selected) {
      setTransaction((prev: ITransaction) => {
        return {
          ...prev,
          beneficiary: selected?.name,
          accountNumber: selected?.accountNumber,
          bank: selected?.bank,
        };
      });
    }
  }, [selectedValue]);

  useEffect(() => {
    if (transaction) {
      const selected = beneficiaries?.find(
        (item) => item?.accountNumber === transaction?.accountNumber,
      );

      setSelectedValue(selected?.value || "");
    }
  }, []);
  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Select beneficiary account before
          <br /> proceeding
        </h3>

        {/* BENEFICIARIES */}
        <div className="no-scrollbar mt-12 h-[245px] overflow-y-auto">
          <div className="p-1">
            <RadioGroup
              defaultValue={selectedValue}
              onValueChange={setSelectedValue}
              className="gap-6"
            >
              {beneficiaries.map((item: any, i: number) => (
                <div className="flex w-full items-center" key={i}>
                  <RadioGroupItem
                    value={item.value}
                    id={item.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={item.value}
                    className={cn(
                      "grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3",
                      selectedValue === item?.value &&
                        "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                    )}
                  >
                    <h4
                      className={cn(
                        "text-sm font-medium text-[#4F4F4F]",
                        selectedValue === item?.value && "text-main-100",
                      )}
                    >
                      {item?.name}
                    </h4>
                    <p
                      className={cn(
                        "justify-self-end text-right text-sm font-semibold text-[#333]",
                        selectedValue === item?.value && "text-main-100",
                      )}
                    >
                      {item.accountNumber}
                    </p>
                    <p
                      className={cn(
                        "text-xs text-[#4F4F4F]",
                        selectedValue === item?.value && "text-main-100",
                      )}
                    >
                      {item.bank}
                    </p>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* ADD BENEFICIARY */}
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
        onClick={() => setStep(1)}
        className="mx-auto h-14 w-full rounded-full bg-main-100 p-3 text-base text-white hover:bg-blue-700 hover:text-white"
      >
        Proceed
      </Button>
    </>
  );
};

export default SelectBeneficiary;
