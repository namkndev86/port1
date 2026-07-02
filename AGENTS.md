# AGENTS.md

# Purpose

This repository is maintained by both humans and AI agents.

The purpose of this document is to define how AI agents should understand, modify, and maintain the project while preserving architecture, consistency, documentation, and historical knowledge.

The repository is the source of truth. AI agents are collaborators responsible for producing production-ready implementations while keeping documentation synchronized with the codebase.

---

# Core Principles

The agent must:

* Treat the repository as the primary source of truth.
* Read relevant documentation before making changes.
* Modify files directly when implementation is requested.
* Preserve the existing architecture whenever possible.
* Prefer existing patterns over introducing new ones.
* Keep implementation and documentation synchronized.
* Avoid making assumptions when requirements are unclear.
* Preserve project history and decision records.
* Produce maintainable, readable, and production-ready code.

The agent must not:

* Introduce unnecessary architectural changes.
* Rewrite large portions of the codebase without justification.
* Remove historical documentation or decision records.
* Claim work has been verified without evidence.

---

# Priority Order

When instructions conflict, use the following priority:

1. Architecture Documentation
2. Architecture Decision Records (ADR)
3. Requirements Documentation
4. Coding Conventions & Standards
5. Feature Specifications
6. Project Memory
7. Session Logs
8. Inline Comments

Higher-priority documentation always overrides lower-priority documentation.

---

# Repository Bootstrap

If this is the first AI interaction with an existing repository, the agent must initialize the documentation structure before performing any implementation.

Verify that the following directories exist:

```text
.ai-memory/
docs/
architecture/
specifications/
adr/
runbooks/
walkthroughs/
```

If any directory is missing:

* Create the directory.
* Generate a README.md describing its purpose.
* Never overwrite existing files.

Ensure the following files exist:

```text
.ai-memory/README.md
docs/README.md
architecture/README.md
specifications/README.md
adr/README.md
```

If any file is missing:

* Create it.
* Add an appropriate initial description.

The bootstrap process must never overwrite existing documentation.

After bootstrap is complete, continue with Project Discovery.

---

# Project Discovery

Before implementing any task, the agent must understand the project.

Review all documentation relevant to the task.

At minimum, review:

* Architecture documentation
* Requirements
* Coding conventions
* Architecture Decision Records (ADR)
* Feature specifications
* Project memory

Typical locations include:

```text
.ai-memory/
docs/
architecture/
specifications/
adr/
```

If documentation does not exist, the existing source code temporarily becomes the source of truth.

When requirements are ambiguous, the agent should request clarification instead of making assumptions.

---

# Task Execution Workflow

For every implementation request:

1. Understand the requirements.
2. Review documentation.
3. Review the affected source code.
4. Understand the current architecture.
5. Implement the requested changes.
6. Update or add tests when appropriate.
7. Update documentation.
8. Update project memory.
9. Create or update ADRs if architectural decisions changed.
10. Summarize the completed work.

Implementation should not stop at analysis when coding has been explicitly requested.

---

# Architecture Preservation

Before making changes:

* Understand the existing architecture.
* Follow established design patterns.
* Reuse existing modules whenever possible.
* Maintain consistency with the existing codebase.

Do not:

* Introduce duplicate implementations.
* Replace established patterns without justification.
* Introduce breaking architectural changes without documentation.

When architecture changes:

* Update architecture documentation.
* Record an ADR.
* Explain the reasoning.

---

# Documentation Rules

Documentation must evolve together with the implementation.

Whenever implementation changes:

* Behavior
* Architecture
* APIs
* Workflows
* Deployment
* User-facing functionality

the corresponding documentation must also be updated.

If documentation for the modified area does not exist, the agent must create it.

Depending on the scope of the implementation, generate or update:

* Feature Specification
* Architecture Notes
* Architecture Decision Record (ADR)
* Project Memory Summary
* API Contract
* Runbook
* Walkthrough Documentation

Never leave newly implemented functionality undocumented.

---

# Decision Records (ADR)

Significant technical decisions should always be documented.

Examples include:

* Architecture changes
* Technology selection
* Database changes
* Deployment strategy
* API contract changes
* Authentication changes
* Authorization changes
* Security decisions
* Scalability decisions
* Performance optimizations

Decision history must remain traceable.

Never modify historical ADRs to hide previous decisions.

---

# API Contract Rules

For every public API:

Document:

* Endpoint
* Method
* Request contract
* Response contract
* Error contract
* Authentication requirements
* Validation rules

Consumers and providers must remain synchronized.

Undocumented API changes are not allowed.

---

# Refactoring Rules

Refactoring should:

* Improve maintainability.
* Improve readability.
* Reduce duplication.
* Simplify complexity.
* Preserve behavior.

Avoid:

* Speculative abstractions.
* Unnecessary rewrites.
* Large-scale restructuring without justification.

---

# Testing Rules

When modifying code:

* Run relevant tests if available.
* Add tests for new behavior when appropriate.
* Preserve existing functionality.
* Do not introduce regressions.

Do not claim verification unless validation has been performed.

If tests cannot be executed, clearly explain why.

---

# Phase & Task Governance

If the project uses phases, milestones, or roadmaps:

* Respect the current phase.
* Do not implement future-scope functionality unless explicitly requested.
* Complete implementation before claiming delivery.
* Complete integration before claiming integration.
* Complete verification before claiming completion.

Implementation, integration, and verification are separate stages.

---

# Status Definitions

Use only the following statuses:

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

Never report:

```text
COMPLETED
```

unless all of the following are true:

* Implementation is complete.
* Integration is complete.
* Documentation is synchronized.
* Verification has been completed.

---

# Historical Preservation

Do not remove:

* ADRs
* Changelogs
* Project Memory
* Session Logs
* Architecture Documentation
* Historical Specifications

Historical context should always be preserved.

---

# Agent Execution Checklist

## Before Every Task

* Read architecture documentation.
* Read relevant requirements.
* Read project memory.
* Review ADRs.
* Review feature specifications.
* Understand the affected code.
* Verify documentation structure.

## During Implementation

* Follow existing architecture.
* Reuse existing patterns.
* Keep implementation consistent.
* Avoid unnecessary refactoring.
* Maintain code quality.

## After Implementation

* Update documentation.
* Update project memory.
* Update ADR if necessary.
* Update API contracts if necessary.
* Update tests if necessary.
* Summarize the completed work.
* Report the appropriate project status.

---

# Definition of Done

A task is considered complete only when:

* Requirements have been implemented.
* Architecture remains consistent.
* Tests have been updated when appropriate.
* Documentation has been synchronized.
* Project memory has been updated.
* ADRs have been recorded when necessary.
* API contracts have been updated when applicable.
* No unintended regressions have been introduced.

Only after these conditions have been satisfied may the task be reported as **COMPLETED**.
