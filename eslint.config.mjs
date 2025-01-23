import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
  {
    languageOptions: { globals: globals.browser },
    plugins: {
      eslintPluginPrettier,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': [
        "error",
        {
          "allow": ["error"]
        }
      ],
      ...prettierConfig.rules,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
