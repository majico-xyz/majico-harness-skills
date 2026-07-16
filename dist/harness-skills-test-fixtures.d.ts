import type { HarnessSkillRow } from "./types.js";
/** Creates a temp directory under tmp/ for harness skill tests. */
export declare function harnessTestRoot(prefix: string): {
    abs: string;
    rel: string;
};
/** Writes a minimal harness SKILL.md under a slug directory. */
export declare function makeHarnessSkillDir(root: string, slug: string, frontmatter: string, body?: string): void;
/** Builds a minimal Supabase mock for harness_skills table operations. */
export declare function mockHarnessSupabase(handlers: {
    existingSlugs?: string[];
    selectError?: {
        message: string;
    };
    insertError?: {
        message: string;
    };
    projectRow?: HarnessSkillRow | null;
    globalRow?: HarnessSkillRow | null;
    projectError?: {
        message: string;
    };
    globalError?: {
        message: string;
    };
    loadThrows?: boolean;
}): {
    from: (table: string) => {
        select: (columns?: string) => {
            is: () => Promise<{
                data: null;
                error: {
                    message: string;
                };
            }> | Promise<{
                data: {
                    skill_slug: string;
                }[];
                error: null;
            }>;
            eq?: undefined;
        } | {
            eq: (col: string) => {
                eq: () => {};
                is?: undefined;
            } | {
                eq: (col2: string) => {
                    maybeSingle: () => Promise<{
                        data: null;
                        error: {
                            message: string;
                        };
                    }> | Promise<{
                        data: HarnessSkillRow | null;
                        error: null;
                    }>;
                    eq?: undefined;
                } | {
                    eq: () => {};
                    maybeSingle?: undefined;
                };
                is: (col2: string) => {
                    eq: () => {
                        maybeSingle: () => Promise<{
                            data: null;
                            error: {
                                message: string;
                            };
                        }> | Promise<{
                            data: HarnessSkillRow | null;
                            error: null;
                        }>;
                    };
                    maybeSingle?: undefined;
                } | {
                    maybeSingle: () => Promise<{
                        data: null;
                        error: null;
                    }>;
                    eq?: undefined;
                };
            };
            is?: undefined;
        };
        insert: () => Promise<{
            error: {
                message: string;
            };
        }> | Promise<{
            error: null;
        }>;
    };
};
/** Exercises mock query edge paths for unit-test coverage. */
export declare function exerciseMockHarnessSupabaseBranches(handlers: Parameters<typeof mockHarnessSupabase>[0]): Promise<void>;
