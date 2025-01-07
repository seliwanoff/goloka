import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAddBeneficiaryOverlay } from "@/stores/overlay";
import { bankList } from "@/utils";
import { addBeneficiary, resolveAccountInfo } from "@/services/contributor";
import { toast } from "sonner";
import { BankAutocomplete } from "./bankAutoComplete";

const schema = yup.object().shape({
  // currency: yup.string().required(),
  bankName: yup.string().required(),
  accountName: yup.string().required(),
  accountNumber: yup
    .string()
    .required()
    .min(10, "Account number must be exactly 10 digits")
    .max(10, "Account number must be exactly 10 digits"),
});
const AddBeneficiary = () => {
  const { setShow } = useAddBeneficiaryOverlay();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const accountNumber = watch("accountNumber");
  const bankCode = watch("bankName");

  useEffect(() => {
    if (accountNumber?.length === 10 && bankCode) {
      setLoading(true);
      const fetchAccountName = async () => {
        try {
          const response = await resolveAccountInfo(accountNumber, bankCode);
          if (response) {
            //@ts-ignore
            const accountName = response?.data?.account_name;
            setValue("accountName", accountName);

            console.log(response, "hfhfh");
            setLoading(false);
            toast.success("Account Resolved Successfully");
          }
        } catch (error) {
          console.error("Error resolving account info", error);
        }
      };

      fetchAccountName();
    }
  }, [accountNumber, bankCode, setValue]);

  const onAddBeneficiary = async (data: any) => {
    setIsSubmitting(true);
    const { accountNumber, bankName } = data;
    try {
      console.log(data, "New Beneficiary");
      const res = await addBeneficiary(accountNumber, bankName);
      toast.success("Beneficiary added successfully!");
       setIsSubmitting(false);
      console.log(res, "Account Added Successfully");
      setShow(false);
      reset();
    } catch (error) {
      toast.error("Failed to add beneficiary. Please try again.");
       setIsSubmitting(false);
      //@ts-ignore
      console.error(error?.response?.data?.message);
         setShow(true);
    }
  };

  console.log(watch("accountName"), "watch");

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Input correct details of the beneficiary
          <br /> account
        </h3>

        <div className="mt-12">
          <form
            id="add_beneficiary"
            onSubmit={handleSubmit(onAddBeneficiary)}
            className="space-y-6"
          >
            {/* CURRENCY */}
            {/* <div>
              <Label
                htmlFor="currency"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Currency
              </Label>
              <Controller
                name="currency"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger
                      className={cn(
                        "w-full focus:ring-1 focus:ring-main-100 focus:ring-offset-0",
                        errors.currency &&
                          "border-red-600 focus:border-red-600 focus:ring-red-600",
                      )}
                    >
                      <SelectValue
                        placeholder="Select currency"
                        className="placeholder:text-[#828282]"
                      >
                        {value?.toUpperCase() || "Select currency"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-48 w-auto overflow-y-auto">
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        <SelectItem value="ngn">
                          NGN - Nigerian Naira
                        </SelectItem>
                        <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div> */}

            {/* BANK NAME */}
            <BankAutocomplete
              control={control}
              name="bankName"
              label="Bank Name"
              bankList={bankList}
              error={!!errors.bankName}
              required
            />

            {/* ACCOUNT NUMBER */}
            <div>
              <Label
                htmlFor="accountNumber"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Account number
              </Label>
              <div className="relative">
                <Input
                  {...register("accountNumber")}
                  id="accountNumber"
                  name="accountNumber"
                  placeholder="Input number"
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
            {/* ACCOUNT NAME */}
            <div>
              <Label
                htmlFor="accountName"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Account name
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

            <div>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
                disabled={watch("accountName") === undefined && true}
              >
               {isSubmitting ?   <Loader className=" animate-spin text-[#fff]" /> : " Add beneficiary"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBeneficiary;
