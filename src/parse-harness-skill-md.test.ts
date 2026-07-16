import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  extractHarnessSkillSection,
  listHarnessSkillDirectories,
  loadHarnessSkillsFromDisk,
  parseHarnessSkillMarkdown,
} from "./parse-harness-skill-md.js";
import {
  harnessTestRoot,
  makeHarnessSkillDir,
} from "./harness-skills-test-fixtures.js";

describe("parseHarnessSkillMarkdown", () => {
  it("parses demo-reel-craft harness skill from disk", () => {
    const content = readFileSync(
      join(process.cwd(), "data/skills/demo-reel-craft/SKILL.md"),
      "utf8"
    );
    const parsed = parseHarnessSkillMarkdown(content);
    expect(parsed.skillSlug).toBe("demo-reel-craft");
    expect(parsed.backendRef).toBe("video-demo-reel");
    expect(parsed.isSystem).toBe(true);
    expect(parsed.bodyMd).toContain("beat-headline");
  });

  it("parses quoted scalars and uses fallback slug", () => {
    const parsed = parseHarnessSkillMarkdown(
      `---
displayName: "Quoted Name"
description: 'Craft copy'
is_system: false
maxQueries: 3
---
Body`,
      "fallback-slug"
    );
    expect(parsed.skillSlug).toBe("fallback-slug");
    expect(parsed.name).toBe("Quoted Name");
    expect(parsed.description).toBe("Craft copy");
    expect(parsed.isSystem).toBe(false);
  });

  it("ignores blank frontmatter lines", () => {
    const parsed = parseHarnessSkillMarkdown(`---
name: blank-lines

is_system: true
---
Body`);
    expect(parsed.skillSlug).toBe("blank-lines");
  });

  it("requires frontmatter delimiters", () => {
    expect(() => parseHarnessSkillMarkdown("# No frontmatter")).toThrow(
      /frontmatter/i
    );
  });

  it("requires skill slug in frontmatter", () => {
    expect(() =>
      parseHarnessSkillMarkdown(`---
displayName: Missing Name
---
Body`)
    ).toThrow(/skill slug/i);
  });

  it("extracts template and system-prompt sections", () => {
    const content = readFileSync(
      join(process.cwd(), "data/skills/demo-reel-craft/SKILL.md"),
      "utf8"
    );
    const parsed = parseHarnessSkillMarkdown(content);
    const headline = extractHarnessSkillSection(parsed.bodyMd, "beat-headline");
    expect(headline).toContain("{{beatId}}");
    expect(headline?.toLowerCase()).toContain("no em dashes");

    const system = extractHarnessSkillSection(parsed.bodyMd, "system-prompt");
    expect(system).toContain("plain text only");
  });

  it("loads only harnessSkill-marked directories", () => {
    const skills = loadHarnessSkillsFromDisk(
      join(process.cwd(), "data/skills")
    );
    expect(skills.map((s) => s.skillSlug)).toEqual(
      expect.arrayContaining([
        "demo-reel-craft",
        "brand-md-craft",
        "guideline-craft",
      ])
    );
    expect(skills.length).toBeGreaterThanOrEqual(16);
  });

  it("returns empty list when skills root is missing", () => {
    expect(listHarnessSkillDirectories("/nonexistent-skills-root")).toEqual([]);
  });

  it("sorts multiple harness skill directories", () => {
    const { abs } = harnessTestRoot("harness-sort-");
    makeHarnessSkillDir(abs, "z-craft", "name: z-craft\nharnessSkill: true");
    makeHarnessSkillDir(abs, "a-craft", "name: a-craft\nharnessSkill: true");
    mkdirSync(join(abs, "no-skill-md"));
    expect(
      listHarnessSkillDirectories(abs).map((dir) => basename(dir))
    ).toEqual(["a-craft", "z-craft"]);
  });

  it("returns null when section heading is absent", () => {
    expect(
      extractHarnessSkillSection("## Other\nText", "missing-section")
    ).toBeNull();
  });

  it("extracts the final template section through end of file", () => {
    const content = readFileSync(
      join(process.cwd(), "data/skills/design-md-craft/SKILL.md"),
      "utf8"
    );
    const parsed = parseHarnessSkillMarkdown(content);
    const section = extractHarnessSkillSection(
      parsed.bodyMd,
      "design-md-visual-theme"
    );
    expect(section).toContain("{{productName}}");
    expect(section).toContain("{{brandTones}}");
  });
});
