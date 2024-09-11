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
import { Controller } from "react-hook-form";

interface InputProps {
  type: string;
  placeholder: string;
  required: boolean;
  err_message: string;
  onChange: (value: string | any) => void;
  value: string;
}

const CustomInput = ({ errors, data, register, control, options }: any) => {
  switch (data?.type) {
    case "tel":
    // return (
    //   <PhoneInput
    //     international
    //     defaultCountry="US"
    //     value={value}
    //     onChange={onChange}
    //   />
    // );
    case "date":
      return <DatePicker {...{ errors, data, control }} />;
    case "select":
      // return <CustomSelectField {...{ errors, data, control, options }} />;

    case "text":
    default:
      // return <TextField {...{ errors, data, register }} />;
  }
};

export default CustomInput;

const DatePicker = ({ errors, data, control }: any) => {
  const [date, setDate] = React.useState<Date>();

  return (
    <div>
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
    </div>
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





// const CustomInput = ({ errors, data, register, control }: any) => {
//   switch (data.type) {
//     case "amount":
//     // return <CustomAmountField {...{ errors, data, register, control }} />;
//     case "autocomplete":
//     // return <CustomAutoComplete {...{ errors, data, register, control }} />;
//     case "richText":
//     // return <CustomTextArea {...{ errors, data, register }} />;
//     case "select":
//       return <CustomSelectField {...{ errors, data, control }} />;
//     case "textarea":
//     // return <CustomTextArea {...{ errors, data, register }} />;
//     default:
//       return <TextField {...{ errors, data, register }} />;
//   }
// };

// export default CustomInput;
