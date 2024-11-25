import React, { useState } from "react";
import StepperIndicator from "./StepperIndicator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContributorStore } from "@/stores/contributors";
import { useUserStore } from "@/stores/currentUserStore";
import DatePickerField from "./datePicker";

type PageProps = {
  setStep: (step: number | ((prev: number) => number)) => void;
  step: number;
};

const religions = [
  { label: "Christianity", value: "christianity" },
  { label: "Islam", value: "islam" },
  { label: "Hinduism", value: "hinduism" },
  { label: "Buddhism", value: "buddhism" },
  { label: "Sikhism", value: "sikhism" },
  { label: "Judaism", value: "judaism" },
  { label: "Atheism", value: "atheism" },
  { label: "Agnosticism", value: "agnosticism" },
  { label: "Other", value: "other" },
];

const ethnicities = [
  { label: "Asian", value: "asian" },
  { label: "Black or African American", value: "black_or_african_american" },
  { label: "Hispanic or Latino", value: "hispanic_or_latino" },
  { label: "White", value: "white" },
  { label: "Native American", value: "native_american" },
  { label: "Pacific Islander", value: "pacific_islander" },
  { label: "Mixed Race", value: "mixed_race" },
  { label: "Other", value: "other" },
];

// Form schema using zod
const formSchema = z.object({
  birth_date: z.date({
    required_error: "Date of birth is required",
  })
    .min(new Date("1900-01-01"), "Date of birth cannot be before 1900")
    .max(new Date(), "Date of birth cannot be in the future"),
  gender: z.string({
    required_error: "Gender is required",
  }),
  religion: z.string({
    required_error: "Religion is required",
  }),
  ethnicity: z.string({
    required_error: "Ethnicity is required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const MoreInfo: React.FC<PageProps> = ({ step, setStep }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setStep1Info } = useContributorStore();
  const currentUser = useUserStore((state) => state.user);

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
      // Convert Date to formatted string
      const formattedData = {
        birth_date: data.birth_date.toISOString().split('T')[0], // YYYY-MM-DD format
        gender: data.gender,
        religion: data.religion,
        ethnicity: data.ethnicity
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setStep1Info(formattedData);
      setStep((prev: number) => prev + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    setStep((prev: number) => prev + 1);
  };

  const firstName = currentUser?.name?.split(" ")[0];
  const formattedName = firstName
    ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
    : "";

  return (
    <>
      <div className="relative z-[1] lg:py-10">
        <StepperIndicator setStep={setStep} step={step} />

        <div className="mt-6">
          <div>
            <h2 className="mb-2 text-xl font-bold leading-tight text-[#333333] lg:text-2xl">
              Hi{" "}
              <span className="bg-gradient-to-b from-main-100 from-[55%] to-main-200 bg-clip-text text-transparent">
                {formattedName}
              </span>
              , we would like to know you more
            </h2>
            <p className="text-sm leading-relaxed text-[#828282] lg:text-base">
              Lorem ipsum dolor sit amet consectetur. Feugiat ullamcorper
              facilisis vulputate.
            </p>
          </div>

          <form
            id="more-info"
            className="mt-10 space-y-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* DATE OF BIRTH */}
            {/* <div className="">
              <label
                htmlFor="birth_date"
                className="mb-2 inline-block text-base font-normal text-[#4F4F4F]"
              >
                Date of birth
              </label>

              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal", {
                          "border-red-500": errors.birth_date,
                        })}
                      >
                        <span>
                          {field.value
                            ? field.value.toLocaleDateString()
                            : "Pick a date"}
                        </span>
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.birth_date && (
                <p className="text-xs text-red-500">
                  {errors.birth_date.message}
                </p>
              )}
            </div> */}
            <DatePickerField control={control} errors={errors} />
            {/* GENDER */}
            <div className="">
              <label
                htmlFor="gender"
                className="mb-2 inline-block font-normal text-[#4F4F4F]"
              >
                Gender
              </label>

              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              )}
            </div>

            {/* RELIGION */}
            <div className="">
              <label
                htmlFor="religion"
                className="mb-2 inline-block font-normal text-[#4F4F4F]"
              >
                Religion
              </label>

              <Controller
                name="religion"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select religion" />
                    </SelectTrigger>
                    <SelectContent>
                      {religions.map((rel, index) => (
                        <SelectItem key={index} value={rel.value}>
                          {rel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.religion && (
                <p className="text-xs text-red-500">
                  {errors.religion.message}
                </p>
              )}
            </div>

            {/* ETHNICITY */}
            <div className="">
              <label
                htmlFor="ethnicity"
                className="mb-2 inline-block font-normal text-[#4F4F4F]"
              >
                Ethnicity
              </label>

              <Controller
                name="ethnicity"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select ethnicity" />
                    </SelectTrigger>
                    <SelectContent>
                      {ethnicities.map((ethnicity, index) => (
                        <SelectItem key={index} value={ethnicity.value}>
                          {ethnicity.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.ethnicity && (
                <p className="text-xs text-red-500">
                  {errors.ethnicity.message}
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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed"
                )}
              </Button>
              <Button
                type="button"
                onClick={handleSkip}
                className="w-full bg-transparent text-base text-main-100 hover:bg-transparent disabled:opacity-50"
                disabled={isSubmitting}
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

export default MoreInfo;
