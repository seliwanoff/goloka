import React, { useMemo } from "react";
import { Ghost } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";

interface Response {
  id: number;
  campaign_id: number;
  campaign_title: string;
  created_at: string;
  organization: string;
  payment_rate_for_response: string;
  status: "draft" | "pending" | "reviewed" | "accepted";
  unread_messages_count: number;
}

interface ResponseListProps {
  responses: Response[];
  isLoading?: boolean;
}


const formatDate = (date?: string): string => {
  if (!date) return "";
  return moment(date).format("ddd, D MMM - h:mma").toLowerCase();
};
const ResponseSkeleton = () => {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-32 rounded bg-gray-200"></div>
          <div className="h-4 w-24 rounded bg-gray-200"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-6 w-20 rounded-full bg-gray-200"></div>
          <div className="h-6 w-12 rounded bg-gray-200"></div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="rounded-lg border border-dashed bg-gray-50 py-12 text-center">
      <Ghost className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">
        No responses yet
      </h3>
      <p className="mt-2 text-sm text-gray-500">
        Responses will appear here once they are available.
      </p>
    </div>
  );
};

const ResponseList: React.FC<ResponseListProps> = ({
  responses,
  isLoading,
}) => {
    const router = useRouter();
  const getStatusStyles = (status: Response["status"]): string => {
    switch (status) {
      case "pending":
        return "bg-orange-50 text-orange-500 border-orange-200";
      case "reviewed":
        return "bg-purple-50 text-purple-500 border-purple-200";
      case "accepted":
        return "bg-green-50 text-green-500 border-green-200";
      default:
        return "bg-gray-50 text-gray-500 border-gray-200";
    }
  };



  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <ResponseSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!responses.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => (
        <div
          key={response.id}
          className={`rounded-xl border border-[#E0E0E0] bg-[#F8F8F8] p-4`}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {response.campaign_title}
                </h3>
                {response.unread_messages_count > 0 &&
                  response.unread_messages_count && (
                    <span className="rounded-full bg-[#FF4C4C] px-1.5 py-0.5 text-xs font-medium text-white">
                      {response.unread_messages_count}
                    </span>
                  )}
              </div>
              <p className="text-sm text-[#828282]">
                {moment(response.created_at).format("ddd, D MMM - h:mma")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`rounded-full border px-3 py-1 text-sm font-medium ${getStatusStyles(
                  response.status,
                )}`}
              >
                {response.status}
              </span>
              <button onClick={() => {
                router.push(`/dashboard/responses/${response?.id}`)
              }} className="font-medium text-blue-600 hover:bg-blue-100 p-2 rounded-full text-sm">
                View
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResponseList;
