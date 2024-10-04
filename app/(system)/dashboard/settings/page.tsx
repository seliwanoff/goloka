"use client";
import CustomInput, { FormProps } from "@/components/lib/widgets/custom_inputs";
import DatePicker from "@/components/settings-comp/date_picker";
import PhoneInputField from "@/components/settings-comp/phone_input";
import CustomSelectField from "@/components/settings-comp/select_field";
import TextField from "@/components/settings-comp/text_field";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";

import { useForm } from "react-hook-form";
import * as yup from "yup";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Avatar from "@/public/assets/images/chat-user-profile.png";
import Image, { StaticImageData } from "next/image";
import { Camera } from "iconsax-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
  email: yup.string().email().required(),
});

type ComponentProps = {};
const PersonalInfo: React.FC<ComponentProps> = ({}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [imgUrl, setImgUrl] = useState<string>(Avatar?.src);
  const [image, setImage] = useState<File | null>(null);
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    const url = URL.createObjectURL(file as Blob);
    setImgUrl(url);
    setImage(file);
    console.log(file, url, image);
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <div className="mt-2.5">
        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="relative w-full bg-transparent"
        >
          <div className="absolute left-0 top-0 block h-14 w-[2000px] -translate-x-[2%] bg-white"></div>

          <TabsList className="relative flex h-auto items-center justify-start gap-6 bg-transparent">
            {settingTabs?.map((tab: any, index: number) => (
              <TabsTrigger
                value={tab.value}
                key={index}
                className="flex items-center justify-between rounded-none border-b-2 border-transparent pb-4 pt-2.5 text-base font-light text-[#071E3B] data-[state=active]:border-main-100 data-[state=active]:bg-transparent data-[state=active]:text-main-100 data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="profile">
            <form
              className="mt-9 block max-w-4xl"
              id="personal-info"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                      Personal info
                    </h3>
                    <p className="text-sm text-[#475467]">
                      Update your photo and personal details here.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-main-100 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>

                {/* PROFILE IMAGE */}
                <div className="flex items-center justify-center">
                  <div className="relative sm:inline-block">
                    <Image
                      src={imgUrl}
                      alt="avatar"
                      width={100}
                      height={100}
                      className="h-[100px] w-[100px] rounded-full object-cover object-center"
                    />
                    <label
                      htmlFor="avatar"
                      aria-label="avatar"
                      className="absolute -bottom-1.5 right-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[#F2F2F2] text-neutral-500"
                    >
                      <Camera size={20} />
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      id="avatar"
                      className="hidden"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="space-y-4 md:mt-8 md:grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-6 md:space-y-0">
                  {personalInfo.map((data: any, index: number) => {
                    if (data.type === "select") {
                      return (
                        <CustomSelectField
                          data={data}
                          errors={errors}
                          register={register}
                          control={control}
                          key={data?.name + index}
                          options={gender}
                        />
                      );
                    }
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
                </div>
              </div>

              {/* OTHER PERSONAL INFO */}
              <OtherPersonalInfo
                errors={errors}
                register={register}
                control={control}
              />
            </form>
          </TabsContent>
          <TabsContent value="password">
            <form className="block" id="password">
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                      Password
                    </h3>
                    <p className="text-sm text-[#475467]">
                      Please enter your current password to change your
                      password.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-main-100 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="">
                    <Label htmlFor="old-password"></Label>
                    <input
                      type="password"
                      name="old-password"
                      id="old-password"
                      className={cn(
                        "form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]",
                        false &&
                          "border-red-600 focus:border-red-600 focus:ring-red-600",
                      )}
                    />
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="location">
            <form className="block" id="location">
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                      Location
                    </h3>
                    <p className="text-sm text-[#475467]">
                      Edit your location preference
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-main-100 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="payment">
            {" "}
            <form className="block" id="payment">
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                      Beneficiary accounts
                    </h3>
                    <p className="text-sm text-[#475467]">
                      Add or remove beneficiary account
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-main-100 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="notification">
            <form className="block" id="notification">
              <div className="rounded-2xl bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                      Push Notification
                    </h3>
                    <p className="text-sm text-[#475467]">
                      Messages you receive from the app
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-6"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-full bg-main-100 text-white"
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

const OtherPersonalInfo: React.FC<any> = ({ errors, register, control }) => {
  return (
    <div className="mt-8 rounded-2xl bg-white p-6">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-[#101828]">
          Other info
        </h3>
        <p className="text-sm text-[#475467]">Edit your location preference</p>
      </div>
      <div className="space-y-4 md:mt-8 md:grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-6 md:space-y-0">
        {otherInfo.map((data, index) => (
          <CustomSelectField
            key={data.name + index} // or `index` for unique keys
            data={data}
            errors={errors}
            register={register}
            control={control}
            options={getOptionsByName(data.name)} // Pass the respective options
          />
        ))}
      </div>
    </div>
  );
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

const settingTabs = [
  { label: "Profile", value: "profile" },
  { label: "Password", value: "password" },
  { label: "Location", value: "location" },
  { label: "Payment", value: "payment" },
  { label: "Notification", value: "notification" },
];

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
    label: "Email address",
    type: "email",
    required: true,
    err_message: "Input your email address",
    name: "email",
    placeholder: "Input email address",
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
    name: "ethnicity",
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

// OTHER OPTIONS
const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

const religionOptions = [
  { label: "Christianity", value: "christianity" },
  { label: "Islam", value: "islam" },
  { label: "Hinduism", value: "hinduism" },
];

const ethnicityOptions = [
  { label: "Yoruba", value: "yoruba" },
  { label: "Igbo", value: "igbo" },
  { label: "Hausa", value: "hausa" },
];

const primaryLanguageOptions = [
  { label: "English", value: "english" },
  { label: "French", value: "french" },
  { label: "Spanish", value: "spanish" },
];

const spokenLanguageOptions = [
  { label: "English", value: "english" },
  { label: "French", value: "french" },
  { label: "Spanish", value: "spanish" },
];

// Map the respective options based on the name
const getOptionsByName = (name: string) => {
  switch (name) {
    case "gender":
      return genderOptions;
    case "religion":
      return religionOptions;
    case "ethnicity":
      return ethnicityOptions;
    case "primaryLanguage":
      return primaryLanguageOptions;
    case "spokenLanguage":
      return spokenLanguageOptions;
    default:
      return [];
  }
};
