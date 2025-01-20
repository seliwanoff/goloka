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
} from "@/services/campaign/question";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAddQuestionSectionOverlay } from "@/stores/overlay";
import SectionName from "@/components/lib/modals/section_name_modal";
import RadioGroupWrapper from "@/components/question/boolean";
import { DragDropContext, Droppable, DropResult } from "@hello-pangea/dnd";
import DraggableComponent from "@/components/ui/drag-drop";
type FormValues = {
  fullname: string;
  email: string;
  country: string;
  password: string;
  password2: string;
};

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
  const [selectedQuestionGroup, setSelectedQuestionGroup] = useState("");
  const [selectedQuestionGroupId, setSelectedQuestionGroupId] =
    useState<any>("");

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
    handleAnswerChange(0, updatedOptions);
    setOptions(updatedOptions);
    // handleAnswerChange(1, updatedOptions);
  };
  const handleAddQuestion = () => {
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
  };
  const handleAnswerChange = (id: number, answer: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => (q.id === id ? { ...q, answer } : q)),
    );
  };
  /***
  const saveQuestion = async () => {
    setIsSubmitting(true);
    let allQuestionsSaved = true;

    try {
      for (const question of questions) {
        //  console.log(question.type);
        const payload = {
          label: question.content,
          //   question_group_id: parseFloat(question.group),
          type: question.type,
          name: question.content.toLowerCase().replace(/\s+/g, " "),
          placeholder:
            question.type === "text" ||
            question.type === "textarea" ||
            question.type === "email" ||
            question.type === "password" ||
            question.type === "tel" ||
            question.type === "url"
              ? question.answer
              : "",
          required: true,
          options:
            question.type === "multipleChoices" ||
            question.type === "select" ||
            question.type === "checkbox" ||
            question.type === "radio"
              ? JSON.stringify(
                  [...questions[0].answer].map((item: any) => item.label),
                )
              : question.type === "area"
                ? JSON.stringify([...area.map((item: any) => item)])
                : question.type === "line"
                  ? JSON.stringify([...line.map((item: any) => item)])
                  : question.type === "location"
                    ? JSON.stringify([...location.map((item: any) => item)])
                    : null,

          attributes: null,
        };

        await createQuestion(questionId, payload);
        setIsQuestionSaved(true);
      }

      toast.success(" Questions added successfully!");
    } catch (error) {
      allQuestionsSaved = false;
      console.error("Error saving questions:", error);
      toast.error("Failed to save some or all questions.");
    } finally {
      setIsSubmitting(false);
    }
  };
*/

  const saveQuestion = async () => {
    setIsSubmitting(true);
    let allQuestionsSaved = true;

    try {
      for (const question of questions) {
        const placeholderTypes = [
          "text",
          "textarea",
          "email",
          "password",
          "tel",
          "url",
        ];

        const optionTypes = ["select", "checkbox", "radio"];

        const options = (() => {
          if (
            optionTypes.includes(question.type) &&
            Array.isArray(question.answer)
          ) {
            return JSON.stringify(
              question.answer.map((item: any) => item.label),
            );
          }
          switch (question.type) {
            case "area":
              return Array.isArray(area) ? JSON.stringify(area) : null;
            case "line":
              return Array.isArray(line) ? JSON.stringify(line) : null;
            case "location":
              return Array.isArray(location) ? JSON.stringify(location) : null;
            default:
              return null;
          }
        })();

        const payload = {
          label: question.content,
          type: question.type,
          name: question.content.toLowerCase().replace(/\s+/g, " "),
          placeholder: placeholderTypes.includes(question.type)
            ? question.answer
            : "",
          required: true,
          options,
          attributes: null,
        };

        await createQuestion(questionId, payload);
        setIsQuestionSaved(true);
      }

      toast.success("Questions added successfully!");
    } catch (error) {
      allQuestionsSaved = false;
      console.error("Error saving questions:", error);
      toast.error("Failed to save some or all questions.");
    } finally {
      setIsSubmitting(false);
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

  const [area, setArea] = useState(["", "", ""]);
  const [location, setLocation] = useState([""]);
  const [line, setLine] = useState(["", ""]);

  const getAllQuestion = async () => {
    const response = await getCampaignQuestion(questionId);

    console.log(response);
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
  }, []);
  const renderQuestionInput = (type: string, id: number) => {
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
            {line.map((value, index) => (
              <Input
                key={`line-${index}`}
                name={`line-${index}`}
                type="text"
                placeholder={`Enter value for line ${index + 1}`}
                value={value}
                onChange={(e) =>
                  handleAnswerChangeLocation("line", index, e.target.value)
                }
                className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
              />
            ))}
          </div>
        );
      case "location":
        return location.map((value, index) => (
          <Input
            key={`location-${index}`}
            name={`location-${index}`}
            type="text"
            placeholder={`Enter value for location ${index + 1}`}
            value={value}
            onChange={(e) =>
              handleAnswerChangeLocation("location", index, e.target.value)
            }
            className="mb-2 h-12 w-full rounded-md border bg-transparent placeholder:text-sm placeholder:font-extralight placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-main-100 focus-visible:ring-offset-0"
          />
        ));
      case "area":
        return (
          <div className="flex w-full max-w-[1/2] flex-1 flex-grow basis-[1/2] gap-4">
            {area.map((value, index) => (
              <Input
                key={`area-${index}`}
                name={`area-${index}`}
                type="text"
                placeholder={`Enter value for area ${index + 1}`}
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
            initialOptions={[{ id: 1, value: "Option 1" }]}
            onOptionsChange={handleOptionsChange}
          />
        );
      case "checkbox":
        return (
          <CheckboxList
            initialOptions={[]}
            onOptionsChange={handleOptionsChange}
          />
        );
      case "MultipleDrop":
        return (
          <DynamicSelect
            label=" "
            name="country"
            control={control}
            initialOptions={[]}
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
      case "radio":
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
  const [items, setItems] = useState([
    {
      id: "1",
      title: "What skill are you presently learning?",
      type: "text",
      order: "1",
    },
    {
      id: "2",
      title: "Describe your recent project.",
      type: "textarea",
      order: "2",
    },
  ]);

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedItems = Array.from(items);
    const [movedItem] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, movedItem);

    const reorderedQuestions = updatedItems.map((item, index) => ({
      id: parseInt(item.id),
      order: index + 1,
    }));

    setItems(updatedItems);

    console.log({
      questions: reorderedQuestions,
    });

    try {
      const response = await reOrdreQuestion(questionId, reorderedQuestions);
      getAllQuestion();

      toast.success("Question reorder succesfully!");
    } catch (e) {
      toast.error("Failed to reorder question. try again later");
    }
  };
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
                onClick={saveQuestion}
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
              Agriculture and Economy Survey
            </h1>
            <span className="font-poppins text-[16px] font-medium text-[#4f4f4f]">
              Lorem ipsum dolor sit amet consectetur. Viverra ultrices
              condimentum nulla mauris id ut non tortor.
            </span>
          </div>

          {/*** SECTION  */}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-4"
                >
                  {items.map((item, index) => (
                    <DraggableComponent
                      key={item.id}
                      id={item.id}
                      index={index}
                      title={item.title}
                    >
                      {renderQuestionInput(item.type, index)}
                    </DraggableComponent>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

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
                  onClick={() => {
                    if (isQuestionSaved) {
                      setShowSection(true);
                    } else {
                      toast.error(
                        "Please save the questions before adding a section",
                      );
                    }
                  }}
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
