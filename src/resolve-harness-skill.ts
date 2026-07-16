import type { SupabaseClient } from "@supabase/supabase-js";
import {
  loadHarnessSkillFromDisk,
  loadHarnessSkillRow,
  parsedToResolvedDisk,
  rowToResolved,
} from "./harness-skills-db.js";
import { extractHarnessSkillSection } from "./parse-harness-skill-md.js";
import { craftSkillSlugForPrompt, normalizePromptStem } from "./prompt-routing.js";
import type { HarnessSkillResolveContext, ResolvedHarnessSkill } from "./types.js";

export { extractHarnessSkillSection };
export { craftSkillSlugForPrompt, normalizePromptStem };

const skillCache = new Map<string, ResolvedHarnessSkill>();

function cacheKey(skillSlug: string, projectId?: string | null): string {
  return `${projectId ?? "global"}:${skillSlug}`;
}

/**
 * Clear in-process harness skill cache (tests).
 */
export function clearHarnessSkillCache(): void {
  skillCache.clear();
}

/**
 * Resolve harness craft skill from DB with disk seed fallback.
 */
export async function resolveHarnessSkill(
  skillSlug: string,
  options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
  }
): Promise<ResolvedHarnessSkill | null> {
  const projectId = options?.context?.projectId ?? null;
  const key = cacheKey(skillSlug, projectId);

  if (!options?.bypassCache) {
    const cached = skillCache.get(key);
    if (cached) return cached;
  }

  const supabase = options?.supabase;
  if (supabase) {
    try {
      const row = await loadHarnessSkillRow(supabase, skillSlug, projectId);
      if (row) {
        const resolved = rowToResolved(row);
        skillCache.set(key, resolved);
        return resolved;
      }
    } catch {
      // Fall through to disk when DB unavailable.
    }
  }

  const disk = loadHarnessSkillFromDisk(skillSlug);
  if (!disk) return null;

  const resolved = parsedToResolvedDisk(disk);
  skillCache.set(key, resolved);
  return resolved;
}

/**
 * Resolve harness template section with optional fallback.
 */
export async function resolveHarnessTemplate(
  skillSlug: string,
  templateKey: string,
  options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
  }
): Promise<string | null> {
  const skill = await resolveHarnessSkill(skillSlug, options);
  if (skill) {
    const section = extractHarnessSkillSection(skill.bodyMd, templateKey);
    if (section) return section;
  }
  return options?.fallback ?? null;
}

/**
 * Resolve system prompt section from harness skill body.
 */
export async function resolveHarnessSystemPrompt(
  skillSlug: string,
  options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
  }
): Promise<string> {
  const fallback =
    options?.fallback ??
    "You write concise product demo copy. Return plain text only.";
  const skill = await resolveHarnessSkill(skillSlug, options);
  if (skill) {
    const section = extractHarnessSkillSection(skill.bodyMd, "system-prompt");
    if (section) return section;
  }
  return fallback;
}

function resolveTemplateFromDisk(
  skillSlug: string,
  templateKey: string
): string | null {
  const disk = loadHarnessSkillFromDisk(skillSlug);
  if (!disk) return null;
  const direct = extractHarnessSkillSection(disk.bodyMd, templateKey);
  if (direct) return direct;

  const prefixBySkill: Record<string, string> = {
    "demo-reel-craft": "demo-reel-",
    "brand-md-craft": "brand-md-",
    "design-md-craft": "design-md-",
    "content-plan-craft": "content-plan-",
    "content-strategy-craft": "content-strategy-",
    "content-templates-craft": "content-templates-",
    "blog-article-craft": "blog-",
    "gtm-craft": "gtm-",
  };
  const prefix = prefixBySkill[skillSlug];
  if (prefix && templateKey.startsWith(prefix)) {
    return extractHarnessSkillSection(
      disk.bodyMd,
      templateKey.slice(prefix.length)
    );
  }
  return null;
}

/**
 * Sync resolver: craft skill template from disk (no DB).
 */
export function resolveSkillPromptSync(
  skillSlugOrPromptName: string,
  templateKeyOrOptions?: string | { skillSlug?: string; fallback?: string },
  options?: { skillSlug?: string; fallback?: string }
): string {
  let skillSlug: string;
  let templateKey: string;
  let fallback: string | undefined;

  if (
    typeof templateKeyOrOptions === "object" &&
    templateKeyOrOptions !== null
  ) {
    const stem = normalizePromptStem(skillSlugOrPromptName);
    skillSlug =
      templateKeyOrOptions.skillSlug ??
      craftSkillSlugForPrompt(stem) ??
      skillSlugOrPromptName;
    templateKey = stem;
    fallback = templateKeyOrOptions.fallback;
  } else if (typeof templateKeyOrOptions === "string") {
    skillSlug = skillSlugOrPromptName;
    templateKey = normalizePromptStem(templateKeyOrOptions);
    fallback = options?.fallback;
  } else {
    const stem = normalizePromptStem(skillSlugOrPromptName);
    skillSlug =
      options?.skillSlug ??
      craftSkillSlugForPrompt(stem) ??
      skillSlugOrPromptName;
    templateKey = stem;
    fallback = options?.fallback;
  }

  const section = resolveTemplateFromDisk(skillSlug, templateKey);
  if (section) return section;
  return fallback ?? "";
}

/**
 * Unified async prompt resolver: DB craft skill → disk → fallback.
 */
export async function resolveSkillPrompt(
  skillSlug: string,
  templateKey: string,
  options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
  }
): Promise<string> {
  const key = normalizePromptStem(templateKey);
  const fromHarness = await resolveHarnessTemplate(skillSlug, key, options);
  if (fromHarness) return fromHarness;
  return options?.fallback ?? "";
}

/**
 * Sync system prompt from craft skill disk seed.
 */
export function resolveHarnessSystemPromptSync(
  skillSlug: string,
  options?: { fallback?: string }
): string {
  const fallback =
    options?.fallback ??
    "You write concise product demo copy. Return plain text only.";
  const section = resolveTemplateFromDisk(skillSlug, "system-prompt");
  return section ?? fallback;
}

/**
 * Resolve by legacy prompt stem; auto-routes to craft skill when known.
 */
export async function resolvePromptByName(
  promptName: string,
  options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
    skillSlug?: string;
  }
): Promise<string> {
  const stem = normalizePromptStem(promptName);
  const skillSlug = options?.skillSlug ?? craftSkillSlugForPrompt(stem) ?? stem;
  return resolveSkillPrompt(skillSlug, stem, options);
}
