import React, { useEffect, useState } from "react";
import UpdateCampaignDialog from "../lib/modals/confirm_update_campaign_modal";

interface CampaignButtonProps {
  status: string;
  setOpen: any;
  open: boolean;
  action: any;
  isSubmitting?: boolean;
}

const CampaignButton: React.FC<CampaignButtonProps> = ({
  status,
  setOpen,
  open,
  action,
  isSubmitting,
}) => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    console.log("Status updated:", status); // Debugging log

    let newTitle = "";
    let newContent = "";

    switch (status) {
      case "paused":
        newTitle = "Pause Campaign";
        newContent = "Are you sure you want to pause this campaign?";

        break;
      case "running":
        newTitle = "Resume Campaign";
        newContent = "Do you want to resume this campaign?";

        break;
      case "completed":
        newTitle = "Restart Campaign";
        newContent = "This campaign has ended. Do you want to restart it?";

        break;
      case "draft":
        newTitle = "Change to draft";
        newContent = "Do you want to change this campaign to draft?";

        break;
      default:
        newTitle = "Unknown Status";
        newContent = "The campaign status is not recognized.";
    }

    setTitle(newTitle);
    setContent(newContent);
  }, [status, open]);

  return (
    <>
      <UpdateCampaignDialog
        title={title}
        content={content}
        action={action}
        open={open}
        isSubmitting={isSubmitting as boolean}
        status={status}
        setOpen={setOpen}
      />
    </>
  );
};

export default CampaignButton;
