---
name: progressive-implementation
description: Implement a task in two phases — first a straightforward but flawed solution, then the industry-standard one — so the owner sees the problem before the pattern that solves it. Use only when the user explicitly asks for progressive implementation for a task; never apply it on your own.
---

# Progressive implementation

The owner learns a pattern best by feeling the problem it solves first.
"Make it work, make it right, make it fast" (Kent Beck), taught as separate,
visible steps.

## Phase 1: the straightforward solution

1. Implement the task the way a capable developer would on a first pass,
   without the pattern: it works, but it doesn't scale, repeats itself, couples
   things that should be separate, or is slow.
2. Keep it realistic. The flaws must be ones that happen in real codebases, not
   a strawman nobody would write. It must still be correct for the current
   requirements, and must not introduce security holes.
3. Add a **"Why this isn't good enough"** section. For each problem:
   - what it is (duplication, coupling, prop drilling, N+1 queries, re-renders, …),
   - when it starts to hurt (the next requirement, more data, another team),
   - how to see it: a concrete scenario, the extra code a new case would need,
     or a measurement (render count, query count, timing, bundle size).
   Make the pain observable rather than just claimed.
4. Stop and wait. Don't start phase 2 until the owner says so.
   Suggest committing phase 1 so the phase 2 diff is easy to study.

## Phase 2: the industry-standard solution

1. Refactor phase 1 into the clean, maintainable, performant version. Name the
   pattern or principle and say where it comes from (who uses it, which docs).
2. Map every phase 1 problem to how it's solved now. For performance, show
   before/after numbers measured the same way as in phase 1.
3. Be honest about the pattern's cost: extra abstraction, indirection, learning
   curve. Say when phase 1 would actually be the right call (small scope, YAGNI).
4. Finish with **"What's worth learning here"**, as usual.

## Rules
- Each phase can still be split into small sub-steps with pauses, as the root
  `AGENTS.md` describes.
- The final code is the phase 2 version. Phase 1 code doesn't stay around.
- Package rules (for example `packages/ui/AGENTS.md`) apply to phase 2. Phase 1
  may only break them where breaking them is the lesson, and must say so.
