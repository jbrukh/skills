---
name: surface-insight
description: Take data, observations, or notes and systematically apply reasoning patterns to surface non-obvious insights — connections, predictions, hidden dynamics, and structural truths invisible from any single data point.
---

# Surface Insight

Take a collection of data points, observations, or notes and systematically apply reasoning lenses to surface non-obvious insights — connections, predictions, hidden dynamics, and structural truths that aren't visible from any single data point alone.

## When to Use

- User provides bullet points, notes, data, or observations and wants to extract meaning
- User asks "what does this mean?" or "what's the insight here?" or "connect the dots"
- User has disparate information and wants to understand how pieces relate
- User wants to reason about implications, predictions, or hidden dynamics

Do NOT use for: summarizing (use sharpen-prompt), writing articles (use write-article), or evaluating prompts (use think-critically).

## Process

### Phase 1: Intake (Silent)

Read the user's data. Silently identify:
- The domain(s) involved (tech, markets, culture, policy, etc.)
- The entities and actors mentioned
- The time horizon (past, present, future)
- Implicit assumptions or framing the user may have

Do not output Phase 1.

### Phase 2: Pattern Scan (Silent)

Run through the Reasoning Lenses below. For each lens, ask: "Does applying this lens to the data yield something the user probably hasn't seen?" Discard any lens that produces only obvious or trivial observations.

Select the **3–7 most productive lenses** for this specific data set. Quality over quantity — fewer strong insights beat many weak ones.

Do not output Phase 2.

### Phase 3: Insight Generation

For each selected lens, develop the insight fully:

1. **Name the pattern** — State which lens you're applying
2. **Show the connection** — Identify which specific data points you're linking and how
3. **Articulate the insight** — State the non-obvious conclusion clearly and concretely
4. **Give the reasoning chain** — Show the logical steps so the reader can evaluate the argument
5. **Assess confidence** — Flag whether this is speculative, plausible, or well-supported

Reject any insight below Level 3 on the Quality Hierarchy (see below).

HARD RULE: Output exactly 3–7 insights, one per selected lens. If you find yourself generating an 8th insight, stop and discard the weakest one. Count your output sections before presenting.

QUALITY GATE: Before presenting each insight, verify: "Would a knowledgeable person in this domain find this non-obvious?" If the answer is no, discard it and attempt the next lens.

### Phase 4: Synthesis & Output

Present insights ordered by non-obviousness x importance. After presenting individual insights, look across them for **meta-insights** — do the individual insights themselves form a pattern? If so, surface that as a final synthesis.

**Output format for each insight:**

```
### [Lens Name]: [Insight Title]

**Connecting:** [which data points are being linked]

[2–4 sentences: the insight and reasoning chain. Must include at least one specific noun (a named entity, a number, a mechanism, or a concrete outcome) — no sentence may consist entirely of abstract generalities.]

**Confidence:** [speculative | plausible | well-supported]
```

End with a `## Synthesis` section if a meta-pattern emerges across insights. A meta-pattern means: two or more individual insights reinforce, tension, or compound each other — producing a higher-order conclusion that none of them states alone. If no such pattern exists, omit the section entirely rather than forcing one.

ANTI-PATTERN CHECK: Before presenting your final output, scan each insight against the Anti-Patterns list below. If any insight exhibits a listed anti-pattern, revise or discard it. Do not present output without completing this check.

---

## Reasoning Lenses

### Lens 1: Connect — Find hidden links

**Convergence Detection.** Multiple independent trends are heading toward the same collision point. Any single trend is interesting; their intersection is where discontinuous change happens.
*Core move: "These unrelated developments all point toward X."*

**Cross-Impact Analysis.** Variable A affects Variable B in a non-obvious way — often through a mediating mechanism not visible in the data.
*Core move: "Changing A doesn't just affect A; it cascades into B because of mechanism M."*

**Triangulation.** Multiple independent signals point to the same conclusion. One signal is noise; three independent signals are a pattern.
*Core move: "Sources X, Y, and Z all independently suggest the same thing."*

### Lens 2: Project — Extend data through time

**Extrapolation.** Project current trends forward and draw a prediction, estimate, or educated guess about where things are heading.
*Core move: "If this continues, then by [time], we should expect [outcome]."*

**Rate-of-Change Analysis.** Look at velocity (is the metric accelerating or decelerating?) and acceleration (is the rate of change itself changing?). A positive metric with negative acceleration is about to turn.
*Core move: "The number is still going up, but it's going up slower — the inflection is coming."*

**Regime Change Detection.** The system isn't just changing quantitatively; it has shifted to a qualitatively different state. Old rules no longer apply.
*Core move: "This isn't a fluctuation within the old regime — the regime itself has changed."*

**Temporal Displacement.** Ask: what's true now that wasn't true 2/5/10 years ago? What enabling conditions have appeared that make something newly possible or newly impossible?
*Core move: "This is viable now because conditions X, Y, Z didn't exist before."*

### Lens 3: Explain — Build and test causal stories

**Abductive Reasoning.** Hypothesize how different pieces of data work together as a system, then look for supporting evidence.
*Core move: "If A and B are both true, the best explanation is H — and here's evidence for H."*

**Retroduction.** Start from a hypothetical outcome. If it were true, what evidence would we expect to see? Then check if that evidence exists in the data.
*Core move: "If thesis T is correct, we'd expect to see E1, E2, E3 — and we do see E1 and E2."*

**Counterfactual Reasoning.** Ask "what if X had not happened?" to isolate what actually caused an observed outcome. Separates genuine causation from correlation and luck.
*Core move: "Remove X from the picture — does the outcome still hold? If yes, X wasn't causal."*

### Lens 4: Reframe — See from a different angle

**Analogical Reasoning.** Draw a useful parallel between what happened in another domain or era and what's happening now. Transfer the lessons.
*Core move: "This situation is structurally similar to [parallel], which implies [lesson]."*

**Disanalogy Analysis.** Identify the analogy everyone is reaching for and show specifically why it breaks down. The failure of an analogy is itself an insight.
*Core move: "Everyone says this is like X, but the key difference is Y, which means the outcome will diverge."*

**Inversion.** Flip the question. Instead of "how does this succeed?" ask "how does this fail?" Instead of "what does the data show?" ask "what would the data look like if the opposite were true?"
*Core move: "Instead of asking Q, ask the inverse — and the answer reveals blind spots."*

**Dialectical Synthesis.** Take the dominant narrative (thesis) and its strongest contradiction (antithesis). Find the higher-order truth that transcends both.
*Core move: "View A says X, View B says Y, but the deeper truth is Z which reconciles both."*

### Lens 5: Reveal — Expose hidden structures

**Second-Order Effects.** Trace downstream consequences beyond the obvious first-order impact. Ask "and then what?" recursively. Non-obvious insights live in the second and third order.
*Core move: "The first-order effect is obvious, but the second-order effect is [surprising consequence]."*

**Cui Bono / Incentive Mapping.** For any observed behavior, ask "who benefits?" Map the incentive structures. Puzzling behavior is often perfectly rational when you see the incentive landscape.
*Core move: "This seems irrational until you realize that actor A benefits because [hidden incentive]."*

**Absence of Evidence (The Dog That Didn't Bark).** Note what is conspicuously missing from the data. The absence of an expected signal is itself a signal.
*Core move: "If X were true, we'd expect to see Y — but Y is absent, which tells us something."*

**Constraint Identification.** Identify the binding constraint that limits the entire system. Optimizing anything other than the bottleneck is waste.
*Core move: "Everyone is focused on improving A, but B is the bottleneck — nothing improves until B does."*

---

## Insight Quality Hierarchy

- **Level 1 — Restatement.** Rephrasing a data point in different words. **REJECT.**
- **Level 2 — Obvious implication.** Something anyone would see from the data. **REJECT.**
- **Level 3 — Non-obvious connection.** Linking two data points that aren't obviously related. **MINIMUM THRESHOLD.**
- **Level 4 — Hidden dynamic.** Revealing a mechanism, feedback loop, or causal chain not visible on the surface. **GOOD.**
- **Level 5 — Assumption inversion.** Overturning a default assumption or conventional wisdom with evidence from the data. **VERY GOOD.**
- **Level 6 — Structural truth.** Revealing a deep pattern that reframes the entire dataset and changes how you think about all the individual data points. **EXCEPTIONAL.**

Aim for Level 4+ on at least half of generated insights. Never output Level 1 or Level 2.

---

## Anti-Patterns

- **Forced connections.** Do not strain to connect data points that are genuinely unrelated. Saying "no strong insight here" is better than fabricating one.
- **Vague gesturing.** "This could have major implications" without specifying what those implications are. Every insight must be concrete and specific.
- **Prediction without mechanism.** "X will happen" without explaining the causal chain. Always show why.
- **False equivalence.** Treating all data points as equally significant. Some are noise; acknowledge that.
- **Pattern over-fitting.** Seeing patterns that aren't there because you're motivated to find them. Apply the "would I believe this if I hadn't been looking for it?" test.
- **Hedging into uselessness.** "This might possibly suggest that under certain conditions..." — either commit to the insight or drop it. Flag confidence level instead of hedging the language.
- **Kitchen-sink analysis.** Applying every lens to every data set. Use 3–7 lenses, not all 18. The value is in selection, not exhaustiveness.

---

## Key Principles

1. **Non-obvious or nothing.** The entire purpose is to surface what the user cannot see on their own. If an insight is obvious, discard it.
2. **Show the reasoning.** Every insight must include the logical chain. The reader should be able to evaluate the argument, not just receive a conclusion.
3. **Concrete and specific.** Replace generalities with specifics. Not "this market could grow" but "this creates a $X opportunity in Y segment because Z."
4. **Calibrated confidence.** Flag how confident you are and why. Speculation is valuable when labeled as speculation.
5. **Less is more.** Three strong insights beat seven weak ones. Ruthlessly filter.
6. **Connect, don't summarize.** The input is data. The output is meaning. The gap between them is where your work happens.

---

## Input

[User provides data, observations, bullet points, or notes below]
