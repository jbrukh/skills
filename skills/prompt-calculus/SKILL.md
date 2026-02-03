---
name: prompt-calculus
description: A minimal formalism for reasoning about LLM evaluations, prompt behavior, and prompt functions.
---

# Prompt Calculus

A minimal formalism for reasoning about LLM evaluations, prompt behavior, and prompt functions.

## Primitives

### Prompts

A **prompt** P is a string of tokens. Prompts are the inputs and outputs of LLMs.

### Evaluation

An **evaluation** E[P] is the process of submitting a prompt P to an LLM and obtaining an output. The evaluation process is abstract — it may involve multiple models, multiple steps, or even user interaction. Only the input and output matter.

If the evaluation produces the output O, we write:

$$E[P] = O$$

This is a slight abuse of notation: LLM evaluation is nondeterministic, so O may differ across runs. What we actually mean is something closer to E[P] ≈ O, where ≈ denotes "having the same information." The calculus treats this characteristic behavior as exact and leaves the underlying nondeterminism implicit.

### Context

If the evaluation occurs in the presence of additional context C (system prompts, conversation history, or any other ambient information), we write:

$$E[P, C]$$

Context extends naturally to multiple items: E[P, C, D, ...].

### Information Production

If I is some piece of information — a fact, a number, a sentiment, or any other extractable content — and the output of evaluating P contains I, we write:

$$E[P] \to I$$

and say "the evaluation of P produces information I."

What counts as "contains" is determined by some reasonable external process: a deterministic program, a trustworthy LLM, or any other method sufficient to establish the claim. The calculus does not prescribe the process.

**Example.** The strings "Paris is the capital of France" and "France's capital is Paris" contain the same information I. The prompt P = "What is the capital of France?", when evaluated, produces that information: E[P] → I.

## Prompt Functions

A **prompt function** is a prompt whose evaluation produces another prompt. That is:

$$E[P] \to P'$$

We may also write P' = E[P] for short.

### Inputs

Prompt functions may take inputs. If a prompt function P takes an input X and produces output Y, we write:

$$E[P, X] = Y$$

or equivalently:

$$P(X) = Y$$

If P is a prompt function producing a prompt P', we may write:

$$P(X) = P'$$

Composition of prompt functions follows naturally from the definitions:

$$P_2(P_1(X)) = E[P_2, E[P_1, X]]$$

## Notable Prompt Functions

### Quine

A **quine** Q is a prompt that produces itself as exact output:

$$E[Q] = Q$$

### Compressor

A **compressor** C is a prompt function that shortens a prompt while preserving its behavior. That is, C(P) = P' where:

$$E[P] \to I \iff E[P'] \to I$$

and |P'| < |P|.

The compressor produces a prompt that is shorter than the original but produces the same information for any I.

## Design Notes

- The information production relation (→) is itself grounded in LLM evaluation, making the semantics of the calculus partially self-referential by design.
- Context C is kept abstract. The calculus does not prescribe what constitutes context.