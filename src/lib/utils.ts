import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorToString(e: unknown): string {
  if (typeof e === "string") {
    return e;
  } else if (e instanceof Error) {
    console.error(e);
    return e.message;
  } else if (e && typeof e === "object" && "error" in e) {
    console.error(e.error);
    if (typeof e.error === "string") {
      return e.error;
    }
  } else {
    console.error(e);
  }
  return "Oops something went wrong";
}
