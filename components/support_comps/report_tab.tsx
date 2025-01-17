"use client";

import React from "react";
import { Label } from "../ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
// import { useToast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  reportable_type: yup.string().required("Please select a type"),
  reportable_id: yup.number().default(1),
});

const ReportTab = () => {
  // const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      reportable_id: 1,
      reportable_type: "organization",
    },
  });

  const onReport = (data: any) => {
    console.log("Form submission:", data);
    toast("description Report submitted");
    reset();
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-main-100">Report an issue</h2>
      <p className="mt-2 text-[#5C5C5C]">
        Lorem ipsum dolor sit amet consectetur. Sed ut consectetur a libero.
        Lobortis ac sit arcu.
      </p>

      <div className="mt-10 max-w-96">
        <form
          id="report-issue"
          onSubmit={handleSubmit(onReport)}
          className="space-y-6"
        >
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              {...register("title")}
              id="title"
              className={cn(
                errors.title && "border-red-600 focus:ring-red-600",
              )}
              placeholder="Enter title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              {...register("description")}
              id="description"
              className={cn(
                "form-textarea w-full rounded-lg border border-[#D9DCE0] p-4 focus:border-main-100 focus:ring-main-100",
                errors.description && "border-red-600 focus:ring-red-600",
              )}
              placeholder="Enter description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Reportable Type Radio Buttons */}
          <div className="space-y-2">
            <Label>Type</Label>
            <RadioGroup
              defaultValue="organization"
              onValueChange={(value) => setValue("reportable_type", value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization">Organization</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="contributor" id="contributor" />
                <Label htmlFor="contributor">Contributor</Label>
              </div>
            </RadioGroup>
            {errors.reportable_type && (
              <p className="text-sm text-red-600">
                {errors.reportable_type.message}
              </p>
            )}
          </div>

          <Button className="w-full rounded-full bg-main-100 px-6 py-2 text-white hover:bg-blue-700 hover:text-white">
            Submit Report
          </Button>
        </form>
      </div>
    </>
  );
};

export default ReportTab;
