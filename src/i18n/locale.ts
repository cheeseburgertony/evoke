"use server";

import { cookies } from "next/headers";
import { defaultLocale } from "./config";

const COOKIE_NAME = "EVOKE_LOCALE";

export const getUserLocale = async () => {
  return (await cookies()).get(COOKIE_NAME)?.value || defaultLocale;
};

export const setUserLocale = async (locale: string) => {
  (await cookies()).set(COOKIE_NAME, locale);
};
