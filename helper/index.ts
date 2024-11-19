import { cn } from "@/lib/utils";
import moment from "moment";
import { usePathname } from "next/navigation";

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
  return moment(dateString).format("DD/M/YYYY");
};

export const formatResponseTime = (dateString: string) => {
  return moment(dateString).format("h:mmA");
};

export const generateURL = (pathname: string, id: number) => {
  if (pathname === "/dashboard" || pathname === "/dashboard/root") {
    return `/dashboard/marketplace/${id}`;
  }
  return `${pathname}/${id}`;
};


interface StatusPillProps {
  status?: string;
  className?: string;
}

// Define possible statuses as a union type
export type Status = "draft" | "pending" | "reviewed" | "approved" | "rejected";

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
      return "bg-emerald-600/5 border-emerald-600 text-emerald-600";
    case "rejected":
      return "bg-red-500/5 border-red-500 text-red-500";
    default:
      return "bg-gray-500/5 border-gray-500 text-gray-500";
  }
};

// Utility function to format the status text
export const getStatusText = (status: Status) => {
  const firstChar = status.charAt(0).toUpperCase();
  const rest = status.slice(1).toLowerCase();
  return `${firstChar}${rest}`;
};


export const generateColor = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

