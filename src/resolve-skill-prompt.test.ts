import { describe, expect, it } from "vitest";
import { craftSkillSlugForPrompt, normalizePromptStem } from "./prompt-routing.js";
import {
  resolveSkillPromptSync,
  resolveHarnessSystemPromptSync,
  resolveSkillPrompt,
  resolvePromptByName,
} from "./resolve-harness-skill.js";

describe("prompt-routing", () => {
  it("normalizes .txt suffix", () => {
    expect(normalizePromptStem("brand-md-identity.txt")).toBe(
      "brand-md-identity"
    );
  });

  it("routes brand-md stems", () => {
    expect(craftSkillSlugForPrompt("brand-md-voice-tone")).toBe(
      "brand-md-craft"
    );
  });

  it("routes carousel stems to social-carousel-craft", () => {
    expect(craftSkillSlugForPrompt("content-plan-carousel-copy")).toBe(
      "social-carousel-craft"
    );
  });

  it("routes special template stems to dedicated craft skills", () => {
    expect(craftSkillSlugForPrompt("outline")).toBe("investor-pack-craft");
    expect(craftSkillSlugForPrompt("review-notes")).toBe("motion-review-craft");
    expect(craftSkillSlugForPrompt("brief")).toBe("creative-direction-craft");
  });
});

describe("resolveSkillPromptSync", () => {
  it("loads brand-md-identity template from disk craft skill", () => {
    const text = resolveSkillPromptSync("brand-md-craft", "brand-md-identity");
    expect(text.length).toBeGreaterThan(20);
  });

  it("loads via object-style resolveSkillPromptSync options", () => {
    const text = resolveSkillPromptSync("brand-md-identity.txt", {
      skillSlug: "brand-md-craft",
      fallback: "unused",
    });
    expect(text).toContain("{{productName}}");
  });

  it("auto-routes prompt stem when object options omit skill slug", () => {
    const text = resolveSkillPromptSync("brand-md-identity.txt", {
      fallback: "unused-fallback",
    });
    expect(text).toContain("{{productName}}");
  });

  it("falls back to prompt stem when craft routing is unknown", () => {
    const text = resolveSkillPromptSync("unknown-prompt-stem.txt", {
      fallback: "stem-fallback",
    });
    expect(text).toBe("stem-fallback");
  });

  it("loads demo-reel beat-headline via prompt stem auto-route", () => {
    const text = resolveSkillPromptSync("demo-reel-beat-headline");
    expect(text).toContain("{{beatId}}");
  });

  it("loads motion-review system prompt", () => {
    const text = resolveHarnessSystemPromptSync("motion-review-craft", {
      fallback: "fallback",
    });
    expect(text.toLowerCase()).toContain("motion");
  });

  it("loads last template section in a craft skill file", () => {
    const text = resolveSkillPromptSync("brand-md-voice-tone");
    expect(text).toContain("{{productName}}");
  });

  it("resolves async prompt by craft skill slug", async () => {
    const text = await resolveSkillPrompt("demo-reel-craft", "beat-headline", {
      supabase: null,
      bypassCache: true,
    });
    expect(text).toContain("{{beatId}}");
  });

  it("falls back when async harness template is missing", async () => {
    const text = await resolveSkillPrompt("missing-craft", "nope", {
      supabase: null,
      bypassCache: true,
      fallback: "fallback-copy",
    });
    expect(text).toBe("fallback-copy");
  });

  it("returns empty string when async prompt and fallback are missing", async () => {
    const text = await resolveSkillPrompt("missing-craft", "nope", {
      supabase: null,
      bypassCache: true,
    });
    expect(text).toBe("");
  });

  it("resolves legacy prompt stems via resolvePromptByName", async () => {
    const text = await resolvePromptByName("brand-md-voice-tone", {
      supabase: null,
      bypassCache: true,
    });
    expect(text).toContain("{{productName}}");
  });

  it("honors explicit skill slug overrides in resolvePromptByName", async () => {
    const text = await resolvePromptByName("beat-headline", {
      supabase: null,
      bypassCache: true,
      skillSlug: "demo-reel-craft",
    });
    expect(text).toContain("{{beatId}}");
  });

  it("uses prompt stem as skill slug when routing is unknown", async () => {
    const text = await resolvePromptByName("unknown-prompt-stem", {
      supabase: null,
      bypassCache: true,
      fallback: "stem-fallback",
    });
    expect(text).toBe("stem-fallback");
  });

  it("uses default system prompt fallback when section is missing", () => {
    const text = resolveHarnessSystemPromptSync("missing-slug");
    expect(text).toContain("plain text only");
  });
});
