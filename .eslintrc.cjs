module.exports = {
  extends: ['next'],
  ignorePatterns: ['.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  overrides: [
    {
      files: ['scripts/**'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    },
    {
      files: ['app/**', 'lib/**', 'types/**', 'jest.setup.ts', '**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    },
    {
      files: ['lib/**', 'next.config.ts'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off'
      }
    }
  ]
};
