import React, { useContext } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { TickCircle } from "iconsax-react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useStepper } from "@/context/TaskStepperContext.tsx";

type ComponentProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TaskSuccessModal: React.FC<ComponentProps> = ({ open, setOpen }) => {
  const router = useRouter();
  const { setStep, setAnswers } = useStepper();

  const handeClick = () => {
    setStep(1);
    setAnswers({});
    router.push("/dashboard/marketplace");
  };

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center overflow-hidden p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg bg-white p-6 text-left shadow-xl transition-all sm:w-[500px]">
                <div className="relative flex w-full flex-col items-center justify-center border-main-100 border-opacity-10 bg-main-100 bg-opacity-5 p-6">
                  <span className="text-main-100">
                    <TickCircle size={54} variant="Bold" />
                  </span>
                  <p className="mt-4 text-center text-sm font-medium text-[#333333]">
                    Great! you have successfully answered all the questions
                  </p>
                  <span
                    onClick={() => setOpen(false)}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#4F4F4F]"
                  >
                    <X />
                  </span>
                </div>

                <p className="mb-11 mt-4 text-base text-[#333333]">
                  You will be credited once the organisation accept your
                  response
                </p>
                <div className="mt-5 sm:mt-6">
                  <Button
                    className="h-auto w-full cursor-pointer rounded-full bg-main-100 py-3 hover:bg-blue-700"
                    onClick={handeClick}
                  >
                    Explore more tasks
                  </Button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TaskSuccessModal;
