"use client";
import CustomInput from "@/components/lib/widgets/custom_inputs";
import DatePicker from "@/components/settings-comp/date_picker";
import PhoneInputField from "@/components/settings-comp/phone_input";
import CustomSelectField from "@/components/settings-comp/select_field";
import TextField from "@/components/settings-comp/text_field";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";

import { useForm } from "react-hook-form";
import * as yup from "yup";

const SettingsPage = () => {
  return (
    <>
      <PersonalInfo />
    </>
  );
};

export default SettingsPage;

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  phoneNo: yup.string().required(),
  gender: yup.string().required(),
});

type ComponentProps = {};
const PersonalInfo: React.FC<ComponentProps> = ({}) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <div className="rounded-2xl bg-white p-4">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-[#101828]">
            Personal info
          </h3>
          <p className="text-sm text-[#475467]">
            Update your photo and personal details here.
          </p>
        </div>

        <form id="personal-info" onSubmit={handleSubmit(onSubmit)}>
          {personalInfo.map((data: any, index: number) => {
            return (
              <CustomInput
                data={data}
                errors={errors}
                register={register}
                control={control}
                key={data?.name + index}
              />
            );
          })}

          <button type="submit">Hellp</button>
        </form>
      </div>
    </>
  );
};

const OtherPersonalInfo: React.FC<ComponentProps> = ({}) => {
  return <></>;
};

const ChangePassword: React.FC<ComponentProps> = ({}) => {
  return <></>;
};

const Location: React.FC<ComponentProps> = ({}) => {
  return <></>;
};

const Payment: React.FC<ComponentProps> = ({}) => {
  return <></>;
};

const Notification: React.FC<ComponentProps> = ({}) => {
  return <></>;
};

const personalInfo = [
  {
    name: "firstName",
    label: "First name",
    type: "text",
    required: true,
    err_message: "Input your first name",
    placeholder: "Input first name",
  },
  {
    label: "Last name",
    type: "text",
    required: true,
    err_message: "Input your first name",
    name: "lastName",
    placeholder: "Input first name",
  },
  {
    label: "Phone number",
    type: "phone",
    required: true,
    err_message: "Input your phone number",
    name: "firstName",
    placeholder: "Input phone number",
  },
  {
    label: "Date of birth",
    type: "date",
    required: true,
    err_message: "Pick your date of birth",
    name: "dateOfBirth",
    placeholder: "Pick date of birth",
  },
  {
    label: "Gender",
    type: "select",
    required: true,
    err_message: "Select your gender",
    name: "gender",
    placeholder: "Select your gender",
  },
];

const otherInfo = [
  {
    label: "Date of birth",
    type: "date",
    required: true,
    err_message: "Select your date of birth",
    name: "dateOfBirth",
    placeholder: "Select date",
  },
  {
    label: "Gender",
    type: "select",
    required: true,
    err_message: "Select your gender",
    name: "gender",
    placeholder: "Select your gender",
  },

  {
    label: "Religion",
    type: "select",
    required: true,
    err_message: "Select your religion",
    name: "religion",
    placeholder: "Select religion",
  },
  {
    label: "Ethnicity",
    type: "select",
    required: true,
    err_message: "Select your religion",
    name: "religion",
    placeholder: "Select ethnicity",
  },
  {
    label: "Primary language",
    type: "select",
    required: true,
    err_message: "Select your primary language",
    name: "primaryLanguage",
    placeholder: "Select primary language",
  },
  {
    label: "Spoken language",
    type: "select",
    required: true,
    err_message: "Select your spoken language",
    name: "spokenLanguage",
    placeholder: "Select spoken language ",
  },
];

const gender = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "others" },
];

const displayPersonalInfo = (
  type: string,
  data: any,
  control: any,
  register: any,
  errors: any,
  index: number,
  options: any[],
) => {
  switch (type) {
    case "select":
      return (
        <CustomSelectField
          data={data}
          control={control}
          errors={errors}
          options={options}
          key={data?.name + index}
        />
      );
    case "phone":
      return (
        <PhoneInputField
          data={data}
          control={control}
          errors={errors}
          key={data?.name + index}
        />
      );
    case "date":
      return (
        <DatePicker
          data={data}
          control={control}
          errors={errors}
          key={data?.name + index}
        />
      );

    default:
      return (
        <TextField
          data={data}
          register={register}
          errors={errors}
          key={data?.name + index}
        />
      );
  }
};
