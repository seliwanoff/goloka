import CustomInput from "@/components/lib/widgets/custom_inputs";
import OtherPersonalInfo from "./other_personal_info";
import { genderOptions, personalFirstName, personalInfo } from "@/utils";
import CustomSelectField from "../select_field";
import { Camera } from "iconsax-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import Avatar from "@/public/assets/images/avatar.png";

import { useUserStore } from "@/stores/currentUserStore";
import { useRemoteUserStore } from "@/stores/remoteUser";

type ComponentProps = {};

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  // dateOfBirth1: yup.string().required(),
  phoneNo: yup.string().required(),
  gender: yup.string().required(),
  // gender1: yup.string().required(),
  email: yup.string().email().required(),
  primaryLanguage: yup.string().required(),
  religion: yup.string().required(),
  ethnicity: yup.string().required(),
  spokenLanguage: yup.string().required(),
});

type FormValues = {
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNo: string;
  gender: string;
  primaryLanguage: string;
  religion: string;
  ethnicity: string;
  spokenLanguage: string;
};

const generateAvatarFromInitials = (name: string) => {
  if (!name) return null;
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
  ];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="${randomColor}"><text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="40" fill="white">${initials}</text></svg>`;
};

const PersonalInfo: React.FC<ComponentProps> = ({}) => {
  const { user: remoteUser } = useRemoteUserStore();
  const currentUser = useUserStore((state) => state.user);

  // Merge user data, prioritizing remoteUser and handling duplicates
  const mergedUserData = useMemo(() => {
    // Safely get values or return empty string
    const safeGet = (obj: any, key: string) => {
      return obj && obj[key] !== undefined ? obj[key] : "";
    };

    // Mapping of incoming keys to form field keys
    const keyMapping: Record<string, string> = {
      name: "firstName",
      lastName: "lastName",
      birth_date: "dateOfBirth",
      email: "email",
      gender: "gender",
      primary_language: "primaryLanguage",
      religion: "religion",
      ethnicity: "ethnicity",
      spoken_languages: "spokenLanguage",
      phone_code: "phoneNo",
    };

    // Merge and transform data
    const merged: Record<string, string> = {};

    Object.keys(keyMapping).forEach((sourceKey) => {
      const targetKey = keyMapping[sourceKey];

      // Prioritize remoteUser, then currentUser
      let value =
        safeGet(remoteUser, sourceKey) || safeGet(currentUser, sourceKey);

      if (value !== undefined && value !== null) {
        // Special handling for some fields
        if (sourceKey === "birth_date") {
          merged[targetKey] = value.split(" ")[0]; // Extract date part
        } else if (sourceKey === "spoken_languages") {
          merged[targetKey] = Array.isArray(value) ? value.join(", ") : value;
        } else {
          merged[targetKey] = value;
        }
      }
    });

    return merged;
  }, [currentUser, remoteUser]);

  // Generate initial avatar if no image is provided
  const initialAvatar = useMemo(() => {
    const fullName = `${mergedUserData.name || ""}`.trim();
    return (
      mergedUserData?.profile_photo_url ||
      generateAvatarFromInitials(fullName) ||
      Avatar.src
    );
  }, [mergedUserData]);

  const [imgUrl, setImgUrl] = useState<string>(initialAvatar);
  const [image, setImage] = useState<File | null>(null);

  console.log(mergedUserData, "mergedUserData");

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: mergedUserData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImgUrl(url);
      setImage(file);
    }
  };

  const onSubmit = (data: any) => {
    // Merge original data with newly submitted data
    const submittedData = {
      ...mergedUserData,
      ...data,
      profileImage: image
        ? URL.createObjectURL(image)
        : mergedUserData.profile_photo_url,
    };

    console.log("Submitted Data:", submittedData);
    console.log("Uploaded Image:", image);
  };
  return (
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
          <div className="fixed bottom-0 left-0 z-30 grid w-full grid-cols-2 items-center gap-3 bg-white p-4 md:static md:inline-flex md:w-min md:p-0">
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
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <div>
            {personalFirstName.map((data: any, index: number) => {
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
                    options={genderOptions}
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
      </div>

      {/* OTHER PERSONAL INFO */}
      <OtherPersonalInfo
        errors={errors}
        register={register}
        control={control}
      />
    </form>
  );
};

export default PersonalInfo;
