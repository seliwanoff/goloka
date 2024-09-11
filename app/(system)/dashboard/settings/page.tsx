"use client";
import CustomInput from "@/components/lib/widgets/custom_inputs";
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
  const { register, control } = useForm({
    resolver: yupResolver(schema),
  });
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

        <form id="personal-info">
          <div>
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
          </div>
          {personalInfo.map((data: any) => {
            return (
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 inline-block text-base text-[#4F4F4F]"
                >
                  First name
                </label>
                {/* <input
                  {...register("firstName")}
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="Input your first name"
                  className="form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]"
                /> */}
                <CustomInput
                  type="text"
                  placeholder="Input first name"
                  required={true}
                  err_message="Input your first name"
                  onChange={(value) => "firstName"}
                  value={""}
                />
                <p className="text-sm text-red-600"></p>
              </div>
            );
          })}
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
    placeholder: "Input first name",
  },
  {
    label: "Phone number",
    type: "tel",
    required: true,
    err_message: "Input your phone number",
    placeholder: "Input phone number",
  },
  {
    label: "Date of birth",
    type: "select",
    required: true,
    err_message: "Input your first name",
    placeholder: "Input first name",
  },
  {
    label: "Last name",
    type: "text",
    required: true,
    err_message: "Input your first name",
    placeholder: "Input first name",
  },
];
