import { addDays, format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DatePicker = ({ errors, data, control }: any) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth());

  // Generates an array of years for DOB selection (adjust range as needed)
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i,
  );

  // const handlePresetChange = (value: string) => {
  //   setDate(addDays(new Date(), parseInt(value)));
  // };
  return (
    <div>
      <div className="mb-2 inline-block text-base text-[#4F4F4F]">
        {data?.label}
      </div>
      <Controller
        name={data?.name}
        control={control}
        render={({ field: { value, onChange } }) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "h-14 w-full justify-between rounded-lg text-left font-normal",
                    !value &&
                      errors[data?.name] &&
                      "border-red-600 focus:border-red-600 focus:ring-red-600",
                  )}
                >
                  {value ? (
                    format(value, "PPP")
                  ) : (
                    <span>{data?.placeholder}</span>
                  )}
                  <CalendarIcon className="mr-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                {/* Year and Month Picker */}
                <div className="flex space-x-2 px-2 pt-2">
                  <Select
                    defaultValue={`${year}`}
                    onValueChange={(value) => setYear(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((yearOption) => (
                        <SelectItem
                          key={yearOption}
                          value={yearOption.toString()}
                        >
                          {yearOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    defaultValue={`${month}`}
                    onValueChange={(value) => setMonth(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {format(new Date(0, i), "MMMM")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={onChange}
                  month={new Date(year, month)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          );
        }}
      />

      <p className="mt-1 text-sm text-red-600">
        {errors[data?.name] && (data?.err_message as string)}
      </p>
    </div>
  );
};
export default DatePicker;
