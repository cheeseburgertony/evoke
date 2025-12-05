// 模板数据对应的国际化key
export const PROJECT_TEMPLATES = [
  {
    emoji: "✨",
    titleKey: "particleLogin_title",
    promptKey: "particleLogin_prompt",
  },
  { emoji: "🎆", titleKey: "fireworks_title", promptKey: "fireworks_prompt" },
  { emoji: "🕰️", titleKey: "timeline_title", promptKey: "timeline_prompt" },
  {
    emoji: "📸",
    titleKey: "imageFilter_title",
    promptKey: "imageFilter_prompt",
  },
  {
    emoji: "🖼️",
    titleKey: "particleAvatar_title",
    promptKey: "particleAvatar_prompt",
  },
  {
    emoji: "🧊",
    titleKey: "glassDashboard_title",
    promptKey: "glassDashboard_prompt",
  },
  { emoji: "🪄", titleKey: "glassCard_title", promptKey: "glassCard_prompt" },
  { emoji: "📋", titleKey: "kanban_title", promptKey: "kanban_prompt" },
] as const;

// placeholder 对应的国际化key
export const PLACEHOLDER_KEYS = [
  "placeholder_blog",
  "placeholder_todo",
  "placeholder_ecommerce",
  "placeholder_portfolio",
  "placeholder_chat",
  "placeholder_weather",
] as const;
