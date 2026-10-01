import fs from "node:fs";
import path from "node:path";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * features/ 配下の機能ディレクトリ一覧。
 * 機能同士の import を禁止するルールを、機能ごとに自動生成するために使う。
 */
const featuresDir = path.resolve("features");
const featureNames = fs.existsSync(featuresDir)
  ? fs
      .readdirSync(featuresDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
  : [];

/**
 * 依存の向きを一方通行にする: app → features → components / lib
 * 詳しくは docs/architecture.md を参照。
 */
const layerZones = [
  {
    target: "./lib",
    from: ["./app", "./features", "./components"],
    message:
      "lib/ はドメイン知識を持たない汎用層です。app・features・components を import できません。",
  },
  {
    target: "./components",
    from: ["./app", "./features"],
    message: "components/ は機能に依存しない共通 UI です。app・features を import できません。",
  },
  {
    target: "./features",
    from: ["./app"],
    message: "features/ から app/ を import することはできません。",
  },
  ...featureNames.map((name) => ({
    target: `./features/${name}`,
    from: "./features",
    except: [`./${name}`],
    message:
      "機能同士は直接 import できません。共通化したいものは components/ か lib/ へ移してください。",
  })),
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // react-markdown の components で ({ node, ...props }) のように node を取り除く書き方を許可する
      "@typescript-eslint/no-unused-vars": ["warn", { ignoreRestSiblings: true }],
      "import/no-restricted-paths": ["error", { zones: layerZones }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message:
                "親ディレクトリへの相対 import は使わず、@/ から始まるパスで書いてください。",
            },
          ],
        },
      ],
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "type"],
          pathGroups: [{ pattern: "@/**", group: "internal" }],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
