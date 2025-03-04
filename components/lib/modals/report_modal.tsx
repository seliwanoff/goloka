import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useShowReport } from "@/stores/overlay";
import { useMediaQuery } from "@react-hook/media-query";
import { cn } from "@/lib/utils";

import ReportWidget from "../widgets/report_widget";
import { useUserStore } from "@/stores/currentUserStore";

const ReportModal = () => {
  const { showReport, setShowReport } = useShowReport();
  const currentUser = useUserStore((state) => state.user);

  return (
    <>
      {/* ADD CAMPAIGN  GROUP */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="overflow-hidden rounded-lg border-0 focus-visible:outline-none">
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
              Report{" "}
              {(currentUser && currentUser?.current_role) || "organization"}
            </DialogTitle>
            <DialogDescription className="sr-only text-white">
              Report{" "}
              {(currentUser && currentUser?.current_role) || "organization"}
            </DialogDescription>
            <span
              onClick={() => setShowReport(false)}
              className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
            >
              <X size={20} />
            </span>
          </DialogHeader>
          <div className={cn("mt-16")} />
          <ReportWidget />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportModal;
