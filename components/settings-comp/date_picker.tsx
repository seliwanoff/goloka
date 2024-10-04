import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Controller } from "react-hook-form";

const DatePicker = ({ errors, data, control }: any) => {
  const [date, setDate] = useState<Date>();

  return (
    <div>
      <label
        htmlFor={data?.name}
        className="mb-2 inline-block text-base text-[#4F4F4F]"
      >
        {data?.label}
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "h-14 w-full justify-between rounded-lg text-left font-normal",
              !date &&
                errors[data?.name] &&
                "border-red-600 focus:border-red-600 focus:ring-red-600",
            )}
          >
            {date ? format(date, "PPP") : <span>{data?.placeholder}</span>}
            <CalendarIcon className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Controller
            name={data?.name}
            control={control}
            render={({ field: { value, onChange } }) => {
              return (
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(val) => {
                    setDate(val);
                    onChange();
                  }}
                  initialFocus
                />
              );
            }}
          />
        </PopoverContent>
      </Popover>
      <p className="mt-1 text-sm text-red-600">
        {errors[data.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};
export default DatePicker;
