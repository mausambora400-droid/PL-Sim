# HDHC Personal Loan Simulator

A normal static simulator based on the provided 20-screen personal-loan journey. The simulator follows the sequence from `HDFC_PL01_PL` through `HDFC_PL20_PL`, with the visible bank branding changed to `HDHC`.

## What is included

- 20-step loan application flow.
- Editable inputs, selects, checkboxes, radio buttons, file input, OTP boxes, sliders, and text areas.
- Local browser save using `localStorage` only when the user clicks `Save For Later`.
- No build step and no external dependencies.

## Project structure

```text
.
|-- index.html
|-- package.json
|-- README.md
|-- scripts/
|   `-- check-project.js
`-- src/
    |-- app.js
    `-- styles.css
```

## Run locally

Open `index.html` in a browser, or run a small static server from this folder:

```powershell
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Verify

```powershell
npm run check
```

## Run on GitHub Pages

For GitHub Pages, `index.html` must be in the repository root.

1. Create a new GitHub repository.
2. Upload the contents of this folder, not the folder itself.
3. Confirm `index.html`, `src/app.js`, and `src/styles.css` are visible at the repository root.
4. Open repository `Settings > Pages`.
5. Set `Source` to `Deploy from a branch`.
6. Select the `main` branch and `/ (root)`.
7. Save and wait for GitHub to publish the Pages URL.

If you use the downloadable zip, extract it first and upload the files inside it directly to the repository root.

## Files

- `index.html` - app entry point.
- `src/styles.css` - simulator styling.
- `src/app.js` - simulator screens, state, navigation, and active fields.
- `scripts/check-project.js` - basic local project checker.
