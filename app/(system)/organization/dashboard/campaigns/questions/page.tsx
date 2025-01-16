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
import Image from "next/image";
import dropdownData from "@/utils/question";
import Add from "@/components/ui/add";
import MultipleChoices from "@/components/ui/multiple-choices";
import FileUpload from "@/components/task-stepper/fileUpload";
import Boolean from "@/components/question/boolean";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { Calendar, Timer } from "lucide-react";
import { TimePicker } from "@/components/ui/time";
import AudioUpload from "@/components/task-stepper/inputs/audioUpload";

const Create = () => {
  const [questions, setQuestions] = useState([
    { id: 1, type: "shortAnswer", content: "" },
  ]);
  const [file, setFile] = useState<File | null>(null);

  const [options, setOptions] = useState([]);

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const handleOptionsChange = (updatedOptions: any) => {
    setOptions(updatedOptions);
    console.log("Updated Options:", updatedOptions);
  };
  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { id: prevQuestions.length + 1, type: "", content: "" },
    ]);
  };

  const handleQuestionTypeChange = (id: number, type: string) => {
    console.log(type);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, type } : q)),
    );
  };

  const handleContentChange = (id: number, content: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, content } : q)),
    );
  };

  const renderQuestionInput = (type: string, id: number) => {
    switch (type) {
      case "shortAnswer":
        return <SmallAnswer placeholder="Text area for contributors" />;
      case "paragraph":
        return (
          <textarea
            placeholder="Type your paragraph here"
            className="h-24 w-full rounded-md border bg-[#F2F2F7] p-2 placeholder:text-gray-600"
            value={questions.find((q) => q.id === id)?.content || ""}
            onChange={(e) => handleContentChange(id, e.target.value)}
          />
        );
      case "multipleChoices":
        return (
          <MultipleChoices
            label="Advanced Options List"
            placeholder="Type something..."
            initialOptions={[{ id: 1, value: "Option 1" }]}
            onOptionsChange={handleOptionsChange}
          />
        );
      case "video":
        return (
          <FileUpload
            ref={null}
            value={null}
            onFileUpload={(file: any) => {
              setFile(file);
              // console.log(file);
            }}
          />
        );
      case "image":
        return (
          <FileUpload
            ref={null}
            value={null}
            onFileUpload={(file: any) => {
              setFile(file);
              // console.log(file);
            }}
          />
        );

      case "file":
        return (
          <FileUpload
            ref={null}
            value={null}
            onFileUpload={(file: any) => {
              setFile(file);
              // console.log(file);
            }}
          />
        );
      case "email":
        return (
          <Input
            name={`email`}
            id={`email`}
            placeholder="Type your email"
            className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        );
      case "audio":
        return <AudioUpload />;
      case "boolean":
        return <Boolean />;
      case "time":
        return (
          <Label htmlFor="date" className="border-red relative w-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between gap-3 rounded-md bg-gray-200 px-3 pr-1 text-center font-poppins text-sm font-normal text-gray-600", // Adjust border color
                  )}
                >
                  {time ? time : " Time"}
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200">
                    <Timer size={20} color="#828282" />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">
                <div className="flex w-full flex-col items-center gap-4 rounded-md border bg-[#fff] shadow-md">
                  <TimePicker
                    selected={time}
                    onSelect={(selectedTime: any) =>
                      setTime(selectedTime || null)
                    }
                  />
                  <div className="flex w-auto items-center justify-between">
                    <button
                      className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                      onClick={() => setTime(null)}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Label>
        );
      case "date":
        return (
          <Label htmlFor="date" className="border-red w-1/2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-between gap-3 rounded-md bg-gray-200 px-3 pr-1 text-center text-sm font-normal",
                    "border-neutral-300", // Adjust border color
                  )}
                >
                  {date ? `${format(date, "PPP")}` : " Date"}
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200">
                    <Calendar size={20} color="#828282" />
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4">
                <div className="flex flex-col items-center gap-4 rounded-md border bg-[#fff] shadow-md">
                  <CalenderDate
                    mode="single"
                    //@ts-ignore
                    selected={date}
                    onSelect={(date: any) => setDate(date || null)}
                    initialFocus
                  />
                  <div className="flex w-auto items-center justify-between">
                    <button
                      className="rounded-full bg-[#F8F8F8] px-2 py-1 text-sm text-blue-500"
                      onClick={() => setDate(null)}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Label>
        );

      default:
        return null;
    }
  };

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
          {/*** QUESTION SECTION */}
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex w-full flex-col gap-6 border-b pb-6"
            >
              <div className="flex w-full items-center gap-6">
                <Label htmlFor={`question-${question.id}`} className="w-2/3">
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    Question
                  </span>
                  <Input
                    name={`question-${question.id}`}
                    id={`question-${question.id}`}
                    placeholder="Type your question here"
                    className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                  />
                </Label>
                <Label
                  htmlFor={`questionType-${question.id}`}
                  className="w-1/3"
                >
                  <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                    Question type
                  </span>
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      handleQuestionTypeChange(question.id, value)
                    }
                  >
                    <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Question Types</SelectLabel>
                        {dropdownData.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            <div className="flex items-center gap-2">
                              <Image
                                src={item.image}
                                alt={item.label}
                                width={16}
                                height={16}
                              />
                              <span>{item.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
              </div>
              {renderQuestionInput(question.type, question.id)}
            </div>
          ))}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Add
                imageSrc="/assets/images/questions/add.png"
                onClick={handleAddQuestion}
              >
                Add question
              </Add>
              <Add
                imageSrc="/assets/images/questions/section.png"
                onClick={handleAddQuestion}
              >
                Add section
              </Add>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Create;
