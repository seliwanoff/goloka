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
  useAddQuestionSectionOverlay,
  useEditCampaignOverlay,
} from "@/stores/overlay";
import { cn } from "@/lib/utils";

import EditCampaignGroup from "../widgets/edit_group";
import AddQuestionSection from "../widgets/add_question_section";

interface sectionNameProps {
  status: any;
  question: any;
}

const SectionName = ({ status, question }: sectionNameProps) => {
  const { showSection, setShowSection } = useAddQuestionSectionOverlay();

  return (
    <>
      {/* ADD SECTION QUESTION */}
      <Dialog open={showSection} onOpenChange={setShowSection}>
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
              {status === "update" ? "Update section" : "Add Section"}
            </DialogTitle>
            <DialogDescription className="sr-only text-white">
              {status === "update" ? "Update section" : "Add Section"}
            </DialogDescription>
            <span
              onClick={() => setShowSection(false)}
              className="absolute right-4 top-1/2 mt-0 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] text-[#424242]"
            >
              <X size={20} />
            </span>
          </DialogHeader>
          <div className={cn("mt-16")} />
          <AddQuestionSection status={status} question={question} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SectionName;
