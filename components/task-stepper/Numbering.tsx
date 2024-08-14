import React from "react";

type ComponentProps = {
  questionNumber: number;
};

const Numbering: React.FC<ComponentProps> = ({ questionNumber }) => {
  return (
    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-main-100 bg-opacity-5">
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-main-100 text-xs font-medium text-white">
        {questionNumber}
      </span>
    </div>
  );
};

export default Numbering;
