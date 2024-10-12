import { cn } from "@/lib/utils";
import { Eye, EyeSlash } from "iconsax-react";
import { useState } from "react";

const PasswordInput: React.FC<any> = ({ data, errors, index, register }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev: boolean) => !prev);
  };
  return (
    <>
      <div
        key={data?.name}
        className={cn("col-span-1", index === 0 && "md:col-span-2")}
      >
        <label
          htmlFor={data?.name}
          className="mb-2 inline-block text-base text-[#4F4F4F]"
        >
          {data?.label}
        </label>
        <div className="relative">
          <input
            {...register(data?.name)}
            id={data?.name}
            name={data?.name}
            placeholder={data?.placeholder}
            type={showPassword ? "text" : "password"}
            className={cn(
              "form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]",
              errors[data?.name] &&
                "border-red-600 focus:border-red-600 focus:ring-red-600",
            )}
          />
          <div
            className="absolute bottom-[16px] right-4 cursor-pointer text-neutral-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
          </div>
        </div>
        <p className="p-1 text-sm text-red-600">
          {errors[data?.name] && (errors[data?.name]?.message as string)}
        </p>
      </div>
    </>
  );
};

export default PasswordInput;
