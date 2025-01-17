import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Country {
  id: string;
  label: string;
}

interface DynamicSelectProps {
  label?: string;
  initialOptions?: Country[];
  control: any; // Pass `control` from `react-hook-form`
  name: string;
  rules?: object;
  errors?: any; // Errors from `react-hook-form`
  placeholder?: string;
  onChange?: any; // Prop for handling changes
}

const DynamicSelect: React.FC<DynamicSelectProps> = ({
  label = "Select an option",
  initialOptions = [],
  control,
  name,
  rules,
  errors,
  placeholder = "Select an option",
  onChange, // New prop for handling external changes
}) => {
  const [options, setOptions] = useState<Country[]>(initialOptions);
  const [newOption, setNewOption] = useState<string>("");
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string>("");

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    const newOptionObject = {
      id: Date.now().toString(),
      label: newOption.trim(),
    };
    setOptions((prevOptions) => [...prevOptions, newOptionObject]);
    setNewOption("");
    onChange(options);
  };

  return (
    <div className="space-y-4">
      <Label htmlFor={name}>
        <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
          {label}
        </span>
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={(value: string) => {
                const selectedOption = options.find(
                  (option: Country) => option.id === value,
                );
                setSelectedOptionLabel(selectedOption?.label || "");
                field.onChange(value); // Update react-hook-form value
                //   onChange?.(value); // Trigger parent onChange callback
              }}
            >
              <SelectTrigger className="neutral-400 h-12 w-full rounded-md border bg-transparent focus:ring-1 focus:ring-offset-0 focus-visible:ring-main-100 [&>span]:font-light">
                <SelectValue
                  placeholder={placeholder}
                  className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                >
                  {selectedOptionLabel || placeholder}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-w-full">
                <SelectGroup>
                  <SelectLabel>
                    {options.length ? label : "No options available"}
                  </SelectLabel>
                  {options.map((option: Country) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.[name] && (
          <p className="text-xs text-red-500">{errors[name].message}</p>
        )}
      </Label>

      {/* Add New Option */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder="Enter new option"
          className="flex-grow rounded-md border-gray-300 px-2 py-2 text-gray-800 focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAddOption}
          className="rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default DynamicSelect;
