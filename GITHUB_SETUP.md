# GitHub setup — Kingston Eats

**Student whose work is being submitted:** Terrance O’Neil Johnson (2301011744).  
If another person is helping with the upload, use **Terrance's GitHub account with his permission**, or arrange for Terrance to perform the sign-in and push. Git author information must truthfully reflect who made each commit.

## 1. Open the right folder
Extract the ZIP. Open the `kingston-eats-terrance` folder in VS Code (the folder containing `index.html`). Run the website with Live Server and confirm the features work.

## 2. Create the repository
On the account that will submit the assignment, visit https://github.com/new .
- Repository name: `kingston-eats`
- Description: `Kingston Eats — interactive Jamaican-inspired restaurant discovery website`
- Visibility: **Public** (unless the lecturer directs otherwise)
- **Do not** initialize with a README, .gitignore or license: these are already in the folder.
- Click **Create repository**.

## 3. Open Terminal → New Terminal in VS Code
Confirm the terminal is inside the folder with `index.html`.

```powershell
git --version
git init
git branch -M main
git status
```
If Git is not installed, install it from https://git-scm.com/downloads and reopen VS Code.

## 4. Configure Git author identity
Use the actual author of the commit, not someone else's identity. The person making a commit should use their own name and GitHub-associated email or GitHub noreply email:

```powershell
git config user.name "ACTUAL COMMIT AUTHOR"
git config user.email "ACTUAL_AUTHOR_EMAIL"
```

Do not use `--global` unless that identity should apply to all projects on the computer.

## 5. Commit the initial project
After reviewing the files:

```powershell
git add .
git commit -m "Add initial Kingston Eats website and project documentation"
```

## 6. Link and push to GitHub
Copy the HTTPS repository URL from GitHub. Replace the example with the actual URL:

```powershell
git remote add origin https://github.com/USERNAME/kingston-eats.git
git push -u origin main
```

Authenticate using the GitHub browser prompt if asked. A GitHub account password is **not** entered as a Git HTTPS password.

## 7. Make at least four more meaningful commits
The rubric requires **at least five meaningful commits total**. Make and test genuine changes between commits; examples:
1. Improve homepage descriptions and image alt text.
2. Improve menu descriptions and restaurant details.
3. Refine reservation help text or error feedback.
4. Update README with observed testing results and accessibility fixes.

For each actual change:
```powershell
git add .
git commit -m "Describe the specific change made"
git push
```

Do not manufacture or backdate a commit history. If a helper makes commits, keep that attribution accurate.

## 8. Check the repository
Refresh the GitHub page and verify the three HTML files, CSS and JS folders, README and commit history. Check the links and README rendering.

## 9. Optional: publish a live site with GitHub Pages
Repository → Settings → Pages → Build and deployment → Deploy from a branch → `main` → `/ (root)` → Save.
When enabled, the site typically appears at:
`https://USERNAME.github.io/kingston-eats/`
Wait for GitHub to display the actual published URL; test it.

## 10. Submit
Create the lecturer's submission document with student name, student ID, repository URL and date submitted. See `SUBMISSION_DETAILS.md`.

### Troubleshooting
- `git is not recognized`: install Git and restart VS Code.
- `not a git repository`: open the correct project folder and run `git init`.
- `remote origin already exists`: use `git remote -v` to inspect it; if wrong, `git remote set-url origin ACTUAL_URL`.
- `nothing to commit`: make and save a real change before creating another commit.
- Authentication fails: sign in to the correct GitHub account through the browser.
