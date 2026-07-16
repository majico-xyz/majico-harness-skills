import type { SupabaseClient } from "@supabase/supabase-js";
import { extractHarnessSkillSection } from "./parse-harness-skill-md.js";
import { craftSkillSlugForPrompt, normalizePromptStem } from "./prompt-routing.js";
import type { HarnessSkillResolveContext, ResolvedHarnessSkill } from "./types.js";
export { extractHarnessSkillSection };
export { craftSkillSlugForPrompt, normalizePromptStem };
/**
 * Clear in-process harness skill cache (tests).
 */
export declare function clearHarnessSkillCache(): void;
/**
 * Resolve harness craft skill from DB with disk seed fallback.
 */
export declare function resolveHarnessSkill(skillSlug: string, options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
}): Promise<ResolvedHarnessSkill | null>;
/**
 * Resolve harness template section with optional fallback.
 */
export declare function resolveHarnessTemplate(skillSlug: string, templateKey: string, options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
}): Promise<string | null>;
/**
 * Resolve system prompt section from harness skill body.
 */
export declare function resolveHarnessSystemPrompt(skillSlug: string, options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
}): Promise<string>;
/**
 * Sync resolver: craft skill template from disk (no DB).
 */
export declare function resolveSkillPromptSync(skillSlugOrPromptName: string, templateKeyOrOptions?: string | {
    skillSlug?: string;
    fallback?: string;
}, options?: {
    skillSlug?: string;
    fallback?: string;
}): string;
/**
 * Unified async prompt resolver: DB craft skill → disk → fallback.
 */
export declare function resolveSkillPrompt(skillSlug: string, templateKey: string, options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
}): Promise<string>;
/**
 * Sync system prompt from craft skill disk seed.
 */
export declare function resolveHarnessSystemPromptSync(skillSlug: string, options?: {
    fallback?: string;
}): string;
/**
 * Resolve by legacy prompt stem; auto-routes to craft skill when known.
 */
export declare function resolvePromptByName(promptName: string, options?: {
    supabase?: SupabaseClient | null;
    context?: HarnessSkillResolveContext;
    bypassCache?: boolean;
    fallback?: string;
    skillSlug?: string;
}): Promise<string>;
