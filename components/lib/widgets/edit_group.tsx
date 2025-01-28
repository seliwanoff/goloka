import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEditCampaignOverlay } from "@/stores/overlay";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateCampaignGroupById } from "@/services/campaign";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
});

const EditCampaignGroup = () => {
  const { title, description, id, setShow, setIsShowEdit } =
    useEditCampaignOverlay(); // Initial values from overlay
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      title: "",
      description: "",
    },
  });

  // Populate form with initial values
  useEffect(() => {
    setValue("title", title || "");
    setValue("description", description || "");
  }, [title, description, setValue]);

  const onUpdateCampaignGroup = async (data: any) => {
    setIsSubmitting(true);
    try {
      await updateCampaignGroupById(id, data.title, data.description);
      toast.success("Campaign group updated!");
      setShow(false);
      setIsShowEdit(true);
      reset();
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
      console.error("Error updating campaign group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form
        id="edit_campaign_group"
        onSubmit={handleSubmit(onUpdateCampaignGroup)}
        className="space-y-6"
      >
        {/* Group Name */}
        <div>
          <Label
            htmlFor="title"
            className="mb-2 inline-block font-light text-[#4F4F4F]"
          >
            Group name
          </Label>
          <div className="relative">
            <Input
              {...register("title")}
              id="title"
              name="title"
              placeholder="Input name"
              className={cn(
                "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
                errors.title &&
                  "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
              )}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="description"
            className="mb-2 inline-block font-light text-[#4F4F4F]"
          >
            Description
          </Label>
          <Textarea
            {...register("description")}
            id="description"
            name="description"
            placeholder="Describe the group here."
            className={cn(
              "form-input rounded-lg border border-[#D9DCE0] px-4 py-[18px] outline-0 placeholder:text-[#828282] focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0",
              errors.description &&
                "border-red-600 focus:border-red-600 focus-visible:ring-red-600",
            )}
          />
          {errors.description && (
            <p className="text-sm text-red-500">{errors.description.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <Button
            className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
            type="submit"
            disabled={!watch("title") || isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin text-[#fff]" />
            ) : (
              "Update campaign group"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCampaignGroup;
