import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Loader } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useAddQuestionSectionOverlay,
  useEditCampaignOverlay,
} from "@/stores/overlay";
import { Input } from "@/components/ui/input";

import { createSection, updateSection } from "@/services/campaign/question";
import { useSearchParams } from "next/navigation";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  // description: yup.string().required("Description is required"),
});

interface sectionNameProps {
  status: any;
}

const AddQuestionSection = ({ status }: sectionNameProps) => {
  const { title, id, setShow } = useEditCampaignOverlay(); // Initial values from overlay
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setShowSection, setIsSectionAdded, sectionName, sectionId } =
    useAddQuestionSectionOverlay();

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
    },
  });

  // console.log("sectionName", sectionName);

  // Populate form with initial values
  useEffect(() => {
    setValue("title", sectionName || "");
    //  setValue("description", description || "");
  }, [title, setValue]);
  const searchParams = useSearchParams();

  const questionId = searchParams.get("questionId") || 0;

  const onCreateSection = async (data: any) => {
    setIsSubmitting(true);
    try {
      status === "create"
        ? await createSection(questionId, data.title)
        : await updateSection(questionId, data.title, sectionId);
      toast.success(
        status === "update" ? "Section Updated" : "Section created!",
      );
      setShowSection(false);
      setIsSectionAdded(true);
      reset();
    } catch (error) {
      toast.error("Failed to create section. Please try again.");
      console.error("Error updating campaign group:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <form
        id="edit_campaign_group"
        onSubmit={handleSubmit(onCreateSection)}
        className="space-y-6"
      >
        {/* Group Name */}
        <div>
          <Label
            htmlFor="title"
            className="mb-2 inline-block font-light text-[#4F4F4F]"
          >
            Section name
          </Label>
          <div className="relative">
            <Input
              {...register("title")}
              id="title"
              name="title"
              placeholder="Input name"
              // value={title}
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

        {/* Submit Button */}
        <div>
          <Button
            className="mt-4 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
            type="submit"
            disabled={!watch("title") || isSubmitting}
          >
            {isSubmitting ? (
              <Loader className="animate-spin text-[#fff]" />
            ) : status === "update" ? (
              "Update section"
            ) : (
              "Add question"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionSection;
