"use client";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmallAnswer } from "@/components/ui/small-input-answer";
import { Label } from "@radix-ui/react-label";
import { Note } from "iconsax-react";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

const dropdownData = [
  {
    id: "shortAnswer",
    label: "Short Answer",
    image: "/images/short-answer.png",
  },
  { id: "paragraph", label: "Paragraph", image: "/images/paragraph.png" },
  { id: "checkbox", label: "Checkbox", image: "/images/checkbox.png" },
  {
    id: "multipleChoices",
    label: "Multiple Choices",
    image: "/images/multiple-choices.png",
  },
  { id: "boolean", label: "Boolean", image: "/images/boolean.png" },
  { id: "dropdowns", label: "Dropdowns", image: "/images/dropdowns.png" },
  { id: "email", label: "Email", image: "/images/email.png" },
  { id: "image", label: "Image", image: "/images/image.png" },
];

const Create = () => {
  const [selectedQuestionType, setSelectedQuestionType] = useState("");

  return (
    <section className="mx-auto mt-5 w-full max-w-[896px]">
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between">
          <CustomBreadCrumbs />
          <div className="flex items-center gap-6">
            <Button
              variant="outline"
              className="rounded-[50px] border-main-100 font-bold text-main-100"
            >
              Generate with AI
            </Button>
            <Button
              variant="outline"
              className="items-center gap-2 rounded-[50px] bg-main-100 font-bold text-white"
            >
              <span>
                <Note />
              </span>
              Save question
            </Button>
          </div>
        </div>
        <div>
          <h1 className="mb-1 font-poppins text-xl font-semibold leading-[30px] text-[#333]">
            Agriculture and Economy Survey
          </h1>
          <span className="font-poppins text-[16px] font-medium text-[#4f4f4f]">
            Lorem ipsum dolor sit amet consectetur. Viverra ultrices condimentum
            nulla mauris id ut non tortor.
          </span>
        </div>
        <div className="container-xxl mt-4 flex w-full flex-col gap-8 rounded-[18px] bg-[#ffffff] p-8">
          <div className="flex w-full flex-col gap-6">
            <div className="flex w-full items-center gap-6">
              <Label htmlFor="question" className="w-2/3">
                <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                  Question
                </span>
                <Input
                  name="question"
                  id="question"
                  placeholder="Type your questions"
                  className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                />
              </Label>

              <Label htmlFor="questionType" className="w-1/3">
                <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                  Question type
                </span>
                <Select
                  value={selectedQuestionType}
                  onValueChange={(value) => {
                    const selected = dropdownData.find(
                      (item) => item.id === value,
                    );
                    setSelectedQuestionType(selected?.label || "");
                  }}
                >
                  <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent className="max-w-full">
                    <SelectGroup>
                      <SelectLabel>Question Types</SelectLabel>
                      {dropdownData.map((item) => (
                        <SelectItem
                          key={item.id}
                          value={item.id}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={item.image}
                            alt={item.label}
                            className="h-5 w-5"
                          />
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Label>
            </div>
            <SmallAnswer
              placeholder="Text area for contributors"
              name="question"
            />
          </div>
          <div className="w-full items-center justify-between border">
            <div className="flex items-center gap-4"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Create;
