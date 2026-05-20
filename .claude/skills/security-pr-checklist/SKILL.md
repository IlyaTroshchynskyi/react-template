---
name: security-pr-checklist
description: Security and code quality checklist for PRs in this React/TypeScript frontend. Reviews git diff and outputs a pass/fail report with line references.
---

You are reviewing a PR in a React 19 + TypeScript + Vite frontend. Run through the checklist below against the current branch diff.

## Step 1: Get the Diff

```bash
git diff master...HEAD
```

If reviewing a specific PR, use:
```bash
gh pr diff <PR_NUMBER>
```

## Step 2: Checklist

Go through each rule and mark PASS / FAIL / N/A with line references for any failures.

### 🔴 Security (Non-Negotiable)

| # | Rule | Check |
|---|------|-------|
| 1 | No raw error objects logged (`console.log(error)`, `console.error(error)`) — may leak tokens or response bodies | Grep: `console\.(log\|error\|warn)\(e[rr]` |
| 2 | No hardcoded credentials, API keys, or secrets | Grep: `apiKey\|secret\|password\s*=\s*["']` |
| 3 | No sensitive data in `localStorage`/`sessionStorage` (passwords, raw tokens) | Review new storage reads/writes |
| 4 | No sensitive data in URL parameters (use opaque IDs only) | Review route/link construction |
| 5 | No use of `dangerouslySetInnerHTML`, `eval()`, or `new Function()` | Grep: `dangerouslySetInnerHTML\|eval(\|new Function(` |
| 6 | Axios calls use the shared `axiosInstance` (not `axios.create` or raw `fetch`) | Review new API calls |

### 🟡 Code Quality

| # | Rule | Check |
|---|------|-------|
| 7 | No new `as any` TypeScript casts | Grep: `as any` in new lines |
| 8 | New routes added to `src/shared/constants/routes.ts` AND `src/App.tsx` | Check both files if new pages added |
| 9 | No `console.log` left in production code | Grep: `console\.log` in new lines |
| 10 | Components handle loading, error, and empty states | Review new components |
| 11 | MUI `sx` prop or `styled()` used for styling — no inline `style={{}}` objects | Grep: `style={{` in new lines |
| 12 | Input validation uses Yup schema in `validation/` — not ad-hoc inline checks | Review new form submissions |

### 🟢 Architecture

| # | Rule | Check |
|---|------|-------|
| 13 | Business logic in feature `api/` or `utils/` files, not in page/component | Review new page components |
| 14 | New components have corresponding `__tests__/` files | Check for missing test files |
| 15 | Path aliases used (`@features/`, `@shared/`, `@pages/`) — no deep relative imports (`../../../../`) | Grep: `from '\.\.\/\.\.\/` in new lines |
| 16 | New API endpoints added to `src/shared/constants/api.ts` | Check if raw strings used in `axiosInstance` calls |

## Step 3: Output Report

```
## Security PR Checklist

**Branch**: <branch name>
**Diff size**: <N files changed>

### 🔴 Security
- [ ] 1. Raw error logging — PASS
- [x] 2. Hardcoded credentials — FAIL: `src/features/auth/api/authApi.ts:12` contains `apiKey = "abc123"`
- [ ] 3. Sensitive data in storage — PASS
- [ ] 4. Sensitive data in URLs — PASS
- [ ] 5. XSS vectors — PASS
- [ ] 6. Shared axiosInstance — PASS

### 🟡 Code Quality
- [ ] 7. No `as any` — PASS
...

### 🟢 Architecture
...

---
**Verdict**: 🚨 BLOCK (1 critical) / ⚠️ APPROVE WITH WARNINGS / ✅ CLEAR TO MERGE
```

If there are CRITICAL failures (rules 1–6), explicitly state what must be fixed before merge.
