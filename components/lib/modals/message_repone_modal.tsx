import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React from "react";
import { Delete, Dog, Pause, Play, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Pattern from "@/public/assets/images/campaign/deleteicon.png";
import { Textarea } from "@/components/ui/textarea";
import { FaSpinner } from "react-icons/fa";

type ComponentProps = {
  title: string;
  content: string;
  status: string;

  open?: any;
  action?: () => void;
  setStep: any;
  message?: string;
  setMessage?: any;
  setOpen: any;
  isSubmitting: any;
};
const ResponseMessageModal: React.FC<ComponentProps> = ({
  title,
  content,
  open,
  action,
  status,
  setOpen,
  setStep,
  setMessage,
  isSubmitting,
  // status,
}) => {
  const icon =
    status === "paused" ? (
      <Pause />
    ) : status === "running" ? (
      <Play />
    ) : status === "delete" ? (
      <Trash />
    ) : (
      <Dog />
    );
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
          <div className="flex min-h-full items-end justify-center overflow-hidden p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex w-max items-center justify-center rounded-full bg-gray-200 p-2">
                    {icon}
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      {title}
                    </DialogTitle>

                    <span className="text-center font-poppins text-xs text-gray-400">
                      {content}
                    </span>

                    <div className="mt-6">
                      <Textarea onChange={(e) => setMessage(e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
                  <Button
                    type="button"
                    className="w-full max-w-[185px] rounded-full border border-[#7F55DA] bg-white font-medium text-[#7F55DA]"
                    onClick={() => {
                      setStep((prev: any) => prev - 1);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="w-full max-w-[185px] rounded-full bg-[#EB5757]"
                    onClick={action}
                  >
                    {isSubmitting ? (
                      <FaSpinner className="animate-spin text-white" />
                    ) : status === "rejected" ? (
                      "Reject Response"
                    ) : status === "reviewed" ? (
                      "Review response"
                    ) : (
                      "Continue"
                    )}
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

export default ResponseMessageModal;
