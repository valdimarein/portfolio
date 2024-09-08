import type { Time } from "./index";

type TimeGuard = {
  time: Time;
};

export function isValidTime(obj: unknown): obj is TimeGuard {
  if (typeof obj === "object" && obj !== null && "time" in obj) {
    const timeObj = (obj as TimeGuard).time;
    return (
      timeObj !== undefined &&
      timeObj !== null &&
      typeof timeObj.hold === "number" &&
      typeof timeObj.remainder === "number"
    );
  }
  return false;
}
