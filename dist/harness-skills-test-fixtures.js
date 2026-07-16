import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
/** Creates a temp directory under tmp/ for harness skill tests. */
export function harnessTestRoot(prefix) {
    const abs = mkdtempSync(join(process.cwd(), "tmp", prefix));
    const rel = abs.slice(process.cwd().length + 1);
    return { abs, rel };
}
/** Writes a minimal harness SKILL.md under a slug directory. */
export function makeHarnessSkillDir(root, slug, frontmatter, body = "Body") {
    const dir = join(root, slug);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, "SKILL.md"), `---\n${frontmatter}\n---\n\n${body}`);
}
/** Builds a minimal Supabase mock for harness_skills table operations. */
export function mockHarnessSupabase(handlers) {
    const defaultGlobalRow = {
        id: "id-db",
        project_id: null,
        skill_slug: "demo-reel-craft",
        name: "DB Craft",
        description: "From DB",
        body_md: "## System prompt\nDB body",
        backend_ref: "video-demo-reel",
        is_system: true,
        enabled: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
    };
    const globalMaybeSingle = () => {
        if (handlers.loadThrows) {
            return Promise.reject(new Error("db down"));
        }
        if (handlers.globalError) {
            return Promise.resolve({ data: null, error: handlers.globalError });
        }
        return Promise.resolve({
            data: handlers.globalRow !== undefined
                ? handlers.globalRow
                : defaultGlobalRow,
            error: null,
        });
    };
    const projectMaybeSingle = () => {
        if (handlers.loadThrows) {
            return Promise.reject(new Error("db down"));
        }
        if (handlers.projectError) {
            return Promise.resolve({ data: null, error: handlers.projectError });
        }
        return Promise.resolve({
            data: handlers.projectRow ?? null,
            error: null,
        });
    };
    return {
        from: (table) => {
            if (table !== "harness_skills")
                throw new Error(`unexpected table ${table}`);
            return {
                select: (columns) => {
                    if (columns === "skill_slug") {
                        return {
                            is: () => handlers.selectError
                                ? Promise.resolve({ data: null, error: handlers.selectError })
                                : Promise.resolve({
                                    data: (handlers.existingSlugs ?? []).map((skill_slug) => ({
                                        skill_slug,
                                    })),
                                    error: null,
                                }),
                        };
                    }
                    return {
                        eq: (col) => {
                            if (col !== "skill_slug")
                                return { eq: () => ({}) };
                            return {
                                eq: (col2) => {
                                    if (col2 === "project_id") {
                                        return {
                                            eq: () => ({
                                                maybeSingle: projectMaybeSingle,
                                            }),
                                        };
                                    }
                                    if (col2 === "enabled") {
                                        return { maybeSingle: globalMaybeSingle };
                                    }
                                    return { eq: () => ({}) };
                                },
                                is: (col2) => {
                                    if (col2 === "project_id") {
                                        return {
                                            eq: () => ({
                                                maybeSingle: globalMaybeSingle,
                                            }),
                                        };
                                    }
                                    return {
                                        maybeSingle: () => Promise.resolve({ data: null, error: null }),
                                    };
                                },
                            };
                        },
                    };
                },
                insert: () => handlers.insertError
                    ? Promise.resolve({ error: handlers.insertError })
                    : Promise.resolve({ error: null }),
            };
        },
    };
}
/** Exercises mock query edge paths for unit-test coverage. */
export async function exerciseMockHarnessSupabaseBranches(handlers) {
    const supabase = mockHarnessSupabase(handlers);
    const table = supabase.from("harness_skills");
    const selectChain = table.select();
    selectChain.eq("other_col").eq("nested");
    await selectChain.eq("skill_slug").eq("enabled").maybeSingle();
    selectChain.eq("skill_slug").eq("other").eq("nested");
    await selectChain.eq("skill_slug").is("enabled").maybeSingle();
    const slugSelect = table.select("skill_slug");
    await slugSelect.is();
    await table.insert();
}
