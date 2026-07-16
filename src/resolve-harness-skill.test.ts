import { describe, expect, it } from "vitest";
import { parsedToResolvedDisk, rowToResolved } from "./harness-skills-db.js";
import { parseHarnessSkillMarkdown } from "./parse-harness-skill-md.js";
import {
  clearHarnessSkillCache,
  resolveHarnessSkill,
  resolveHarnessSystemPrompt,
  resolveHarnessTemplate,
} from "./resolve-harness-skill.js";
import { mockHarnessSupabase } from "./harness-skills-test-fixtures.js";

describe("resolveHarnessSkill", () => {
  it("resolves demo-reel-craft from disk when DB is absent", async () => {
    clearHarnessSkillCache();
    const skill = await resolveHarnessSkill("demo-reel-craft", {
      supabase: null,
      bypassCache: true,
    });
    expect(skill?.skillSlug).toBe("demo-reel-craft");
    expect(skill?.source).toBe("disk");
    expect(skill?.bodyMd).toContain("### beat-headline");
  });

  it("resolves beat-headline template from disk skill", async () => {
    clearHarnessSkillCache();
    const template = await resolveHarnessTemplate(
      "demo-reel-craft",
      "beat-headline",
      { supabase: null, bypassCache: true }
    );
    expect(template).toContain("{{productName}}");
  });

  it("resolves system prompt from disk skill", async () => {
    clearHarnessSkillCache();
    const system = await resolveHarnessSystemPrompt("demo-reel-craft", {
      supabase: null,
      bypassCache: true,
    });
    expect(system).toContain("anti-slop");
  });

  it("maps DB rows to resolved skills", () => {
    const row = {
      id: "id-1",
      project_id: null,
      skill_slug: "demo-reel-craft",
      name: "Demo Reel Craft",
      description: "Craft copy",
      body_md: "## System prompt\nTest body",
      backend_ref: "video-demo-reel",
      is_system: true,
      enabled: true,
      created_at: "2026-01-01",
      updated_at: "2026-01-01",
    };
    const resolved = rowToResolved(row);
    expect(resolved.source).toBe("database");
    expect(resolved.bodyMd).toBe("## System prompt\nTest body");
  });

  it("maps disk parsed skills to resolved form", () => {
    const parsed = parseHarnessSkillMarkdown(`---
name: test-craft
displayName: Test
is_system: true
---
Body`);
    const resolved = parsedToResolvedDisk(parsed);
    expect(resolved.source).toBe("disk");
    expect(resolved.enabled).toBe(true);
  });

  it("uses in-process cache when bypassCache is false", async () => {
    clearHarnessSkillCache();
    const first = await resolveHarnessSkill("demo-reel-craft", {
      supabase: null,
    });
    const second = await resolveHarnessSkill("demo-reel-craft", {
      supabase: null,
    });
    expect(first).toBe(second);
  });

  it("resolves from database when supabase returns a row", async () => {
    clearHarnessSkillCache();
    const supabase = mockHarnessSupabase({});
    const skill = await resolveHarnessSkill("demo-reel-craft", {
      supabase: supabase as never,
      bypassCache: true,
    });
    expect(skill?.source).toBe("database");
    expect(skill?.bodyMd).toContain("DB body");
  });

  it("falls back to disk when database lookup throws", async () => {
    clearHarnessSkillCache();
    const supabase = mockHarnessSupabase({ loadThrows: true });
    const skill = await resolveHarnessSkill("demo-reel-craft", {
      supabase: supabase as never,
      bypassCache: true,
    });
    expect(skill?.source).toBe("disk");
  });

  it("returns null when skill is missing on disk and database", async () => {
    clearHarnessSkillCache();
    const supabase = mockHarnessSupabase({ globalRow: null });
    const skill = await resolveHarnessSkill("missing-slug-xyz", {
      supabase: supabase as never,
      bypassCache: true,
    });
    expect(skill).toBeNull();
  });

  it("returns template fallback when section is missing", async () => {
    clearHarnessSkillCache();
    const template = await resolveHarnessTemplate(
      "demo-reel-craft",
      "nonexistent-template",
      { supabase: null, bypassCache: true, fallback: "fallback template" }
    );
    expect(template).toBe("fallback template");
  });

  it("returns null when template section and fallback are missing", async () => {
    clearHarnessSkillCache();
    const template = await resolveHarnessTemplate(
      "demo-reel-craft",
      "nonexistent-template",
      {
        supabase: null,
        bypassCache: true,
      }
    );
    expect(template).toBeNull();
  });

  it("returns null when skill cannot be resolved", async () => {
    clearHarnessSkillCache();
    const supabase = mockHarnessSupabase({ globalRow: null });
    const template = await resolveHarnessTemplate(
      "missing-slug-xyz",
      "beat-headline",
      {
        supabase: supabase as never,
        bypassCache: true,
      }
    );
    expect(template).toBeNull();
  });

  it("returns default system prompt fallback when section is missing", async () => {
    clearHarnessSkillCache();
    const system = await resolveHarnessSystemPrompt("missing-slug", {
      supabase: null,
      bypassCache: true,
    });
    expect(system).toContain("plain text only");
  });

  it("returns custom system prompt fallback when provided", async () => {
    clearHarnessSkillCache();
    const system = await resolveHarnessSystemPrompt("missing-slug", {
      supabase: null,
      bypassCache: true,
      fallback: "Custom fallback prompt",
    });
    expect(system).toBe("Custom fallback prompt");
  });

  it("uses fallback when resolved skill lacks system-prompt section", async () => {
    clearHarnessSkillCache();
    const supabase = mockHarnessSupabase({
      globalRow: {
        id: "id-db",
        project_id: null,
        skill_slug: "demo-reel-craft",
        name: "DB Craft",
        description: "",
        body_md: "## Templates\n### beat-headline\nHeadline only",
        backend_ref: null,
        is_system: true,
        enabled: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
    });
    const system = await resolveHarnessSystemPrompt("demo-reel-craft", {
      supabase: supabase as never,
      bypassCache: true,
      fallback: "Section missing fallback",
    });
    expect(system).toBe("Section missing fallback");
  });
});
