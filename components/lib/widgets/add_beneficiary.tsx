import React from "react";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
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

const schema = yup.object().shape({
  currency: yup.string().required(),
  bankName: yup.string().required(),
  accountName: yup.string().required(),
  accountNumber: yup.string().required(),
});

const AddBeneficiary = () => {
  const { setShow } = useAddBeneficiaryOverlay();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onAddBeneficiary = (data: any) => {
    console.log(data, "New Beneficiary");
    setShow(false);
    reset();
  };

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
            <div>
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
                      />
                    </SelectTrigger>
                    <SelectContent>
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
            </div>

            {/* BANK NAME */}
            <div>
              <Label
                htmlFor="bankName"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Bank Name
              </Label>
              <Controller
                name="bankName"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select value={value} onValueChange={onChange}>
                    <SelectTrigger
                      className={cn(
                        "w-full focus:ring-1 focus:ring-main-100 focus:ring-offset-0",
                        errors.bankName &&
                          "border-red-600 focus:border-red-600 focus:ring-red-600",
                      )}
                    >
                      <SelectValue
                        placeholder="Select currency"
                        className="placeholder:text-[#828282]"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Bank name</SelectLabel>
                        <SelectItem value="gtb">
                          GTB - Guaranty Trust Bank
                        </SelectItem>
                        <SelectItem value="uba">
                          UBA - United Bank for Africa
                        </SelectItem>
                        <SelectItem value="access">Access Bank</SelectItem>
                        <SelectItem value="firstbank">
                          FirstBank of Nigeria
                        </SelectItem>
                        <SelectItem value="stanbic">
                          Stanbic IBTC Bank
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* ACCOUNT NUMBER */}
            <div>
              <Label
                htmlFor="accountNumber"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Account number
              </Label>
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
                placeholder="Input name"
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.accountName &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>

            <div>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
              >
                Add beneficiary
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddBeneficiary;
