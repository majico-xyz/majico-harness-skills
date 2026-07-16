import fs from "node:fs";
import path from "node:path";
import type { ParsedHarnessSkillDefinition } from "./types.js";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

function parseScalar(value: string): string | number | boolean {
  const trimmed = value.trim();
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseFrontmatter(source: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const line of source.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = line.match(/^(\w+):\s*(.+)$/);
    if (!match) continue;
    result[match[1]!] = parseScalar(match[2]!);
  }
  return result;
}

/**
 * Parse a harness craft SKILL.md (YAML frontmatter + markdown body).
 */
export function parseHarnessSkillMarkdown(
  content: string,
  fallbackSlug?: string
): ParsedHarnessSkillDefinition {
  const normalized = content.replace(/^\uFEFF/, "");
  const match = normalized.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(
      "SKILL.md must start with YAML frontmatter delimited by ---"
    );
  }
  const [, frontmatterSource, body] = match;
  const frontmatter = parseFrontmatter(frontmatterSource);
  const skillSlug = String(frontmatter.name ?? fallbackSlug ?? "").trim();
  if (!skillSlug) {
    throw new Error("Frontmatter name (skill slug) is required");
  }
  const name =
    typeof frontmatter.displayName === "string"
      ? frontmatter.displayName
      : skillSlug;
  const description =
    typeof frontmatter.description === "string" ? frontmatter.description : "";
  const backendRef =
    typeof frontmatter.backendRef === "string" ? frontmatter.backendRef : null;

  return {
    skillSlug,
    name,
    description,
    bodyMd: body.trim(),
    backendRef,
    isSystem: frontmatter.is_system === true,
  };
}

export function readHarnessSkillFromDirectory(
  skillDir: string
): ParsedHarnessSkillDefinition {
  const skillPath = path.join(skillDir, "SKILL.md");
  const content = fs.readFileSync(skillPath, "utf-8");
  return parseHarnessSkillMarkdown(content, path.basename(skillDir));
}

function isHarnessCraftSkill(content: string): boolean {
  return content.includes("harnessSkill: true");
}

export function listHarnessSkillDirectories(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(root, entry.name))
    .filter((dir) => {
      const skillPath = path.join(dir, "SKILL.md");
      if (!fs.existsSync(skillPath)) return false;
      const content = fs.readFileSync(skillPath, "utf-8");
      return isHarnessCraftSkill(content);
    })
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Load harness craft skills from disk (harnessSkill: true in frontmatter).
 */
export function loadHarnessSkillsFromDisk(
  root: string
): ParsedHarnessSkillDefinition[] {
  return listHarnessSkillDirectories(root).map((dir) =>
    readHarnessSkillFromDirectory(dir)
  );
}

/**
 * Build a regex-safe section heading pattern (hyphen or space).
 */
function sectionHeadingPattern(sectionKey: string): string {
  return sectionKey
    .split("-")
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\s-]+");
}

/**
 * Extract a named section from harness skill body (### key or ## key).
 */
export function extractHarnessSkillSection(
  bodyMd: string,
  sectionKey: string
): string | null {
  const heading = sectionHeadingPattern(sectionKey);
  const endOfString = "(?![\\s\\S])";
  const templateSiblingLookahead = `(?=\\n###\\s+[^\\n]*-[^\\n]+\\s*\\n|\\n##\\s+|${endOfString})`;
  const patterns = [
    new RegExp(
      `^###\\s+${heading}\\s*\\n([\\s\\S]*?)${templateSiblingLookahead}`,
      "im"
    ),
    new RegExp(
      `^##\\s+${heading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|${endOfString})`,
      "im"
    ),
  ];
  for (const pattern of patterns) {
    const match = bodyMd.match(pattern);
    if (match?.[1]?.trim()) {
      return match[1].trim();
    }
  }
  return null;
}
