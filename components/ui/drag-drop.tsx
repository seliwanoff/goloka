import { Edit, Trash } from "lucide-react";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { BsThreeDots } from "react-icons/bs";
import { useEditAQuestion } from "@/stores/overlay";

type DraggableComponentProps = {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
  className?: string;
  type?: string;
  required?: any;
  data?: any;
  setSelectedQuestion: any;
  setClickedId?: any;
  setOpenQuestion?: any;
};

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  id,
  index,
  title,
  children,
  className,
  required,
  type,
  data,
  setSelectedQuestion,
  setClickedId,
  setOpenQuestion,
}) => {
  const { setShowQuestionEdit } = useEditAQuestion();

  return (
    <Draggable draggableId={id?.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative mt-4 flex flex-col gap-8 rounded-lg bg-white ${type === "s" ? "pt-4" : "p-8"}`}
        >
          <div className="flex items-center justify-between">
            <h3 className={`${className}`}>
              {title}{" "}
              {required === 1 && <span className="text-red-800">*</span>}
            </h3>

            <div className="flex items-center gap-2">
              <span
                className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-600"
                onClick={() => {
                  setShowQuestionEdit(true);
                  setSelectedQuestion(data);
                }}
              >
                <Edit size={18} />
                Edit
              </span>

              <span
                className="inline-flex cursor-pointer items-center gap-2 rounded-md text-[#FF4C4C]"
                onClick={() => {
                  setClickedId(data.id);
                  setOpenQuestion(true);
                  // setSelectedQuestion(data);
                }}
              >
                <Trash size={18} />
              </span>
              {/***
              <BsThreeDots style={{ transform: "rotate(90deg)" }} />
              */}
            </div>
          </div>
          <div>{children}</div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableComponent;
