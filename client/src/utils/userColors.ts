import { getUserColor } from "./colorPicker";

export const usersColors: Record<string, string> = {};

export function handleLogin(userId: string) {
  if (!usersColors[userId]) {
    usersColors[userId] = getUserColor(); // assign new color
  }
  return usersColors[userId]; // return assigned/reused color
}