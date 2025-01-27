"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { createOrganization } from "@/services/organization";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
  logo: z.instanceof(File).optional(),
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const DataphyteOrgForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("phone", data.phone);
      formData.append("description", data.description);

      if (logoPreview && data.logo) {
        formData.append("logo", data.logo);
      }
      const res = await createOrganization(formData);
      console.log(res, "res");
      if (res) {
        setIsSubmitting(false);
         //@ts-ignore
        toast.success(res.message || "Successful");
        router.push("/organization/dashboard/root");
      }

      //   await new Promise((resolve) => setTimeout(resolve, 1000));

      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      //   setIsSubmitting(false);
    } catch (error) {
        // console.error("Error submitting form:", error?.response?.data?.message);
     
        //@ts-ignore
        toast.error(error?.response?.data?.message);
      setIsSubmitting(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setValue("logo", undefined);
  };

  return (
    <div className="mx- max-w-xl rounded-xl bg-white p-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Organization Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Upload */}
        <div className="mb-4 flex justify-center">
          <Controller
            name="logo"
            control={control}
            render={({ field: { onChange } }) => (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="org_logo"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setLogoPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <label htmlFor="org_logo" className="group cursor-pointer">
                  <div className="relative flex h-40 w-40 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition-all hover:border-main-100">
                    {logoPreview ? (
                      <>
                        <Image
                          src={logoPreview}
                          alt="Organization Logo"
                          fill
                          className="rounded-xl object-contain p-4"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemoveLogo();
                          }}
                          className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-all hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-center text-gray-500 transition-all group-hover:text-main-100">
                        <ImagePlus className="mx-auto mb-2 h-12 w-12" />
                        <p className="text-sm">Upload Logo</p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            )}
          />
        </div>

        {/* Organization Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Organization Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter organization name"
                className={`${
                  errors.name ? "border-red-500" : "border-gray-300"
                } h-12 rounded-md focus:border-main-100 focus:ring-main-100`}
              />
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter 11-digit phone number"
                className={`${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } h-12 rounded-md focus:border-main-100 focus:ring-main-100`}
              />
            )}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Enter organization description"
                className={`${
                  errors.description ? "border-red-500" : "border-gray-300"
                } min-h-[100px] rounded-md focus:border-main-100 focus:ring-main-100`}
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="h-12 w-full rounded-full bg-main-100 text-white hover:bg-main-200 disabled:bg-gray-400"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Submit Registration"
          )}
        </Button>
      </form>
    </div>
  );
};

export default DataphyteOrgForm;
