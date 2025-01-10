import DatePicker from "@/components/settings-comp/date_picker";
import PhoneInputField from "@/components/settings-comp/phone_input";
import CustomSelectField from "@/components/settings-comp/select_field";
import TextField from "@/components/settings-comp/text_field";
import { watch } from "fs";
import { FieldErrors, UseFormRegister, Control } from "react-hook-form";

export interface FormProps {
  errors: FieldErrors;
  data: Record<string, any>;
  register?: UseFormRegister<any>;
  control?: Control<any>;
  watch?: any;
  options?: Option[];
}

type Option = {
  label: string;
  value: string | number;
};

interface InputProps {
  type: string;
  placeholder: string;
  required: boolean;
  err_message: string;
  onChange: (value: string | any) => void;
  value: string;
}

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

const CustomInput = ({
  errors,
  data,
  register,
  control,
  watch,
  options,
}: FormProps) => {
  switch (data?.type) {
    case "select":
      return <CustomSelectField {...{ errors, data, control, options }} />;
    case "phoneNo":
      return <PhoneInputField {...{ errors, data, control }} />;
    case "date":
      return <DatePicker {...{ errors, data, control }} />;

    default:
      return <TextField {...{ errors, data, register, watch }} />;
  }
};

export default CustomInput;
