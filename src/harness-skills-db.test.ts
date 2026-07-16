import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  loadHarnessSkillFromDisk,
  loadHarnessSkillRow,
  seedGlobalHarnessSkills,
} from "./harness-skills-db.js";
import type { HarnessSkillRow } from "./types.js";
import {
  harnessTestRoot,
  makeHarnessSkillDir,
  mockHarnessSupabase,
  exerciseMockHarnessSupabaseBranches,
} from "./harness-skills-test-fixtures.js";

describe("harness-skills-db", () => {
  it("seeds missing global harness skills from disk", async () => {
    const { abs, rel } = harnessTestRoot("harness-seed-");
    makeHarnessSkillDir(
      abs,
      "seed-craft",
      "name: seed-craft\ndisplayName: Seed\nharnessSkill: true\nis_system: true"
    );
    const supabase = mockHarnessSupabase({ existingSlugs: [] });
    const result = await seedGlobalHarnessSkills(supabase as never, {
      skillsRoot: rel,
    });
    expect(result.seeded).toBe(1);
    expect(result.existing).toBe(0);
  });

  it("skips seeding when slug already exists", async () => {
    const { abs, rel } = harnessTestRoot("harness-seed-");
    makeHarnessSkillDir(
      abs,
      "seed-craft",
      "name: seed-craft\nharnessSkill: true\nis_system: true"
    );
    const supabase = mockHarnessSupabase({ existingSlugs: ["seed-craft"] });
    const result = await seedGlobalHarnessSkills(supabase as never, {
      skillsRoot: rel,
    });
    expect(result.seeded).toBe(0);
    expect(result.existing).toBe(1);
  });

  it("returns zero counts when no harness skills on disk", async () => {
    const { rel } = harnessTestRoot("harness-empty-");
    const supabase = mockHarnessSupabase({});
    const result = await seedGlobalHarnessSkills(supabase as never, {
      skillsRoot: rel,
    });
    expect(result).toEqual({ seeded: 0, existing: 0 });
  });

  it("throws when seed select fails", async () => {
    const { abs, rel } = harnessTestRoot("harness-seed-");
    makeHarnessSkillDir(
      abs,
      "seed-craft",
      "name: seed-craft\nharnessSkill: true"
    );
    const supabase = mockHarnessSupabase({
      selectError: { message: "select failed" },
    });
    await expect(
      seedGlobalHarnessSkills(supabase as never, { skillsRoot: rel })
    ).rejects.toThrow(/Failed to read harness skills/);
  });

  it("throws when seed insert fails", async () => {
    const { abs, rel } = harnessTestRoot("harness-seed-");
    makeHarnessSkillDir(
      abs,
      "seed-craft",
      "name: seed-craft\nharnessSkill: true"
    );
    const supabase = mockHarnessSupabase({
      insertError: { message: "insert failed" },
    });
    await expect(
      seedGlobalHarnessSkills(supabase as never, { skillsRoot: rel })
    ).rejects.toThrow(/Failed to seed harness skill seed-craft/);
  });

  it("uses default skills root and tolerates null existing rows", async () => {
    const supabase = mockHarnessSupabase({
      existingSlugs: undefined,
    });
    const result = await seedGlobalHarnessSkills({
      from: () => ({
        select: () => ({
          is: () => Promise.resolve({ data: null, error: null }),
        }),
        insert: () => Promise.resolve({ error: null }),
      }),
    } as never);
    expect(result.existing).toBe(0);
  });

  it("honors forceReseedMissing without inserting duplicate slugs", async () => {
    const { abs, rel } = harnessTestRoot("harness-seed-");
    makeHarnessSkillDir(
      abs,
      "seed-craft",
      "name: seed-craft\nharnessSkill: true"
    );
    const supabase = mockHarnessSupabase({ existingSlugs: ["seed-craft"] });
    const result = await seedGlobalHarnessSkills(supabase as never, {
      skillsRoot: rel,
      forceReseedMissing: true,
    });
    expect(result.seeded).toBe(0);
    expect(result.existing).toBe(1);
  });

  it("loads project override before global row", async () => {
    const projectRow: HarnessSkillRow = {
      id: "proj-1",
      project_id: "project-abc",
      skill_slug: "demo-reel-craft",
      name: "Project Craft",
      description: "",
      body_md: "project body",
      backend_ref: null,
      is_system: false,
      enabled: true,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    };
    const supabase = mockHarnessSupabase({ projectRow });
    const row = await loadHarnessSkillRow(
      supabase as never,
      "demo-reel-craft",
      "project-abc"
    );
    expect(row?.name).toBe("Project Craft");
  });

  it("falls back to global row when project override is missing", async () => {
    const supabase = mockHarnessSupabase({ projectRow: null });
    const row = await loadHarnessSkillRow(
      supabase as never,
      "demo-reel-craft",
      "project-abc"
    );
    expect(row?.name).toBe("DB Craft");
  });

  it("loads global row when project override is absent", async () => {
    const supabase = mockHarnessSupabase({ projectRow: null });
    const row = await loadHarnessSkillRow(supabase as never, "demo-reel-craft");
    expect(row?.name).toBe("DB Craft");
  });

  it("returns null when global harness skill row is missing", async () => {
    const supabase = mockHarnessSupabase({ globalRow: null });
    const row = await loadHarnessSkillRow(supabase as never, "demo-reel-craft");
    expect(row).toBeNull();
  });

  it("throws when project harness skill query fails", async () => {
    const supabase = mockHarnessSupabase({
      projectError: { message: "project query failed" },
    });
    await expect(
      loadHarnessSkillRow(supabase as never, "demo-reel-craft", "project-abc")
    ).rejects.toThrow(/Failed to load project harness skill/);
  });

  it("rejects when project query throws before Supabase responds", async () => {
    const supabase = mockHarnessSupabase({ loadThrows: true });
    await expect(
      loadHarnessSkillRow(supabase as never, "demo-reel-craft", "project-abc")
    ).rejects.toThrow(/db down/);
  });

  it("throws when global harness skill query fails", async () => {
    const supabase = mockHarnessSupabase({
      globalError: { message: "global query failed" },
    });
    await expect(
      loadHarnessSkillRow(supabase as never, "demo-reel-craft")
    ).rejects.toThrow(/Failed to load global harness skill/);
  });

  it("returns null when disk skill directory is missing", () => {
    expect(loadHarnessSkillFromDisk("missing-slug", "data/skills")).toBeNull();
  });

  it("returns null when disk skill markdown is invalid", () => {
    const { abs, rel } = harnessTestRoot("harness-bad-");
    const dir = join(abs, "bad-craft");
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"), "# no frontmatter");
    expect(loadHarnessSkillFromDisk("bad-craft", rel)).toBeNull();
  });

  it("exercises mock supabase query edge branches", async () => {
    expect(() => mockHarnessSupabase({}).from("other_table")).toThrow(
      /unexpected table/
    );
    await exerciseMockHarnessSupabaseBranches({
      existingSlugs: ["seed-craft"],
      insertError: { message: "insert failed" },
    });
    await exerciseMockHarnessSupabaseBranches({
      selectError: { message: "select failed" },
    });
  });
});
