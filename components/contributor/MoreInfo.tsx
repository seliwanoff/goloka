import React from "react";
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
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

type PageProps = {
  setStep: any;
  step: any;
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

const MoreInfo: React.FC<PageProps> = ({ step, setStep }) => {
  const handleProceed = (e: any) => {
    e.preventDefault();

    setStep((prev: number) => prev + 1);
  };

  const handleSkip = () => {};

  return (
    <>
      <div className="relative z-[1] translate-y-[30%] py-24 lg:translate-y-0 lg:py-10">
        <StepperIndicator setStep={setStep} step={step} />

        <div className="mt-6">
          <h2 className="mb-2 text-2xl font-bold leading-9 text-[#333333]">
            Hi{" "}
            <span className="bg-gradient-to-b from-main-100 from-[55%] to-main-200 bg-clip-text text-transparent">
              Jamiu
            </span>
            , we would like to know you more
          </h2>
          <p className="leading-7 text-[#828282]">
            Lorem ipsum dolor sit amet consectetur. Feugiat ullamcorper
            facilisis vulputate .
          </p>

          <form
            id="more-info"
            className="mt-10 space-y-6"
            onSubmit={(e) => handleProceed(e)}
          >
            {/* DATE OF BIRTH */}
            <div className="">
              <label
                htmlFor="dob"
                className="mb-2 inline-block text-base font-normal text-[#4F4F4F]"
              >
                Date of birth
              </label>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal")}
                  >
                    <span>Pick a date</span>
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    // selected={field.value}
                    // onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* GENDER */}
            <div className="">
              <label
                htmlFor="gender"
                className="mb-2 inline-block font-normal text-[#4F4F4F]"
              >
                Gender
              </label>

              <Select
                name="gender" /*onValueChange={onChange} defaultValue={value}*/
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* RELIGION */}
            <div className="">
              <label
                htmlFor="religion"
                className="mb-2 inline-block font-normal text-[#4F4F4F]"
              >
                Religion
              </label>

              <Select
                name="religion" /*onValueChange={onChange} defaultValue={value}*/
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  {religions.map((rel: any, index: number) => (
                    <SelectItem key={index} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ethnicity */}

            <div className="">
              <label
                htmlFor="ethnicity"
                className="mb-2 inline-block font-normal text-[#4F4F4F]"
              >
                Ethnicity
              </label>

              <Select
                name="ethnicity" /*onValueChange={onChange} defaultValue={value}*/
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  {ethnicities.map((rel: any, index: number) => (
                    <SelectItem key={index} value={rel.value}>
                      {rel.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-3 pt-6">
              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-main-100 text-base font-light text-white hover:bg-blue-700"
              >
                Proceed
              </Button>
              <Button
                onClick={handleSkip}
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

export default MoreInfo;
