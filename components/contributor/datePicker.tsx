import React from "react";
import { format, differenceInYears } from "date-fns";
import { Control, Controller, FieldErrors } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the complete form values interface
interface FormValues {
  birth_date: Date;
  gender: string;
  religion: string;
  ethnicity: string;
}

interface DatePickerFieldProps {
  control: Control<FormValues>;
  errors: FieldErrors<FormValues>;
}

interface AgeValidationResult {
  message: string;
  type: "success" | "warning" | "error";
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  control,
  errors,
}) => {
  const calculateAge = (birthDate: Date): number => {
    return differenceInYears(new Date(), birthDate);
  };

  const getAgeValidation = (date: Date | null): AgeValidationResult | null => {
    if (!date) return null;

    const age = calculateAge(date);

    if (age < 0) {
      return {
        message: "Date cannot be in the future",
        type: "error",
      };
    }

    if (age < 13) {
      return {
        message: "Warning: User is under 13 years old",
        type: "warning",
      };
    }

    if (age > 120) {
      return {
        message: "Please verify this date of birth",
        type: "warning",
      };
    }

    return {
      message: `Age: ${age} years old`,
      type: "success",
    };
  };

  const getValidationColor = (type: AgeValidationResult["type"]): string => {
    switch (type) {
      case "error":
        return "text-red-500";
      case "warning":
        return "text-amber-500";
      case "success":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Date of Birth</label>
      <Controller
        name="birth_date"
        control={control}
        render={({ field: { onChange, value } }) => (
          <div className="space-y-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !value && "text-gray-400",
                    errors.birth_date && "border-red-500 focus:ring-red-500",
                  )}
                >
                  <div className="flex w-full items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? (
                      <span>
                        {format(value, "MMMM d, yyyy")}
                        <span className="ml-2 text-sm text-gray-500">
                          ({calculateAge(value)} years old)
                        </span>
                      </span>
                    ) : (
                      "Select your date of birth"
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(date: Date | undefined) => {
                    if (date) {
                      onChange(date);
                    }
                  }}
                  disabled={(date: Date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                  className="rounded-md border"
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>

            {value && (
              <div
                className={cn(
                  "text-sm",
                  getValidationColor(
                    getAgeValidation(value)?.type || "success",
                  ),
                )}
              >
                {getAgeValidation(value)?.message}
              </div>
            )}

            {errors.birth_date && (
              <p className="text-sm text-red-500">
                {errors.birth_date.message?.toString()}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default DatePickerField;
