import type { SupabaseClient } from "@supabase/supabase-js";
import type { HarnessSkillRow, ParsedHarnessSkillDefinition, ResolvedHarnessSkill } from "./types.js";
export type SeedHarnessSkillsResult = {
    seeded: number;
    existing: number;
};
/**
 * Map a DB row to a resolved harness skill.
 */
export declare function rowToResolved(row: HarnessSkillRow): ResolvedHarnessSkill;
/**
 * Seed global harness skills from data/skills/ when slug is missing.
 */
export declare function seedGlobalHarnessSkills(supabase: SupabaseClient, options?: {
    skillsRoot?: string;
    forceReseedMissing?: boolean;
}): Promise<SeedHarnessSkillsResult>;
/**
 * Load harness skill row from DB (project override, then global).
 */
export declare function loadHarnessSkillRow(supabase: SupabaseClient, skillSlug: string, projectId?: string | null): Promise<HarnessSkillRow | null>;
/**
 * Load a single harness craft skill from disk by slug.
 */
export declare function loadHarnessSkillFromDisk(skillSlug: string, skillsRoot?: string): ParsedHarnessSkillDefinition | null;
/**
 * Convert a disk-parsed skill to resolved form.
 */
export declare function parsedToResolvedDisk(skill: ParsedHarnessSkillDefinition): ResolvedHarnessSkill;
