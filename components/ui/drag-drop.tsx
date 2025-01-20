import { Edit } from "lucide-react";
import React from "react";
import { Draggable } from "@hello-pangea/dnd";

type DraggableComponentProps = {
  id: string;
  index: number;
  title: string;
  children: React.ReactNode;
};

const DraggableComponent: React.FC<DraggableComponentProps> = ({
  id,
  index,
  title,
  children,
}) => {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mt-4 flex flex-col gap-8 rounded-lg bg-white p-8"
        >
          <div className="flex items-center justify-between">
            <h3>{title}</h3>
            <span className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-gray-600">
              <Edit size={18} />
              Edit
            </span>
          </div>
          <div>{children}</div>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableComponent;
