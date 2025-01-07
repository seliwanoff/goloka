import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAddBeneficiaryOverlay } from "@/stores/overlay";
import { useMediaQuery } from "@react-hook/media-query";
import { cn } from "@/lib/utils";

import { ArrowLeft } from "iconsax-react";
import AddBeneficiary from "../widgets/add_beneficiary";

const CreateBeneficiary = () => {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { show, setShow } = useAddBeneficiaryOverlay();

  return (
    <>
      {isDesktop ? (
        <>
          {/* DESTOP */}

          {/* ADD BENEFICIARY MODAL */}
          <Dialog open={show} onOpenChange={setShow}>
            <DialogContent className="overflow-hidden rounded-lg border-0 focus-visible:outline-none">
              <DialogHeader
                className={cn(
                  "absolute left-0 top-0 z-10 w-full space-y-0 border-b border-[#F2F2F2] bg-white p-5 text-left",
                )}
              >
                <DialogTitle className={cn("text-lg font-medium text-[#333]")}>
                  Add beneficiary
                </DialogTitle>
                <DialogDescription className="sr-only text-white">
                  Add beneficiary
                </DialogDescription>
                <span
                  onClick={() => setShow(false)}
                  className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
                >
                  <X size={20} />
                </span>
              </DialogHeader>
              <div className={cn("mt-16")} />
              <AddBeneficiary />
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          {/* MOBILE */}

          <div
            className={cn(
              "fixed left-0 top-0 h-svh w-full overflow-y-auto bg-white px-4 pb-8 pt-24",
              show ? "block" : "hidden",
            )}
          >
            <div className="h-min">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-4">
                  <span
                    className="cursor-pointer"
                    onClick={() => setShow(false)}
                  >
                    <ArrowLeft size="24" />
                  </span>
                  <h3 className="text-lg font-medium text-[#333333]">
                    Add beneficiary
                  </h3>
                </div>
                <span
                  onClick={() => setShow(false)}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
                >
                  <X size={20} />
                </span>
              </div>

              <div className="mt-11">
                <AddBeneficiary />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CreateBeneficiary;
