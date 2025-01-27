"use client";
import CustomBreadCrumbs from "@/components/lib/navigation/custom_breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SmallAnswer } from "@/components/ui/small-input-answer";
import { Label } from "@radix-ui/react-label";
import { Note } from "iconsax-react";
import { useEffect, useState } from "react";
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
//import Boolean from "@/components/question/boolean";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalenderDate } from "@/components/ui/calendar";
import { Calendar, Edit, Timer } from "lucide-react";
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
import { useAddQuestionSectionOverlay } from "@/stores/overlay";
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
type FormValues = {
  fullname: string;
  email: string;
  country: string;
  password: string;
  password2: string;
};

interface CampaignQuestionResponse {
  ungrouped_questions: any[];
}

const Create = () => {
  const [questions, setQuestions] = useState([
    { id: 1, type: "text", content: "", group: "", answer: "" },
  ]);
  const [file, setFile] = useState<File | null>(null);

  const [options, setOptions] = useState([]);

  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isQuestionSaved, setIsQuestionSaved] = useState(false);
  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [campaigns, setCampaigns] = useState<any>([]);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FormValues>();
  const searchParams = useSearchParams();

  const questionId = searchParams.get("questionId") || 0;

  const { showSection, setShowSection, isSectionAdded } =
    useAddQuestionSectionOverlay();

  const handleOptionsChange = (updatedOptions: any) => {
    setOptions(updatedOptions);
    console.log(updatedOptions);
    handleAnswerChange(1, updatedOptions);
  };
  const handleSection = async () => {
    const hasData = questions.some((q) => q.content.trim() !== "");

    if (hasData) {
      await saveQuestion();
    }

    setShowSection(true);
  };

  const handleAddQuestion = async () => {
    setIsAddQuestion(true);
    try {
      await saveQuestion();
      /***
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        {
          id: prevQuestions.length + 1,
          type: "",
          group: "",
          content: "",
          answer: "",
        },
      ]);
      */
    } catch (e) {
      console.log(e);
      toast.error("Error adding question");
    }
  };
  const handleAnswerChange = (id: number, answer: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, answer } : q)),
    );
  };

  const DraggableList = ({
    ungroupedQuestions,
    groupedQuestions,
    handleDragEnd,
  }: {
    ungroupedQuestions: any[];
    groupedQuestions: any[];
    handleDragEnd: (result: any) => void;
  }) => {
    const totalSections = groupedQuestions.length;

    return (
      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Ungrouped Questions Droppable */}
        <Droppable droppableId="ungroupedQuestions">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              <UngroupedQuestionsList questions={ungroupedQuestions} />
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        {/* Grouped Questions Droppables */}
        {groupedQuestions.map((group, index) => (
          <Droppable droppableId={group.id} key={group.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-6"
              >
                <GroupedQuestions
                  group={group}
                  groupIndex={index}
                  totalSections={totalSections}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    );
  };

  const UngroupedQuestionsList = ({ questions }: { questions: any[] }) => (
    <>
      {questions
        .sort((a, b) => a.order - b.order) // Sort by order
        .map((item, index) => (
          <DraggableComponent
            key={item?.id}
            id={item?.id.toString()}
            index={index}
            title={` ${item?.label}`} // Display order and label
            className="font-semibold text-[#071E3B]"
          >
            {renderQuestionInput(item?.type, index, item.options, "preview")}
          </DraggableComponent>
        ))}
    </>
  );

  const GroupedQuestions = ({
    group,
    groupIndex,
    totalSections,
  }: {
    group: any;
    groupIndex: number;
    totalSections: number;
  }) => (
    <div className="rounded-lg">
      <GroupHeader
        group={group}
        groupIndex={groupIndex}
        totalSections={totalSections}
      />

      {/* Render Questions within the Group */}
      {group.questions?.length > 0
        ? group.questions
            .sort((a: any, b: any) => a.order - b.order)
            .map((item: any, index: number) => (
              <DraggableComponent
                key={item.id}
                id={item.id.toString()}
                index={index}
                title={`${item.label}`}
                className="p-2 font-semibold text-[#071E3B]"
              >
                {renderQuestionInput(item.type, index, item.options, "preview")}
              </DraggableComponent>
            ))
        : ""}
    </div>
  );

  const GroupHeader = ({
    group,
    groupIndex,
    totalSections,
  }: {
    group: any;
    groupIndex: number;
    totalSections: number;
  }) => (
    <div className="rounded-[18px] bg-white">
      <div className="flex flex-col">
        <div className="w-fit rounded-br-[59px] rounded-tl-lg bg-main-100 px-8 py-2 font-poppins text-[18px] font-medium text-white">
          Section {groupIndex + 1} of {totalSections}
        </div>

        <div className="px-4 py-6">{group.name}</div>
      </div>
    </div>
  );

  const saveQuestion = async () => {
    setIsSubmitting(true);
    let allQuestionsSaved = true;
    const hasData = questions.some((q) => q.content.trim() !== "");
    if (hasData) {
      try {
        for (const question of questions) {
          //  console.log(question.type);
          const payload = {
            label: question.content,
            question_group_id: parseFloat(
              groupedQuestions[groupedQuestions.length - 1]?.id,
            ),
            type: question.type === "boolean" ? "radio" : question.type,
            name: question.content.toLowerCase().replace(/\s+/g, " "),
            placeholder:
              question.type === "text" ||
              question.type === "textarea" ||
              question.type === "email" ||
              question.type === "password" ||
              question.type === "tel" ||
              question.type === "url"
                ? "Enter your input"
                : "",
            required: true,
            options:
              question.type === "select" ||
              question.type === "checkbox" ||
              question.type === "radio"
                ? JSON.stringify(
                    [...questions[0].answer].map((item: any) => item.value),
                  )
                : question.type === "area"
                  ? null
                  : question.type === "line"
                    ? null
                    : question.type === "location"
                      ? null
                      : question.type === "boolean"
                        ? JSON.stringify(
                            [
                              { label: "True", value: "true" },
                              { label: "False", value: "false" },
                            ].map((item) => item.value),
                          )
                        : null,

            attributes: null,
          };

          await createQuestion(questionId, payload);
          setQuestions([
            { id: 1, type: "text", content: " ", group: " ", answer: " " },
          ]);
          setIsQuestionSaved(true);
        }
      } catch (error) {
        allQuestionsSaved = false;
        console.error("Error saving questions:", error);
      } finally {
        setIsSubmitting(false);
        setIsAddQuestion(false);
      }
    } else {
      toast.error("Please add question");
    }
  };

  const saveQuestionBySave = async () => {
    setIsSubmitting(true);

    let allQuestionsSaved = true;

    const isAnyQuestionAvailable = questions.some(
      (question) => question.content !== "",
    );

    if (!isAnyQuestionAvailable) {
      try {
        await submitCampaign(questionId);
        router.push("/organization/dashboard/campaigns");
      } catch (e: any) {
        //console.log(e?.response?.data?.message);
        toast.error(e?.response?.data?.message);
        setIsSubmitting(false);
      }
      return;
    }

    try {
      for (const question of questions) {
        const payload = {
          label: question.content,
          question_group_id: parseFloat(
            groupedQuestions[groupedQuestions.length - 1]?.id,
          ),
          type: question.type === "boolean" ? "radio" : question.type,
          name: question.content.toLowerCase().replace(/\s+/g, " "),
          placeholder: [
            "text",
            "textarea",
            "email",
            "password",
            "tel",
            "url",
          ].includes(question.type)
            ? "Enter your input"
            : "",
          required: true,
          options: ["select", "checkbox", "radio"].includes(question.type)
            ? JSON.stringify(
                [...questions[0].answer].map((item: any) => item.value),
              )
            : question.type === "area"
              ? JSON.stringify([...area.map((item: any) => item)])
              : question.type === "line"
                ? JSON.stringify([...line.map((item: any) => item)])
                : question.type === "location"
                  ? JSON.stringify([...location.map((item: any) => item)])
                  : question.type === "boolean"
                    ? JSON.stringify(
                        [
                          { label: "True", value: "true" },
                          { label: "False", value: "false" },
                        ].map((item) => item.value),
                      )
                    : null,
          attributes: null,
        };

        await createQuestion(questionId, payload);
        try {
          await submitCampaign(questionId);
          toast.success("Question saved successfully.");
        } catch (e) {
          console.log(e);
          toast.error("Failed to save some or all questions.");
          setIsSubmitting(false);
        }

        setQuestions([
          { id: 1, type: "text", content: "", group: "", answer: "" },
        ]);
        setIsQuestionSaved(true);
      }
      router.push("/organization/dashboard/campaigns");
    } catch (error) {
      allQuestionsSaved = false;
      console.error("Error saving questions:", error);
      toast.error("Failed to save some or all questions.");
    } finally {
      setIsSubmitting(false);
      setIsAddQuestion(false);
      setQuestions([
        { id: 1, type: "text", content: "", group: "", answer: "" },
      ]);
    }
  };

  const handleQuestionTypeChange = (id: number, type: string) => {
    // console.log(type);
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, type } : q)),
    );
  };

  const handleContentChange = (id: number, content: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, content } : q)),
    );
  };
  const handleGroupChange = (id: number, group: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, group } : q)),
    );
  };

  useEffect(() => {
    if (isSectionAdded && isQuestionSaved) {
      [{ id: 1, type: "text", content: "", answer: "" }];
    }
  }, [isSectionAdded, isQuestionSaved]);

  const [area, setArea] = useState(["4"]);
  const [location, setLocation] = useState([""]);
  const [line, setLine] = useState(["2"]);
  const [lines] = useState(["", ""]);
  const [locations] = useState([""]);
  const [areas] = useState(["", "", "", ""]);

  const getAllQuestion = async () => {
    try {
      const response: AxiosResponse<CampaignQuestionResponse> =
        await getCampaignQuestion(questionId);
      setUngroupedQuestions(response.ungrouped_questions);
      setGroupedQuestions(response.grouped_questions);

      //  console.log(response.grouped_questions);
    } catch (error) {
      console.error("Error fetching campaign questions:", error);
    }
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

  useEffect(() => {
    getAllQuestion();
  }, [isQuestionSaved, showSection]);
  const renderQuestionInput = (
    type: string,
    id: number,
    options?: any,
    preview?: any,
  ) => {
    //  console.log(preview);
    switch (type) {
      case "text":
        return (
          <SmallAnswer
            placeholder="Text area for contributors"
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
                return options ? options : [];
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
  const [items, setItems] = useState([]);
  const [groupedQuestions, setGroupedQuestions] = useState<any>([]);
  const [ungroupedQuestions, setUngroupedQuestions] = useState<any>([]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    try {
      let sourceGroupId: string | null = null;
      let destinationGroupId: string | null = null;

      if (source.droppableId === destination.droppableId) {
        // Reordering within the same list
        if (source.droppableId === "ungroupedQuestions") {
          const updatedItems = Array.from(ungroupedQuestions);
          const [movedItem] = updatedItems.splice(source.index, 1);
          updatedItems.splice(
            destination.index,
            0,
            movedItem as (typeof ungroupedQuestions)[number],
          ); // Ensure TypeScript knows the type
          setUngroupedQuestions(updatedItems);
        } else {
          const group = groupedQuestions.find(
            (g: any) => g.id === source.droppableId,
          );
          if (group) {
            const updatedQuestions = Array.from(group.questions);
            const [movedItem] = updatedQuestions.splice(source.index, 1);
            updatedQuestions.splice(destination.index, 0, movedItem);

            setGroupedQuestions((prev: any) =>
              prev.map((g: any) =>
                g.id === group.id ? { ...g, questions: updatedQuestions } : g,
              ),
            );

            const payload = {
              questions: updatedQuestions.map((q: any, index: number) => ({
                id: q.id,
                order: index + 1,
              })),
              question_group_id: group.id,
            };

            try {
              await reOrdreQuestion(questionId, payload);
              toast.success("Question reordered within the same section.");
              getAllQuestion();
            } catch (e) {
              toast.error("Failed to reorder question, try again later.");
            }
          }
        }
      } else {
        // Moving between different lists
        let sourceList: typeof ungroupedQuestions = [];
        let destinationList: typeof ungroupedQuestions = [];

        if (source.droppableId === "ungroupedQuestions") {
          sourceList = Array.from(ungroupedQuestions);
          destinationGroupId = destination.droppableId;
          destinationList = Array.from(
            groupedQuestions.find((g: any) => g.id === destinationGroupId)
              ?.questions || [],
          );
        } else if (destination.droppableId === "ungroupedQuestions") {
          sourceGroupId = source.droppableId;
          sourceList = Array.from(
            groupedQuestions.find((g: any) => g.id === sourceGroupId)
              ?.questions || [],
          );
          destinationList = Array.from(ungroupedQuestions);
        } else {
          sourceGroupId = source.droppableId;
          destinationGroupId = destination.droppableId;
          sourceList = Array.from(
            groupedQuestions.find((g: any) => g.id === sourceGroupId)
              ?.questions || [],
          );
          destinationList = Array.from(
            groupedQuestions.find((g: any) => g.id === destinationGroupId)
              ?.questions || [],
          );
        }

        const [movedItem] = sourceList.splice(source.index, 1) as [
          (typeof sourceList)[number],
        ];
        destinationList.splice(destination.index, 0, movedItem);

        if (source.droppableId === "ungroupedQuestions") {
          setUngroupedQuestions(sourceList);
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) =>
              g.id === destinationGroupId
                ? { ...g, questions: destinationList }
                : g,
            ),
          );

          try {
            await updateQuestion(
              questionId,
              {
                question_group_id: destinationGroupId,
                label: movedItem.label,
                type: movedItem.type,
                name: movedItem.name,
                placeholder: movedItem.placeholder,
                required: movedItem.required,

                options: movedItem.options
                  ? JSON.stringify(
                      movedItem.options.map((item: any) => item.value),
                    )
                  : null,

                attributes: movedItem.attributes,
              },
              movedItem.id,
            );
            // toast.success("Question moved to grouped section.");
            getAllQuestion();
          } catch (e) {
            toast.error("Failed to move question, try again later.");
          }
        } else if (destination.droppableId === "ungroupedQuestions") {
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) =>
              g.id === sourceGroupId ? { ...g, questions: sourceList } : g,
            ),
          );
          setUngroupedQuestions(destinationList);

          try {
            await updateQuestion(
              questionId,
              {
                question_group_id: "",
                label: movedItem.label,
                type: movedItem.type,
                name: movedItem.name,
                placeholder: movedItem.placeholder,
                required: movedItem.required,
                options: movedItem.options
                  ? JSON.stringify(
                      movedItem.options.map((item: any) => item.value),
                    )
                  : null,

                attributes: movedItem.attributes,
              },
              movedItem.id,
            );
            //  toast.success("Question moved to ungrouped section.");
            getAllQuestion();
          } catch (e) {
            toast.error("Failed to move question, try again later.");
          }
        } else {
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) => {
              if (g.id === sourceGroupId) {
                return { ...g, questions: sourceList };
              }
              if (g.id === destinationGroupId) {
                return { ...g, questions: destinationList };
              }
              return g;
            }),
          );

          try {
            await updateQuestion(
              questionId,
              {
                question_group_id: destinationGroupId,
                label: movedItem.label,
                type: movedItem.type,
                name: movedItem.name,
                placeholder: movedItem.placeholder,
                required: movedItem.required,
                options: movedItem.options
                  ? JSON.stringify(
                      movedItem.options.map((item: any) => item.value),
                    )
                  : null,

                attributes: movedItem.attributes,
              },
              movedItem.id,
            );

            // toast.success("Question moved between sections.");
            getAllQuestion();
          } catch (e) {
            toast.error("Failed to move question, try again later.");
          }
        }
      }
    } catch (error) {
      console.error("Error handling drag and drop:", error);
    }
  };

  const handleDragEndvv = async (result: DropResult) => {
    const { source, destination } = result;

    // If there's no destination, exit early
    if (!destination) return;

    try {
      let sourceGroupId: string | null = null;
      let destinationGroupId: string | null = null;

      if (source.droppableId === destination.droppableId) {
        if (source.droppableId === "ungroupedQuestions") {
          const updatedItems = Array.from(ungroupedQuestions);
          const [movedItem] = updatedItems.splice(source.index, 1);
          updatedItems.splice(destination.index, 0, movedItem);
          setUngroupedQuestions(updatedItems);
        } else {
          const group = groupedQuestions.find(
            (g: any) => g.id === source.droppableId,
          );
          if (group) {
            const updatedQuestions = Array.from(group.questions);
            const [movedItem] = updatedQuestions.splice(source.index, 1);
            updatedQuestions.splice(destination.index, 0, movedItem);

            setGroupedQuestions((prev: any) =>
              prev.map((g: any) =>
                g.id === group.id ? { ...g, questions: updatedQuestions } : g,
              ),
            );

            const payload = {
              questions: updatedQuestions.map((q: any, index: number) => ({
                id: q.id,
                order: index + 1,
              })),
              question_group_id: group.id,
            };

            try {
              await reOrdreQuestion(questionId, payload);

              //  console.log(questionId);
              toast.success("Question reordered");
              getAllQuestion();
            } catch (e) {
              toast.error("Fail to reorder question, try again later.");
            }
          }
        }
      } else {
        let sourceList = [];
        let destinationList = [];

        if (source.droppableId === "ungroupedQuestions") {
          sourceList = Array.from(ungroupedQuestions);
          destinationGroupId = destination.droppableId;
          destinationList = Array.from(
            groupedQuestions.find((g: any) => g.id === destinationGroupId)
              ?.questions || [],
          );
        } else if (destination.droppableId === "ungroupedQuestions") {
          sourceGroupId = source.droppableId;
          sourceList = Array.from(
            groupedQuestions.find((g: any) => g.id === sourceGroupId)
              ?.questions || [],
          );
          destinationList = Array.from(ungroupedQuestions);
        } else {
          sourceGroupId = source.droppableId;
          destinationGroupId = destination.droppableId;
          sourceList = Array.from(
            groupedQuestions.find((g: any) => g.id === sourceGroupId)
              ?.questions || [],
          );
          destinationList = Array.from(
            groupedQuestions.find((g: any) => g.id === destinationGroupId)
              ?.questions || [],
          );
        }

        const [movedItem] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, movedItem);

        if (source.droppableId === "ungroupedQuestions") {
          setUngroupedQuestions(sourceList);
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) =>
              g.id === destinationGroupId
                ? { ...g, questions: destinationList }
                : g,
            ),
          );
        } else if (destination.droppableId === "ungroupedQuestions") {
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) =>
              g.id === sourceGroupId ? { ...g, questions: sourceList } : g,
            ),
          );
          setUngroupedQuestions(destinationList);
        } else {
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) => {
              if (g.id === sourceGroupId) {
                return { ...g, questions: sourceList };
              }
              if (g.id === destinationGroupId) {
                return { ...g, questions: destinationList };
              }
              return g;
            }),
          );
        }

        if (destinationGroupId) {
          const payload = {
            questions: destinationList.map((q: any, index: number) => ({
              id: q.id,
              order: index + 1,
            })),
            question_group_id: destinationGroupId,
          };

          //console.log("Payload for reordering:", payload);

          try {
            await reOrdreQuestion(questionId, payload);

            console.log(questionId);
            toast.success("Question reordered");
            getAllQuestion();
          } catch (e) {
            toast.error("Fail to reorder question, try again later.");
          }
        }
      }
    } catch (error) {
      console.error("Error handling drag and drop:", error);
    }
  };

  const handleDragEndp = async (result: DropResult) => {
    const { source, destination } = result;

    // If there's no destination, exit early
    if (!destination) return;

    try {
      if (source.droppableId === destination.droppableId) {
        // Reordering within the same list
        if (source.droppableId === "ungroupedQuestions") {
          const updatedItems = Array.from(ungroupedQuestions);
          const [movedItem] = updatedItems.splice(source.index, 1);
          updatedItems.splice(destination.index, 0, movedItem);
          setUngroupedQuestions(updatedItems);
        } else {
          const group = groupedQuestions.find(
            (g: any) => g.id === source.droppableId,
          );
          if (group) {
            const updatedQuestions = Array.from(group.questions);
            const [movedItem] = updatedQuestions.splice(source.index, 1);
            updatedQuestions.splice(destination.index, 0, movedItem);

            setGroupedQuestions((prev: any) =>
              prev.map((g: any) =>
                g.id === group.id ? { ...g, questions: updatedQuestions } : g,
              ),
            );
          }
        }
      } else {
        // Moving between different lists
        let sourceList = [];
        let destinationList = [];

        if (source.droppableId === "ungroupedQuestions") {
          sourceList = Array.from(ungroupedQuestions);
          destinationList = Array.from(
            groupedQuestions.find((g: any) => g.id === destination.droppableId)
              ?.questions || [],
          );
        } else if (destination.droppableId === "ungroupedQuestions") {
          sourceList = Array.from(
            groupedQuestions.find((g: any) => g.id === source.droppableId)
              ?.questions || [],
          );
          destinationList = Array.from(ungroupedQuestions);
        } else {
          sourceList = Array.from(
            groupedQuestions.find((g: any) => g.id === source.droppableId)
              ?.questions || [],
          );
          destinationList = Array.from(
            groupedQuestions.find((g: any) => g.id === destination.droppableId)
              ?.questions || [],
          );
        }

        const [movedItem] = sourceList.splice(source.index, 1);
        destinationList.splice(destination.index, 0, movedItem);

        if (source.droppableId === "ungroupedQuestions") {
          setUngroupedQuestions(sourceList);
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) =>
              g.id === destination.droppableId
                ? { ...g, questions: destinationList }
                : g,
            ),
          );
        } else if (destination.droppableId === "ungroupedQuestions") {
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) =>
              g.id === source.droppableId ? { ...g, questions: sourceList } : g,
            ),
          );
          setUngroupedQuestions(destinationList);
        } else {
          setGroupedQuestions((prev: any) =>
            prev.map((g: any) => {
              if (g.id === source.droppableId) {
                return { ...g, questions: sourceList };
              }
              if (g.id === destination.droppableId) {
                return { ...g, questions: destinationList };
              }
              return g;
            }),
          );
        }
      }

      const reorderedData = {
        ungroupedQuestions,
        groupedQuestions,
      };
      // console.log(reorderedData);
      await reOrdreQuestion(questionId, reorderedData);
      console.log("Reordering saved successfully.");
    } catch (error) {
      console.error("Error handling drag and drop:", error);
    }
  };
  const getCampaign = async () => {
    try {
      const response = await getCampaignByIdDetails(questionId);
      console.log(response);
      setCampaigns(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getCampaign();
  }, []);
  return (
    <>
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
                onClick={saveQuestionBySave}
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "Save question"
                )}
              </Button>
            </div>
          </div>
          <div>
            <h1 className="mb-1 font-poppins text-xl font-semibold leading-[30px] text-[#333]">
              {campaigns.title}
            </h1>
            <span className="font-poppins text-[16px] font-medium text-[#4f4f4f]">
              {campaigns.description}
            </span>
          </div>

          {/*** SECTION  */}

          <DraggableList
            ungroupedQuestions={ungroupedQuestions}
            groupedQuestions={groupedQuestions}
            handleDragEnd={handleDragEnd}
          />

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
                      autoComplete="off"
                      value={question.content}
                      onChange={(e) =>
                        handleContentChange(question.id, e.target.value)
                      }
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
                {/***
                <Label htmlFor="questionType" className="w-full">
                  <div className="flex items-center justify-between">
                    <span className="mb-2 inline-block text-base font-extralight text-[#4F4F4F]">
                      Question group
                    </span>
                  </div>

                  <Select
                    value={selectedQuestionGroupId}
                    onValueChange={(value: any) => {
                      handleGroupChange(question.id, value);

                      const selected = questtonGroup.find(
                        (item: any) => item.id === parseInt(value),
                      ) as { id: number; name: string } | undefined;

                      setSelectedQuestionGroup(selected?.name || "");
                      setSelectedQuestionGroupId(selected?.id);
                    }}
                  >
                    <SelectTrigger className="h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0">
                      <SelectValue
                        placeholder="Select question group"
                        className="text-neutral-40 placeholder:text-neutral-40 text-sm font-light"
                      >
                        {selectedQuestionGroup}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent className="max-w-full">
                      <SelectGroup>
                        <SelectLabel>Question group</SelectLabel>
                        {questtonGroup.map((item: any) => (
                          <SelectItem
                            key={item.id}
                            value={item.id.toString()}
                            className="flex items-center gap-2"
                          >
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Label>
                */}
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
                  onClick={handleSection}
                >
                  Add section
                </Add>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionName />
    </>
  );
};

export default Create;
