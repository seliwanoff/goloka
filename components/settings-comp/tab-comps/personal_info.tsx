import React from "react";
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
import { normalizeSpokenLanguages } from "../multiSelect";
import { createContributor } from "@/services/contributor";

type ComponentProps = {};

const schema = yup.object().shape({
  firstName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  phoneNo: yup.string().required(),
  gender: yup.string().required(),
  email: yup.string().email().required(),
  primaryLanguage: yup.string().required(),
  religion: yup.string().required(),
  ethnicity: yup.string().required(),
  spokenLanguage: yup.array().of(yup.string()).required(),
});

type FormValues = {
  email: string;
  firstName: string;
  dateOfBirth: string;
  phoneNo: string;
  gender: string;
  primaryLanguage: string;
  religion: string;
  ethnicity: string;
  spokenLanguage: string[];
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
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);

  const mergedUserData = useMemo(() => {
    const safeGet = (obj: any, key: string) => {
      return obj && obj[key] !== undefined ? obj[key] : "";
    };

    const keyMapping: Record<string, string> = {
      name: "firstName",

      birth_date: "dateOfBirth",
      email: "email",
      gender: "gender",
      primary_language: "primaryLanguage",
      religion: "religion",
      ethnicity: "ethnicity",
      spoken_languages: "spokenLanguage",
      tel: "phoneNo",
    };

    const merged: Record<string, any> = {};

    Object.keys(keyMapping).forEach((sourceKey) => {
      const targetKey = keyMapping[sourceKey];
      let value =
        safeGet(remoteUser, sourceKey) || safeGet(currentUser, sourceKey);

      if (value !== undefined && value !== null) {
        if (sourceKey === "birth_date") {
          merged[targetKey] = value.split(" ")[0];
        } else if (sourceKey === "spoken_languages") {
          merged[targetKey] = normalizeSpokenLanguages(value);
        } else {
          merged[targetKey] =
            typeof value === "string" ? value.toLowerCase() : value;
        }
      }
    });

    return merged;
  }, [currentUser, remoteUser]);

  const initialAvatar = useMemo(() => {
    const fullName = `${mergedUserData.firstName || ""}`.trim();
    return (
      mergedUserData?.profile_photo_url ||
      generateAvatarFromInitials(fullName) ||
      Avatar.src
    );
  }, [mergedUserData]);

  const [imgUrl, setImgUrl] = useState<string>(initialAvatar);
  const [image, setImage] = useState<File | null>(null);

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver(schema),
    defaultValues: {
      ...mergedUserData,
      spokenLanguage: normalizeSpokenLanguages(mergedUserData.spokenLanguage),
    },
  });

  // Watch all form fields
  const formValues = watch();

  useEffect(() => {
    if (mergedUserData && !initialValues) {
      //@ts-ignore
      setInitialValues(mergedUserData);
      reset(mergedUserData);
    }
  }, [mergedUserData, reset, initialValues]);

  // Check if any values have changed from initial values
  useEffect(() => {
    if (initialValues) {
      const hasChanges = Object.keys(formValues).some((key) => {
        if (key === "spokenLanguage") {
          const initial = normalizeSpokenLanguages(initialValues[key]);
          const current = normalizeSpokenLanguages(formValues[key]);
          return JSON.stringify(initial) !== JSON.stringify(current);
        }
        return (
          initialValues[key as keyof FormValues] !==
          formValues[key as keyof FormValues]
        );
      });

      const hasImageChange = image !== null;
      setIsFormDirty(hasChanges || hasImageChange);
    }
  }, [formValues, initialValues, image]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImgUrl(url);
      setImage(file);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      // First, log the raw form data
      console.log("Raw form data:", data);

      // Create the final data object
      const finalData = {
        ...data,
        spokenLanguage: Array.isArray(data.spokenLanguage)
          ? data.spokenLanguage.join(", ")
          : data.spokenLanguage,
        profileImage: image
          ? URL.createObjectURL(image)
          : mergedUserData.profile_photo_url,
      };

      // Log the final data
      console.log("Processed final data:", finalData);

      // Calculate changed values by comparing with initial values
      const changedValues = Object.entries(data).reduce(
        (acc: any, [key, value]) => {
          const initialValue = initialValues?.[key as keyof FormValues];

          // Handle arrays (like spokenLanguage) specially
          if (Array.isArray(value)) {
            if (JSON.stringify(value) !== JSON.stringify(initialValue)) {
              acc[key] = value;
            }
          } else if (value !== initialValue) {
            acc[key] = value;
          }

          return acc;
        },
        {},
      );

      // Add image to changed values if it was updated
      if (image) {
        changedValues.profileImage = URL.createObjectURL(image);
      }

      // Log the changed values
      console.log("Changed values:", changedValues);
      //   const response = await createContributor(finalData);

      // Here you can add your API call
      // try {
      //   console.log("API Response:", response);
      // } catch (error) {
      //   console.error("API Error:", error);
      // }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  useEffect(() => {
    console.log("Form values changed:", formValues);
  }, [formValues]);

  return (
    <form
      className="block max-w-4xl"
      id="personal-info"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("Form submission started");
        handleSubmit((data) => {
          console.log("HandleSubmit callback triggered");
          return onSubmit(data);
        })(e);
      }}
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
              onClick={() => {
                reset(initialValues || {});
                setImage(null);
                setImgUrl(initialAvatar);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-main-100 text-white"
              disabled={!isFormDirty}
              onClick={() => {
                console.log("Submit button clicked");
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>

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
            {personalFirstName.map((data: any, index: number) => (
              <CustomInput
                data={data}
                errors={errors}
                register={register}
                control={control}
                key={data?.name + index}
              />
            ))}
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

      <OtherPersonalInfo
        errors={errors}
        register={register}
        control={control}
        defaultValues={mergedUserData}
      />
    </form>
  );
};

export default PersonalInfo;
