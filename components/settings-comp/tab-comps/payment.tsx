import CustomInput from "@/components/lib/widgets/custom_inputs";
import { Button } from "@/components/ui/button";
import {
  addBeneficiary,
  bankOptions,
  currencyOptions,
  myBeneficiaries,
} from "@/utils";
import CustomSelectField from "../select_field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";

const getFieldOptions = (name: string) => {
  switch (name) {
    case "currency":
      return currencyOptions;
    case "bankName":
      return bankOptions;
    default:
      return [];
  }
};

const Payment: React.FC<any> = ({}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [beneficiaries, setBeneficiaries] = useState(myBeneficiaries);

  const schema = yup.object().shape({
    currency: yup.string().required(),
    bankName: yup.string().required(),
    accountNumber: yup.number().required(),
    accountName: yup.string().required(),
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="block max-w-4xl"
        id="payment"
      >
        <div className="w-full rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Beneficiary accounts
              </h3>
              <p className="text-sm text-[#475467]">
                Add or remove beneficiary account
              </p>
            </div>
          </div>

          <div className="mt-8">
            {/* BENEFICIARIES */}
            <div className="no-scrollbar h-[180px] overflow-y-auto">
              <div className="p-1">
                <RadioGroup
                  defaultValue={selectedValue}
                  onValueChange={setSelectedValue}
                  className="gap-5"
                >
                  {beneficiaries.map((item: any, i: number) => {
                    if (i > 1) return;
                    return (
                      <div className="flex w-full items-center" key={i}>
                        <RadioGroupItem
                          value={item.value}
                          id={item.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={item.value}
                          className={cn(
                            "grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3.5",
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
                    );
                  })}
                </RadioGroup>
              </div>
            </div>

            {/* ADD NEW BENEFICIARY */}
            <div className="mt-11">
              <h3 className="mb-4 text-base font-medium leading-7 text-[#333333]">
                Add new beneficiary
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {addBeneficiary.map((data, index) => {
                  if (data.type === "select") {
                    return (
                      <CustomSelectField
                        key={data.name}
                        data={data}
                        errors={errors}
                        register={register}
                        control={control}
                        options={getFieldOptions(data.name)}
                      />
                    );
                  } else {
                    // Render input fields for number or text types
                    return (
                      <CustomInput
                        key={data.name}
                        data={data}
                        errors={errors}
                        register={register}
                        control={control}
                      />
                    );
                  }
                })}
              </div>
            </div>

            <div className="fixed bottom-0 left-0 z-30 mt-[42px] grid w-full grid-cols-1 items-center gap-3 bg-white p-4 shadow-[0_0_20px_rgba(0,0,0,0.1)] md:static md:flex md:bg-transparent md:p-0 md:shadow-none">
              <Button
                type="submit"
                className="h-auto w-full rounded-full bg-main-100 py-3.5 text-white hover:bg-blue-600"
              >
                Add beneficiary
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Payment;
