export type Locale = (typeof locales)[number];

export const locales = ["en-US", "zh-CN"] as const;
export const defaultLocale: Locale = "zh-CN";
