# Pull request

## Summary

<!-- One paragraph: what changes and why. Link the issue if there is one. -->

## Type of change

- [ ] Bug fix (no breaking change)
- [ ] New primitive / gate / adapter capability (additive, no breaking change)
- [ ] Refactor (no behavior change)
- [ ] Breaking change (callout below)
- [ ] Docs / typo / dev hygiene

## Verification

- [ ] `pnpm verify` passes (typecheck + tests + registry-drift + build)
- [ ] `pnpm smoke-test` passes (if changes touch primitives or registry)
- [ ] New primitives include schema, registry entry, and showcase section
- [ ] New gates include factory tests
- [ ] New adapter helpers include at least one allow + deny integration test
- [ ] Component changes maintain a11y (aria, keyboard, focus)

## Breaking changes

<!-- If this is a breaking change, describe what breaks, who is affected, and the migration path. Otherwise: "None." -->

## Notes for the reviewer

<!-- Anything the reviewer should pay attention to: tricky edge cases, deferred follow-ups, things you're unsure about. -->
