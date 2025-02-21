import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const CustomSelectField = ({
  errors,
  data,
  control,
  options,
  defaultValue,
}: any) => {
  // Find matching option value accounting for case
  const findMatchingOption = (value: string) => {
    if (!value || !options) return "";

    const normalizedValue = value?.toLowerCase();
    const matchingOption = options.find(
      (opt: any) => opt.value?.toLowerCase() === normalizedValue,
    );
    return matchingOption ? matchingOption.value : "";
  };

  return (
    <div>
      <label
        htmlFor={data?.name}
        className="mb-2 inline-block text-base text-[#4F4F4F]"
      >
        {data?.label}
      </label>
      <Controller
        name={data?.name}
        control={control}
        defaultValue={defaultValue || ""}
        render={({ field: { value, onChange } }) => {
          // Get the correct option value accounting for case
          const normalizedValue = findMatchingOption(value || defaultValue);

          return (
            <Select defaultValue={normalizedValue} onValueChange={onChange}>
              <SelectTrigger
                className={cn(
                  "h-14 w-full rounded-lg focus:ring-1 focus:ring-main-100 focus:ring-offset-0 focus-visible:ring-0",
                  errors[data?.name] &&
                    "border-red-600 focus:border-red-600 focus:ring-red-600",
                )}
              >
                <SelectValue
                  className="text-[#828282]"
                  placeholder={data?.placeholder}
                />
              </SelectTrigger>
              <SelectContent id={data?.name}>
                {options?.map((opt: any) => (
                  <SelectItem key={opt?.value} value={opt?.value}>
                    {opt?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
      <p className="p-1 text-sm text-red-600">
        {errors[data?.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};

export default CustomSelectField;
