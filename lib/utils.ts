import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";

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
const serverUrl: string = process.env.NEXT_PUBLIC_SERVER_HOST as string;
export const serverRoute = (route: string): string => `${serverUrl}/${route}`;

// Extract token from local storage and return token data with auth header
export const tokenExtractor = (): {
  authHeader: string;
  tokenData: TokenType;
} | null => {
  const rawToken: string | null = localStorage.getItem("whoami");
  if (!rawToken) return null;

  try {
    const tokenData: TokenType = JSON.parse(rawToken);
    return {
      authHeader: `${tokenData.token_type} ${tokenData.access_token}`,
      tokenData,
    };
  } catch (error) {
    console.error("Failed to parse token from local storage", error);
    return null;
  }
};
