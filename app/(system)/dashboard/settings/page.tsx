"use client";
import CustomInput, { FormProps } from "@/components/lib/widgets/custom_inputs";
import DatePicker from "@/components/settings-comp/date_picker";
import PhoneInputField from "@/components/settings-comp/phone_input";
import CustomSelectField from "@/components/settings-comp/select_field";
import TextField from "@/components/settings-comp/text_field";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";

import { Control, Controller, useForm } from "react-hook-form";
import * as yup from "yup";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Avatar from "@/public/assets/images/contributor-profile.jpeg";
import Image, { StaticImageData } from "next/image";
import { Camera, Eye, EyeSlash } from "iconsax-react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { myBeneficiaries } from "@/utils";
import { Switch } from "@/components/ui/switch";

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
          <div className="absolute left-0 top-0 block h-[50px] w-[2000px] -translate-x-[2%] bg-white"></div>

          <TabsList className="relative mb-8 flex h-auto items-center justify-start gap-6 bg-transparent">
            {settingTabs?.map((tab: any, index: number) => (
              <TabsTrigger
                value={tab.value}
                key={index}
                className="flex items-center justify-between rounded-none border-b-2 border-transparent pb-4 pt-2.5 text-sm font-light text-[#828282] data-[state=active]:border-main-100 data-[state=active]:bg-transparent data-[state=active]:text-main-100 data-[state=active]:shadow-none"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="profile">
            <form
              className="block max-w-4xl"
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
                <div className="my-8 flex items-center justify-center">
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

                <div className="space-y-4 md:grid md:grid-cols-2 md:gap-x-[18px] md:gap-y-6 md:space-y-0">
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
            <ChangePassword />
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
            <Payment />
          </TabsContent>
          <TabsContent value="notification">
            <Notification />
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

const passwordSchema = yup.object().shape({
  oldPassword: yup.string().required(),
  password: yup.string().required(),
  passwordAgain: yup.string().required(),
});

const ChangePassword: React.FC<any> = ({}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <>
      <form className="block max-w-4xl" id="password">
        <div className="rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Password
              </h3>
              <p className="text-sm text-[#475467]">
                Please enter your current password to change your password.
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

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {passwordFormData.map((data: any, index: number) => {
              return (
                <PasswordInput
                  key={data?.name + index}
                  data={data}
                  errors={errors}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </form>
    </>
  );
};

const PasswordInput: React.FC<any> = ({ data, errors, index }) => {
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      <div
        key={data?.name}
        className={cn("col-span-1", index === 0 && "md:col-span-2")}
      >
        <label
          htmlFor={data?.name}
          className="mb-2 inline-block text-base text-[#4F4F4F]"
        >
          {data?.label}
        </label>
        <div className="relative">
          <input
            id={data?.name}
            name={data?.name}
            placeholder={data?.placeholder}
            type={showPassword ? "text" : "password"}
            className={cn(
              "form-input h-14 w-full rounded-lg border border-[#D9DCE0] p-4 placeholder:text-sm placeholder:text-[#828282]",
              errors[data?.name] &&
                "border-red-600 focus:border-red-600 focus:ring-red-600",
            )}
          />
          <div
            className="absolute bottom-[16px] right-4 cursor-pointer text-neutral-500"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeSlash size={24} /> : <Eye size={24} />}
          </div>
        </div>
        <p className="p-1 text-sm text-red-600">
          {errors[data?.name] && (data?.err_message as string)}
        </p>
      </div>
    </>
  );
};

const Location: React.FC<ComponentProps> = ({}) => {
  return <></>;
};

const Payment: React.FC<any> = ({}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [beneficiaries, setBeneficiaries] = useState(myBeneficiaries);

  const schema = yup.object().shape({
    currency: yup.string().required(),
    bankName: yup.string().required(),
    accountNumber: yup.number().required(),
    accountName: yup.string().required(),
  });

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="block max-w-4xl"
        id="payment"
      >
        <div className="w-full rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Beneficiary accounts
              </h3>
              <p className="text-sm text-[#475467]">
                Add or remove beneficiary account
              </p>
            </div>
          </div>

          <div className="mt-8">
            {/* BENEFICIARIES */}
            <div className="no-scrollbar h-[180px] overflow-y-auto">
              <div className="p-1">
                <RadioGroup
                  defaultValue={selectedValue}
                  onValueChange={setSelectedValue}
                  className="gap-5"
                >
                  {beneficiaries.map((item: any, i: number) => {
                    if (i > 1) return;
                    return (
                      <div className="flex w-full items-center" key={i}>
                        <RadioGroupItem
                          value={item.value}
                          id={item.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={item.value}
                          className={cn(
                            "grid w-full grid-cols-[1.5fr_1fr] gap-y-1 rounded-lg border border-[#14342C0F] bg-[#FDFDFD] p-3.5",
                            selectedValue === item?.value &&
                              "border-main-100 bg-main-100 bg-opacity-5 ring-1 ring-main-100",
                          )}
                        >
                          <h4
                            className={cn(
                              "text-sm font-medium text-[#4F4F4F]",
                              selectedValue === item?.value && "text-main-100",
                            )}
                          >
                            {item?.name}
                          </h4>
                          <p
                            className={cn(
                              "justify-self-end text-right text-sm font-semibold text-[#333]",
                              selectedValue === item?.value && "text-main-100",
                            )}
                          >
                            {item.accountNumber}
                          </p>
                          <p
                            className={cn(
                              "text-xs text-[#4F4F4F]",
                              selectedValue === item?.value && "text-main-100",
                            )}
                          >
                            {item.bank}
                          </p>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            </div>

            {/* ADD NEW BENEFICIARY */}
            <div className="mt-11">
              <h3 className="mb-4 text-base font-medium leading-7 text-[#333333]">
                Add new beneficiary
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                {addBeneficiary.map((data, index) => {
                  if (data.type === "select") {
                    return (
                      <CustomSelectField
                        key={data.name}
                        data={data}
                        errors={errors}
                        register={register}
                        control={control}
                        options={getFieldOptions(data.name)}
                      />
                    );
                  } else {
                    // Render input fields for number or text types
                    return (
                      <CustomInput
                        key={data.name}
                        data={data}
                        errors={errors}
                        register={register}
                        control={control}
                      />
                    );
                  }
                })}
              </div>
            </div>

            <div className="mt-[42px] flex items-center gap-3">
              <Button
                type="submit"
                className="h-auto w-full rounded-full bg-main-100 py-3.5 text-white"
              >
                Add beneficiary
              </Button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const Notification: React.FC<ComponentProps> = ({}) => {
  const schema = yup.object().shape({
    taskUpdates: yup.boolean().default(false).optional(),
    tasksRelatedToMe: yup.boolean(),
    messagesFromOrganization: yup.boolean(),
    payments: yup.boolean(),
  });

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
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="block"
        id="notification"
      >
        <div className="rounded-2xl bg-white p-6">
          <div>
            <div className="">
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Push Notification
              </h3>
              <p className="text-sm text-[#475467]">
                Messages you receive from the app
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {pushNotifications?.map((item: any, index: number) => (
                <NotificationType
                  data={item}
                  control={control}
                  key={item.value + index}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mt-[64px]">
              <h3 className="mb-1 text-lg font-semibold text-[#101828]">
                Email Notification
              </h3>
              <p className="text-sm text-[#475467]">
                Messages that will be sent to your mail
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {emailNotifications?.map((item: any, index: number) => (
                <NotificationType
                  data={item}
                  control={control}
                  key={item.value + index}
                />
              ))}
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

const NotificationType: React.FC<{
  data: any;

  control: Control<any>;
}> = ({ data, control }) => {
  return (
    <>
      <div className="flex w-full items-center justify-between rounded-full bg-[#F8F8F8] px-3 py-4">
        <span className="text-base font-medium text-[#333]">{data?.label}</span>

        <Controller
          name={data?.value}
          control={control}
          render={({ field: { value, onChange } }) => (
            <Switch
              className="bg-[#EAEAEA] shadow-[0_0_1px_rgba(0,0,0,0.25)] data-[state=checked]:bg-[#EAEAEA] *:data-[state=checked]:bg-main-100 *:data-[state=unchecked]:bg-[#E0E0E0] *:data-[state=unchecked]:shadow-[0_0_3px_rgba(0,0,0,0.25)]"
              checked={value}
              onCheckedChange={onChange}
            />
          )}
        />
      </div>
    </>
  );
};

const settingTabs = [
  { label: "Profile", value: "profile" },
  { label: "Password", value: "password" },
  { label: "Location", value: "location" },
  { label: "Payment", value: "payment" },
  { label: "Notification", value: "notification" },
];

const pushNotifications = [
  {
    label: "Task Updates",
    value: "taskUpdates",
    isActive: true,
  },
  {
    label: "Tasks related to me",
    value: "tasksRelatedToMe",
    isActive: true,
  },
  {
    label: "Messages from organization",
    value: "messagesFromOrganization",
    isActive: true,
  },
  {
    label: "Payments",
    value: "payments",
    isActive: true,
  },
];

const emailNotifications = [
  {
    label: "Task Updates",
    value: "taskUpdates",
    isActive: true,
  },
  {
    label: "Tasks related to me",
    value: "tasksRelatedToMe",
    isActive: false,
  },
  {
    label: "Messages from organization",
    value: "messagesFromOrganization",
    isActive: true,
  },
  {
    label: "Payments",
    value: "payments",
    isActive: true,
  },
];

const addBeneficiary = [
  {
    label: "Currency",
    type: "select",
    required: true,
    err_message: "Select currency",
    name: "currency",
    placeholder: "Select currency",
  },
  {
    label: "Bank name",
    type: "select",
    required: true,
    err_message: "Select bank name",
    name: "bankName",
    placeholder: "Select bank name",
  },
  {
    label: "Account number",
    type: "number",
    required: true,
    err_message: "Input account number",
    name: "accountNumber",
    placeholder: "Input number",
  },
  {
    label: "Account name",
    type: "text",
    required: true,
    err_message: "Input account name",
    name: "accountName",
    placeholder: "Input name",
  },
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

const passwordFormData = [
  {
    label: "Current password",
    type: "password",
    required: true,
    err_message: "Input your old password",
    name: "oldPassword",
    placeholder: "Input password",
  },
  {
    label: "New password",
    type: "password",
    required: true,
    err_message: "Input your new password",
    name: "password",
    placeholder: "Input password",
  },
  {
    label: "Confirm password",
    type: "password",
    required: true,
    err_message: "Input your confirm password",
    name: "passwordAgain",
    placeholder: "Input password",
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

// ADD BENEFICIARY
// Define the options for the select fields
const currencyOptions = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "NGN", value: "ngn" },
];

const bankOptions = [
  { label: "First Bank", value: "firstBank" },
  { label: "GT Bank", value: "gtBank" },
  { label: "Zenith Bank", value: "zenithBank" },
];

const getFieldOptions = (name: string) => {
  switch (name) {
    case "currency":
      return currencyOptions;
    case "bankName":
      return bankOptions;
    default:
      return [];
  }
};
