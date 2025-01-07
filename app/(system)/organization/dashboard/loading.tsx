import React, { FC } from "react";

type ComponentProps = {};

const LoadingComponent: FC<ComponentProps> = ({}) => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      LoadingComponent
    </div>
  );
};

export default LoadingComponent;
