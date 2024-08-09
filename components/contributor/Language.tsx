import React from "react";
import StepperIndicator from "./StepperIndicator";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  Select as Select2,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import useShowOverlay from "@/stores/overlay";
import { useContributorStore } from "@/stores/contributors";
import { useLoadingStore } from "@/stores/misc";
import { FaSpinner } from "react-icons/fa";

type PageProps = {
  setStep: any;
  step: number;
};

const languages = [
  { value: "english", label: "English" },
  { label: "Mandarin Chinese", value: "mandarin_chinese" },
  { label: "Spanish", value: "spanish" },
  { label: "Hindi", value: "hindi" },
  { label: "French", value: "french" },
  { label: "Arabic", value: "arabic" },
  { label: "Bengali", value: "bengali" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Russian", value: "russian" },
  { label: "Japanese", value: "japanese" },
  { label: "Punjabi", value: "punjabi" },
  { label: "German", value: "german" },
  { label: "Korean", value: "korean" },
  { label: "Vietnamese", value: "vietnamese" },
  { label: "Turkish", value: "turkish" },
  { label: "Italian", value: "italian" },
  { label: "Persian", value: "persian" },
  { label: "Dutch", value: "dutch" },
  { label: "Thai", value: "thai" },
  { label: "Swahili", value: "swahili" },
];

const Language: React.FC<PageProps> = ({ setStep, step }) => {
  const { loading } = useLoadingStore();
  const { setOpen } = useShowOverlay();
  const { setStep2Info, submitUserInfo } = useContributorStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    setStep2Info(data);
    console.log(data);
    setOpen(true);
    submitUserInfo();
  };

  const handleSkip = () => {};

  return (
    <>
      <div className="relative z-10 md:w-[70%] lg:w-[80%]">
        <StepperIndicator setStep={setStep} step={step} />

        <div className="mt-6">
          <h2 className="mb-2 text-2xl font-bold leading-9 text-[#333333]">
            Let us know about your&nbsp;
            <span className="bg-gradient-to-b from-main-100 from-[55%] to-main-200 bg-clip-text text-transparent">
              language&nbsp;
            </span>
            preference
          </h2>
          <p className="leading-7 text-[#828282]">
            Lorem ipsum dolor sit amet consectetur. Feugiat ullamcorper
            facilisis vulputate .
          </p>

          <form
            id="more-info"
            className="mt-10 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* PRIMARY LANGUAGE */}
            <div className="">
              <label
                htmlFor="primary_language"
                className="mb-2 inline-block font-normal capitalize text-[#4F4F4F]"
              >
                Primary Language
              </label>

              <Controller
                name="primary_language"
                control={control}
                render={({ field }) => (
                  <Select2 value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your primary language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang: any, index: number) => (
                        <SelectItem key={index} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select2>
                )}
              />
              {errors.primary_language && (
                <p className="text-red-500">
                  {errors.primary_language.message as string}
                </p>
              )}
            </div>

            {/* SPOKEN LANGUAGES */}
            <div className="">
              <label
                htmlFor="spoken_languages"
                className="mb-2 inline-block font-normal capitalize text-[#4F4F4F]"
              >
                Spoken Languages
              </label>

              <Controller
                name="spoken_languages"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    isMulti
                    options={languages}
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    value={languages.filter((lang) =>
                      field?.value?.includes(lang.value),
                    )}
                    onChange={(selectedOptions) => {
                      field.onChange(
                        selectedOptions.map((option: any) => option.value),
                      );
                    }}
                  />
                )}
              />
              {errors.spoken_languages && (
                <p className="text-red-500">
                  {errors.spoken_languages.message as string}
                </p>
              )}
            </div>

            <div className="grid gap-3 pt-6">
              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Proceed"}
              </Button>

              <Button
                onClick={handleSkip}
                type="button"
                className="w-full bg-transparent text-base text-main-100 hover:bg-transparent"
              >
                Skip
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Language;
