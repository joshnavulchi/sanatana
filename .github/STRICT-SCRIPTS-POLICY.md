# Repository Script and Build File Change Policy

## Strict Rule

- **Do NOT modify** the following files or their contents without explicit approval from the repository maintainers:
  - `.render-build.sh`
  - `package.json` scripts section

## Rationale

- These scripts are critical for deployment and CI/CD stability.
- Unauthorized changes may break production or development workflows.

## Enforcement

- All pull requests that alter `.render-build.sh` or the `scripts` section of `package.json` will be rejected unless accompanied by:
  - A clear justification
  - Approval from a lead maintainer

## Exceptions

- Only maintainers or those with explicit written approval may propose changes.

---

**Contact a maintainer if you believe a change is necessary.**
