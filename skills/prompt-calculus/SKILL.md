---
name: prompt-calculus
description: A minimal formalism for reasoning about LLM evaluations, prompt behavior, and prompt functions. Use this skill when discussing prompt composition, evaluation semantics, quines, or formal properties of prompts.
---

(The metadata block above is for skill registration only and is not part of the calculus. Begin reading from the heading below.)

# Prompt Calculus

A minimal formalism for reasoning about LLM evaluations, prompt behavior, and prompt functions.

## Primitives

### Prompts

A **prompt** P is a string of tokens. Prompts are the inputs and outputs of LLMs.

### Evaluation

An **evaluation** E[P] is the process of submitting a prompt P to an LLM and obtaining an output. The evaluation process is abstract — it may involve multiple models, multiple steps, or even user interaction. Only the input and output matter.

If the evaluation produces the exact output O, we write:

$$E[P] = O$$

### Context

If the evaluation occurs in the presence of additional context C (system prompts, conversation history, or any other ambient information), we write:

$$E[P, C]$$

### Information Production

If the output of an evaluation contains some information I, as determined by some reasonable process (such as asking the LLM), we write:

$$E[P] \to I$$

and say "the evaluation of P produces information I."

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

A **quine** Q is a prompt function that produces itself as exact output:

$$E[Q] = Q$$

## Design Notes

- The calculus intentionally abstracts over the stochastic nature of LLM evaluation. E[P] = O is a statement about the characteristic behavior of a prompt, asserted as exact.
- The information production relation (→) is itself grounded in LLM evaluation, making the semantics of the calculus partially self-referential by design.
- Context C is kept abstract. The calculus does not prescribe what constitutes context.
