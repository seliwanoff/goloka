import React from "react";
import CustomInput from "../lib/widgets/custom_inputs";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomSelectField from "@/components/settings-comp/select_field";
import { bankOptions, beneficiaryStruct, currencyOptions } from "@/utils";
import { Button } from "@/components/ui/button";

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

const schema = yup.object().shape({
  currency: yup.string().required(),
  bankName: yup.string().required(),
  accountNumber: yup.number().required(),
  accountName: yup.string().required(),
});

const AddNewBeneficiary = () => {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="block max-w-4xl"
      id="newBeneficiary"
    >
      <div className="mt-11">
        <h3 className="mb-4 text-base font-medium leading-7 text-[#333333]">
          Add new beneficiary
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {beneficiaryStruct.map((data, index) => {
            if (data.type === "select") {
              return (
                <CustomSelectField
                  key={data.name + index}
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
                  key={data.name + index}
                  data={data}
                  errors={errors}
                  register={register}
                  control={control}
                />
              );
            }
          })}
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
    </form>
  );
};

export default AddNewBeneficiary;
