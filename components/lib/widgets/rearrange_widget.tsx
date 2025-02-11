"use client";

import { GripHorizontal, Loader } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { reOrdreQuestion, updateQuestion } from "@/services/campaign/question";
import { toast } from "sonner";
import { useRearrageQuestion } from "@/stores/overlay";

interface Question {
  id: string;
  text: string;
  type: string;
  order: number;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  options?: any[];
  attributes?: any;
  question_group_id?: string;
}

interface RearrangeWidgetProps {
  questions: Question[];
  id: any;
  action: () => void;
}

const RearrangeWidget = ({ questions, id, action }: RearrangeWidgetProps) => {
  const [sortedQuestions, setSortedQuestions] = useState<Question[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { setShowQuestion } = useRearrageQuestion();

  useEffect(() => {
    setSortedQuestions([...questions].sort((a, b) => a.order - b.order));
  }, [questions]);
  //console.log(questions);

  const handleQuestion = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setShowQuestion(false);
    }, 1000);
  };
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const reorderedQuestions = [...sortedQuestions];
    const movedItem = reorderedQuestions.splice(result.source.index, 1)[0];

    reorderedQuestions.splice(result.destination.index, 0, movedItem);

    // Update order numbers
    const updatedQuestions = reorderedQuestions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));
    updateRearrangeQuestions(updatedQuestions);
    setSortedQuestions(updatedQuestions);
  };

  const updateRearrangeQuestions = async (newQuestion: any) => {
    setLoading(true);
    // console.log(newQuestion);
    try {
      const payload = {
        questions: newQuestion.map((q: any, index: number) => ({
          id: q.id,
          order: q.order,
        })),
        question_group_id: "",
      };
      await reOrdreQuestion(id, payload);
      action();
      //toast.success("Question reordered");
    } catch (error) {
      console.error("Failed to update questions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions-list">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="flex flex-col gap-4"
            >
              {sortedQuestions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex w-full cursor-grab items-center justify-between gap-8 border-b bg-white px-4 py-4"
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="flex cursor-grab items-center gap-2"
                      >
                        <GripHorizontal className="text-base text-[#CECECE]" />
                        <span className="font-poppins font-medium text-[#333333]">
                          {question.label}
                        </span>
                      </div>

                      <span className="font-poppins font-normal text-[#666666]">
                        {question.type}
                      </span>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        className="mt-8 h-auto w-full rounded-full bg-main-100 py-3 text-white hover:bg-blue-700 hover:text-white"
        type="button"
        onClick={handleQuestion}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader className="animate-spin text-[#fff]" />
        ) : (
          "Rearrange Questions"
        )}
      </Button>
    </div>
  );
};

export default RearrangeWidget;
