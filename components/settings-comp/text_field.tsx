import { cn } from "@/lib/utils";

const TextField = ({ errors, data, register, ...props }: any) => {
  const allowedTypes = ["text", "email", "number"];
  const inputType = allowedTypes.includes(data?.type) ? data.type : "text";

  return (
    <div className="">
      <label
        htmlFor={data?.name}
        className="mb-2 inline-block text-base text-[#4F4F4F]"
      >
        {data?.label}
      </label>
      <div className="relative">
        <input
          {...register(data?.name)}
          type={inputType}
          id={data?.name}
          name={data?.name}
          disabled={data?.disabled}
          placeholder={data?.placeholder}
          {...props}
          className={cn(
            "form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]",
            errors[data?.name] &&
              "border-red-600 focus:border-red-600 focus:ring-red-600",
          )}
        />
      </div>

      <p className="p-1 text-sm text-red-600">
        {errors[data?.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};

export default TextField;
