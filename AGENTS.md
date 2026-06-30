# AGENT.md

## Purpose

This repository is maintained by both humans and AI agents.

The purpose of this document is to define how agents should understand, modify, and maintain the project while preserving architecture, consistency, and historical knowledge.

---

# Core Principles

The agent must:

- Treat the repository as the source of truth.
- Modify files directly when implementation is requested.
- Keep architecture, implementation, documentation, and memory synchronized.
- Preserve project consistency.
- Prefer existing patterns over introducing new ones.
- Never delete historical records unless explicitly requested.
- Avoid making assumptions when requirements are unclear.

---

# Priority Order

When instructions conflict, use the following priority:

1. Architecture documents
2. ADRs (Architecture Decision Records)
3. Requirements documents
4. Conventions and standards
5. Feature specifications
6. Session logs
7. Inline comments

Higher-priority documents always override lower-priority documents.

---

# Project Memory Workflow

Before starting any task:

Read all relevant memory and documentation files.

Examples:

```text
.ai-memory/
docs/
architecture/
specifications/
```

At minimum, review:

- architecture documentation
- requirements
- conventions
- decision records
- feature specifications related to the task

Memory and documentation are considered the source of truth.

---

# Architecture Preservation

Before making changes:

- Understand the existing architecture.
- Follow established patterns.
- Reuse existing modules when possible.
- Avoid introducing duplicate solutions.

Do not:

- Rewrite large sections unnecessarily.
- Replace established patterns without justification.
- Introduce breaking architectural changes without documentation.

When architecture changes:

- Update documentation.
- Record decisions.
- Explain reasoning.

---

# Documentation Rules

Whenever implementation changes affect behavior, architecture, APIs, workflows, or deployment:

Update the corresponding documentation.

Possible locations include:

```text
docs/
architecture/
specifications/
runbooks/
walkthroughs/
```

Documentation should remain synchronized with implementation.

---

# Decision Records

Significant technical decisions should be recorded.

Examples:

- architecture changes
- technology selection
- database changes
- deployment strategy changes
- API contract changes
- security decisions

Historical decisions must remain traceable.

---

# API Contract Rules

For systems that expose APIs:

Every API should have:

- endpoint definition
- request contract
- response contract
- error contract

Consumers and providers must remain synchronized.

API contracts are the source of truth for integrations.

Do not introduce undocumented API changes.

---

# Implementation Rules

When implementing a task:

1. Understand requirements.
2. Review relevant documentation.
3. Review affected code.
4. Implement the solution.
5. Update tests when necessary.
6. Update documentation.
7. Update memory and decision records if required.
8. Summarize changes.

Do not stop at analysis when implementation is requested.

---

# Refactoring Rules

Refactoring should:

- Improve maintainability.
- Preserve behavior.
- Reduce duplication.
- Improve clarity.

Avoid:

- unnecessary rewrites
- speculative abstractions
- large-scale restructuring without justification

---

# Testing Rules

When modifying code:

- Run relevant tests when available.
- Add tests for new behavior when appropriate.
- Ensure existing behavior remains functional.

Do not claim verification without validation.

---

# Phase & Task Governance

If the project uses phases, milestones, or roadmaps:

- Follow the current phase scope.
- Do not implement future-scope features unless explicitly requested.
- Complete implementation before claiming completion.
- Complete integration before claiming delivery.
- Complete verification before claiming final completion.

Implementation, integration, and verification are separate stages.

---

# Status Definitions

Use status reporting consistently.

Allowed statuses:

```text
PLANNING
IMPLEMENTATION IN PROGRESS
IMPLEMENTATION COMPLETE
READY FOR INTEGRATION
INTEGRATION IN PROGRESS
INTEGRATION COMPLETE
READY FOR VERIFICATION
VERIFICATION IN PROGRESS
COMPLETED
BLOCKED
```

Do not report:

```text
COMPLETED
```

unless implementation, integration, and verification requirements have been satisfied.

---

# Historical Preservation

Do not remove:

- ADRs
- decision history
- changelogs
- session logs
- architectural records

Preserve historical context whenever possible.

---

# Agent Execution Checklist

Before Task

- Read relevant documentation.
- Read memory files.
- Understand requirements.
- Understand architecture.

During Task

- Follow existing conventions.
- Maintain consistency.
- Implement requested changes.

After Task

- Update documentation.
- Update memory.
- Update decision records if needed.
- Record significant changes.
- Summarize completed work.

Failure to follow this workflow is considered a project defect.
