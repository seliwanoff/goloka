import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { ITransaction, useWithdrawStepper } from "@/stores/misc";
import { useAddBeneficiaryOverlay, useWithdrawOverlay } from "@/stores/overlay";
import { Add } from "iconsax-react";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useMemo,
  useState,
} from "react";
import AddBeneficiary from "../lib/widgets/add_beneficiary";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getContributorsProfile } from "@/services/contributor";
// import { useNavigate } from "react-router-dom";

const SelectBeneficiary = () => {
  const { setOpen } = useWithdrawOverlay();
  const { show, setShow } = useAddBeneficiaryOverlay();
  const { setStep, setTransaction, transaction } = useWithdrawStepper();
  const [selectedValue, setSelectedValue] = useState("");
  // const navigate = useNavigate();

  const { data: remoteUser, isLoading } = useQuery({
    queryKey: ["Get remote user"],
    queryFn: getContributorsProfile,
  });

  const beneficiaries = useMemo(
    //@ts-ignore
    () => remoteUser?.data?.bank_accounts,
    [remoteUser?.data],
  );

  const handleProceed = () => {
    if (selectedValue) {
      setStep(1);
      // navigate(`/withdraw?beneficiary=${selectedValue}`);
    }
  };

  const handleAddBeneficiary = () => {
    setOpen(false);
    setShow(true);
  };

  useEffect(() => {
    const selected = beneficiaries?.find((item: { id: string; }) => item?.id === selectedValue);

    if (selected) {
      setTransaction((prev) => ({
        ...prev,
        beneficiary: selected?.name,
        accountNumber: selected?.accountNumber,
        bank: selected?.bank,
      }));
    }
  }, [selectedValue, beneficiaries]);

  useEffect(() => {
    if (transaction && beneficiaries) {
      const selected = beneficiaries.find(
        (item: { accountNumber: string | number; }) => item?.accountNumber === transaction?.accountNumber,
      );

      setSelectedValue(selected?.id || "");
    }
  }, [transaction, beneficiaries]);

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Select beneficiary account before
          <br /> proceeding
        </h3>

        <div className="mt-12 h-[245px] overflow-y-auto">
          <div className="p-1">
            {isLoading ? (
              <BeneficiarySkeletonLoader count={3} />
            ) : (
              <RadioGroup
                value={selectedValue}
                onValueChange={setSelectedValue}
                className="gap-6"
              >
                {beneficiaries?.map((item: { id: string | undefined; account_name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; account_number: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; bank_name: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; }, i: Key | null | undefined) => (
                  <div className="flex w-full items-center" key={i}>
                    <RadioGroupItem
                      value={item.id}
                      id={item.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={item.id}
                      className={cn(
                        "grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3",
                        selectedValue === item?.id &&
                          "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                      )}
                    >
                      <h4
                        className={cn(
                          "text-sm font-medium text-[#4F4F4F]",
                          selectedValue === item?.id && "text-main-100",
                        )}
                      >
                        {item?.account_name}
                      </h4>
                      <p
                        className={cn(
                          "justify-self-end text-right text-sm font-semibold text-[#333]",
                          selectedValue === item?.id && "text-main-100",
                        )}
                      >
                        {item.account_number}
                      </p>
                      <p
                        className={cn(
                          "text-xs text-[#4F4F4F]",
                          selectedValue === item?.id && "text-main-100",
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
        className="mx-auto h-14 w-full rounded-full bg-main-100 p-3 text-base text-white hover:bg-blue-700 hover:text-white"
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
