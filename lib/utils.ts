import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import React, { SetStateAction } from "react";
// import { getResourceToken } from "@/services/resource_service";


type TokenType = {
  access_token: string;
  token_type: string;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ~ ======= merge and construct various tailwind classes into one -->
export const class_merge = (...classes: (string | boolean)[]): string =>
  classes.filter(Boolean).join(" ");

// ~ ======= build server routes -->
const server_url: string = process.env.NEXT_PUBLIC_SERVER_HOST as string;
export const serverRoute = (route: string): string => `${server_url}/${route}`;

// ~ ======= Get token from localstorage -->
export const tokenExtractor = (): {
  auth_header: string;
  token_data: TokenType;
} | null => {
  const raw_token: string | null = localStorage.getItem("whoami");
  if (!raw_token) return null;

  const token: TokenType = JSON.parse(raw_token);
  // @ts-ignore
  return { auth_header: `${token.token_type} ${token.access_token}` };
};







