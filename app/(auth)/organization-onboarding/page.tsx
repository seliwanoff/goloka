"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { createOrganization } from "@/services/organization";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentOrganization } from "@/services/auth";


interface FormValues {
  logo?: File;
  name: string;
  phone: string;
  description: string;
}

const DataphyteOrgForm: React.FC = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormValues>({
    name: "",
    phone: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<FormValues>>({});

  const validateForm = () => {
    const newErrors: Partial<FormValues> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Organization name must be at least 2 characters";
    }

    if (!formData.phone || !/^[0-9]{11}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 11 digits";
    }

    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("phone", formData.phone);
      submitData.append("description", formData.description);

      if (logoPreview && formData.logo) {
        submitData.append("logo", formData.logo);
      }

      const res = await createOrganization(submitData);
      getCurrentOrganization(res.data);

      setIsSubmitting(false);
      //@ts-ignore
      toast.success(res?.message || "Registration successful");
      router.push("/organization/dashboard/root");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "An error occurred");
      setIsSubmitting(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData((prev) => ({ ...prev, logo: undefined }));
  };

  return (
    <div className="mx-auto max-w-xl rounded-xl bg-white p-6">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
        Organization Registration
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Upload */}
        <div className="mb-4 flex justify-center">
          <div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="org_logo"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData((prev) => ({ ...prev, logo: file }));
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
        </div>

        {/* Organization Name */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Organization Name
          </label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Enter organization name"
            className={`${
              errors.name ? "border-red-500" : "border-gray-300"
            } h-12 rounded-md focus:border-main-100 focus:ring-main-100`}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Phone Number
          </label>
          <Input
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            placeholder="Enter 11-digit phone number"
            className={`${
              errors.phone ? "border-red-500" : "border-gray-300"
            } h-12 rounded-md focus:border-main-100 focus:ring-main-100`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block font-medium text-gray-700">
            Description
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Enter organization description"
            className={`${
              errors.description ? "border-red-500" : "border-gray-300"
            } min-h-[100px] rounded-md focus:border-main-100 focus:ring-main-100`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
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
