---
name: prompt-calculus
description: A minimal formalism for reasoning about LLM evaluations, prompt behavior, and prompt functions, grounded in probability. Use this skill when discussing prompt composition, evaluation semantics, quines, or formal properties of prompts.
---

(The metadata block above is for skill registration only and is not part of the calculus. Begin reading from the heading below.)

# Prompt Calculus

A minimal formalism for reasoning about LLM evaluations, prompt behavior, and prompt functions, grounded in probability.

---

## 1. Alphabet and Strings

Fix a finite **token alphabet** $\Sigma$. A **string** is a finite sequence of tokens:

$$s = t_1 t_2 \cdots t_n, \quad t_i \in \Sigma, \quad n \geq 0.$$

The set of all finite strings over $\Sigma$ is denoted $\Sigma^*$. The **empty string** is $\varepsilon$. String **concatenation** is written $s_1 \cdot s_2$ or simply $s_1 s_2$.

$\Sigma^*$ is countable. We equip it with the discrete $\sigma$-algebra $2^{\Sigma^*}$ (every subset is measurable).

## 2. Prompts

The **prompt space** is

$$\mathcal{P} = \Sigma^*.$$

Every element $P \in \mathcal{P}$ is called a **prompt**. Prompts serve simultaneously as inputs to and outputs of evaluation. There is no distinguished syntactic separation between "questions," "instructions," "completions," or any other role — these are informal categories imposed by context, not by the calculus.

## 3. Distributions over Prompts

A **distribution** over $\mathcal{P}$ is a function $\mu : \mathcal{P} \to [0,1]$ satisfying

$$\sum_{O \in \mathcal{P}} \mu(O) = 1.$$

The set of all distributions over $\mathcal{P}$ is denoted $\Delta(\mathcal{P})$. For any prompt $O_0 \in \mathcal{P}$, the **point mass** at $O_0$ is the distribution

$$\delta_{O_0}(O) = \begin{cases} 1 & \text{if } O = O_0 \\ 0 & \text{otherwise.} \end{cases}$$

## 4. Evaluation

### 4.1 The Evaluation Kernel

An **evaluation kernel** is a function

$$K : \mathcal{P} \to \Delta(\mathcal{P})$$

that assigns to each prompt $P$ a distribution $K(P)$ over outputs. For each $P$ and each $O$:

$$K(P)(O) = \Pr[\text{evaluation produces } O \mid \text{input } P].$$

$K$ encodes the complete input–output behavior of an LLM (or any system that maps prompts to distributions over prompts).

**Notational shorthand.** We write $K_P$ for the distribution $K(P)$, and $K_P(O)$ for the probability that evaluating prompt $P$ produces output $O$. That is:

$$K_P \stackrel{\text{def}}{=} K(P) \in \Delta(\mathcal{P}), \qquad K_P(O) \stackrel{\text{def}}{=} K(P)(O) \in [0,1].$$

### 4.2 Sampling

An **evaluation** of prompt $P$ is a single draw from $K_P$. We write

$$O \sim K_P$$

and say "$O$ is sampled from the evaluation of $P$."

### 4.3 Deterministic Evaluation

An evaluation is **deterministic** at $P$ if $K_P = \delta_{O}$ for some $O$, i.e., one output has probability 1. In this case we write

$$K_P = \delta_O$$

and say "evaluating $P$ deterministically produces $O$." All deterministic assertions in the calculus are special cases of the kernel.

### 4.4 Context

A **context** $C \in \mathcal{P}$ is any additional prompt material (system prompts, conversation history, retrieved documents, or any other ambient information) present during evaluation. A **contextual evaluation kernel** is a function

$$K : \mathcal{P} \times \mathcal{P} \to \Delta(\mathcal{P})$$

where $K(P, C)$ is the output distribution when prompt $P$ is evaluated in the presence of context $C$. When context is absent or implicit, we write $K_P$ as before.

The calculus does not prescribe how $P$ and $C$ are combined (concatenation, interleaving, structured message format, etc.). This is abstracted away.

## 5. Information Production

### 5.1 Information Predicates

An **information predicate** is a function

$$\varphi : \mathcal{P} \to \{0, 1\}$$

that tests whether a string carries some particular piece of information. For example, $\varphi(O) = 1$ might mean "the string $O$ contains a syntactically valid Python function" or "the string $O$ asserts that the sky is blue."

The precise definition of any given predicate is external to the calculus. In practice, predicates are often evaluated by an LLM — e.g., "ask the LLM whether $O$ contains information $I$." This makes the semantics partially self-referential by design.

### 5.2 Probabilistic Information Production

We say the evaluation of $P$ **produces information** $\varphi$ with probability at least $\theta$ if:

$$\Pr_{O \sim K_P}[\varphi(O) = 1] \geq \theta.$$

We write this as:

$$K_P \xrightarrow{\theta} \varphi$$

When $\theta$ is left implicit, the assertion $K_P \to \varphi$ means the probability is "high enough to be relied upon" — a pragmatic threshold left to the user of the calculus.

The deterministic special case corresponds to $\theta = 1$.

## 6. Prompt Functions

### 6.1 Definition

A **prompt function** is an informal label for a prompt $F \in \mathcal{P}$ whose intended use is compositional — its outputs are fed back into $K$ as inputs, or it is repeatedly paired with varying inputs via $K(F, X)$.

There is no formal distinction between prompt functions and other prompts. The kernel $K$ does not know whether a prompt is a "function," an "instruction," a "question," or anything else. Every prompt is trivially a prompt function (its output can always be fed back into $K$). The term is used when this compositional use is the intended purpose.

### 6.2 Application

If $F$ is a prompt function and $X$ is an input, the **application** of $F$ to $X$ is simply

$$K(F, X) \in \Delta(\mathcal{P}).$$

This is the same two-argument kernel as contextual evaluation (§4.4). The calculus makes no formal distinction between "applying a function to an argument" and "evaluating a prompt in context." The difference is one of intent, not of mechanism: we call $F$ a "prompt function" and $X$ its "input" when the purpose is compositional, but the kernel treats them identically.

### 6.3 Composition

Given two prompt functions $F$ and $G$, their **composition** $(G \circ F)(X)$ is defined by:

1. Sample $Y \sim K(F, X)$.
2. Sample $Z \sim K(G, Y)$.

The resulting distribution over $Z$ is the **kernel composition**:

$$(G \circ F)_X(Z) = \sum_{Y \in \mathcal{P}} K_Y^G(Z) \cdot K_X^F(Y)$$

where $K^F$ and $K^G$ denote the kernels associated with $F$ and $G$ respectively. This is the Chapman–Kolmogorov equation applied to prompt evaluation. It says: the probability of final output $Z$ is the sum over all intermediate outputs $Y$ of the probability of producing $Y$ from $X$ times the probability of producing $Z$ from $Y$.

Composition is associative (by associativity of kernel composition) but not in general commutative.

When $F = G$ (a prompt function composed with itself), we write $F^n$ for $n$-fold composition. See §8.3.

## 7. Behavioral Equivalence

### 7.1 Distributional Equivalence

Two prompts $P_1$ and $P_2$ are **distributionally equivalent**, written

$$P_1 \equiv P_2,$$

if they induce the same output distribution:

$$K_{P_1} = K_{P_2} \quad \text{(i.e., } K_{P_1}(O) = K_{P_2}(O) \text{ for all } O).$$

### 7.2 Approximate Equivalence

In practice, exact distributional equivalence is too strong. Two prompts are **approximately equivalent** if their output distributions are close under some divergence $d$:

$$P_1 \approx_\epsilon P_2 \iff d(K_{P_1}, K_{P_2}) \leq \epsilon.$$

The calculus does not prescribe a specific divergence. Natural choices include total variation distance, KL divergence, or any metric on $\Delta(\mathcal{P})$ appropriate to the application.

### 7.3 Observational Equivalence

A weaker notion: $P_1$ and $P_2$ are **observationally equivalent** with respect to a set of predicates $\Phi$ if they agree on all predicates in $\Phi$:

$$P_1 \equiv_\Phi P_2 \iff \forall \varphi \in \Phi : \Pr_{O \sim K_{P_1}}[\varphi(O)] = \Pr_{O \sim K_{P_2}}[\varphi(O)].$$

Distributional equivalence is the special case where $\Phi$ is the set of all predicates. Observational equivalence captures the idea that two prompts "behave the same" for all purposes we care about, even if their raw output distributions differ.

## 8. Notable Constructs

### 8.1 Quine

A **quine** $Q$ is a prompt satisfying:

$$K_Q = \delta_Q$$

That is, evaluation of $Q$ deterministically produces $Q$ itself. $Q$ is a fixed point of $K$.

### 8.2 Fixed Points (General)

More generally, a prompt $P$ is a **distributional fixed point** of $K$ if sampling an output and re-evaluating yields the same distribution:

$$\sum_{Y \in \mathcal{P}} K_Y(O) \cdot K_P(Y) = K_P(O) \quad \text{for all } O.$$

That is, $K_P$ is a stationary distribution under one step of re-evaluation. A quine is a distributional fixed point where $K_P$ is a point mass.

### 8.3 Iterated Self-Application

Given a prompt function $F$ and an initial input $X$, the **iteration sequence** is the chain of random variables defined by:

$$X_0 = X, \qquad X_{n+1} \sim K(F, X_n).$$

That is, we apply $F$ to $X$, take the output, feed it back into $F$, and repeat. Each $X_n$ is a random variable; its distribution is determined by the $n$-fold kernel composition.

**The $n$-step distribution.** We write $K^n_F(X)$ for the distribution over outputs after $n$ applications of $F$ starting from $X$. The base case and recursion are:

$$K^0_F(X) = \delta_X$$

$$K^{n+1}_F(X)(Z) = \sum_{Y \in \mathcal{P}} K(F, Y)(Z) \cdot K^n_F(X)(Y).$$

That is, $K^n_F(X)$ is $K(F, -)$ composed with itself $n$ times, started at $X$.

**Convergence.** The iteration sequence may exhibit several behaviors:

- **Convergence to a point.** $K^n_F(X)$ approaches $\delta_Y$ for some $Y$ as $n \to \infty$. The outputs stabilize: repeated application eventually produces the same output every time. $Y$ satisfies $K(F, Y) = \delta_Y$ — it is a deterministic fixed point of $F$.

- **Convergence to a stationary distribution.** $K^n_F(X)$ approaches some distribution $\pi \in \Delta(\mathcal{P})$ that is a fixed point of the kernel:

$$\sum_{Y \in \mathcal{P}} K(F, Y)(Z) \cdot \pi(Y) = \pi(Z) \quad \text{for all } Z.$$

The outputs don't stabilize to a single value, but their statistical character stops changing. Each individual evaluation still varies, but the distribution over outputs is stable.

- **Cycling.** The distribution over outputs oscillates between two or more distributions without settling.

- **Divergence.** The distribution does not converge; outputs wander without pattern.

**Practical interpretation.** In prompt engineering, iterated self-application arises when a prompt function is used to iteratively refine its own output — for example, "improve this text" applied repeatedly to its own result. Convergence to a fixed point means the refinement process terminates: further applications produce no meaningful change. The speed of convergence (how many iterations until the distribution is approximately stationary) is a measure of the prompt function's stability.

## 9. Design Notes

1. **Abstraction level.** The kernel $K$ abstracts over all implementation details: tokenizer, model architecture, sampling parameters (temperature, top-$p$), batching, and so on. Different settings of these parameters yield different kernels, but the calculus treats each such configuration as simply "a kernel."

2. **Self-reference.** Information predicates ($\S$5.1) and the information production relation ($\S$5.2) are grounded in LLM evaluation, which is itself the object being formalized. This circularity is intentional and reflects the actual practice of prompt engineering, where "did the LLM produce useful output?" is judged by the LLM or by processes that include LLM evaluation.

3. **The countability assumption.** Because $\Sigma$ is finite and strings are finite-length, $\mathcal{P} = \Sigma^*$ is countable and we can work with probability mass functions throughout. No measure-theoretic subtlety arises. In practice, LLMs have a maximum output length $N$, so the support of $K_P$ is contained in $\Sigma^{\leq N}$, which is finite.

4. **Context is a prompt.** By defining $C \in \mathcal{P}$, we ensure that context is not a separate sort of object — it is itself a string of tokens, subject to the same formalism. How context is integrated with the input prompt is abstracted away.

5. **Recovering the deterministic calculus.** Every construct in this document reduces to its deterministic counterpart when $K_P$ is a point mass for all relevant $P$. The deterministic notation ($K_P = \delta_O$, $K_P \xrightarrow{1} \varphi$, $K(F, X) = \delta_Y$) is available whenever the point-mass assumption is appropriate.
