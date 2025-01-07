import React from "react";
import { Controller } from "react-hook-form";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { cn } from "@/lib/utils";

const PhoneInputField = ({ errors, data, control }: any) => {
  return (
    <div>
      <label
        htmlFor={data?.name}
        className="mb-2 inline-block text-base text-[#4F4F4F]"
      >
        {data?.label}
      </label>
      <div
        className={cn(
          "focus-within::ring-1 h-14 w-full rounded-lg border border-[#d9dce0] p-4 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-main-100",
          errors[data?.name] &&
            "border-red-600 focus:border-red-600 focus:ring-red-600",
        )}
      >
        <Controller
          name={data?.name}
          control={control}
          render={({ field: { value, onChange } }) => (
            <PhoneInput
              international
              defaultCountry="NG"
              countryCallingCodeEditable={false}
              value={value}
              onChange={onChange}
              placeholder={data?.placeholder}
              className={cn(
                "input-phone h-6 w-full border-transparent outline-0 ring-0",
              )}
            />
          )}
        />
      </div>
      <p className="p-1 text-sm text-red-600">
        {errors[data.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};

export default PhoneInputField;
