/**
 * Maps legacy prompt stems (lib/llm/prompts/<stem>.txt) to harness craft skill slugs.
 */
const PREFIX_RULES = [
    { prefix: "demo-reel-", craftSlug: "demo-reel-craft" },
    { prefix: "brand-md-", craftSlug: "brand-md-craft" },
    { prefix: "design-md-", craftSlug: "design-md-craft" },
    { prefix: "guidelines-", craftSlug: "guideline-craft" },
    { prefix: "guideline-", craftSlug: "guideline-craft" },
    { prefix: "content-plan-carousel-", craftSlug: "social-carousel-craft" },
    { prefix: "content-plan-", craftSlug: "content-plan-craft" },
    { prefix: "content-strategy-", craftSlug: "content-strategy-craft" },
    { prefix: "content-templates-", craftSlug: "content-templates-craft" },
    { prefix: "gtm-", craftSlug: "gtm-craft" },
    { prefix: "blog-", craftSlug: "blog-article-craft" },
    { prefix: "studio-rail-", craftSlug: "studio-rail-craft" },
];
const EXACT_RULES = {
    "suggest-guidelines-overview": "guideline-craft",
    "suggest-guidelines-overview-sidebar": "guideline-craft",
    "guideline-annotation-rewrite": "guideline-craft",
    "suggest-palette": "palette-craft",
    "suggest-palette-colors": "palette-craft",
    "grade-palette-options": "palette-craft",
    "improve-palette-pair": "palette-craft",
    "filter-relevant-competitors": "palette-craft",
    "generate-search-query": "brand-profile-craft",
    "summarize-chunk": "brand-profile-craft",
    "synthesize-summary": "brand-profile-craft",
    "suggest-archetype": "brand-profile-craft",
    "suggest-tones": "brand-profile-craft",
    "suggest-positioning": "brand-profile-craft",
    "suggest-brand-story": "brand-profile-craft",
    "extract-competitors": "brand-profile-craft",
    "extract-competitors-from-article": "brand-profile-craft",
    "validate-competitors": "brand-profile-craft",
    "suggest-logo-ids": "brand-profile-craft",
    "enrich-competitor": "brand-profile-craft",
    "positioning-against-competitors": "brand-profile-craft",
    "first-mover-positioning": "brand-profile-craft",
    "name-occupancy-differentiation": "brand-profile-craft",
    "positioning-against-similar-names": "brand-profile-craft",
    "suggest-more-alternative-names": "brand-profile-craft",
    "dimension-competitor-matrix": "brand-profile-craft",
    "suggest-logo-archetypes-from-description": "brand-profile-craft",
    "describe-logo-style": "brand-profile-craft",
    "generate-logo-svg": "brand-profile-craft",
    "refine-logo-svg": "brand-profile-craft",
    "judge-logo-pointwise": "brand-profile-craft",
    "judge-logo-pairwise": "brand-profile-craft",
    "suggest-font-description": "brand-profile-craft",
    "suggest-font-archetypes": "brand-profile-craft",
    "suggest-typography": "brand-profile-craft",
};
const INVESTOR_PACK_TEMPLATES = new Set(["outline", "slide", "outreach"]);
const MOTION_REVIEW_TEMPLATES = new Set(["review-notes"]);
const CREATIVE_DIRECTION_TEMPLATES = new Set(["brief"]);
/**
 * Normalize prompt file/name to template stem (no .txt).
 */
export function normalizePromptStem(name) {
    return name.replace(/\.txt$/i, "").trim();
}
/**
 * Resolve craft skill slug for a prompt stem or template key.
 */
export function craftSkillSlugForPrompt(name) {
    const stem = normalizePromptStem(name);
    if (EXACT_RULES[stem])
        return EXACT_RULES[stem];
    for (const { prefix, craftSlug } of PREFIX_RULES) {
        if (stem.startsWith(prefix))
            return craftSlug;
    }
    if (INVESTOR_PACK_TEMPLATES.has(stem))
        return "investor-pack-craft";
    if (MOTION_REVIEW_TEMPLATES.has(stem))
        return "motion-review-craft";
    if (CREATIVE_DIRECTION_TEMPLATES.has(stem))
        return "creative-direction-craft";
    return null;
}
