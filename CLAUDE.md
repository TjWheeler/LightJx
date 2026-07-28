# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

LightJx is a small, dependency-light JavaScript/TypeScript validation framework (published to npm as `lightjx`), ported and adapted from [LightVx](https://github.com/TjWheeler/LightVx). It provides a fluent API for building field validators (`Validate.field(...)` / `Validate.define()`), primarily intended for client-side/UX validation — not a security boundary (see README's "A note on security & validation"). A separate, longer guide for AI consumers of the *library* (not this repo) lives at `docs/ai-guidance.md` — don't duplicate its content here.

## Commands

- `npm test` — run the full Jest suite
- `npm run test:watch` — Jest in watch mode
- `npm run test:validators` — run only `__tests__/validator.test.ts`
- `npm run test:fluent` — run only `__tests__/fluentapi.test.ts`
- `npm run test:general` — run only `__tests__/general.test.ts`
- To run a single test by name: `npx jest -t "test name substring"`
- `npm run build` — full production build: `build-tsc` (emits per-file `.d.ts` + `.tsbuildinfo`) → `webpack` (bundles `dist/bundle.js`) → `build-dts` (bundles the per-file `.d.ts` into `dist/index.d.ts` via `rollup-plugin-dts`) → `build-esm` (generates the ESM wrapper, see below)
- `npm run build-tsc` — plain `tsc --build` (type-check + declaration emit, outputs into `dist/`)
- `npm run build-dts` — bundles declarations with `rollup -c rollup.dts.config.mjs`, then renames the rollup output to `dist/index.d.ts`
- `npm run build-esm` — runs `scripts/build-esm.js` directly (useful if you only need to regenerate the ESM wrapper after a `dist/bundle.js`/`dist/index.d.ts` already exist)
- `npm run dev` — webpack watch build (development mode)
- `npm run prepare` — alias for `npm run build`; runs automatically on `npm install` and before `npm pack`/`npm publish`
- `npm run release` — bumps patch version (`npm version patch`) then runs `npm run build`; used when publishing a new npm version

Jest is configured via `jest.config.ts` with `rootDir: '__tests__'` and runs `.ts`/`.js` files through `ts-jest`. Coverage is collected automatically (`collectCoverage: true`) and excludes `src/index.ts`.

## Architecture

The library is built around three layers:

1. **`src/Validator.ts`** — the `Validator` interface every validator implements (`isValid`, `errorMessage`, `validate(input)`, `reset()`).
2. **`src/validators/ValidatorBase.ts`** — an abstract base class implementing common helpers used by every concrete validator: `hasValue`, `fail`/`succeed` (which build the error message from `fieldDisplayName`/`fieldName`, or a per-call custom error message), regex helpers (`test`, `hasMatch`, `matchCount`), type coercion helpers (`getAsNumber`, `getAsString`, `getAsDate`, `isNumberString`, `isIntString`, `isFloatString`), and delegates date parsing to `src/helpers/DateHelper.ts` (a thin wrapper around `luxon`).
3. **`src/validators/CoreValidators.ts`** — all concrete validator classes (e.g. `RequiredValidator`, `RegexValidator`, `MinValidator`, `MaxValidator`, `MinDateValidator`, `LengthValidator`, `ContainsTextValidator`, etc.), each extending `ValidatorBase`. Several validators (`Min`, `Max`, `MinDate`, `BetweenDate`, `ContainsText`, `NotContainsText`, `Length`) accept either a literal value or a `Function` (evaluated at validation time), enabling validation against dynamic/changing form state.

On top of that:

- **`src/ValidatorFluent.ts`** — `ValidatorFluent` is the fluent builder. Each chainable method (`.required()`, `.asEmail()`, `.min()`, `.hasMaxLength()`, etc.) instantiates the corresponding validator from `CoreValidators` and appends it to an internal list via `add()`. Calling `.validate(input)` runs every accumulated validator in order, collects failures into `errorMessages`, and joins them into `errorMessage` using `ValidationOptions.errorMessageSeperator`. `.reset()` clears state without discarding the configured validator chain, and `.setName(name, displayName)` retroactively renames the field across all attached validators.
- **`src/Validate.ts`** — the public entry point. `Validate.field(name, displayName)` creates a `ValidatorFluent` with field metadata for user-friendly error messages; `Validate.define()` creates one without field metadata (rules only, no naming). Both share a single module-level `validationOptions` (`ValidationOptions`) instance.
- **`src/index.ts`** — the package's public export surface (`Validate`, `validationOptions`). Keep this minimal and intentional — anything exported here becomes part of the npm package's public API, the generated `.d.ts` bundle, and (via `scripts/build-esm.js`) the ESM named exports.

### Adding a new validator

1. Add the class to `src/validators/CoreValidators.ts`, extending `ValidatorBase` and implementing `validate()` using the `fail()`/`succeed()` helpers so error messages stay consistent.
2. Add a corresponding chainable method to `ValidatorFluent` in `src/ValidatorFluent.ts` that constructs and `add()`s the validator, then returns `this`.
3. Add success/failure test cases to `__tests__/validator.test.ts` (validator in isolation) and, if it's chain-relevant, `__tests__/fluentapi.test.ts` (via `Validate.field`/`Validate.define`).
4. Update the "Available commands" list in `README.md`.

### Build/packaging notes

- The build pipeline is `tsc` (declaration emit) + webpack/`ts-loader` (the UMD JS bundle) + `rollup-plugin-dts` (bundles the per-file declarations into one `dist/index.d.ts`) + a small Node script (`scripts/build-esm.js`) for the ESM entry point.
- `output.globalObject` is set to `'globalThis'` in `webpack.config.js` — without it, webpack 5's UMD default (`self`) makes the bundle throw `ReferenceError: self is not defined` under plain Node `require()`. Do not remove this.
- `header.txt` supplies the license/repo banner injected into the bundle (via `webpack.BannerPlugin`).
- Target is ES5/CommonJS (`tsconfig.json`) for broad browser compatibility, since this library is meant to run client-side. Note that bundled third-party code (e.g. `luxon`) still ships ES6+ syntax (classes, arrow functions) since only first-party `src/**/*.ts` goes through `ts-loader`'s ES5 downlevel — the bundle is not actually pure ES5 today.
- **ESM support**: `package.json` has an `exports` map so `import { Validate } from "lightjx"` resolves natively under Node ESM, while `require("lightjx")` and bundler consumers keep resolving the original UMD bundle unchanged — one runtime copy of the code either way (no dual-package hazard). The `import` condition points at `dist/index.mjs` + `dist/index.d.mts`; `require`/`default` point at the original `dist/bundle.js` + `dist/index.d.ts`.
- `scripts/build-esm.js` runs as the last step of `npm run build`. It `require()`s the freshly built `dist/bundle.js`, enumerates its exported keys (currently `Validate`, `validationOptions`) rather than hardcoding them, and writes `dist/index.mjs` re-exporting each as a named ESM binding plus a default export. It also copies `dist/index.d.ts` to `dist/index.d.mts` (byte-identical — the declarations use plain `export`/`declare class` syntax with no CJS-specific constructs). The `.d.mts` copy is required: without it, TypeScript resolves the `import` condition's types as CJS-format under `moduleResolution: node16`/`nodenext` and tools like `arethetypeswrong` flag the package as "masquerading as CJS".
- `luxon` is bundled inline into `dist/bundle.js` (not left as an external `require`), so there's no separate luxon install/version needed by consumers, and no duplicate-luxon-instance risk.
- `scripts/` is excluded from the published npm package via `.npmignore` — it's a build-time-only tool, not part of the public API.
