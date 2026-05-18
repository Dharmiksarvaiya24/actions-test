# git-action

GitHub Actions repository (workflows + custom actions).

## What’s inside
- `.github/workflows/` — CI/CD workflows
- `.github/actions/` — local custom actions used by workflows

## Run / check
- Go to the **Actions** tab to run workflows (if `workflow_dispatch` is enabled) and view logs.
- Configure required **Secrets/Variables** in: `Settings → Secrets and variables → Actions`.

## Use a local action
```yaml
- name: Run local action
  uses: ./.github/actions/<action-folder>
```

## Example
<img width="817" height="519" alt="Screenshot 2026-04-05 at 11 46 35 PM" src="https://github.com/user-attachments/assets/86ba0bf3-6d3e-493f-a6dc-2108e1434c92" />

## Diagram 
<img width="711" height="397" alt="Screenshot 2026-05-18 at 10 35 10 AM" src="https://github.com/user-attachments/assets/da41d990-8bca-47a3-b0d0-c6d21aeac036" />
