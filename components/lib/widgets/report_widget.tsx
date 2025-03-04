import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";

import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAddcampaignGroupOverlay, useShowReport } from "@/stores/overlay";
import { addCampaignGroup } from "@/services/contributor";
import { toast } from "sonner";
import { BankAutocomplete } from "./bankAutoComplete";
import { Textarea } from "@/components/ui/textarea";
import { reportOrganizationAndCampaign } from "@/services/reports";
import { useUserStore } from "@/stores/currentUserStore";

const schema = yup.object().shape({
  // currency: yup.string().required(),
  name: yup.string().required(),
  description: yup.string().required(),
});
const ReportWidget = () => {
  const { setShowReport, showReport } = useShowReport();
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

  const currentUser = useUserStore((state) => state.user);
  const { reportId } = useShowReport();

  // console.log(currentUser);

  const onAddBeneficiary = async (data: any) => {
    setIsSubmitting(true);
    const { name, description } = data;

    //console.log(data);
    try {
      const res = await reportOrganizationAndCampaign(
        reportId as string,
        name,
        description,
      );
      toast.success("Report submitted successfully");
      setIsSubmitting(false);
      setShowReport(false);

      reset();
    } catch (error) {
      //@ts-ignore
      toast.error(
        //@ts-ignore
        error?.response?.data?.message ||
          "Connection error. Please try again...",
      );
      setIsSubmitting(false);
      //@ts-ignore
      // console.error(error?.response?.data?.message);
      setShowReport(true);
    } finally {
    }
  };

  return (
    <>
      <div className="">
        <h3 className="text-center font-medium text-[#333333]">
          We are very sorry for the inconvenience, let’s hear
          <br />
          what happened with your trip
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
                Title
              </Label>
              <div className="relative">
                <Input
                  {...register("name")}
                  id="name"
                  name="name"
                  autoComplete="off"
                  placeholder="Input title here"
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
                autoComplete="off"
                placeholder="Explain what happen here."
                className={cn(
                  "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                  errors.description &&
                    "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
                )}
              />
            </div>

            <div>
              <Button
                className="mt-4 h-auto w-full rounded-full bg-[#EB5757] py-3 text-white hover:bg-[#EB5757] hover:text-white"
                type="submit"
                disabled={watch("name") === undefined && true}
              >
                {isSubmitting ? (
                  <Loader className="animate-spin text-[#fff]" />
                ) : (
                  ` Report  ${(currentUser && currentUser.current_role) || "organization"} `
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportWidget;
