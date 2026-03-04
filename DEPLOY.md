Quick GitHub Pages Deploy (for Shivam)

If you want your portfolio published at `https://shivams0116.github.io/` (recommended — user site):

1. Create a new repository named `shivams0116.github.io` on GitHub.
2. Push the contents of this `portfolio/` folder to the `main` branch of that repository:

```bash
git init
git add .
git commit -m "Initial portfolio"
git branch -M main
git remote add origin https://github.com/shivams0116/shivams0116.github.io.git
git push -u origin main
```

3. GitHub Pages will publish the site automatically at `https://shivams0116.github.io/` (allow a minute).

If you prefer to host the site from a repository with a different name, go to the repository **Settings → Pages** and select the `main` branch and `/ (root)` folder.

Optional: I can add a GitHub Actions workflow to automatically deploy from `main` if you want CI-based deploys.
