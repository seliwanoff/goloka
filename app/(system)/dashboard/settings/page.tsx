"use client";
import CustomInput from "@/components/lib/widgets/custom_inputs";
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
          {/* <div>
            <label
              htmlFor="firstName"
              className="mb-2 inline-block text-base text-[#4F4F4F]"
            >
              First name
            </label>
            <input
              {...register("firstName")}
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Input your first name"
              className="form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
            />
            <p className="text-sm text-red-600"></p>
          </div> */}
          {personalInfo.map((data: any, index: number) => {
            if (data?.type === "select") {
              
            }
            return (
              <>
                <TextField data={data} register={register} errors={errors} />
              </>
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
    err_message: "Input your first name",
    name: "dateOfBirth",
    placeholder: "Input first name",
  },
  {
    label: "Gender",
    type: "select",
    required: true,
    err_message: "Input your first name",
    name: "firstName",
    placeholder: "Input first name",
  },
];
