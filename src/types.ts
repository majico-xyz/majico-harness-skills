export type HarnessSkillRow = {
  id: string;
  project_id: string | null;
  skill_slug: string;
  name: string;
  description: string;
  body_md: string;
  backend_ref: string | null;
  is_system: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type ParsedHarnessSkillDefinition = {
  skillSlug: string;
  name: string;
  description: string;
  bodyMd: string;
  backendRef: string | null;
  isSystem: boolean;
};

export type ResolvedHarnessSkill = {
  skillSlug: string;
  name: string;
  description: string;
  bodyMd: string;
  backendRef: string | null;
  isSystem: boolean;
  enabled: boolean;
  source: "database" | "disk";
};

export type HarnessSkillResolveContext = {
  projectId?: string | null;
};

export const DEFAULT_HARNESS_SKILLS_ROOT = "data/skills";
