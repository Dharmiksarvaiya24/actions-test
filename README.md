# git-action

GitHub Actions repository (workflows + custom actions).

## What’s inside
- `.github/Scripts/` — CI/CD scripts
- `.github/actions/` — local custom actions used by workflows

## Run / check
- Go to the **Actions** tab to run workflows and view logs.
- Configure required **Secrets/Variables** in: `Settings → Secrets and variables → Actions`.

## Use a local action
```yaml
- name: Run local action
  uses: ./.github/actions/<action-folder>
```

## Example
<img width="815" height="483" alt="Screenshot 2026-05-18 at 10 55 06 AM" src="https://github.com/user-attachments/assets/a7c02edb-4c04-4606-87af-61f9598323f9" />


## Diagram 
<img width="711" height="397" alt="Screenshot 2026-05-18 at 10 35 10 AM" src="https://github.com/user-attachments/assets/f051eafe-4c8b-4b3b-a246-057122be30cb" />

