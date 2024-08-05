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
import { X } from "lucide-react";
import Image from "next/image";
import useShowOverlay from "@/stores/overlay";

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
  const [selectedOption, setSelectedOption] = useState(null);
  const { setOpen } = useShowOverlay();

  const handleProceed = (e: any) => {
    e.preventDefault();

    // setStep((prev: number) => prev + 1);
    setOpen(true);
    console.log("heheheh");
  };

  const handleSkip = () => {};

  return (
    <>
      <div className="lg:w-[80% relative z-10 md:w-[70%]">
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
            onSubmit={(e) => handleProceed(e)}
          >
            {/* PRIMARY LANGUAGE */}
            <div className="">
              <label
                htmlFor="primary-language"
                className="mb-2 inline-block font-normal capitalize text-[#4F4F4F]"
              >
                primary language
              </label>

              <Select2
                name="primary-language" /*onValueChange={onChange} defaultValue={value}*/
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang: any, index: number) => {
                    return (
                      <SelectItem key={index} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select2>
            </div>

            <div className="">
              <label
                htmlFor="spoken-language"
                className="mb-2 inline-block font-normal capitalize text-[#4F4F4F]"
              >
                spoken language
              </label>

              <Select
                // defaultValue={selectedOption}
                // onChange={(e) => se}
                isMulti
                options={languages}
              />
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
