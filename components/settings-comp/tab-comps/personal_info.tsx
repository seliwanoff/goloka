import CustomInput from "@/components/lib/widgets/custom_inputs";
import OtherPersonalInfo from "./other_personal_info";
import { genderOptions, personalInfo } from "@/utils";
import CustomSelectField from "../select_field";
import { Camera } from "iconsax-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Avatar from "@/public/assets/images/contributor-profile.jpeg";

type ComponentProps = {};

const schema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  dateOfBirth: yup.string().required(),
  dateOfBirth1: yup.string().required(),
  phoneNo: yup.string().required(),
  gender: yup.string().required(),
  gender1: yup.string().required(),
  email: yup.string().email().required(),
  primaryLanguage: yup.string().required(),
  religion: yup.string().required(),
  ethnicity: yup.string().required(),

  spokenLanguage: yup.string().required(),
});

const PersonalInfo: React.FC<ComponentProps> = ({}) => {
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
    console.log(data, "clicked");
  };
  return (
    <>
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

        {/* OTHER PERSONAL INFO */}
        <OtherPersonalInfo
          errors={errors}
          register={register}
          control={control}
        />
      </form>
    </>
  );
};

export default PersonalInfo;
