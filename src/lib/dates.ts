import { parse } from "date-fns";

export function getEpochFromDateAndTime(date: string, time: string) {
  return parse(`${date} ${time}`, "yyyy-MM-dd HH:mm", new Date()).getTime();
}
