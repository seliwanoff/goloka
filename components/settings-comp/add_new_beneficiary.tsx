import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import { BankAutocomplete } from "../lib/widgets/bankAutoComplete";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { addBeneficiary, resolveAccountInfo } from "@/services/contributor";
import { toast } from "sonner";
import { useAddBeneficiaryOverlay } from "@/stores/overlay";
import {
  bankList,
  bankOptions,
  beneficiaryStruct,
  currencyOptions,
} from "@/utils";
import { QueryObserverResult, RefetchOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

const getFieldOptions = (name: string) => {
  switch (name) {
    case "currency":
      return currencyOptions;
    case "bankName":
      return bankList;
    default:
      return [];
  }
};

const schema = yup.object().shape({
  currency: yup.string().required(),
  bankName: yup.string().required(),
  accountNumber: yup
    .string()
    .required()
    .min(10, "Account number must be exactly 10 digits")
    .max(10, "Account number must be exactly 10 digits"),
  accountName: yup.string().required(),
});
interface AddNewBeneficiaryProps {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<UseQueryResult<AxiosResponse<Response, any>>, Error>
  >;
}
const AddNewBeneficiary: React.FC<AddNewBeneficiaryProps> = ({ refetch }) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const { setShow } = useAddBeneficiaryOverlay();
  const [loading, setLoading] = useState(false);
  const [accountResolved, setAccountResolved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const accountNumber = watch("accountNumber");
  const bankCode = watch("bankName");

  useEffect(() => {
    if (accountNumber?.length === 10 && bankCode) {
      setLoading(true);
      setAccountResolved(false);

      const fetchAccountName = async () => {
        try {
          const response = await resolveAccountInfo(accountNumber, bankCode);
          if (response) {
            //@ts-ignore
            const accountName = response?.data?.account_name;
            setValue("accountName", accountName);
            setAccountResolved(true);
            toast.success("Account resolved successfully");
          }
        } catch (error) {
          toast.error("Failed to resolve account info");
        } finally {
          setLoading(false);
        }
      };

      fetchAccountName();
    }
  }, [accountNumber, bankCode, setValue]);

  const onSubmit = async (data: any) => {
    if (!accountResolved || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const { accountNumber, bankName } = data;
      await addBeneficiary(accountNumber, bankName);
      await refetch();
      toast.success("Beneficiary added successfully!");
      setShow(false);
      reset();
    } catch (error) {
      toast.error("Failed to add beneficiary. Please try again.");

      //@ts-ignore
      console.error(error?.response?.data?.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      // Wrap handleSubmit with a function that prevents default behavior
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(onSubmit)(e);
      }}
      className="block max-w-4xl"
    >
      <div className="mt-11">
        <h3 className="mb-4 text-base font-medium leading-7 text-[#333333]">
          Add new beneficiary
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {beneficiaryStruct.map((data, index) => {
            if (data.type === "select" && data.name !== "bankName") {
              return (
                <BankAutocomplete
                  key={data.name + index}
                  control={control}
                  name={data.name}
                  label={data.label}
                  bankList={getFieldOptions(data.name)}
                  error={!!errors?.currency}
                  required
                />
              );
            }

            if (data.type === "select" && data.name === "bankName") {
              return (
                <BankAutocomplete
                  key={data.name + index}
                  control={control}
                  name="bankName"
                  label="Bank Name"
                  bankList={bankList}
                  error={!!errors.bankName}
                  required
                />
              );
            }

            if (data.name === "accountNumber") {
              return (
                <div key={data.name + index}>
                  <Label
                    htmlFor="accountNumber"
                    className="mb-2 inline-block font-light text-[#4F4F4F]"
                  >
                    {data.label}
                  </Label>
                  <div className="relative">
                    <Input
                      {...register("accountNumber")}
                      id="accountNumber"
                      name="accountNumber"
                      placeholder={data.placeholder}
                      className={cn(
                        "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                        errors.accountNumber &&
                          "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                      )}
                    />
                    {loading && (
                      <Loader className="absolute right-2 top-2 animate-spin text-blue-700" />
                    )}
                  </div>
                </div>
              );
            }

            if (data.name === "accountName") {
              return (
                <div key={data.name + index}>
                  <Label
                    htmlFor="accountName"
                    className="mb-2 inline-block font-light text-[#4F4F4F]"
                  >
                    {data.label}
                  </Label>
                  <Input
                    {...register("accountName")}
                    id="accountName"
                    name="accountName"
                    placeholder="Resolved account name"
                    className={cn(
                      "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                      errors.accountName &&
                        "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                    )}
                    disabled
                  />
                </div>
              );
            }

            return null;
          })}
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            className={cn(
              "w-full rounded-full bg-main-100 py-3 text-white",
              !accountResolved || isSubmitting
                ? "cursor-not-allowed bg-opacity-50"
                : "hover:bg-blue-600",
            )}
            disabled={!accountResolved || isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="mr-2 animate-spin" />
            ) : (
              "Add Beneficiary"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddNewBeneficiary;
