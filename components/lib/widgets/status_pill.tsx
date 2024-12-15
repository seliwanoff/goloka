import { getStatusText } from "@/helper";
import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: string;
  getStatusColor: any;
}

const StatusPill: React.FC<StatusPillProps> = ({ status, getStatusColor }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full border px-2 py-1 text-xs font-medium",
        getStatusColor,
      )}
    >
      {getStatusText(status)}
    </span>
  );
};

export default StatusPill;
