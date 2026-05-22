# Agents

Custom agents for this project. Each agent is defined in a `.md` file with frontmatter.

---

## senior-dev

**File:** `senior-dev.md`
**Purpose:** Senior Tech Lead for full feature lifecycle — architecture, implementation, test coverage.

### How to invoke

```
@agent-senior-dev <task description or plan>
```

### What happens at startup

When you invoke `@agent-senior-dev`, the following sequence runs automatically:

1. **Claude Code fires the `SubagentStart` hook** (configured in `.claude/settings.json`) before the agent processes anything.
2. **The hook checks `agent_name`** — if it matches `senior-dev`, it outputs a `additionalContext` payload.
3. **Claude Code injects the payload** into the agent's context as a `system-reminder` — before the agent writes a single line.
4. **The agent sees the reminder** telling it to load mandatory skills first.
5. **The agent calls the `Skill` tool** to load `react-memoization` and `component-decomposition` (always), plus task-specific skills.
6. **Only after all relevant skills are loaded** does the agent read `CLAUDE.md`, explore the codebase, and start implementing.

### Skills loaded by senior-dev

| Skill | When |
|---|---|
| `react-memoization` | Always — first |
| `component-decomposition` | Always — second |
| `route-builder` | New route or page |
| `react-query-patterns` | Data fetching, mutations, polling |
| `react-state-patterns` | Tabs, filters, search, pagination |
| `vercel-composition-patterns` | Component API or composition design |
| `vercel-react-best-practices` | Performance or bundle optimization |
| `security-pr-checklist` | Pre-merge security audit |

### Why two layers?

The skill-loading behaviour is enforced in two ways so that neither can silently fail:

- **`senior-dev.md` prompt** — the agent's own Phase 1 instructions mandate skill loading.
- **`SubagentStart` hook** — Claude Code injects the reminder externally, before the agent acts. This mirrors how the `using-superpowers` plugin works via its `SessionStart` hook.