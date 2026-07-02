// eslint.config.mjs
// Enterprise ESLint Flat Config — generated from repository analysis
// Stack: Next.js 16 App Router | React 19 | TypeScript strict | Tailwind v4 | pnpm
//
// IMPORTANT: eslint-config-next/core-web-vitals already registers these plugins internally:
//   - @typescript-eslint, react, react-hooks, jsx-a11y, @next/next, import
// Therefore our layers must NEVER re-declare those in `plugins: {}`.
// We only add NEW plugins (unused-imports, simple-import-sort) and extend rules.

import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

// ─── Conditionally-loaded NEW plugins ────────────────────────────────────────
// These are NOT included by eslint-config-next, so they are safe to register.
// Install with:  pnpm add -D eslint-plugin-unused-imports eslint-plugin-simple-import-sort

let unusedImports, simpleImportSort

try {
  unusedImports = (await import("eslint-plugin-unused-imports")).default
} catch {
  unusedImports = null
}

try {
  simpleImportSort = (await import("eslint-plugin-simple-import-sort")).default
} catch {
  simpleImportSort = null
}

// ─── Base config layers ───────────────────────────────────────────────────────
const baseConfigs = [...nextVitals, ...nextTs]

// ─── Plugin layers (only added if installed) ─────────────────────────────────
const pluginConfigs = []

if (unusedImports && simpleImportSort) {
  pluginConfigs.push({
    name: "import-sorting",
    plugins: {
      "unused-imports": unusedImports,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // ── Remove unused imports automatically ──────────────────────────────
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      // ── Import ordering ───────────────────────────────────────────────────
      // Group order: Node → React → Next → Third-party → @/ aliases → Relative → CSS → Types
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^node:"],
            ["^react$", "^react-dom"],
            ["^next(/|$)"],
            ["^@?\\w"],
            ["^@/"],
            ["^\\.\\./", "^\\./" ],
            ["\\.css$", "\\.scss$"],
            ["^.*\\u0000$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  })
}

// ─── jsx-a11y extra rules ─────────────────────────────────────────────────────
// eslint-config-next ALREADY registers jsx-a11y. We only extend rules here.
// Do NOT add a `plugins` key — that would cause "Cannot redefine plugin" error.
const a11yRules = {
  name: "jsx-a11y-extended-rules",
  files: ["**/*.tsx", "**/*.jsx"],
  rules: {
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/anchor-is-valid": "warn",
    "jsx-a11y/aria-props": "error",
    "jsx-a11y/aria-role": "error",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/interactive-supports-focus": "warn",
  },
}

// ─── Project-specific TypeScript rules ───────────────────────────────────────
const typescriptRules = {
  name: "typescript-project-rules",
  files: ["**/*.ts", "**/*.tsx"],
  rules: {
    // Warn on `any` — gradual migration, not hard error yet
    "@typescript-eslint/no-explicit-any": "warn",

    // These would be too noisy while `any` is still widespread
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-unsafe-return": "off",

    // Enforce `import type` for type-only imports (detected inconsistency)
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
        fixStyle: "inline-type-imports",
      },
    ],

    "no-var": "error",
    "prefer-const": "error",

    // Allow console.warn/error in production; flag console.log
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
}

// ─── React/JSX rules ─────────────────────────────────────────────────────────
const reactRules = {
  name: "react-project-rules",
  files: ["**/*.tsx"],
  rules: {
    // Detected: <img> used in portfolio/page.tsx instead of next/image
    "@next/next/no-img-element": "error",

    // React 19 + new JSX transform — React does not need to be in scope
    "react/react-in-jsx-scope": "off",

    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
  },
}

// ─── Server Action overrides ──────────────────────────────────────────────────
const serverActionRules = {
  name: "server-action-rules",
  files: ["**/actions.ts", "**/actions/**/*.ts"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "no-console": "off",
  },
}

// ─── Repository / Service layer overrides ────────────────────────────────────
const dataLayerRules = {
  name: "data-layer-rules",
  files: [
    "src/repositories/**/*.ts",
    "src/services/**/*.ts",
    "src/lib/**/*.ts",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { allow: ["error", "warn"] }],
  },
}

// ─── Prisma seed / scripts ────────────────────────────────────────────────────
const scriptRules = {
  name: "script-rules",
  files: ["prisma/**/*.ts", "scripts/**/*.ts"],
  rules: {
    "no-console": "off",
    "@typescript-eslint/no-explicit-any": "off",
  },
}

// ─── Final config ─────────────────────────────────────────────────────────────
const eslintConfig = defineConfig([
  // 1. Global ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    // TypeScript declaration file generated by Next.js
    "next-env.d.ts",
    // Dependencies
    "node_modules/**",
    // Prisma generated client
    "node_modules/.prisma/**",
    // Coverage reports
    "coverage/**",
    // Lock files
    "*.lock",
    "pnpm-lock.yaml",
  ]),

  // 2. Next.js base (core-web-vitals + typescript)
  // NOTE: this already registers: @typescript-eslint, react, react-hooks, jsx-a11y, @next/next
  ...baseConfigs,

  // 3. New plugins only (unused-imports, simple-import-sort — NOT pre-registered by Next)
  ...pluginConfigs,

  // 4. Extra jsx-a11y rules (rules only — jsx-a11y plugin is already registered by Next above)
  a11yRules,

  // 5. TypeScript rules
  typescriptRules,

  // 6. React/JSX rules
  reactRules,

  // 7. Server Action overrides
  serverActionRules,

  // 8. Data layer overrides
  dataLayerRules,

  // 9. Script overrides
  scriptRules,
])

export default eslintConfig
