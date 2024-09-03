import React from "react";
import { Label } from "../ui/label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";

const schema = yup.object().shape({
  suggestion: yup.string().required(),
});

const ReportTab = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onReport = (data: any) => {
    console.log(data);
  };

  return (
    <>
      <h2 className="text-xl font-semibold text-main-100">Report an issue</h2>
      <p className="mt-2 text-[#5C5C5C]">
        Lorem ipsum dolor sit amet consectetur. Sed ut consectetur a libero.
        Lobortis ac sit arcu.
      </p>

      <div className="mt-10">
        <form id="report-issue" onSubmit={handleSubmit(onReport)}>
          <div>
            <Label htmlFor="suggestion" className="sr-only">
              Your Suggestion
            </Label>
            <textarea
              {...register("suggestion")}
              id="suggesstion"
              className={cn(
                "form-textarea rounded-lg border border-[#D9DCE0] p-4 focus:border-main-100 focus:ring-main-100",
                errors.suggestion && "border-red-600 focus:ring-red-600",
              )}
              placeholder="input your suggestion here"
            ></textarea>
          </div>
        </form>
      </div>
    </>
  );
};

export default ReportTab;
