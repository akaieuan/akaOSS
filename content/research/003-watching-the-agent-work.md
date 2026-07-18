---
title: "Watching the agent work: observability for agent-driven asset pipelines"
date: "2026-07-18"
experiment: null
models: []
tags: ["Hologram", "MCP", "Blender", "glTF", "observability", "read-only by design"]
keywords: ["agent observability", "asset pipeline", "Blender", "glTF", "MCP", "non-destructive tooling"]
kind: "essay"
status: "published"
summary: "When an AI coding agent became a real part of a Blender → glTF game pipeline — writing the export scripts, running them, rearranging the shipped files — the speed-up came with a blind spot: no picture of what it was actually doing. Hologram is the pattern that closed the gap: one append-only event log, a live dashboard beside the assets, and the same pipeline handed back to the agent as a small non-destructive MCP surface."
key_findings:
  - "The failure mode of agent-driven pipelines isn't bad output — it's **lost provenance**: assets change, exports appear, and reconstructing which step touched which file means scrolling a terminal."
  - "The fix is symmetric visibility: a **live activity feed next to the assets it produces** for the human, and the **same pipeline as MCP tools** for the agent — so both parties look at one picture instead of talking past each other."
  - "Trust comes from constraints: **read-only by design** (four read-only tools plus one non-destructive render), no framework, no build step, no database — a stdlib HTTP server, a JSONL log, and pure-Python glTF parsing."
---

This essay is the design story behind [Hologram](/projects/hologram) — where
it came from and why its constraints are the point.

## 1. The moment the agent joined the pipeline

Hologram comes from building games. The bulk of the asset work runs through
Blender into glTF — characters, props, weapons — and at some point an AI
coding agent became a real part of that pipeline: it writes the Blender
scripts, runs the exports, and rearranges the `.glb` files that ship. That
was a huge speed-up, right up until the realisation that there was no real
picture of what it was *doing*. Assets changed, exports appeared, and
reconstructing which step touched which file meant scrolling back through a
terminal.

That's the general failure mode of agent-driven pipelines, and it isn't bad
output. It's lost provenance. The work happens; the understanding of the work
doesn't.

## 2. One log, one picture

Hologram's answer is deliberately small. Everything appends to a single JSONL
event log: sessions, shell commands, file edits, MCP calls, slash-command
invocations — failures and in-flight work included. A local dashboard tails
that log over server-sent events and shows the agent's live activity right
next to the assets those actions produce: exported GLBs grouped by category,
each one introspectable down to its glTF structure, with an in-browser
preview.

Then the same pipeline is handed back to the agent as a small MCP surface —
list assets, inspect one, tail the events, read pipeline status — plus a
render, so the agent can *see* an export instead of just counting its nodes.
That symmetry is the actual design: human and agent looking at the same
picture instead of talking past each other. Checks you author yourself run
over every asset and fingerprint them, so the dashboard can answer "what
changed since the last check" — materials, meshes, and animations gained,
lost, or changed.

## 3. Constraints as trust

A tool that watches the pipeline that produces the assets you ship has to be
trustworthy, and Hologram buys trust with constraints. It is read-only /
non-destructive by design: four tools strictly observe; the one exception,
`render_asset`, drives a live Blender in a throwaway scene and restores
yours afterward. Checks can't modify anything and never run inside the MCP
server.

The architecture is austere on purpose: no framework, no build step, no
database — a stdlib HTTP server, a JSONL event log, and pure-Python glTF
parsing. The MCP server imports none of your project code, and Hologram
never imports `bpy`; it drives Blender over a socket, so its import purity
stays intact. Every one of those absences is a thing that can't break, can't
drift, and can't surprise you.

## 4. Where this is heading

The pattern generalizes beyond watching. An export step that atomically
maintains a per-asset manifest — version, generator parameters, triangle
counts, thumbnails — plus an append-only build log and per-version snapshots
turns "what changed" from a diff heuristic into recorded history. That
review-pipeline shape is already proven in a real game project, and folding
it into Hologram's dashboard is the current direction of travel: not just a
live feed of the agent's work, but a browsable record of every version of
every asset it ever produced.
