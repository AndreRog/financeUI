module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
  overrides: [
    {
      // Generated shadcn/ui primitives legitimately co-export cva variants
      // alongside their components; the HMR-only rule doesn't apply.
      files: ['src/components/ui/**/*.{ts,tsx}'],
      rules: { 'react-refresh/only-export-components': 'off' },
    },
  ],
}
