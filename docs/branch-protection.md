# Branch protection (operators)

SEC-028 expects protected default/deploy branches and code-owner review. Repo settings cannot be expressed fully as code; apply these in GitHub and keep [`.github/CODEOWNERS`](../.github/CODEOWNERS) up to date.

## Branches to protect

| Branch | Role |
|--------|------|
| `new-version` | Staging deploy branch (GitHub Pages workflow) |
| `main` / `master` | Historical/default — protect if still used for releases |

## Recommended GitHub settings

For each protected branch (**Settings → Branches → Branch protection rules**):

1. **Require a pull request before merging**
   - Require approvals: at least **1**
   - Require review from **Code Owners** (uses `.github/CODEOWNERS`)
2. **Require status checks to pass**
   - Require branches to be up to date before merging (optional but preferred)
   - Required checks from [`.github/workflows/test.yml`](../.github/workflows/test.yml):
     - `Typecheck & audit`
     - `Secret scan`
     - `Vitest`
     - `Playwright E2E`
3. **Do not allow bypassing** the above for administrators unless org policy requires an emergency break-glass account
4. **Restrict who can push** to the protected branch (maintainers only)

## Verification checklist

| # | Check | Done |
|---|-------|------|
| 1 | `CODEOWNERS` exists and lists active maintainers | ☐ |
| 2 | `new-version` protection rule enabled | ☐ |
| 3 | Required status checks match current workflow job names | ☐ |
| 4 | Code owner review required | ☐ |
| 5 | Direct pushes to protected branch blocked for non-admins | ☐ |

**Last verified:** _YYYY-MM-DD_ · **Owner:** _name_

## Related

- [CONTRIBUTING.md](../CONTRIBUTING.md)
- [deployment-runtime.md](./deployment-runtime.md)
