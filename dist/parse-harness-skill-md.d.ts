import type { ParsedHarnessSkillDefinition } from "./types.js";
/**
 * Parse a harness craft SKILL.md (YAML frontmatter + markdown body).
 */
export declare function parseHarnessSkillMarkdown(content: string, fallbackSlug?: string): ParsedHarnessSkillDefinition;
export declare function readHarnessSkillFromDirectory(skillDir: string): ParsedHarnessSkillDefinition;
export declare function listHarnessSkillDirectories(root: string): string[];
/**
 * Load harness craft skills from disk (harnessSkill: true in frontmatter).
 */
export declare function loadHarnessSkillsFromDisk(root: string): ParsedHarnessSkillDefinition[];
/**
 * Extract a named section from harness skill body (### key or ## key).
 */
export declare function extractHarnessSkillSection(bodyMd: string, sectionKey: string): string | null;
