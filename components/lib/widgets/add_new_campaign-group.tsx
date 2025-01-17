import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAddcampaignGroupOverlay } from "@/stores/overlay";
import { addCampaignGroup } from "@/services/contributor";
import { toast } from "sonner";
import { BankAutocomplete } from "./bankAutoComplete";
import { Textarea } from "@/components/ui/textarea";

const schema = yup.object().shape({
  // currency: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
});
const AddNewCampaignGroup = () => {
  const { setShowCreate, setFecthed } = useAddcampaignGroupOverlay();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const name = watch("name");
  const description = watch("description");

  const onAddBeneficiary = async (data: any) => {
    setIsSubmitting(true);
    const { name, description } = data;

    //console.log(data);
    try {
      console.log(data, "New Beneficiary");
      const res = await addCampaignGroup(name, description);
      toast.success("Campaign group added successfully!");
      setIsSubmitting(false);
      setShowCreate(false);
      setFecthed(true);

      reset();
    } catch (error) {
      toast.error("Failed to add campaign group. Please try again.");
      setIsSubmitting(false);
      //@ts-ignore
      console.error(error?.response?.data?.message);
      setShowCreate(true);
    } finally {
      // setFecthed(false);
    }
  };

  // console.log(watch("accountName"), "watch");

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          Input details of the campaign group you want
          <br />
          to create
        </h3>

        <div className="mt-12">
          <form
            id="add_beneficiary"
            onSubmit={handleSubmit(onAddBeneficiary)}
            className="space-y-6"
          >
            {/* GROUP NAME */}
            <div>
              <Label
                htmlFor="accountNumber"
                className="mb-2 inline-block font-light text-[#4F4F4F]"
              >
                Group name
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
              <Button
                className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
                type="submit"
                disabled={watch("name") === undefined && true}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin text-[#fff]" />
                ) : (
                  " Create campaign group"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddNewCampaignGroup;
