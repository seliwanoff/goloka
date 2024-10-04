import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";
import { useState } from "react";

const TextField = ({ errors, data, register }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  const allowedTypes = ["text", "email"];
  const inputType = allowedTypes.includes(data?.type) ? data.type : "text";

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div>
      <label
        htmlFor={data?.name}
        className="mb-2 inline-block text-base text-[#4F4F4F]"
      >
        {data?.label}
      </label>
      <input
        {...register(data?.name)}
        type={inputType === "password" && showPassword ? "text" : inputType}
        id={data?.name}
        name={data?.name}
        placeholder={data?.placeholder}
        className={cn(
          "form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]",
          errors[data?.name] &&
            "border-red-600 focus:border-red-600 focus:ring-red-600",
        )}
      />
      {inputType === "password" && (
        <div
          className="absolute right-4 top-[42px] cursor-pointer"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
        </div>
      )}

      <p className="p-1 text-sm text-red-600">
        {errors[data.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};

export default TextField;
