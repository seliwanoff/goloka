import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  useAddcampaignGroupOverlay,
  useCreateOrganizationOverlay,
} from "@/stores/overlay";
import { addCampaignGroup } from "@/services/contributor";
import { toast } from "sonner";
import { BankAutocomplete } from "./bankAutoComplete";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/task-stepper/fileUpload";
import { createOrganization } from "@/services/organization";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  phone: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
});
const CreateNewOrganization = () => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile_photo, setProfilePhoto] = useState<File | null>(null);
  const router = useRouter();
  const { setOpenOrganization } = useCreateOrganizationOverlay();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  // console.log(profile_photo.name);

  const onCreateOrganization = async (data: any) => {
    setIsSubmitting(true);
    const { name, description, phone } = data;

    try {
      const formData = new FormData();

      //console.log(data);
      if (profile_photo) {
        formData.append("profile_photo", profile_photo.name);
      }

      const datas = {
        name: name,
        phone: phone,
        description: description,
      };
      const res = await createOrganization({ ...datas, formData });

      toast.success("Organization created successfully!");
      setOpenOrganization(false);
      window.location.href = `/organization/dashboard/campaigns`;

      reset();
    } catch (error) {
      toast.error("Failed to add create organization. Please try again.");
      setIsSubmitting(false);
      //@ts-ignore
      console.error(error?.response?.data?.message);
    } finally {
      // setFecthed(false);
      setIsSubmitting(false);
    }
  };

  // console.log(watch("accountName"), "watch");

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Input details of the organization you want
          <br />
          to create
        </h3>

        <div className="mt-12">
          <form
            id="add_beneficiary"
            onSubmit={handleSubmit(onCreateOrganization)}
            className="space-y-6"
          >
            {/* GROUP NAME */}
            <div>
              <Label
                htmlFor="accountNumber"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Organization name
              </Label>
              <div className="relative">
                <Input
                  {...register("name")}
                  id="name"
                  name="name"
                  placeholder="Input name"
                  className={cn(
                    "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                    errors.name &&
                      "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                  )}
                />
                {loading && (
                  <Loader className="absolute right-2 top-2 animate-spin text-blue-700" />
                )}
              </div>
            </div>

            {/**** Phone Number */}

            <div>
              <Label
                htmlFor="accountNumber"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Phone number
              </Label>
              <div className="relative">
                <Input
                  {...register("phone")}
                  id="phone"
                  name="phone"
                  placeholder="Input phone number"
                  className={cn(
                    "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                    errors.phone &&
                      "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                  )}
                />
                {loading && (
                  <Loader className="absolute right-2 top-2 animate-spin text-blue-700" />
                )}
              </div>
            </div>
            {/* DESCRIPTION */}
            <div>
              <Label
                htmlFor="accountName"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Deescription
              </Label>

              <Textarea
                {...register("description")}
                id="description"
                name="description"
                placeholder="describe the group here."
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.description &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>
            <div>
              <FileUpload
                ref={null}
                value={null}
                onFileUpload={(file: any) => {
                  setProfilePhoto(file);
                  // console.log(file);
                }}
              />
            </div>

            <div>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
                disabled={watch("name") === undefined && true}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin text-[#fff]" />
                ) : (
                  " Create Organization"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateNewOrganization;
