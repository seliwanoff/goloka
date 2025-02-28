import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmallAnswer } from "@/components/ui/small-input-answer";
import { Label } from "@radix-ui/react-label";
import { Note } from "iconsax-react";
import { useEffect, useState } from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

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

type FormValues = {
  fullname: string;
  email: string;
  country: string;
  password: string;
  password2: string;
};
//import Boolean from "@/components/question/boolean";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { Calendar, Edit, Loader, Timer } from "lucide-react";
import { TimePicker } from "@/components/ui/time";
import AudioUpload from "@/components/task-stepper/inputs/audioUpload";
import CheckboxList from "@/components/task-stepper/checkboxOption";
import DynamicSelect from "@/components/task-stepper/dropdownOption";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { FaSpinner } from "react-icons/fa";
import {
  createQuestion,
  getCampaignQuestion,
  reOrdreQuestion,
  updateQuestion,
  updateQuestion2,
} from "@/services/campaign/question";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  useAddQuestionSectionOverlay,
  useEditAQuestion,
} from "@/stores/overlay";
import SectionName from "@/components/lib/modals/section_name_modal";
import RadioGroupWrapper from "@/components/question/boolean";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableComponent from "@/components/ui/drag-drop";
import { AxiosResponse } from "axios";
import {
  getCampaignById,
  getCampaignByIdDetails,
  submitCampaign,
} from "@/services/campaign";
import RadioSelection from "@/components/ui/radio-select";

type Question = {
  type: string;
  label: string;
  options: any[];
  id: any;
  content: string;
  value: any;
  answer?: any;
  required: boolean;
};
interface EditQuestionWidgetProps {
  question: Question[]; // Ensure question is always an array
  id: any; // Ideally, specify a more specific type than 'any'
  action: () => void;
}

const EditQuestionWidget = ({
  question,
  id,
  action,
}: EditQuestionWidgetProps) => {
  const [questions, setQuestions] = useState<Question[]>(
    Array.isArray(question) ? question.flat() : [question],
  );

  const { setShowQuestionEdit } = useEditAQuestion();
  //  console.log(questions);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>();

  const [area, setArea] = useState(["4"]);
  const [location, setLocation] = useState([""]);
  const [line, setLine] = useState(["2"]);
  const [lines] = useState(["", ""]);
  const [locations] = useState([""]);
  const [areas] = useState(["", "", "", ""]);
  const [options, setOptions] = useState([]);
  const [file, setFile] = useState<File | null>(null);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [isChecked, setIschecked] = useState(false);

  const handleAnswerChange = (id: number, answer: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, answer } : q)),
    );
  };
  const handleQuestionTypeChange = (id: number, type: string) => {
    // console.log(type);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, type } : q)),
    );
  };

  const handleUpdate = (id: string, required: boolean) => {
    setIschecked(required);
  };

  const ToggleSwitch = ({
    data,
    onUpdate,
  }: {
    data: {
      id: string;
      required: boolean;
      label: string;
      type: string;
      options: any[];
    };
    onUpdate: (id: string, required: boolean) => void;
  }) => {
    const [localChecked, setLocalChecked] = useState(data.required);

    const handleToggle = async (checked: boolean) => {
      setLocalChecked(checked);
      //   console.log(data.options);
      onUpdate(data.id, checked);
    };

    return (
      <SwitchPrimitive.Root
        id="switch"
        checked={localChecked}
        onCheckedChange={handleToggle}
        className="relative h-6 w-10 rounded-full bg-gray-300 transition"
      >
        <SwitchPrimitive.Thumb className="block h-4 w-4 translate-x-1 transform rounded-full shadow-md transition-transform data-[state=checked]:translate-x-5 data-[state=checked]:bg-blue-500" />
      </SwitchPrimitive.Root>
    );
  };

  const handleContentChange = (id: number, label: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, label } : q)),
    );
  };
  const handleAnswerChangeLocation = (
    type: string,
    index: number,
    value: string,
  ) => {
    switch (type) {
      case "area":
        setArea((prev) => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case "location":
        setLocation((prev) => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case "line":
        setLine((prev) => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      default:
        console.warn("Unsupported type");
    }
  };

  const handleOptionsChange = (updatedOptions: any) => {
    setOptions(updatedOptions);
    // console.log(updatedOptions);
    handleAnswerChange(1, updatedOptions);
  };
  // console.log(options);

  const handleQuestion = async () => {
    setIsLoading(true);
    // console.log(questions);
    try {
      const payload = {
        label: questions[0].label,
        question_group_id: "",

        type: questions[0].type === "boolean" ? "radio" : questions[0].type,

        name: questions[0].label.toLowerCase().replace(/\s+/g, " "),
        placeholder:
          questions[0].type === "text" ||
          questions[0].type === "textarea" ||
          questions[0].type === "email" ||
          questions[0].type === "password" ||
          questions[0].type === "tel" ||
          questions[0].type === "url"
            ? "Enter your input"
            : "",
        required: isChecked ? "1" : "0",
        options:
          questions[0].type === "select" ||
          questions[0].type === "checkbox" ||
          questions[0].type === "radio"
            ? JSON.stringify([...options].map((item: any) => item.value))
            : questions[0].type === "area"
              ? null
              : questions[0].type === "line"
                ? null
                : questions[0].type === "location"
                  ? null
                  : questions[0].type === "boolean"
                    ? JSON.stringify(
                        [
                          { label: "True", value: "true" },
                          { label: "False", value: "false" },
                        ].map((item) => item.value),
                      )
                    : null,

        attributes: null,
      };
      //@ts-ignore

      await updateQuestion(id, payload, question.id);
      toast.success("Question updated");
      setShowQuestionEdit(false);
      action();
    } catch (e) {
      console.log(e);
      toast.error("Error updating question");
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestionInput = (
    type: string,
    id: number,
    value?: any,
    options?: any,
    preview?: any,
  ) => {
    //  console.log(preview);
    switch (type) {
      case "text":
        return (
          <SmallAnswer
            placeholder="Text area for contributors"
            value={value}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
          />
        );
      case "line":
        return (
          <div className="flex w-full max-w-[1/2] basis-[1/2] gap-4">
            {preview === "preview"
              ? lines.map((value, index) => (
                  <Input
                    key={`line-${index}`}
                    name={`line-${index}`}
                    type="text"
                    disabled={preview !== "preview" ? true : false}
                    placeholder={`Enter points`}
                    value={value}
                    onChange={(e) =>
                      handleAnswerChangeLocation("line", index, e.target.value)
                    }
                    className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                  />
                ))
              : line.map((value, index) => (
                  <Input
                    key={`line-${index}`}
                    name={`line-${index}`}
                    type="text"
                    disabled={true}
                    placeholder={`2 points`}
                    value={2}
                    onChange={(e) =>
                      handleAnswerChangeLocation("line", index, e.target.value)
                    }
                    className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                  />
                ))}
          </div>
        );
      case "location":
        return preview === "preview"
          ? locations.map((value, index) => (
              <Input
                key={`location-${index}`}
                name={`location-${index}`}
                type="text"
                placeholder={`Search address`}
                value={value}
                onChange={(e) =>
                  handleAnswerChangeLocation("location", index, e.target.value)
                }
                className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
            ))
          : location.map((value, index) => (
              <Input
                key={`location-${index}`}
                name={`location-${index}`}
                type="text"
                placeholder={`Search address`}
                value={value}
                disabled={true}
                onChange={(e) =>
                  handleAnswerChangeLocation("location", index, e.target.value)
                }
                className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
            ));
      case "area":
        return (
          <div className="flex w-full flex-wrap justify-between gap-4">
            {preview === "preview"
              ? areas.map((value, index) => (
                  <Input
                    key={`area-${index}`}
                    name={`area-${index}`}
                    type="text"
                    placeholder={`Enter number of point`}
                    value={value}
                    onChange={(e) =>
                      handleAnswerChangeLocation("area", index, e.target.value)
                    }
                    className="mb-2 h-12 w-full flex-grow basis-[300px] rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                  />
                ))
              : area.map((value, index) => (
                  <Input
                    key={`area-${index}`}
                    name={`area-${index}`}
                    type="text"
                    min={4}
                    placeholder={`Enter number of point`}
                    value={value}
                    onChange={(e) =>
                      handleAnswerChangeLocation("area", index, e.target.value)
                    }
                    className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
                  />
                ))}
          </div>
        );
      case "textarea":
        return (
          <textarea
            value={value}
            placeholder="Type your paragraph here"
            className="h-24 w-full rounded-md border bg-[#F2F2F7] p-2 placeholder:text-gray-600"
            onChange={(e) => handleAnswerChange(id, e.target.value)}
          />
        );
      case "select":
        return (
          <MultipleChoices
            label="Select option"
            placeholder="Type something..."
            preview={preview}
            initialOptions={(() => {
              try {
                const parsedValue = value ? JSON.parse(value) : [];

                // Ensure parsedValue is always an array
                const normalizedArray = Array.isArray(parsedValue)
                  ? parsedValue
                  : [parsedValue]; // Wrap single object in array

                return normalizedArray.map((option) =>
                  typeof option === "object" && option !== null
                    ? { ...option, value: option.value }
                    : { value: option },
                );
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            onOptionsChange={handleOptionsChange}
          />
        );
      case "radio":
        return (
          <RadioSelection
            initialOptions={(() => {
              try {
                return options ? options : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            preview={preview}
            onOptionsChange={handleOptionsChange}
          />
        );
      case "checkbox":
        return (
          <CheckboxList
            initialOptions={(() => {
              try {
                return options ? options : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            preview={preview}
            onOptionsChange={handleOptionsChange}
          />
        );
      case "MultipleDrop":
        return (
          <DynamicSelect
            label=" "
            name="country"
            control={control}
            initialOptions={(() => {
              try {
                return options ? options : [];
              } catch (error) {
                console.error("Error parsing options:", error);
                return [];
              }
            })()}
            placeholder="Enter option"
            onChange={(value: any) => {
              console.log(value);

              handleAnswerChange(id, value);
            }}
            rules={{ required: "Country is required" }}
            // errors={errors}
          />
        );
      case "video":
        return (
          <FileUpload
            disabled={true}
            ref={null}
            value={null}
            onFileUpload={(file: any) => {
              setFile(file);
              // console.log(file);
            }}
          />
        );
      case "photo":
        return (
          <FileUpload
            ref={null}
            disabled={true}
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
            disabled={true}
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
            type="email"
            value={value}
            id={`email`}
            placeholder="Type  email"
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        );
      case "url":
        return (
          <Input
            name={`url`}
            type="url"
            id={`url`}
            value={value}
            placeholder="Type  URL"
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        );
      case "password":
        return (
          <Input
            name={`password`}
            id={`password`}
            type="password"
            value={value}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            placeholder="Type  password"
            className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        );
      case "tel":
        return (
          <Input
            type="tel"
            name={`tel`}
            value={value}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            id={`tel`}
            placeholder="Type  tel"
            className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            name={`number`}
            id={`number`}
            value={value}
            onChange={(e) => handleAnswerChange(id, e.target.value)}
            placeholder="Type  number"
            className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        );
      case "audio":
        return <AudioUpload />;
      case "boolean":
        return (
          <RadioGroupWrapper
            options={[
              { label: "True", value: "true" },
              { label: "False", value: "false" },
            ]}
            selectedValue={""}
            onChange={(value) => handleAnswerChange(1, value)}
          />
        );
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
                    onSelect={(selectedTime: any) => {
                      setTime(selectedTime || null);
                      handleAnswerChange(id, selectedTime);
                    }}
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
                    onSelect={(date: any) => {
                      console.log(date);
                      handleAnswerChange(id, date);
                      setDate(date || null);
                    }}
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
    <>
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
                autoComplete="off"
                value={question.label}
                onChange={(e) =>
                  handleContentChange(question.id, e.target.value)
                }
                placeholder="Type your question here"
                className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
            </Label>
            <Label htmlFor={`questionType-${question.id}`} className="w-1/3">
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

          {renderQuestionInput(
            question.type,
            question.id,
            question.value,
            question.options,
          )}
          <div className="w-ful flex items-center gap-2">
            <span>Required status</span>
            <ToggleSwitch
              key={question.id}
              data={question}
              onUpdate={handleUpdate}
            />
          </div>

          <Button
            className="mt-8 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
            type="button"
            onClick={handleQuestion}
            // disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin text-[#fff]" />
            ) : (
              "Save Questions"
            )}
          </Button>
        </div>
      ))}
    </>
  );
};

export default EditQuestionWidget;
