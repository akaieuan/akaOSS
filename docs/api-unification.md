# API unification proposal (deferred to v1.0)

**Status:** Design doc, not yet executed. Captures the v0.7+ work flagged in the v0.6 audit.

## The problem

The 15 primitives ship with two prop API shapes and inconsistent callback names. This is honest reporting — the kit was built in waves and the inconsistencies show.

### Two prop patterns currently in use

**Pattern A — `config={}` props.** Used by: `HitlCard`, `DiffResult`, `CitationResult`, `EditablePlan`, `ToolCallPreview`.

```tsx
<HitlCard config={{ id, kind, title, ... }} onConfirm={...} onDismiss={...} />
```

**Pattern B — spread fields.** Used by: `AiGenerationScale`, `BatchQueue`, `ContextChips`, `MiniTrace`, `QAFlow`, `SearchResultCard`, `SubagentStatusCard`, `ApproveRejectRow`, `WritingAgent`, `ResearchAgent`.

```tsx
<MiniTrace steps={steps} />
<ApproveRejectRow state={state} onApprove={...} onReject={...} />
```

### Callback names drift

Across the 15:

| Primitive | Action callback names |
|---|---|
| `HitlCard` | `onConfirm`, `onDismiss` |
| `ApproveRejectRow` | `onApprove`, `onReject`, `onUndo` |
| `DiffResult` | `onAccept`, `onReject` |
| `CitationResult` | `onVerify`, `onReject` |
| `ToolCallPreview` | `onApprove`, `onReject` |
| `EditablePlan` | `onSubmit`, `onCancel` |
| `QAFlow` | `onSubmit` |
| Demo-app components | `onAction` (single action callback) |

There's no convention. New primitives pick a name that "feels right" rather than following a rule.

## Recommended unification

### One prop pattern: spread

Rationale:

1. **Spread matches how `<HitlEventRenderer />` mounts components.** The renderer destructures the validated event and spreads it directly. Forcing consumers to wrap-and-unwrap into `config={...}` adds a translation layer that the renderer doesn't need.
2. **Smaller API surface.** `<DiffResult title={...} hunks={...} />` is shorter and easier to read than `<DiffResult config={{ title, hunks }} />`.
3. **Consistent with shadcn/ui house style.** Most shadcn primitives spread props; very few use a `config={}` envelope.

The five Pattern A components (HitlCard, DiffResult, CitationResult, EditablePlan, ToolCallPreview) need to migrate.

### One callback convention: `onAction({ kind, ...payload })`

Rationale: a single typed callback per primitive replaces the per-action callback explosion. The discriminated payload lets TypeScript narrow inside consumer code.

Example for DiffResult:

```ts
type DiffAction =
  | { kind: "accept"; hunkIndex?: number }
  | { kind: "reject" };

interface DiffResultProps extends DiffResultEvent {
  onAction?: (action: DiffAction) => void;
}
```

Example for ApproveRejectRow:

```ts
type ApprovalAction =
  | { kind: "approve" }
  | { kind: "reject" }
  | { kind: "undo" };

interface ApproveRejectRowProps {
  state: ApprovalStatus;
  onAction?: (action: ApprovalAction) => void;
  // ...
}
```

The same `onAction` signature is what `<HitlEventRenderer />` already pipes through to its registry components — see `packages/react/src/HitlEventRenderer.tsx`. Today the renderer types `onAction` as `(action: unknown) => void`. After unification it can carry a discriminated `HitlAction` union.

### Migration strategy

This is a **breaking change** for any consumer using Pattern A or per-action callbacks. Plan:

1. **Ship as v1.0.0.** Coordinated major bump across `@hitl-kit/core`, `@hitl-kit/react`, all adapters, and the registry.
2. **Provide compat shims for one minor.** `<HitlCard config={...} onConfirm={...} />` stays valid in v0.x → v1.0 but logs a deprecation warning in development. Removed in v1.1.
3. **Codemod.** Ship a `npx @hitl-kit/codemod migrate-v1` that rewrites Pattern A → spread + maps the per-action callbacks → `onAction` payloads.
4. **Migration guide.** New file `docs/migration-v1.md` with before/after for each affected primitive.
5. **Demo + showcase update in lockstep.** Both the registry components in `src/components/hitl/` and the demo copies in `apps/demo-langgraph/components/hitl/` migrate at the same time. (The registry/demo duplication is a separate problem — see "Open question" below.)

### Estimated effort

- Codemod: 1 day (small AST rewrite, well-defined input)
- Component edits: 1 day across 5 components (Pattern A) + 10 components (callback names). Test updates: 0.5 day.
- Migration guide: 0.5 day
- Compat shims: 0.5 day
- Total: ~3 days of careful work

## Open question

**Should the registry components and the demo components stay as separate copies?**

Today there are two parallel implementations:

- `src/components/hitl/{HitlCard,DiffResult,...}.tsx` — registry-installable, used by `npx shadcn add`
- `apps/demo-langgraph/components/hitl/{DiffResult,CitationResult,EditablePlan,ToolCallPreview}.tsx` — used by the demo app's `HitlEventRenderer`

The demo copies were created because the renderer expects spread props (Pattern B) but the original Pattern A registry components require `config={}`. After unification, both layers use the same prop shape — at which point the duplication is gratuitous. Two options:

- **A**: Demo app imports from `@hitl-kit/registry-components` (a new package that re-exports from `src/components/hitl/`). Single source of truth.
- **B**: Demo app keeps its copies but they become trivial wrappers (`export { DiffResult } from "@/components/registry/DiffResult"`) — the demo can override styling per route if it wants.

Recommend A. Resolves the duplication entirely.

## What to commit to before v1.0

- [ ] Confirm Pattern B (spread) + `onAction({ kind, ...payload })` are the agreed conventions
- [ ] Decide on registry/demo duplication strategy (A or B)
- [ ] Commit to writing the codemod (or accept that the migration is manual)
- [ ] Write `docs/migration-v1.md` with at least one before/after per affected primitive

Once those decisions land, the actual work is mechanical and can ship within a normal release cycle.

## Why this isn't urgent

- Existing API surface is documented and works
- New primitives can be authored to anticipate the unified API even before v1.0 lands
- A11y, tests, and gates are higher-leverage right now

This proposal stays parked here until the kit has a critical mass of external consumers who have *real* opinions on the API. Until then, the cost of breaking changes outweighs the cleanup benefit.
