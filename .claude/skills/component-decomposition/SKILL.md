---
name: component-decomposition
description: Load on every task in this project. Defines when and how to extract repeated JSX patterns, types, constants, and functions to eliminate duplication across the codebase.
---

# Component Decomposition

## One Component Per File

**Each React component must live in its own file.** The file name must match the component name in PascalCase (e.g., `UserAvatar.tsx` exports `UserAvatar`).

**No exceptions.** Every named component — regardless of size, whether it is exported or not, whether it is used only once — must have its own file. There is no line-count threshold that permits co-location.

**Not allowed in the same file:**
- Two or more components, for any reason
- A component and a helper sub-component, even if the helper is tiny
- A component and its sibling — sibling components each get their own file

**`index.ts` barrel files** are for re-exporting only — never define components inside them.

```tsx
// ❌ Two components in one file
export const UserAvatar = () => { ... }
export const UserBadge = () => { ... }  // must be UserBadge.tsx

// ✅ One component per file
// UserAvatar.tsx → exports UserAvatar
// UserBadge.tsx  → exports UserBadge
// components/index.ts → re-exports both
```

---

## When to Extract

**Extract when the same JSX structure appears 2+ times in one file, or 1+ times across different features.**

A repeated pattern is one where the props/structure are the same but the values differ — the diff is data, not behavior.

**Do not extract** a component just to shorten a file. Extract because it has a reusable interface that isolates its consumers from implementation details.

---

## Where to Put It

| Situation | Location |
|---|---|
| Can be used in more than one feature | `src/shared/components/` |
| Only used within one feature, but in multiple files | `src/features/<name>/components/` |
| Only used in one component file | `src/features/<name>/components/` — still its own file |

---

## No Duplicate Types, Constants, or Functions

The one-source-of-truth rule applies beyond components. **Any type, constant, or utility function that appears in more than one file must be extracted.**

### Types

A union type defined once as `type UserRole = 'admin' | 'editor' | 'viewer'` must not be re-declared anywhere else. All consumers import and use `UserRole` directly.

```ts
// ❌ Same union copy-pasted into the validation schema
role: Yup.string().oneOf(['admin', 'editor', 'viewer'])  // hardcoded again
role: 'admin' | 'editor' | 'viewer'                      // and again in the interface

// ✅ One canonical type in types/index.ts, used everywhere
import type { UserRole } from '../types'
role: UserRole
```

### Constants derived from types

When a runtime value (e.g. an array for `.oneOf()`, a `Record` for colors) must match a type's members, define a **single constant** and derive the type from it — or `satisfies` the type against it — so adding a new variant is a one-line change.

```ts
// ✅ One array, one type, no drift
export const USER_ROLES = ['admin', 'editor', 'viewer'] as const satisfies readonly UserRole[]

// Yup validation — reads the array at runtime
role: Yup.string().oneOf(USER_ROLES, 'Invalid role')

// Interface — uses the type at compile time  
role: UserRole
```

### Constants

A constant (color map, gradient list, style object) that appears in more than one file belongs in a shared location:

| Scope | Location |
|---|---|
| Used across multiple features | `src/shared/constants/` |
| Used across multiple files in one feature | `src/features/<name>/constants.ts` |
| Used in exactly one file | Keep it local — don't extract yet |

```ts
// ❌ ROLE_COLORS defined in UsersTable.tsx and UserProfileForm.tsx
// ✅ ROLE_COLORS defined once in src/features/users/constants.ts, imported by both
```

### Functions

A utility function (formatter, sorter, transformer) that appears in more than one file belongs in `utils/`:

| Scope | Location |
|---|---|
| Used across multiple features | `src/shared/utils/` |
| Used across multiple files in one feature | `src/features/<name>/utils/` |
| Used in exactly one file | Keep it local |

---

## Concrete Example: Formik TextField

In `src/features/users/components/UserProfileForm.tsx`, this pattern repeats for every field:

```tsx
// ❌ Repeated 4 times — firstName, lastName, email, bio
<TextField
  id='firstName'
  name='firstName'
  label='First Name'
  size='small'
  value={formik.values.firstName}
  onChange={formik.handleChange}
  onBlur={formik.handleBlur}
  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
  helperText={formik.touched.firstName && formik.errors.firstName}
/>
```

This belongs in `src/shared/components/FormField.tsx` because any feature with a Formik form can use it:

```tsx
// src/shared/components/FormField.tsx
import { TextField } from '@mui/material'
import type { TextFieldProps } from '@mui/material'
import type { FormikProps } from 'formik'

interface FormFieldProps extends Pick<TextFieldProps, 'label' | 'type' | 'multiline' | 'rows' | 'fullWidth' | 'sx'> {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>
}

export const FormField = ({ name, formik, ...rest }: FormFieldProps) => (
  <TextField
    id={name}
    name={name}
    size='small'
    value={formik.values[name]}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    error={formik.touched[name] && Boolean(formik.errors[name])}
    helperText={formik.touched[name] && (formik.errors[name] as string)}
    {...rest}
  />
)
```

Usage — each field collapses to one line of meaningful data:

```tsx
// ✅ After extraction
<FormField name='firstName' label='First Name' formik={formik} />
<FormField name='lastName'  label='Last Name'  formik={formik} />
<FormField name='email'     label='Email'      type='email' formik={formik} />
<FormField name='bio'       label='Bio'        multiline rows={3} fullWidth formik={formik} />
```

---

## Other Patterns Worth Extracting in This Project

| Repeated pattern | Proposed component | Location |
|---|---|---|
| Avatar circle with gradient initials | `UserAvatar` | `src/features/users/components/` — users-only |
| Skeleton loading rows in a table | `TableRowSkeleton` | `src/shared/components/` — reusable across tables |
| Chip with capitalized label | Not a component — it's a one-expression render, no extraction needed |

---

## Common Mistakes

| Mistake | Fix |
|---|---|
| Keeping a helper component in the same file because it's small | Every component gets its own file — no size exception |
| Putting a feature-specific component in `shared/` | Check: will another feature actually use this? If no, keep it in the feature |
| Passing `formik` as `any` without a comment | The `FormikProps<any>` is intentional to keep the component generic — add a comment if not obvious |
| Forgetting to export from the feature's `components/index.ts` | Add the export when creating a new feature-scoped component |