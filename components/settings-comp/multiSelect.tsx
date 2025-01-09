import React from "react";
import { Controller, FieldErrors } from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";

// interface MultiSelectProps {
//   errors: FieldErrors<FormValues>;
//   data: {
//     name: string;
//     label: string;
//     placeholder: string;
//     err_message: string;
//     required: boolean;
//     type: string;
//   };
//   control: Control<FormValues>;
//   options: { label: string; value: string }[];
//   defaultValue?: string[];
// }

export const normalizeSpokenLanguages = (value: unknown): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string")
    return value.split(",").map((lang) => lang.trim());
  return [];
};

const CustomMultiSelect = ({
  errors,
  data,
  control,
  options,
  defaultValue,
}: any) => {
  return (
    <div>
      <label
        htmlFor={data?.name}
        className="mb-2 inline-block text-base text-[#4F4F4F]"
      >
        {data?.label}
      </label>
      <Controller
        name={data.name}
        control={control}
        defaultValue={[]} // Start with empty array if no default
        render={({ field }) => {
          // Ensure we always have an array of values
          const currentValues = normalizeSpokenLanguages(field.value);

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "h-auto min-h-[56px] w-full justify-between rounded-lg px-3 py-2 text-left",
                    errors[data?.name] && "border-red-600",
                  )}
                >
                  <div className="flex flex-wrap gap-1">
                    {currentValues.length > 0 ? (
                      currentValues.map((val) => (
                        <span
                          key={val}
                          className="inline-flex items-center gap-1 rounded bg-gray-100 px-2 py-1 text-sm"
                        >
                          {val}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newValues = currentValues.filter(
                                (v) => v !== val,
                              );
                              field.onChange(newValues);
                            }}
                          />
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">{data?.placeholder}</span>
                    )}
                  </div>
                  <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput
                    placeholder={`Search ${data?.label.toLowerCase()}...`}
                  />
                  <CommandEmpty>
                    No {data?.label.toLowerCase()} found.
                  </CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-auto">
                    {options.map((option: any) => {
                      const isSelected = currentValues.includes(
                        option.value.toLowerCase(),
                      );
                      return (
                        <CommandItem
                          key={option.value}
                          onSelect={() => {
                            const newValues = isSelected
                              ? currentValues.filter(
                                  (v) => v !== option.value.toLowerCase(),
                                )
                              : [...currentValues, option.value.toLowerCase()];
                            field.onChange(newValues);
                          }}
                        >
                          <div className="flex w-full items-center justify-between">
                            <span>{option.label}</span>
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
      <p className="p-1 text-sm text-red-600">
        {errors[data?.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};

export default CustomMultiSelect;
