import fs from "node:fs";
import path from "node:path";
import { loadHarnessSkillsFromDisk, readHarnessSkillFromDirectory, } from "./parse-harness-skill-md.js";
import { DEFAULT_HARNESS_SKILLS_ROOT } from "./types.js";
function parsedToInsertRow(skill, projectId) {
    return {
        project_id: projectId,
        skill_slug: skill.skillSlug,
        name: skill.name,
        description: skill.description,
        body_md: skill.bodyMd,
        backend_ref: skill.backendRef,
        is_system: skill.isSystem,
        enabled: true,
    };
}
/**
 * Map a DB row to a resolved harness skill.
 */
export function rowToResolved(row) {
    return {
        skillSlug: row.skill_slug,
        name: row.name,
        description: row.description,
        bodyMd: row.body_md,
        backendRef: row.backend_ref,
        isSystem: row.is_system,
        enabled: row.enabled,
        source: "database",
    };
}
/**
 * Seed global harness skills from data/skills/ when slug is missing.
 */
export async function seedGlobalHarnessSkills(supabase, options) {
    const skillsRoot = path.join(process.cwd(), options?.skillsRoot ?? DEFAULT_HARNESS_SKILLS_ROOT);
    const defaults = loadHarnessSkillsFromDisk(skillsRoot);
    if (defaults.length === 0) {
        return { seeded: 0, existing: 0 };
    }
    const { data: existingRows, error: selectError } = await supabase
        .from("harness_skills")
        .select("skill_slug")
        .is("project_id", null);
    if (selectError) {
        throw new Error(`Failed to read harness skills: ${selectError.message}`);
    }
    const existingSlugs = new Set((existingRows ?? []).map((row) => row.skill_slug));
    let seeded = 0;
    for (const skill of defaults) {
        if (existingSlugs.has(skill.skillSlug) && !options?.forceReseedMissing) {
            continue;
        }
        if (existingSlugs.has(skill.skillSlug))
            continue;
        const payload = parsedToInsertRow(skill, null);
        const { error: insertError } = await supabase
            .from("harness_skills")
            .insert(payload);
        if (insertError) {
            throw new Error(`Failed to seed harness skill ${skill.skillSlug}: ${insertError.message}`);
        }
        seeded += 1;
    }
    return { seeded, existing: existingSlugs.size };
}
/**
 * Load harness skill row from DB (project override, then global).
 */
export async function loadHarnessSkillRow(supabase, skillSlug, projectId) {
    if (projectId) {
        const { data: projectRow, error: projectError } = await supabase
            .from("harness_skills")
            .select("*")
            .eq("skill_slug", skillSlug)
            .eq("project_id", projectId)
            .eq("enabled", true)
            .maybeSingle();
        if (projectError) {
            throw new Error(`Failed to load project harness skill: ${projectError.message}`);
        }
        if (projectRow)
            return projectRow;
    }
    const { data: globalRow, error: globalError } = await supabase
        .from("harness_skills")
        .select("*")
        .eq("skill_slug", skillSlug)
        .is("project_id", null)
        .eq("enabled", true)
        .maybeSingle();
    if (globalError) {
        throw new Error(`Failed to load global harness skill: ${globalError.message}`);
    }
    return globalRow ?? null;
}
/**
 * Load a single harness craft skill from disk by slug.
 */
export function loadHarnessSkillFromDisk(skillSlug, skillsRoot) {
    const root = path.join(process.cwd(), skillsRoot ?? DEFAULT_HARNESS_SKILLS_ROOT);
    const skillDir = path.join(root, skillSlug);
    if (!fs.existsSync(skillDir))
        return null;
    try {
        return readHarnessSkillFromDirectory(skillDir);
    }
    catch {
        return null;
    }
}
/**
 * Convert a disk-parsed skill to resolved form.
 */
export function parsedToResolvedDisk(skill) {
    return {
        skillSlug: skill.skillSlug,
        name: skill.name,
        description: skill.description,
        bodyMd: skill.bodyMd,
        backendRef: skill.backendRef,
        isSystem: skill.isSystem,
        enabled: true,
        source: "disk",
    };
}
