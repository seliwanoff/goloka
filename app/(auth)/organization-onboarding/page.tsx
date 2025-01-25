"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, User, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  profile_photo: z.instanceof(File).optional(),
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const DataphyteOrgForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

      // Only append profile photo if it exists
      if (photoPreview && data.profile_photo) {
        formData.append("profile_photo", data.profile_photo);
      }

      // Simulate API call with FormData
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Log FormData contents (for demonstration)
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setValue("profile_photo", undefined);
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-center text-2xl font-bold">
        Dataphyte Organization Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Photo */}
        <div className="relative mb-4 flex justify-center">
          <Controller
            name="profile_photo"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="profile_photo"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPhotoPreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  {...field}
                />
                <label htmlFor="profile_photo" className="cursor-pointer">
                  <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-gray-100 bg-[#fff] shadow-lg">
                    {photoPreview ? (
                      <>
                        <Image
                          src={photoPreview}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleRemovePhoto();
                          }}
                          className="absolute right-0 top-0 rounded-full bg-red-500 p-1 text-white"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <User className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                </label>
              </div>
            )}
          />
        </div>

        {/* Organization Name */}
        <div>
          <label htmlFor="name" className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
            Organization Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter organization name"
                className={`${errors.name ? "border-red-500" : ""} h-12 rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0`}
              />
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter 11-digit phone number"
                className={errors.phone ? "border-red-500" : ""}
              />
            )}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                placeholder="Enter organization description"
                className={errors.description ? "border-red-500" : ""}
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
        {/* <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-4 w-full"
        > */}
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700 disabled:bg-blue-500"
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
