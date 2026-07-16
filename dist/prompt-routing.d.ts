/**
 * Maps legacy prompt stems (lib/llm/prompts/<stem>.txt) to harness craft skill slugs.
 */
/**
 * Normalize prompt file/name to template stem (no .txt).
 */
export declare function normalizePromptStem(name: string): string;
/**
 * Resolve craft skill slug for a prompt stem or template key.
 */
export declare function craftSkillSlugForPrompt(name: string): string | null;
