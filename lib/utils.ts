import { type ClassValue, clsx } from "clsx";
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
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to merge and construct various Tailwind classes into one
export const classMerge = (...classes: (string | boolean)[]): string =>
  classes.filter(Boolean).join(" ");

// Build server routes with the base URL from environment variables
// const serverUrl: string = process.env.NEXT_PUBLIC_SERVER_HOST as string;
export const serverRoute = (route: string): string => `${baseURL}/${route}`;

// Extract token from local storage and return token data with auth header
// export const tokenExtractor = (): {
//   authHeader: string;
//   // tokenData: TokenType;
// } | null => {
//   const rawToken: string | null = localStorage.getItem("my_id");
//   const token = localStorage.getItem("access_token");
//   const token_type = localStorage.getItem("token_type");
//   if (!token) return null;

//   try {
//     const parsedToken = JSON.parse(token);
//     const parsedTokenType = JSON.parse(token_type as string);

//     const tokenData = {
//       token_type: parsedTokenType,
//       access_token: token,
//       refresh_token: parsedToken.refresh_token,
//       expires_at: parsedToken.exp * 1000, // Convert to milliseconds
//     };

//     return {
//       authHeader: `${parsedTokenType} ${parsedToken}`,
//       // tokenData,
//     };
//   } catch (error) {
//     console.error("Failed to parse token from local storage", error);
//     return null;
//   }
// };
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
