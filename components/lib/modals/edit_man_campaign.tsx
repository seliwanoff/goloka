import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useEditCampaignOverlay,
  useEditMainCampaignOverlay,
} from "@/stores/overlay";
import { cn } from "@/lib/utils";

import { ArrowLeft } from "iconsax-react";
import EditCampaignGroup from "../widgets/edit_group";
import EditMainCampaignWidget from "../widgets/edit_main_campaign";

const EditMainCampaign = () => {
  const { show, setShow } = useEditMainCampaignOverlay();

  return (
    <>
      {/* Edit CAMPAIGN  GROUP */}
      <Dialog open={show} onOpenChange={setShow}>
        <DialogContent
          className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 max-h-[90vh] overflow-y-auto rounded-lg border-0 focus-visible:outline-none"
          style={{
            scrollbarWidth: "none", // Hides scrollbar in Firefox
            msOverflowStyle: "none",
          }}
        >
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
              Edit campaign
            </DialogTitle>
            <DialogDescription className="sr-only text-white">
              Edit campaign
            </DialogDescription>
            <span
              onClick={() => setShow(false)}
              className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
            >
              <X size={20} />
            </span>
          </DialogHeader>
          <div className={cn("mt-16")} />
          <EditMainCampaignWidget />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditMainCampaign;
