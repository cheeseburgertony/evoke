#!/usr/bin/env node

/**
 * i18n 文案提取与替换脚本 (增强版)
 *
 * 功能：
 * - 扫描 src 目录下所有 .tsx/.ts/.jsx/.js 文件
 * - 提取包含中文的字符串（排除注释和 console 内容）
 * - 支持模板字符串（反引号）
 * - 支持 JSX 中带变量插值的文本
 * - 支持常量文件
 * - 按照 next-intl 的嵌套 JSON 格式输出到 messages 目录
 * - 【可选】自动替换源代码中的中文为 t('key') 格式
 *
 * 使用方法：
 *   node scripts/extract-i18n.js          # 仅提取，不替换
 *   node scripts/extract-i18n.js --replace # 提取并替换源代码
 *   node scripts/extract-i18n.js --dry-run # 预览替换效果（不写入文件）
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const MSG_DIR = path.join(ROOT, "messages");

// 命令行参数
const args = process.argv.slice(2);
const REPLACE_MODE = args.includes("--replace");
const DRY_RUN = args.includes("--dry-run");

// 存储提取的文案: namespace -> Map<key, text>
const extractedMessages = new Map();

// 存储文案到 key 的反向映射: text -> { namespace, key }
const textToKeyMap = new Map();

// 存储需要修改的文件
const filesToModify = new Map();

/**
 * 根据文件路径生成命名空间
 */
function generateNamespace(filePath) {
  let rel = path.relative(SRC_DIR, filePath).replace(/\\/g, "/");
  rel = rel.replace(/\.(tsx|ts|jsx|js)$/, "");
  rel = rel.replace(/\[(.*?)\]/g, "");
  rel = rel.replace(/\(.*?\)\//g, "");

  const parts = rel.split("/").filter(Boolean);

  // 页面
  if (parts.includes("page") || parts[0] === "app") {
    const pageParts = parts.filter(p => p !== "app" && p !== "page" && p !== "index");
    if (pageParts.length === 0) return "HomePage";
    return toPascalCase(pageParts.join("-")) + "Page";
  }

  // 组件
  if (parts.includes("components")) {
    const idx = parts.lastIndexOf("components");
    const componentParts = parts.slice(idx + 1).filter(p => p !== "index");
    if (componentParts.length === 0) return "Common";
    return toPascalCase(componentParts.join("-"));
  }

  // 模块
  if (parts.includes("modules")) {
    const idx = parts.indexOf("modules");
    const moduleParts = parts.slice(idx + 1).filter(p => !["ui", "index", "page"].includes(p));
    if (moduleParts.length === 0) return "Common";
    return toPascalCase(moduleParts.join("-"));
  }

  // lib
  if (parts.includes("lib")) {
    const idx = parts.indexOf("lib");
    const libParts = parts.slice(idx + 1).filter(p => p !== "index");
    if (libParts.length === 0) return "Lib";
    return toPascalCase(libParts.join("-"));
  }

  // constants 文件归类到 Common
  if (parts.some(p => p.includes("constants"))) {
    return "Common";
  }

  const fileName = parts[parts.length - 1] || "common";
  return toPascalCase(fileName);
}

function toPascalCase(str) {
  return str
    .replace(/[-_](.)/g, (_, char) => char.toUpperCase())
    .replace(/^(.)/, (_, char) => char.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "");
}

/**
 * 语义化 key 映射表
 */
const KEYWORD_MAP = {
  "登录": "signIn",
  "注册": "signUp",
  "提交": "submit",
  "取消": "cancel",
  "确认": "confirm",
  "删除": "delete",
  "编辑": "edit",
  "保存": "save",
  "返回": "goBack",
  "首页": "home",
  "回到首页": "backToHome",
  "返回首页": "backToHome",
  "设置": "settings",
  "用户": "user",
  "密码": "password",
  "邮箱": "email",
  "手机": "phone",
  "搜索": "search",
  "加载中": "loading",
  "暂无数据": "noData",
  "暂无作品": "noWorks",
  "暂无": "empty",
  "错误": "error",
  "成功": "success",
  "失败": "failed",
  "警告": "warning",
  "提示": "hint",
  "复制": "copy",
  "已复制": "copied",
  "升级": "upgrade",
  "订阅价格": "pricingTitle",
  "订阅": "subscription",
  "价格": "pricing",
  "剩余": "remaining",
  "重置": "reset",
  "发送": "send",
  "创建": "create",
  "选择": "select",
  "我的": "my",
  "作品": "works",
  "重新加载": "reload",
  "刷新": "refresh",
  "预览": "preview",
  "代码": "code",
  "外观": "appearance",
  "浅色": "light",
  "深色": "dark",
  "思考中": "thinking",
  "生成中": "generating",
  "简体中文": "zhCN",
  "未知时间": "unknownTime",
  "用户未登录": "userNotLoggedIn",
  "复制到剪贴板": "copyToClipboard",
  "链接已复制到剪贴板": "linkCopied",
  "复制链接": "copyLink",
  "在新的标签页打开": "openInNewTab",
  "复制链接失败": "copyLinkFailed",
  "错误详情": "errorDetails",
  "复制错误信息": "copyErrorInfo",
  "哎呀": "oops",
  "出了点问题": "somethingWentWrong",
  "页面遇到": "pageEncountered",
  "意外情况": "unexpectedError",
  "如果问题持续存在": "ifProblemPersists",
  "联系技术支持": "contactSupport",
  "后重置": "resetAfter",
  "额度": "quota",
  "免费": "free",
  "粒子动画": "particleAnimation",
  "登录页": "loginPage",
  "烟花": "fireworks",
  "生成器": "generator",
  "时间线": "timeline",
  "滤镜": "filter",
  "工作室": "studio",
  "头像": "avatar",
  "仪表盘": "dashboard",
  "卡片": "card",
  "看板": "kanban",
  "任务": "task",
  "博客": "blog",
  "网站": "website",
  "待办事项": "todo",
  "电商": "ecommerce",
  "平台": "platform",
  "作品集": "portfolio",
  "聊天": "chat",
  "应用": "app",
  "天气": "weather",
  "预报": "forecast",
  "构建": "build",
  "正在分析": "analyzing",
  "正在构建": "building",
  "制作": "making",
  "组件": "component",
  "优化": "optimizing",
  "布局": "layout",
  "添加": "adding",
  "润色": "polishing",
  "即将完成": "almostDone",
  "智谱": "zhipu",
  "大模型": "llm",
  "编程": "coding",
  "性价比": "costEffective",
  "速度快": "fast",
  "美团": "meituan",
  "跟随系统": "system",
  "的作品": "sWorks",
  "消息": "message",
  "给": "sendTo",
  "交互式": "interactive",
  "图片": "image",
  "拖拽": "drag",
  "上传": "upload",
  "下载": "download",
  "鼠标": "mouse",
  "动画": "animation",
  "效果": "effect",
  "背景": "background",
  "渐变": "gradient",
  "玻璃": "glass",
  "悬停": "hover",
  "流畅": "smooth",
  "现代": "modern",
  "简洁": "clean",
  "支持": "support",
  "包含": "include",
  "使用": "use",
  "实现": "implement",
  "页面": "page",
  "个人": "personal",
};

/**
 * 生成语义化的 key
 */
function generateKey(chinese, existingKeys) {
  // 清理字符串（移除变量占位符）
  const cleanedChinese = chinese.replace(/\{[^}]*\}/g, "").trim();

  // 完全匹配
  if (KEYWORD_MAP[cleanedChinese]) {
    return makeUniqueKey(KEYWORD_MAP[cleanedChinese], existingKeys);
  }

  // 包含关键词（优先匹配更长的）
  const sortedKeywords = Object.keys(KEYWORD_MAP).sort((a, b) => b.length - a.length);
  for (const cn of sortedKeywords) {
    if (cleanedChinese.includes(cn)) {
      return makeUniqueKey(KEYWORD_MAP[cn], existingKeys);
    }
  }

  // 根据内容长度生成 key
  const cleaned = cleanedChinese.replace(/[^\u4e00-\u9fa5]/g, "").slice(0, 6);
  return makeUniqueKey("text_" + cleaned, existingKeys);
}

function makeUniqueKey(baseKey, existingKeys) {
  if (!existingKeys.has(baseKey)) return baseKey;
  let counter = 2;
  while (existingKeys.has(`${baseKey}${counter}`)) counter++;
  return `${baseKey}${counter}`;
}

function hasChinese(str) {
  return /[\u4e00-\u9fa5]/.test(str);
}

/**
 * 清理字符串，保留变量占位符
 */
function cleanString(str) {
  return str
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, " ")
    .replace(/\\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 判断是否是需要跳过的字符串
 */
function shouldSkipString(str, code, index) {
  const before = code.slice(Math.max(0, index - 80), index);

  // 跳过 className
  if (/className\s*=\s*["'`]?$/.test(before)) return true;
  if (/cn\(\s*["'`]?$/.test(before)) return true;
  if (/clsx\(\s*["'`]?$/.test(before)) return true;
  if (/cva\(\s*["'`]?$/.test(before)) return true;

  // 跳过 import/require/from
  if (/import\s+.*from\s+["'`]$/.test(before)) return true;
  if (/require\(\s*["'`]$/.test(before)) return true;
  if (/from\s+["'`]$/.test(before)) return true;

  // 跳过 href/src 属性
  if (/href\s*=\s*["'`]$/.test(before)) return true;
  if (/src\s*=\s*["'`]$/.test(before)) return true;

  // 跳过太长的字符串（但保留有变量的）
  if (str.length > 200 && !str.includes("{")) return true;

  // 跳过纯代码关键字的字符串
  if (/^(function|const|let|var|return|import|export|className|onClick)$/.test(str)) return true;

  return false;
}

/**
 * 判断文件是否是 React 组件文件（可以使用 useTranslations hook）
 */
function isReactComponentFile(code, filePath) {
  // 跳过特定目录的文件（非组件文件）
  const skipPaths = [
    "/trpc/",
    "/lib/",
    "/utils/",
    "/types/",
    "/hooks/",
    "/inngest/",
    "/server/",
  ];

  const normalizedPath = filePath.replace(/\\/g, "/");
  for (const skipPath of skipPaths) {
    if (normalizedPath.includes(skipPath)) {
      return false;
    }
  }

  // 必须有 JSX 语法（有 <Component 或 <tag）
  const hasJSX = /<[A-Za-z][A-Za-z0-9]*[\s\/>]/.test(code);

  // 必须是函数组件（返回 JSX）
  const hasReturnJSX = /return\s*\(?\s*</.test(code);

  return hasJSX && hasReturnJSX;
}

/**
 * 判断文件是否是常量文件
 */
function isConstantsFile(filePath) {
  const normalizedPath = filePath.replace(/\\/g, "/");
  return normalizedPath.includes("/constants") || normalizedPath.endsWith("constants.ts") || normalizedPath.endsWith("constants.js");
}

/**
 * 从代码中移除注释
 */
function removeComments(code) {
  let result = code;
  // 移除多行注释
  result = result.replace(/\/\*[\s\S]*?\*\//g, match => " ".repeat(match.length));
  // 移除单行注释
  result = result.replace(/\/\/[^\n]*/g, match => " ".repeat(match.length));
  // 移除 console 语句
  result = result.replace(/console\.(log|warn|error|info|debug)\s*\([^)]*\)/g, match => " ".repeat(match.length));
  return result;
}

/**
 * 提取双引号字符串
 */
function extractDoubleQuoteStrings(code, messages) {
  const re = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
  let match;
  while ((match = re.exec(code)) !== null) {
    const str = match[1];
    if (hasChinese(str) && !shouldSkipString(str, code, match.index)) {
      messages.push({ text: cleanString(str), original: match[0], type: "double" });
    }
  }
}

/**
 * 提取单引号字符串
 */
function extractSingleQuoteStrings(code, messages) {
  const re = /'([^'\\]*(?:\\.[^'\\]*)*)'/g;
  let match;
  while ((match = re.exec(code)) !== null) {
    const str = match[1];
    if (hasChinese(str) && !shouldSkipString(str, code, match.index)) {
      messages.push({ text: cleanString(str), original: match[0], type: "single" });
    }
  }
}

/**
 * 提取模板字符串（反引号）
 */
function extractTemplateStrings(code, messages) {
  // 匹配简单的模板字符串（不含 ${} 的）
  const simpleRe = /`([^`$]*[\u4e00-\u9fa5][^`$]*)`/g;
  let match;
  while ((match = simpleRe.exec(code)) !== null) {
    const str = match[1];
    if (hasChinese(str) && !shouldSkipString(str, code, match.index)) {
      messages.push({ text: cleanString(str), original: match[0], type: "template" });
    }
  }

  // 匹配带 ${} 变量的模板字符串
  const complexRe = /`([^`]*\$\{[^}]+\}[^`]*)`/g;
  while ((match = complexRe.exec(code)) !== null) {
    const str = match[1];
    if (hasChinese(str) && !shouldSkipString(str, code, match.index)) {
      // 将 ${xxx} 转换为 {xxx} 格式，便于 i18n 处理
      const normalized = str.replace(/\$\{([^}]+)\}/g, "{$1}");
      messages.push({ text: cleanString(normalized), original: match[0], type: "templateComplex", hasVars: true });
    }
  }
}

/**
 * 判断是否是简单变量 {varName} 而不是复杂表达式 {a && b} 或 {a ? b : c}
 */
function isSimpleVariable(expr) {
  // 移除花括号
  const inner = expr.slice(1, -1).trim();
  // 简单变量: 只包含标识符、点号、可选链
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*(\??\.[a-zA-Z_$][a-zA-Z0-9_$]*)*$/.test(inner);
}

/**
 * 从 JSX 文本中提取纯中文部分，过滤复杂表达式
 */
function extractChineseFromJSX(str) {
  // 找出所有 {...} 表达式
  const expressions = str.match(/\{[^}]+\}/g) || [];

  let result = str;
  let hasSimpleVars = false;
  let hasComplexExpr = false;

  for (const expr of expressions) {
    if (isSimpleVariable(expr)) {
      // 简单变量保留
      hasSimpleVars = true;
    } else {
      // 复杂表达式移除
      hasComplexExpr = true;
      result = result.replace(expr, "");
    }
  }

  // 清理多余空格
  result = result.replace(/\s+/g, " ").trim();

  return { text: result, hasSimpleVars, hasComplexExpr };
}

/**
 * 提取 JSX 文本节点（包括带变量的）
 */
function extractJSXTextNodes(code, messages) {
  // 简单的 JSX 文本节点: >中文<
  const simpleRe = />([^<>]*[\u4e00-\u9fa5][^<>]*)</g;
  let match;
  while ((match = simpleRe.exec(code)) !== null) {
    let str = match[1];
    if (!str || str.length > 300) continue;

    // 清理并保留变量
    str = str.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");

    // 替换 &nbsp; 为空格
    str = str.replace(/&nbsp;/g, " ");

    // 检查是否包含 JSX 表达式 {...}
    const hasExpression = /\{[^}]+\}/.test(str);

    if (hasExpression) {
      // 提取纯中文部分，过滤复杂表达式
      const { text, hasSimpleVars, hasComplexExpr } = extractChineseFromJSX(str);

      if (hasChinese(text)) {
        messages.push({
          text: cleanString(text),
          original: match[0],
          type: "jsx",
          hasVars: hasSimpleVars,
          hasComplexExpr: hasComplexExpr
        });
      }
    } else if (hasChinese(str)) {
      messages.push({
        text: cleanString(str),
        original: match[0],
        type: "jsx",
        hasVars: false
      });
    }
  }
}

/**
 * 提取对象属性中的中文（用于常量文件）
 */
function extractObjectProperties(code, messages) {
  // 匹配 key: "中文" 或 key: '中文' 格式
  const propRe = /(\w+)\s*:\s*["']([^"']*[\u4e00-\u9fa5][^"']*)["']/g;
  let match;
  while ((match = propRe.exec(code)) !== null) {
    const key = match[1];
    const str = match[2];

    // 跳过一些特定的 key
    if (["className", "id", "type", "name", "href", "src"].includes(key)) continue;

    if (hasChinese(str) && !shouldSkipString(str, code, match.index)) {
      messages.push({ text: cleanString(str), original: match[0], type: "property", propKey: key });
    }
  }
}

/**
 * 第一遍：提取所有中文文案
 */
function extractPhase(filePath) {
  const originalCode = fs.readFileSync(filePath, "utf8");
  const namespace = generateNamespace(filePath);
  const isConstants = isConstantsFile(filePath);

  // 用于匹配的代码（移除注释）
  const code = removeComments(originalCode);

  const messages = [];

  // 提取各类字符串
  extractDoubleQuoteStrings(code, messages);
  extractSingleQuoteStrings(code, messages);
  extractTemplateStrings(code, messages);
  extractJSXTextNodes(code, messages);

  // 常量文件额外提取对象属性
  if (isConstants) {
    extractObjectProperties(code, messages);
  }

  // 去重（基于文本内容）
  const seen = new Set();
  const uniqueMessages = messages.filter(m => {
    if (seen.has(m.text)) return false;
    seen.add(m.text);
    return true;
  });

  if (uniqueMessages.length > 0) {
    if (!extractedMessages.has(namespace)) {
      extractedMessages.set(namespace, new Map());
    }

    const nsMessages = extractedMessages.get(namespace);
    const existingKeys = new Set(nsMessages.keys());

    for (const msg of uniqueMessages) {
      // 检查是否已存在相同文案
      let existingKey = null;
      for (const [key, value] of nsMessages.entries()) {
        if (value === msg.text) {
          existingKey = key;
          break;
        }
      }

      if (!existingKey) {
        const key = generateKey(msg.text, existingKeys);
        nsMessages.set(key, msg.text);
        existingKeys.add(key);
        textToKeyMap.set(`${namespace}::${msg.text}`, { namespace, key, ...msg });
      } else {
        textToKeyMap.set(`${namespace}::${msg.text}`, { namespace, key: existingKey, ...msg });
      }
    }

    // 记录需要修改的文件（仅 React 组件文件）
    if (uniqueMessages.length > 0 && isReactComponentFile(originalCode, filePath)) {
      filesToModify.set(filePath, { namespace, messages: uniqueMessages });
    }
  }
}

/**
 * 第二遍：替换源代码中的中文
 */
function replacePhase(filePath) {
  const fileInfo = filesToModify.get(filePath);
  if (!fileInfo) return;

  const { namespace, messages } = fileInfo;
  let code = fs.readFileSync(filePath, "utf8");
  let modified = false;

  // 构建该文件的文案 -> key 映射
  const localTextToKey = new Map();
  for (const msg of messages) {
    const mapping = textToKeyMap.get(`${namespace}::${msg.text}`);
    if (mapping) {
      localTextToKey.set(msg.text, { key: mapping.key, ...msg });
    }
  }

  // 按文案长度降序排序（先替换长的，避免部分替换问题）
  const sortedEntries = [...localTextToKey.entries()].sort((a, b) => b[0].length - a[0].length);

  for (const [text, info] of sortedEntries) {
    const { key, hasVars } = info;

    // 如果包含变量，暂时跳过自动替换（需要手动处理）
    if (hasVars) {
      console.log(`  ⚠️  含变量，需手动处理: "${text}" -> t("${key}")`);
      continue;
    }

    // 1. 替换 JSX 文本节点: >中文< → >{t("key")}<
    const jsxTextRe = new RegExp(`>(\\s*)(${escapeRegex(text)})(\\s*)<`, "g");
    if (jsxTextRe.test(code)) {
      code = code.replace(jsxTextRe, `>$1{t("${key}")}$3<`);
      modified = true;
    }

    // 2. 替换字符串属性: attr="中文" → attr={t("key")}
    const attrRe = new RegExp(`(\\w+)="(${escapeRegex(text)})"`, "g");
    if (attrRe.test(code)) {
      code = code.replace(attrRe, `$1={t("${key}")}`);
      modified = true;
    }

    // 3. 替换单引号字符串属性: attr='中文' → attr={t("key")}
    const attrSingleRe = new RegExp(`(\\w+)='(${escapeRegex(text)})'`, "g");
    if (attrSingleRe.test(code)) {
      code = code.replace(attrSingleRe, `$1={t("${key}")}`);
      modified = true;
    }

    // 4. 替换 JS 中的字符串字面量（非 JSX 属性）
    const stringLiteralRe = new RegExp(`"(${escapeRegex(text)})"`, "g");
    code = code.replace(stringLiteralRe, (match, _, offset) => {
      const before = code.slice(Math.max(0, offset - 10), offset);
      if (/t\(\s*$/.test(before) || /=\s*\{\s*t\(\s*$/.test(before)) {
        return match;
      }
      modified = true;
      return `t("${key}")`;
    });

    // 5. 替换单引号字符串字面量
    const stringLiteralSingleRe = new RegExp(`'(${escapeRegex(text)})'`, "g");
    code = code.replace(stringLiteralSingleRe, (match, _, offset) => {
      const before = code.slice(Math.max(0, offset - 10), offset);
      if (/t\(\s*$/.test(before) || /=\s*\{\s*t\(\s*$/.test(before)) {
        return match;
      }
      modified = true;
      return `t("${key}")`;
    });
  }

  if (!modified) return;

  // 添加 useTranslations 导入和声明
  code = addTranslationsImport(code, namespace);

  if (DRY_RUN) {
    console.log(`\n📄 [预览] ${path.relative(ROOT, filePath)}`);
    console.log("-".repeat(50));
    const lines = code.split("\n").slice(0, 50);
    console.log(lines.join("\n"));
    if (code.split("\n").length > 50) {
      console.log("... (更多内容省略)");
    }
  } else {
    fs.writeFileSync(filePath, code, "utf8");
    console.log(`✅ 已替换: ${path.relative(ROOT, filePath)}`);
  }
}

/**
 * 添加 useTranslations 导入和声明
 */
function addTranslationsImport(code, namespace) {
  const hasImport = /import\s+.*useTranslations.*from\s+["']next-intl["']/.test(code);

  if (!hasImport) {
    if (/^["']use client["'];?\s*$/m.test(code)) {
      code = code.replace(
        /^(["']use client["'];?\s*\n)/m,
        `$1\nimport { useTranslations } from "next-intl";\n`
      );
    } else {
      if (/^import\s/m.test(code)) {
        code = code.replace(
          /^(import\s)/m,
          `import { useTranslations } from "next-intl";\n$1`
        );
      } else {
        code = `import { useTranslations } from "next-intl";\n\n${code}`;
      }
    }
  }

  const hasUseTranslations = new RegExp(`useTranslations\\(["']${namespace}["']\\)`).test(code);

  if (!hasUseTranslations) {
    const patterns = [
      /^(export\s+(?:default\s+)?const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)\s*$/m,
      /^(export\s+(?:default\s+)?const\s+\w+\s*=\s*\(\)\s*=>\s*\{)\s*$/m,
      /^(export\s+(?:default\s+)?function\s+\w+\s*\([^)]*\)\s*\{)\s*$/m,
      /^(function\s+\w+\s*\([^)]*\)\s*\{)\s*$/m,
      /^(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{)\s*$/m,
    ];

    let inserted = false;
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        code = code.replace(pattern, `$1\n  const t = useTranslations("${namespace}");\n`);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      const returnMatch = code.match(/^(\s*)(return\s*\()/m);
      if (returnMatch) {
        const indent = returnMatch[1];
        code = code.replace(
          /^(\s*)(return\s*\()/m,
          `${indent}const t = useTranslations("${namespace}");\n\n$1$2`
        );
      }
    }
  }

  return code;
}

/**
 * 转义正则特殊字符
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 深度合并两个对象，保留已有的值
 */
function deepMerge(existing, newData) {
  const result = { ...existing };

  for (const [namespace, messages] of Object.entries(newData)) {
    if (!result[namespace]) {
      result[namespace] = messages;
    } else {
      result[namespace] = { ...result[namespace] };
      for (const [key, value] of Object.entries(messages)) {
        if (!(key in result[namespace])) {
          result[namespace][key] = value;
        }
      }
    }
  }

  return result;
}

/**
 * 读取现有的翻译文件
 */
function loadExistingMessages(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`⚠️  无法读取现有翻译文件 ${filePath}: ${error.message}`);
  }
  return {};
}

/**
 * 递归扫描目录
 */
function walk(dir, callback) {
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (["node_modules", "generated", ".next", "__tests__", "test"].includes(file)) continue;
      walk(filePath, callback);
    } else if (/\.(tsx|ts|jsx|js)$/.test(file) && !file.endsWith(".d.ts")) {
      callback(filePath);
    }
  }
}

/**
 * 生成 JSON 输出
 */
function generateJSON() {
  const result = {};
  const sortedNamespaces = Array.from(extractedMessages.keys()).sort();

  for (const namespace of sortedNamespaces) {
    const messages = extractedMessages.get(namespace);
    result[namespace] = {};
    const sortedKeys = Array.from(messages.keys()).sort();
    for (const key of sortedKeys) {
      result[namespace][key] = messages.get(key);
    }
  }
  return result;
}

/**
 * 主函数
 */
function main() {
  console.log("🔍 i18n 文案提取与替换工具 (增强版)\n");

  if (REPLACE_MODE) {
    console.log("⚡ 模式: 提取 + 替换源代码");
  } else if (DRY_RUN) {
    console.log("👀 模式: 预览（不写入文件）");
  } else {
    console.log("📋 模式: 仅提取（不修改源代码）");
    console.log("   使用 --replace 参数启用替换功能");
    console.log("   使用 --dry-run 参数预览替换效果\n");
  }

  console.log("📋 支持内容：");
  console.log("   - 双引号/单引号字符串");
  console.log("   - 模板字符串（反引号）");
  console.log("   - JSX 文本节点（含变量）");
  console.log("   - 常量文件对象属性");
  console.log("📋 排除内容：注释、console 语句、className、import/export\n");

  // 第一遍：提取所有中文
  console.log("🔍 第一步：扫描并提取中文文案...\n");
  walk(SRC_DIR, extractPhase);

  const zhJSON = generateJSON();

  // 生成英文版本
  const enJSON = {};
  for (const [namespace, messages] of Object.entries(zhJSON)) {
    enJSON[namespace] = {};
    for (const key of Object.keys(messages)) {
      enJSON[namespace][key] = "";
    }
  }

  if (!fs.existsSync(MSG_DIR)) {
    fs.mkdirSync(MSG_DIR, { recursive: true });
  }

  const zhPath = path.join(MSG_DIR, "zh-CN.json");
  const enPath = path.join(MSG_DIR, "en-US.json");

  // 读取现有的翻译文件
  const existingZh = loadExistingMessages(zhPath);
  const existingEn = loadExistingMessages(enPath);

  // 合并新旧翻译（保留已有的翻译）
  const mergedZh = deepMerge(existingZh, zhJSON);
  const mergedEn = deepMerge(existingEn, enJSON);

  // 按 key 排序
  const sortObject = (obj) => {
    const sorted = {};
    for (const namespace of Object.keys(obj).sort()) {
      sorted[namespace] = {};
      for (const key of Object.keys(obj[namespace]).sort()) {
        sorted[namespace][key] = obj[namespace][key];
      }
    }
    return sorted;
  };

  fs.writeFileSync(zhPath, JSON.stringify(sortObject(mergedZh), null, 2), "utf8");
  fs.writeFileSync(enPath, JSON.stringify(sortObject(mergedEn), null, 2), "utf8");

  // 统计新增的文案数量
  let newZhCount = 0;
  for (const [namespace, messages] of Object.entries(zhJSON)) {
    for (const key of Object.keys(messages)) {
      if (!existingZh[namespace] || !(key in existingZh[namespace])) {
        newZhCount++;
      }
    }
  }

  // 统计
  console.log("📊 提取统计：\n");
  let totalCount = 0;
  for (const [namespace, messages] of extractedMessages.entries()) {
    console.log(`  ${namespace}: ${messages.size} 条`);
    totalCount += messages.size;
  }

  console.log(`\n✅ 共提取 ${totalCount} 条文案`);
  if (newZhCount > 0) {
    console.log(`🆕 新增 ${newZhCount} 条文案`);
  } else {
    console.log(`ℹ️  没有新增文案（已有的翻译已保留）`);
  }
  console.log(`\n📁 已输出到：`);
  console.log(`   - ${path.relative(ROOT, zhPath)}`);
  console.log(`   - ${path.relative(ROOT, enPath)}`);

  // 第二遍：替换源代码
  if (REPLACE_MODE || DRY_RUN) {
    console.log("\n" + "=".repeat(60));
    console.log("🔄 第二步：替换源代码中的中文...");
    console.log("=".repeat(60) + "\n");

    for (const filePath of filesToModify.keys()) {
      replacePhase(filePath);
    }

    if (DRY_RUN) {
      console.log("\n⚠️  这是预览模式，文件未被修改。");
      console.log("   使用 --replace 参数来实际替换文件。");
    } else if (REPLACE_MODE) {
      console.log(`\n✅ 已替换 ${filesToModify.size} 个文件`);
    }
  }

  // 详细列表
  console.log("\n" + "=".repeat(60));
  console.log("📝 提取的文案详情：");
  console.log("=".repeat(60) + "\n");

  for (const [namespace, messages] of extractedMessages.entries()) {
    console.log(`[${namespace}]`);
    for (const [key, value] of messages.entries()) {
      // 标记含变量的文案
      const hasSimpleVars = /\{[a-zA-Z_$][a-zA-Z0-9_$.?]*\}/.test(value);
      const marker = hasSimpleVars ? " 📌" : "";
      console.log(`  ${key}: "${value}"${marker}`);
    }
    console.log("");
  }

  console.log("💡 使用提示：");
  console.log("   1. 英文翻译值为空，请手动翻译");
  console.log("   2. 在组件中使用: const t = useTranslations('Namespace');");
  console.log("   3. 调用翻译: t('keyName')");
  console.log("   4. 📌 标记的文案含变量，使用 t('key', { var: value }) 格式");
  console.log("   5. 含复杂表达式的 JSX 已被过滤，只保留纯文本部分");
  console.log("");
  console.log("📖 命令行参数：");
  console.log("   --replace  提取并替换源代码");
  console.log("   --dry-run  预览替换效果（不写入文件）");
}

main();
