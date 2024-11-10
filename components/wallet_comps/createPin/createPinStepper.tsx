import { useTransferStepper } from "@/stores/misc";

import { useMediaQuery } from "@react-hook/media-query";
import CreatePin from "./createPin";
import { useState } from "react";



const CreatePinStepper = () => {
    //   const { step } = useTransferStepper();
    const [step] = useState(0);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const stepper = () => {
    switch (step) {
      case 0:
        return <CreatePin />;
    //   case 1:
    //     return <CreatePin />;

    }
  };

  const stepperMobile = () => {
    switch (step) {
      case 0:
        return <CreatePin />;
    //   case 1:
    //     return <CreatePin />;

    }
  };

  return <>{isDesktop ? stepper() : stepperMobile()}</>;
};

export default CreatePinStepper;
