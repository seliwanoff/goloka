import { cn } from "@/lib/utils";
import axios from "axios";
import moment from "moment";
import { usePathname } from "next/navigation";
import { format } from "date-fns";

export function numberWithCommas(x: any) {
  if (isNaN(parseFloat(x)) || !isFinite(x)) {
    return "0.00";
  }

  return parseFloat(x).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const formatResponseDate = (dateString: string) => {
  return moment(dateString, "YYYY-MM-DD HH:mm:ss").format("DD/M/YYYY");
};

export const formatResponseTime = (dateString: string) => {
  return moment(dateString, "YYYY-MM-DD HH:mm:ss").format("h:mmA");
};

export const generateURL = (pathname: string, id: number) => {
  if (pathname === "/dashboard" || pathname === "/dashboard/root") {
    return `/dashboard/marketplace/${id}`;
  }
  return `${pathname}/${id}`;
};
export const formatDate = (
  dateString: string,
  format: string = "DD/MM/YYYY",
) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return format
    .replace("DD", day)
    .replace("MM", month)
    .replace("YYYY", year.toString());
};
interface StatusPillProps {
  status?: string;
  className?: string;
}

// Define possible statuses as a union type
export type Status =
  | "draft"
  | "pending"
  | "reviewed"
  | "approved"
  | "rejected"
  | "accepted";

// Utility function to return the appropriate color classes
export const getStatusColor = (status: Status) => {
  switch (status) {
    case "draft":
      return "bg-violet-500/5 border-violet-500 text-violet-500";
    case "pending":
      return "bg-orange-400/5 border-orange-400 text-orange-400";
    case "reviewed":
      return "bg-blue-500/5 border-blue-500 text-blue-500";
    case "approved":
    case "accepted":
      return "bg-emerald-600/5 border-emerald-600 text-emerald-600";
    case "rejected":
      return "bg-red-500/5 border-red-500 text-red-500";
    default:
      return "bg-gray-500/5 border-gray-500 text-gray-500";
  }
};

// Utility function to format the status text
export const getStatusText = (status: Status | string) => {
  const firstChar = status?.charAt(0)?.toUpperCase();
  const rest = status?.slice(1).toLowerCase();
  return `${firstChar}${rest}`;
};

export const getAddressFromLatLng = async (lat: number, lng: number) => {
  const path = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;
  const res = await axios.get<{ results: { formatted_address: string }[] }>(
    path,
  );
  return res.data.results[0].formatted_address;
};

// export const generateColor = (name: string) => {
//   const colors = [
//     "bg-blue-400",
//     "bg-green-400",
//     "bg-red-400",
//     "bg-purple-400",
//     "bg-indigo-400",
//     "bg-cyan-400",
//     "bg-teal-400",
//   ];

//   let hash = 0;
//   for (let i = 0; i < name.length; i++) {
//     hash = name.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const index = Math.abs(hash) % colors.length;
//   return colors[index];
// };

export const generateColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  // Generate RGB values from the hash
  const r = (hash >> 16) & 0xff; // Extract red
  const g = (hash >> 8) & 0xff; // Extract green
  const b = hash & 0xff; // Extract blue
  return `rgb(${r}, ${g}, ${b})`; // Return RGB color
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

export const formatNotifications = (apiResponse: any) => {
  const typeMapping: Record<
    string,
    "TASK" | "ORGANISATIONAL" | "FINANCIAL" | "FEEDBACK"
  > = {
    task: "TASK",
    organisation: "ORGANISATIONAL",
    financial: "FINANCIAL",
    feedback: "FEEDBACK",
  };

  return apiResponse?.data?.map((notification: any) => {
    const { type, data, created_at } = notification;

    return {
      type: typeMapping[data?.type] || "TASK", // Default to TASK if no mapping exists
      message: data?.message,
      time: format(new Date(created_at), "PPPp"), // Format the timestamp, e.g., "Today at 9:20 AM"
    };
  });
};
