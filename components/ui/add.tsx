import Image from "next/image";
import React, { ReactNode } from "react";

interface AddProps {
  imageSrc: string;
  onClick?: () => void;
  children?: ReactNode;
}

const Add: React.FC<AddProps> = ({ imageSrc, onClick, children }) => {
  return (
    <div
      className="flex w-fit cursor-pointer items-center gap-2 rounded-lg bg-[#F8F8F8] p-2 hover:bg-gray-200"
      onClick={onClick}
    >
      <Image
        src={imageSrc}
        alt="icon"
        width={24}
        height={24}
        className="object-contain"
      />
      {children && (
        <div className="font-poppins text-sm font-normal text-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};

export default Add;
