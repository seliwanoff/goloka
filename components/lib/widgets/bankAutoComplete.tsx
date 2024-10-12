import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface BankOption {
  value: string;
  label: string;
}

interface BankAutocompleteProps {
  control: any;
  name: string;
  label: string;
  bankList: BankOption[];
  error?: boolean;
  required?: boolean;
}

export function BankAutocomplete({
  control,
  name,
  label,
  bankList,
  error,
  required,
}: BankAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBanks = bankList.filter((bank) =>
    bank.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col space-y-1.5">
      <label
        htmlFor={name}
        className="mb-2 inline-block font-light text-[#4F4F4F]"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between focus:ring-1 focus:ring-main-100 focus:ring-offset-0",
                  error &&
                    "border-red-600 focus:border-red-600 focus:ring-red-600",
                  !field.value && "text-[#828282]",
                )}
              >
                {field.value
                  ? bankList.find((bank) => bank.value === field.value)?.label
                  : "Select bank"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search bank..."
                  className="w-full rounded border p-2"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  value={searchTerm}
                />
              </div>
              <div className="max-h-48 overflow-y-scroll">
                {filteredBanks.map((bank) => (
                  <div
                    key={bank.value}
                    className={cn(
                      "flex cursor-pointer items-center px-2 py-1 hover:bg-gray-100",
                      field.value === bank.value && "bg-blue-100",
                    )}
                    onClick={() => {
                      field.onChange(bank.value);
                      setOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        field.value === bank.value
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    {bank.label}
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      />
    </div>
  );
}
