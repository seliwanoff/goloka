import React from "react";
import CustomInput from "@/components/lib/widgets/custom_inputs";
import {
  genderOptions,
  personalFirstName,
  personalInfo,
  personalInfoCreate,
} from "@/utils";
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

import { createContributor } from "@/services/contributor";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/user";
import { userInfo } from "os";
import { getCurrentOrganization } from "@/services/auth";
import { getOrganizationByDomain } from "@/services/organization";
import { normalizeSpokenLanguages } from "@/components/settings-comp/multiSelect";
import CustomSelectField from "@/components/settings-comp/select_field";
import OtherPersonalInfo from "@/components/settings-comp/tab-comps/other_personal_info";
import { FaSpinner } from "react-icons/fa";
import OtherContributorWidget from "@/components/settings-comp/tab-comps/other_info_widget_create_contributo";
import { useRouter } from "next/navigation";
import { useCreateContributorOverlay } from "@/stores/overlay";

type ComponentProps = {};

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
  profile_photo_url?: string; // Add this field
};

// Update the schema to include profile_photo_url
const schema = yup.object().shape({
  firstName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  phoneNo: yup.string(),
  gender: yup.string().required(),
  email: yup.string().email().required(),
  primaryLanguage: yup.string().required(),
  religion: yup.string().required(),
  ethnicity: yup.string().required(),
  spokenLanguage: yup.array().of(yup.string()).required(),
  profile_photo_url: yup.string(), // Add this field
});

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

const CreateContributorWidget: React.FC<ComponentProps> = ({}) => {
  const { user: remoteUser } = useRemoteUserStore();
  const currentUser = useUserStore((state) => state.user);
  //const [isFormDirty, setIsFormDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [users, setUsers] = useState([]);

  const { setOpenContributor } = useCreateContributorOverlay();
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
      profile_photo_url: "profile_photo_url", // Add this mapping
    };

    const merged: Record<string, any> = {};

    Object.keys(keyMapping).forEach((sourceKey) => {
      const targetKey = keyMapping[sourceKey];
      let value =
        safeGet(remoteUser, sourceKey) || safeGet(currentUser, sourceKey);
      //safeGet(users, sourceKey);

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
  const router = useRouter();

  // Update the initialAvatar logic to use profile_photo_url from form values
  const initialAvatar = useMemo(() => {
    const fullName = `${mergedUserData.firstName || ""}`.trim();
    return (
      mergedUserData?.profile_photo_url ||
      generateAvatarFromInitials(fullName) ||
      Avatar.src
    );
  }, [mergedUserData]);

  // Update useForm initialization
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    //@ts-ignore
    resolver: yupResolver(schema),
    //   defaultValues: mergedUserData,
    mode: "onChange",
  });
  //console.log(formState)
  // Update form submission to include profile_photo_url
  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const formData = new FormData();

      // Add all form fields
      formData.append("name", data.firstName);
      formData.append("birth_date", new Date(data.dateOfBirth).toISOString());
      formData.append("tel", data.phoneNo || "");
      formData.append("gender", data.gender);
      formData.append("religion", data.religion);
      formData.append("ethnicity", data.ethnicity);
      formData.append("primary_language", data.primaryLanguage);
      formData.append("email", data.email);

      // Add spoken languages
      data.spokenLanguage.forEach((lang, index) => {
        formData.append(`spoken_languages[${index}]`, lang);
      });

      // Handle profile photo
      if (image) {
        formData.append("profile_photo", image);
      } else if (data.profile_photo_url) {
        formData.append("profile_photo_url", data.profile_photo_url);
      }

      const response = await createContributor(formData);

      if (!response) {
        throw new Error("Failed to submit the form. Please try again.");
      }
      //@ts-ignore
      toast.success(response?.message);
      setInitialValues(data);
      setOpenContributor(false);
      //  setIsFormDirty(false);

      // Cleanup old image URL
      if (imgUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imgUrl);
      }
      getCurrentOrganization(null);
      window.location.href = "/dashboard/root";
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [imgUrl, setImgUrl] = useState<string>(initialAvatar);
  const [image, setImage] = useState<File | null>(null);

  // Watch all form fields
  const formValues = watch();

  // Initialize form with merged data
  useEffect(() => {
    if (mergedUserData && !isInitialized) {
      Object.entries(mergedUserData).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value);
      });
      //@ts-ignore
      setInitialValues(mergedUserData);
      setIsInitialized(true);
    }
  }, [mergedUserData, setValue, isInitialized]);

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
      // setIsFormDirty(hasChanges || hasImageChange);
    }
  }, [formValues, initialValues, image]);
  // Ensure form values are set when user data is available
  useEffect(() => {
    if (mergedUserData) {
      Object.entries(mergedUserData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          setValue(key as keyof FormValues, value);
        }
      });
    }
  }, [mergedUserData, setValue]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file size and type
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (file.size > maxSize) {
          toast.error("Image size should be less than 5MB");
          return;
        }

        if (!allowedTypes.includes(file.type)) {
          toast.error("Please upload a valid image file (JPEG, PNG, or WebP)");
          return;
        }

        const url = URL.createObjectURL(file);
        setImgUrl(url);
        setImage(file);

        // Cleanup previous object URL to prevent memory leaks
        return () => URL.revokeObjectURL(url);
      }
    },
    [],
  );

  React.useEffect(() => {
    return () => {
      if (imgUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imgUrl);
      }
    };
  }, [imgUrl]);

  // console.log(users);
  return (
    <form
      className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 block max-h-[80vh] overflow-y-auto"
      id="personal-info"
      onSubmit={handleSubmit(onSubmit)}
      style={{
        scrollbarWidth: "none", // Hides scrollbar in Firefox
        msOverflowStyle: "none",
      }}
    >
      <div className="rounded-2xl bg-white p-6">
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
              disabled={isLoading}
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
                // disabled={isLoading}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {personalInfoCreate.map((data: any, index: number) => {
              if (data.type === "select") {
                return (
                  <CustomSelectField
                    data={data}
                    errors={errors}
                    register={register}
                    control={control}
                    key={data?.name + index}
                    options={genderOptions}
                    disabled={isLoading}
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
                  // disabled={isLoading}
                />
              );
            })}
            <OtherContributorWidget
              errors={errors}
              register={register}
              control={control}
              defaultValues={mergedUserData}
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="mt-4 w-full rounded-full bg-main-100 text-white"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner size={20} /> : "Create Contributor"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateContributorWidget;
