---
name: react-memoization
description: Load on every task in this project. Defines when useMemo and useCallback are required vs. wasteful in React 19 without the React Compiler.
---

# React Memoization (React 19, no Compiler)

This project uses React 19 **without** the React Compiler plugin. Memoization is manual but must be **targeted** — wrapping everything is noise that obscures real optimizations.

---

## `useMemo`

### Use when:

**1. Expensive computation** — filtering/sorting arrays, heavy transforms:
```tsx
const filtered = useMemo(() => {
  const q = search.toLowerCase()
  return users.filter(u => {
    if (search && !u.email.toLowerCase().includes(q)) return false
    if (role && u.role !== role) return false
    return true
  })
}, [users, search, role])
```

**2. Stable reference needed as a hook dependency** — inline objects/arrays are new references every render, which causes dependent hooks to re-run:
```tsx
// ❌ New object each render → useEffect fires every render
const params = { role, status }
useEffect(() => fetchData(params), [params])

// ✅ Stable reference
const params = useMemo(() => ({ role, status }), [role, status])
useEffect(() => fetchData(params), [params])
```

**3. Non-primitive default value** — hoist to module level instead of `useMemo`:
```tsx
// ❌ New [] when data is undefined → deps see a new reference every render
const { data: users = [] } = useQuery(...)

// ✅ Module-level constant — zero overhead
const EMPTY_USERS: User[] = []
const { data: users = EMPTY_USERS } = useQuery(...)
```

### Skip when:

- Result is a **primitive** (string, number, boolean) — compared by value, not reference
- Computation is trivially cheap (property access, short slice, simple string op)
- Value is only consumed in JSX, not as a dep of any hook

```tsx
// ❌ Wasteful
const isAdmin = useMemo(() => user.role === 'admin', [user.role])

// ✅
const isAdmin = user.role === 'admin'
```

---

## `useCallback`

### Use when:

1. Function is passed as a **prop to a `React.memo`-wrapped child**
2. Function is a **dependency of `useEffect`, `useMemo`, or another `useCallback`**

```tsx
// ✅ Stable ref — it's a useEffect dep
const load = useCallback(() => refetch(), [refetch])
useEffect(() => { load() }, [load])

// ✅ Stable ref — passed to a memo'd child
const handleDelete = useCallback((id: string) => deleteItem(id), [deleteItem])
<MemoizedRow onDelete={handleDelete} />
```

### Skip when:

- Handler is only attached to a **native DOM element** — React never compares function refs on DOM nodes
- Function is never a dep of any hook and the parent doesn't use `React.memo`

```tsx
// ❌ No benefit
const handleChange = useCallback(e => setValue(e.target.value), [])

// ✅ Inline is fine
onChange={e => setValue(e.target.value)}
```

---

## Quick Reference

| Pattern | Use memo? |
|---|---|
| Filter/sort large array | `useMemo` yes |
| Simple boolean derivation | No — primitive, free |
| Object/array as hook dep | `useMemo` yes |
| Module-level non-primitive default | Hoist to constant |
| Handler → DOM element only | No `useCallback` |
| Handler → `memo` child | `useCallback` yes |
| Handler → `useEffect` dep | `useCallback` yes |