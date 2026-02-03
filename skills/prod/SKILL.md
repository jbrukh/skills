---
name: prod
description: Pipeline orchestrator that sharpens, evaluates, compresses, and stores a draft prompt as a production-ready skill.
---

# Prod

Take a draft prompt through a production pipeline: sharpen → evaluate → compress → store. Output is a ready-to-use SKILL.md.

## When to Use

- User invokes `/prod`
- User wants to turn a draft prompt into a production-quality skill
- User says "productionize this prompt" or "make this a skill"

## Process

You are a prompt production pipeline. You will guide a draft prompt P through five sequential phases. Each phase's output feeds the next. Do not skip phases. Do not combine phases. Complete each phase fully before moving to the next.

Announce each phase with its header (e.g., "## Phase 1: Intake") before beginning work.

### Phase 1: Intake

Collect three inputs from the user:

1. **P** — the draft prompt. If already provided, acknowledge it. If not, ask for it.
2. **X** — expectations. Ask: **"What expectations should this prompt satisfy? List specific, testable behaviors you want the prompt to produce."** Gather these as a numbered list. Push back if expectations are vague — each should be concrete enough to score pass/fail.
3. **Skill name** — Ask: **"What should this skill be called? (lowercase, hyphenated, e.g. `code-reviewer`)"** Validate: lowercase, hyphenated, no spaces.

Do not proceed until all three inputs are confirmed.

### Phase 2: Sharpen

Apply the `/sharpen-prompt` protocol to P. Read `skills/sharpen-prompt/SKILL.md` and follow its process with these constraints:

- **Intensity: quick.** Ask 3–5 targeted questions maximum. The user already provided expectations in Phase 1 — use those to guide your questions. Do not re-ask what's already known.
- **Scope: Claude-specific** unless user says otherwise.
- Produce the sharpened prompt P' as a complete, ready-to-use text block.

State clearly: **"Sharpened prompt P':"** followed by the full prompt.

### Phase 3: Evaluate

Apply the `/think-critically` protocol to P' with expectations X. Read `skills/think-critically/SKILL.md` and follow its full process:

1. Produce the evaluation table (Step 1)
2. Compute σ(P') (Step 2)
3. Produce mitigations M (Step 3)
4. Produce revised prompt P'' by applying M (Step 4)
5. Run the self-check and convergence loop

If convergence is not achieved after the iteration limit, present the best P'' and note it. Proceed regardless.

State clearly: **"Converged prompt P'':"** followed by the full prompt.

### Phase 4: Compress

Apply the `/compress-prompt` protocol in **lossless mode** to P''. Read `skills/compress-prompt/SKILL.md` and follow its lossless process:

- 100% semantic retention required.
- Produce the compressed prompt P''', the directive map, and stats.
- If P'' begins with YAML frontmatter, preserve it verbatim.

State clearly: **"Compressed prompt P''':"** followed by the full prompt.

### Phase 5: Store

Write P''' as a skill file. Construct the SKILL.md as follows:

```
---
name: <skill-name from Phase 1>
description: <one-line description derived from P'''>
---

<P''' content>
```

Write this file to `skills/<skill-name>/SKILL.md`.

After writing, confirm: **"Skill stored at `skills/<skill-name>/SKILL.md`"**

## Key Principles

- **Sequential phases.** Never skip or reorder. Each phase depends on the previous output.
- **Show your work.** Display intermediate outputs (P', P'', P''') so the user can track the pipeline.
- **Respect the protocols.** Each phase follows its source skill faithfully — do not abbreviate the think-critically convergence loop or skip the compress directive map.
- **User stays in control.** After Phase 2 (sharpen) and Phase 4 (compress), pause briefly for user confirmation before proceeding. If the user wants adjustments, make them before moving on.
- **One pipeline, one skill.** Each invocation produces exactly one SKILL.md.
