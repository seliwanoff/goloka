import clsx from "clsx";
// import { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import { baseURL } from "./axiosInstance";

// Define the type for tokens
type TokenType = {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
};

// Function to merge class names with Tailwind and clsx
// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

// Function to merge and construct various Tailwind classes into one
export const classMerge = (...classes: (string | boolean)[]): string =>
  classes.filter(Boolean).join(" ");

export const serverRoute = (route: string): string => `${baseURL}/${route}`;

export const tokenExtractor = (): {
  authHeader: string;
  tokenData: any;
} | null => {
  const token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const token_type = localStorage.getItem("token_type");

  if (!token || !token_type) return null;

  try {
    const parsedToken = JSON.parse(token) as string;
    const parsedRefresh_token = JSON.parse(refresh_token as string) as string;
    const parsedTokenType = JSON.parse(token_type) as string;

    const tokenData = {
      token_type: parsedTokenType,
      access_token: parsedToken,
      refresh_token: parsedRefresh_token,
    };

    return {
      authHeader: `${parsedTokenType} ${parsedToken}`,
      tokenData,
    };
  } catch (error) {
    console.error("Failed to parse token from local storage", error);
    return null;
  }
};

export function chunkArray<T>(array: T[], size: number) {
  let result = [];
  for (let i = 0; i < array?.length; i += size) {
    let chunk = array?.slice(i, i + size);
    result.push(chunk);
  }
  return result;
}

export const responseStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "draft":
      return "bg-violet-500 border border-violet-500 bg-opacity-5 text-violet-500";
    case "pending":
      return "bg-orange-400 border border-orange-400 bg-opacity-5 text-orange-400";
    case "approved":
      return "bg-emerald-700 border border-emerald-700 bg-opacity-5 text-emerald-700";
    case "rejected":
      return "bg-[#FF0000] border border-[#FF0000] bg-opacity-5 text-[#FF0000]";
  }
};

export const walletStatus = (status: string) => {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-orange-400 border border-orange-400 bg-opacity-5 text-orange-400";
    case "successful":
      return "bg-emerald-700 border border-emerald-700 bg-opacity-5 text-emerald-700";
    case "failed":
      return "bg-[#FF0000] border border-[#FF0000] bg-opacity-5 text-[#FF0000]";
  }
};


