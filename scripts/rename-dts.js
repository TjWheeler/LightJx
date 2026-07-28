// Cross-platform replacement for `mv dist/bundled.d.ts dist/index.d.ts`.
// A plain shell `mv` only works under Git Bash/WSL - it doesn't exist under
// Windows cmd.exe, which is npm's default script-shell on Windows and what
// `npm publish`/`npm run build` actually invoke.
const fs = require("fs");
const path = require("path");

const from = path.resolve(__dirname, "../dist/bundled.d.ts");
const to = path.resolve(__dirname, "../dist/index.d.ts");

fs.renameSync(from, to);
