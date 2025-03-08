import globals from "globals";
import pluginJs from "@eslint/js";
import securityPlugin from "eslint-plugin-security";
import nodePlugin from "eslint-plugin-node";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  
  {
    plugins: {
      security: securityPlugin,
      node: nodePlugin
    },
    rules: {
      "no-console": "warn",
      "no-debugger": "warn",
      // Security rules
      "security/detect-unsafe-regex": "error",
      "security/detect-non-literal-fs-filename": "error",
      "security/detect-eval-with-expression": "error",
      "security/detect-possible-timing-attacks": "error",
      "security/detect-non-literal-regexp": "error",
      "security/detect-non-literal-require": "error",
      
      
      // Node js rules
      "node/no-sync": "warn",
      "node/no-process-exit": "warn",
      "node/no-missing-import": "error"
    }
  }
];