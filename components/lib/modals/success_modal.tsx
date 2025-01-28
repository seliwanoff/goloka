import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useOpenSuccessModalOverlay } from "@/stores/overlay";
import { cn } from "@/lib/utils";
import Pattern from "@/public/assets/images/campaign/newmasked.png";

import Image from "next/image";
import { Button } from "@/components/ui/button";
type ComponentProps = {
  title: string;
  content: string;
  action: () => void;
};
const SuccessDialog: React.FC<ComponentProps> = ({
  title,
  content,
  action,
}) => {
  const { open, setOpen } = useOpenSuccessModalOverlay();

  return (
    <>
      {/* ADD CAMPAIGN  GROUP */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[475px] overflow-hidden rounded-lg border-0 focus-visible:outline-none">
          <DialogHeader
            className={cn(
              "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
            )}
          >
            <DialogTitle
              className={cn(
                "font-poppins text-lg font-medium leading-[21px] text-[#333]",
              )}
            >
              Create campaign
            </DialogTitle>
            <DialogDescription className="sr-only text-white">
              Create campaign
            </DialogDescription>
            <span
              onClick={() => setOpen(false)}
              className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
            >
              <X size={20} />
            </span>
          </DialogHeader>
          <div className={cn("mt-16")} />
          <div className="ml-12 mr-12">
            <div className="mx-auto flex w-max items-center justify-center rounded-full">
              <Image
                src={Pattern}
                alt="Campaign created"
                className="h-full w-full"
              />
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                {title}
              </DialogTitle>
              <div className="mt-2">
                <p className="text-center text-sm text-gray-500">{content}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col items-center gap-4 sm:mt-6">
            <Button
              type="button"
              className="w-full rounded-full bg-[#3365E3] font-medium text-[#fff]"
              onClick={action}
            >
              Add campaign question
            </Button>

            <span
              className="block cursor-pointer text-center font-poppins text-[16px] font-medium text-[#3365E3]"
              onClick={() => setOpen(false)}
            >
              I will do it later
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SuccessDialog;
