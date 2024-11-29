import CustomInput from "@/components/lib/widgets/custom_inputs";
import TextField from "@/components/settings-comp/text_field";
import { Button } from "@/components/ui/button";
import { addCard } from "@/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  cardNumber: yup.string().required().max(16),
  expiryDate: yup
    .string()
    .required("Expiry date is required")
    .matches(
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "Invalid expiry date format (MM/YY)",
    ),
  cvv: yup
    .string()
    .matches(/^[0-9]{3,4}$/, "Invalid CVV")
    .required("CVV is required"),
});

const AddNewCard = () => {
  const [expiryValue, setExpiryValue] = useState("");
  const [cardno, setCardNo] = useState("");
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<any>({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleExpiryChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    console.log(value, e, "Expiry");

    setExpiryValue(value);
    setValue("expiryDate", value, { shouldValidate: true });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full" id="newCard">
        {/* ADD NEW CARD */}
        <div className="mt-11">
          <h3 className="mb-4 text-base font-medium leading-7 text-[#333333]">
            Add new card
          </h3>
          <div className="grid gap-6 md:grid-cols-2 md:[&_div:nth-child(1)]:col-span-2">
            {addCard.map((data, index) => {
              if (data.name === "expiryDate") {
                return (
                  <TextField
                    key={data.name + index}
                    data={data}
                    errors={errors}
                    register={register}
                    value={expiryValue}
                    onChange={(e: any) => handleExpiryChange(e)}
                  />
                );
              } else if (data.name === "cardNumber") {
                return (
                  <TextField
                    key={data.name + index}
                    data={data}
                    errors={errors}
                    register={register}
                  />
                );
              } else {
                return (
                  <TextField
                    key={data.name + index}
                    data={data}
                    errors={errors}
                    register={register}
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
            Add new card
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddNewCard;
