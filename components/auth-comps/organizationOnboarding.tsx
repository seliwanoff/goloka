

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  profile_photo: z.instanceof(File).optional(),
  name: z.string().min(2, "Organization name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{11}$/, "Phone number must be 11 digits"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const DataphyteOrgForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Organization Registration Data:", {
        profile_photo: data.profile_photo?.name || "No photo uploaded",
        name: data.name,
        phone: data.phone,
        description: data.description,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Dataphyte Organization Registration
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Profile Photo */}
        <div>
          <label htmlFor="profile_photo" className="mb-2 block">
            Profile Photo
          </label>
          <Controller
            name="profile_photo"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  onChange(file);
                }}
                {...field}
              />
            )}
          />
        </div>

        {/* Organization Name */}
        <div>
          <label htmlFor="name" className="mb-2 block">
            Organization Name
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter organization name"
                className={errors.name ? "border-red-500" : ""}
              />
            )}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone" className="mb-2 block">
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
          <label htmlFor="description" className="mb-2 block">
            Description
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
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
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="mt-4 w-full"
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