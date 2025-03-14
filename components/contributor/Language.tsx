import React, { useState } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useShowOverlay } from "@/stores/overlay";
import { useContributorStore } from "@/stores/contributors";
import { useLoadingStore } from "@/stores/misc";
import { cn } from "@/lib/utils";

type PageProps = {
  setStep: (step: number | ((prev: number) => number)) => void;
  step: number;
};

export const languages = [
  { label: "Arabic", value: "arabic" },
  { label: "Bachama", value: "bachama" },
  { label: "Bengali", value: "bengali" },
  { label: "Bura", value: "bura" },
  { label: "Dutch", value: "dutch" },
  { label: "Efik", value: "efik" },
  { label: "English", value: "english" },
  { label: "French", value: "french" },
  { label: "Fulfulde", value: "fulfulde" },
  { label: "Gamargu", value: "gamargu" },
  { label: "German", value: "german" },
  { label: "Gbagyi", value: "gbagyi" },
  { label: "Hausa", value: "hausa" },
  { label: "Hindi", value: "hindi" },
  { label: "Higgi", value: "higgi" },
  { label: "Ibibio", value: "ibibio" },
  { label: "Ijaw", value: "ijaw" },
  { label: "Italian", value: "italian" },
  { label: "Japanese", value: "japanese" },
  { label: "Jukun", value: "jukun" },
  { label: "Kanuri", value: "kanuri" },
  { label: "Kare Kare", value: "kare_kare" },
  { label: "Kilba", value: "kilba" },
  { label: "Kibaku", value: "kibaku" },
  { label: "Korean", value: "korean" },
  { label: "Mandara", value: "mandara" },
  { label: "Mandarin Chinese", value: "mandarin_chinese" },
  { label: "Marghi", value: "marghi" },
  { label: "Nigerian Pidgin", value: "pidgin_english" },
  { label: "Nupe", value: "nupe" },
  { label: "Persian", value: "persian" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Punjabi", value: "punjabi" },
  { label: "Russian", value: "russian" },
  { label: "Shuwa Arabic", value: "shuwa_arabic" },
  { label: "Spanish", value: "spanish" },
  { label: "Swahili", value: "swahili" },
  { label: "Thai", value: "thai" },
  { label: "Tiv", value: "tiv" },
  { label: "Turkish", value: "turkish" },
  { label: "Urhobo", value: "urhobo" },
  { label: "Vietnamese", value: "vietnamese" },
  { label: "Yoruba", value: "yoruba" },
  { label: "Waha", value: "waha" },
];

// Validation schema
const languageSchema = z.object({
  primary_language: z.string({
    required_error: "Primary language is required",
  }),
  spoken_languages: z
    .array(z.string())
    .min(1, "Select at least one spoken language"),
});

type LanguageFormValues = z.infer<typeof languageSchema>;

const Language: React.FC<PageProps> = ({ setStep, step }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setOpen } = useShowOverlay();
  const { setStep2Info, submitUserInfo } = useContributorStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: LanguageFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call or processing
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStep2Info(data);
      setOpen(true);
      submitUserInfo();
      setStep((prev) => prev + 1);
    } catch (error) {
      console.error("Error submitting language info:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setStep((prev) => prev + 1);
  };

  return (
    <>
      <div className="relative z-10 w-full">
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
            facilisis vulputate.
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
                disabled={!isValid || isSubmitting}
                className={cn(
                  "h-12 w-full rounded-full bg-main-100 text-base font-light text-white transition-all",
                  "hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50",
                )}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Proceed"
                )}
              </Button>

              {/* <Button
                type="button"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="w-full bg-transparent text-base text-main-100 hover:bg-transparent disabled:opacity-50"
              >
                Skip
              </Button> */}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Language;
