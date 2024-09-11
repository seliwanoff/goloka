import React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

// DATE
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

// SELECT
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface InputProps {
  type: string;
  placeholder: string;
  required: boolean;
  err_message: string;
  onChange: (value: string | any) => void;
  value: string;
}

const CustomInput: React.FC<InputProps> = ({
  type,
  placeholder,
  required,
  err_message,
  onChange,
  value,
}) => {
  switch (type) {
    case "text":
      return (
        <input
          type="text"
          placeholder={placeholder}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      );
    case "tel":
      return (
        <PhoneInput
          international
          defaultCountry="US"
          value={value}
          onChange={onChange}
        />
      );
    case "date":
      return <DatePicker onChange={onChange} value={value} />;
    case "select":
      return (
        <SelectInput
          onChange={onChange}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            // Add more options as needed
          ]}
          value={value}
          placeholder={placeholder}
        />
      );
    default:
      return null;
  }
};

export default CustomInput;

const DatePicker = ({ onChange, value }: { onChange: any; value: any }) => {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = {
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  value: string;
};

const SelectInput: React.FC<SelectProps> = ({
  onChange,
  options,
  placeholder,
  value,
}) => {
  return (
    <>
      <Select defaultValue={value} onValueChange={onChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options?.map((opt: any) => (
            <SelectItem key={opt?.value} value={opt?.value}>
              {opt?.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};



const TextField = ({ errors, data, register, infoColor }: any) => {
  
}